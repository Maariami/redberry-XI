// Reusable browse-courses navigation across pages
(function () {
  if (window.__redberryBrowseCoursesInitialized) return;
  window.__redberryBrowseCoursesInitialized = true;

  const browseFiltersState = {
    selectedCategoryIds: new Set(),
    selectedTopicIds: new Set(),
    selectedInstructorIds: new Set(),
    categories: [],
    topics: [],
    instructors: [],
    courses: [],
    coursesLoaded: false,
    currentSort: "newest",
    currentPage: 1,
    pageSize: 9,
    totalCourses: 0,
  };

  const sortOptionLabels = {
    newest: "Newest First",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    popular: "Most Popular",
    "title-asc": "Title: A-Z",
  };

  const categoryIconClassByName = {
    development: "category-icon--development",
    design: "category-icon--design",
    business: "category-icon--business",
    marketing: "category-icon--marketing",
    "data science": "category-icon--datascience",
    "data-science": "category-icon--datascience",
    datascience: "category-icon--datascience",
  };

  function isBrowseCoursesPage() {
    return (
      window.location.pathname.endsWith("/browse-courses.html") ||
      window.location.pathname.endsWith("browse-courses.html")
    );
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeCollection(result) {
    if (Array.isArray(result?.data?.data)) return result.data.data;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result)) return result;
    return [];
  }

  function getCategoryIconClass(category) {
    const iconKey = String(category?.icon || category?.name || "")
      .trim()
      .toLowerCase();
    return categoryIconClassByName[iconKey] || "category-icon--development";
  }

  function normalizeCoursesResponse(result) {
    return {
      items: Array.isArray(result?.data?.data)
        ? result.data.data
        : Array.isArray(result?.data)
          ? result.data
          : [],
      meta: result?.data?.meta ?? {},
    };
  }

  function formatPrice(value) {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? numeric.toFixed(2) : "0.00";
  }

  function formatRating(value) {
    const numeric = Number(value ?? 0);
    return Number.isFinite(numeric) ? numeric.toFixed(1) : "0.0";
  }

  function getFilteredCourses() {
    return browseFiltersState.courses.filter((course) => {
      const matchesCategory =
        browseFiltersState.selectedCategoryIds.size === 0 ||
        browseFiltersState.selectedCategoryIds.has(Number(course.category?.id));
      const matchesTopic =
        browseFiltersState.selectedTopicIds.size === 0 ||
        browseFiltersState.selectedTopicIds.has(Number(course.topic?.id));
      const matchesInstructor =
        browseFiltersState.selectedInstructorIds.size === 0 ||
        browseFiltersState.selectedInstructorIds.has(
          Number(course.instructor?.id),
        );

      return matchesCategory && matchesTopic && matchesInstructor;
    });
  }

  function getSortedCourses(courses) {
    const sortableCourses = [...courses];

    switch (browseFiltersState.currentSort) {
      case "price-asc":
        sortableCourses.sort(
          (left, right) =>
            Number(left.basePrice ?? 0) - Number(right.basePrice ?? 0),
        );
        break;
      case "price-desc":
        sortableCourses.sort(
          (left, right) =>
            Number(right.basePrice ?? 0) - Number(left.basePrice ?? 0),
        );
        break;
      case "popular":
        sortableCourses.sort(
          (left, right) =>
            Number(right.avgRating ?? 0) - Number(left.avgRating ?? 0),
        );
        break;
      case "title-asc":
        sortableCourses.sort((left, right) =>
          String(left.title || "").localeCompare(String(right.title || "")),
        );
        break;
      default:
        sortableCourses.sort(
          (left, right) => Number(right.id ?? 0) - Number(left.id ?? 0),
        );
        break;
    }

    return sortableCourses;
  }

  function updateBrowseCoursesCount(totalFilteredCourses) {
    const countElement = document.getElementById("browseCoursesCount");
    if (!countElement) return;

    const visibleCount = Math.min(
      browseFiltersState.pageSize,
      Math.max(
        totalFilteredCourses -
          (browseFiltersState.currentPage - 1) * browseFiltersState.pageSize,
        0,
      ),
    );

    countElement.textContent = `Showing ${visibleCount} out of ${totalFilteredCourses}`;
  }

  function renderBrowseCoursesEmpty(message) {
    const cards = document.getElementById("browseCoursesCards");
    const pagination = document.getElementById("browsePagination");
    if (cards) {
      cards.innerHTML = `<div class="no-courses browse-no-courses">${escapeHtml(message)}</div>`;
    }
    if (pagination) {
      pagination.innerHTML = "";
    }
    updateBrowseCoursesCount(0);
  }

  function renderPagination(totalFilteredCourses) {
    const pagination = document.getElementById("browsePagination");
    if (!pagination) return;

    const totalPages = Math.max(
      1,
      Math.ceil(totalFilteredCourses / browseFiltersState.pageSize),
    );

    if (totalFilteredCourses <= browseFiltersState.pageSize) {
      pagination.innerHTML = "";
      return;
    }

    const pageItems = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page += 1) {
        pageItems.push(page);
      }
    } else if (browseFiltersState.currentPage <= 3) {
      pageItems.push(1, 2, 3, "ellipsis", totalPages);
    } else if (browseFiltersState.currentPage >= totalPages - 2) {
      pageItems.push(1, "ellipsis", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageItems.push(
        1,
        "ellipsis",
        browseFiltersState.currentPage - 1,
        browseFiltersState.currentPage,
        browseFiltersState.currentPage + 1,
        "ellipsis",
        totalPages,
      );
    }

    const pageButtons = pageItems
      .map((item, index) => {
        if (item === "ellipsis") {
          return `<span class="browse-pagination__ellipsis" aria-hidden="true">...</span>`;
        }

        return `
          <button
            class="browse-pagination__button${item === browseFiltersState.currentPage ? " is-active" : ""}"
            type="button"
            data-page="${item}"
            aria-label="Go to page ${item}"
          >
            ${item}
          </button>`;
      })
      .join("");

    pagination.innerHTML = `
      <button
        class="browse-pagination__button browse-pagination__button--nav"
        type="button"
        data-page="${browseFiltersState.currentPage - 1}"
        aria-label="Previous page"
        ${browseFiltersState.currentPage === 1 ? "disabled" : ""}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      ${pageButtons}
      <button
        class="browse-pagination__button browse-pagination__button--nav"
        type="button"
        data-page="${browseFiltersState.currentPage + 1}"
        aria-label="Next page"
        ${browseFiltersState.currentPage === totalPages ? "disabled" : ""}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>`;
  }

  function renderBrowseCourseCards() {
    const cards = document.getElementById("browseCoursesCards");
    if (!cards) return;

    if (
      !browseFiltersState.coursesLoaded &&
      browseFiltersState.courses.length === 0
    ) {
      renderBrowseCoursesEmpty("Loading courses...");
      return;
    }

    const filteredCourses = getSortedCourses(getFilteredCourses());
    const totalFilteredCourses = filteredCourses.length;
    const totalPages = Math.max(
      1,
      Math.ceil(totalFilteredCourses / browseFiltersState.pageSize),
    );

    if (browseFiltersState.currentPage > totalPages) {
      browseFiltersState.currentPage = totalPages;
    }

    if (!totalFilteredCourses) {
      renderBrowseCoursesEmpty("No courses match the selected filters.");
      return;
    }

    const startIndex =
      (browseFiltersState.currentPage - 1) * browseFiltersState.pageSize;
    const visibleCourses = filteredCourses.slice(
      startIndex,
      startIndex + browseFiltersState.pageSize,
    );

    cards.innerHTML = visibleCourses
      .map((course) => {
        const image = course.image || "./assets/cardimage.png";
        const title = course.title || "Untitled course";
        const instructorName = course.instructor?.name || "Course instructor";
        const rating = formatRating(course.avgRating);
        const price = formatPrice(course.basePrice);
        const durationWeeks = Number(course.durationWeeks) || 0;
        const categoryName = course.category?.name || "Category";
        const categoryIconClass = getCategoryIconClass(course.category);

        return `
          <div class="card browse-course-card" data-course-id="${escapeHtml(course.id)}">
            
              <img class="classimage browse-course-card__image" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" />
            
            <div class="coursebaseinfo">
              <p> ${escapeHtml(instructorName)} | ${escapeHtml(durationWeeks)} Weeks</p>
              <div class="rating">
                <img src="./assets/star.png" alt="Rating" />${escapeHtml(rating)}
              </div>
            </div>
            <div class="coursetitle">${escapeHtml(title)}</div>
            <div class="browse-course-card__category course-detail-meta-item category">
              <span class="category-icon ${escapeHtml(categoryIconClass)}" aria-hidden="true"></span>
              <span>${escapeHtml(categoryName)}</span>
            </div>
            <div class="lastcardline">
              <div class="price">
                starting from
                <span
                  style="
                    color: rgba(20, 20, 20, 1);
                    font-size: 32px;
                    font-weight: 600;
                  "
                  >$${escapeHtml(price)}</span
                >
              </div>
              <button class="details" type="button" data-course-id="${escapeHtml(course.id)}">Details</button>
            </div>
          </div>`;
      })
      .join("");

    cards.querySelectorAll(".details").forEach((button) => {
      button.addEventListener("click", () => {
        const courseId = button.dataset.courseId;
        if (!courseId) return;
        window.location.href = `course-details.html?id=${encodeURIComponent(courseId)}`;
      });
    });

    updateBrowseCoursesCount(totalFilteredCourses);
    renderPagination(totalFilteredCourses);
  }

  function renderSortUI() {
    const sortRoot = document.getElementById("browseSort");
    const selectedLabel = document.getElementById("browseSortSelected");
    const sortButton = document.getElementById("browseSortButton");
    if (selectedLabel) {
      selectedLabel.textContent =
        sortOptionLabels[browseFiltersState.currentSort] ||
        sortOptionLabels.newest;
    }
    document
      .querySelectorAll("#browseSortDropdown .filter-sort__item")
      .forEach((item) => {
        item.classList.toggle(
          "filter-sort__item--active",
          item.dataset.sortValue === browseFiltersState.currentSort,
        );
      });
    if (sortRoot && sortButton) {
      sortButton.setAttribute(
        "aria-expanded",
        String(sortRoot.classList.contains("is-open")),
      );
    }
  }

  function renderCategories() {
    const categoryFilters = document.getElementById("categoryFilters");
    if (!categoryFilters) return;

    categoryFilters.innerHTML = browseFiltersState.categories
      .map((category) => {
        const isSelected = browseFiltersState.selectedCategoryIds.has(
          category.id,
        );

        return `
          <button
            class="course-detail-meta-item category browse-filter-chip${isSelected ? " selected" : ""}"
            type="button"
            data-filter-group="category"
            data-filter-id="${escapeHtml(category.id)}"
          >
            <span class="category-icon ${escapeHtml(getCategoryIconClass(category))}" aria-hidden="true"></span>
            <span>${escapeHtml(category.name)}</span>
          </button>`;
      })
      .join("");
  }

  function renderTopics() {
    const topicFilters = document.getElementById("topicFilters");
    if (!topicFilters) return;

    topicFilters.innerHTML = browseFiltersState.topics
      .map((topic) => {
        const isSelected = browseFiltersState.selectedTopicIds.has(topic.id);

        return `
          <button
            class="course-detail-meta-item category browse-filter-chip browse-filter-chip--topic${isSelected ? " selected" : ""}"
            type="button"
            data-filter-group="topic"
            data-filter-id="${escapeHtml(topic.id)}"
          >
            <span>${escapeHtml(topic.name)}</span>
          </button>`;
      })
      .join("");
  }

  function renderInstructors() {
    const instructorFilters = document.getElementById("instructorFilters");
    if (!instructorFilters) return;

    instructorFilters.innerHTML = browseFiltersState.instructors
      .map((instructor) => {
        const isSelected = browseFiltersState.selectedInstructorIds.has(
          instructor.id,
        );

        return `
          <button
            class="browse-filter-instructor${isSelected ? " selected" : ""}"
            type="button"
            data-filter-group="instructor"
            data-filter-id="${escapeHtml(instructor.id)}"
          >
            <img
              src="${escapeHtml(instructor.avatar)}"
              alt="${escapeHtml(instructor.name)}"
              class="course-detail-avatar"
            />
            <span>${escapeHtml(instructor.name)}</span>
          </button>`;
      })
      .join("");
  }

  function renderActiveFiltersCount() {
    const filtersCount = document.querySelector(".numoffilters");
    if (!filtersCount) return;

    const activeCount =
      browseFiltersState.selectedCategoryIds.size +
      browseFiltersState.selectedTopicIds.size +
      browseFiltersState.selectedInstructorIds.size;

    filtersCount.textContent = `${activeCount} filter${activeCount === 1 ? "" : "s"} active`;
  }

  function renderBrowseFilters() {
    renderCategories();
    renderTopics();
    renderInstructors();
    renderActiveFiltersCount();
    renderBrowseCourseCards();
  }

  function toggleSelection(group, rawId) {
    const id = Number(rawId);
    if (!Number.isFinite(id)) return;

    const selectionMap = {
      category: browseFiltersState.selectedCategoryIds,
      topic: browseFiltersState.selectedTopicIds,
      instructor: browseFiltersState.selectedInstructorIds,
    };

    const targetSet = selectionMap[group];
    if (!targetSet) return;

    if (targetSet.has(id)) {
      targetSet.delete(id);
    } else {
      targetSet.add(id);
    }

    browseFiltersState.currentPage = 1;
    renderBrowseFilters();
  }

  function clearAllBrowseFilters() {
    browseFiltersState.selectedCategoryIds.clear();
    browseFiltersState.selectedTopicIds.clear();
    browseFiltersState.selectedInstructorIds.clear();
    browseFiltersState.currentPage = 1;
    renderBrowseFilters();
  }

  function renderBrowseFiltersError(message) {
    const groups = ["categoryFilters", "topicFilters", "instructorFilters"];
    groups.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;
      element.innerHTML = `<div class="browse-filter-feedback">${escapeHtml(message)}</div>`;
    });

    renderActiveFiltersCount();
  }

  async function loadBrowseCourses() {
    if (!isBrowseCoursesPage()) return;

    browseFiltersState.coursesLoaded = false;
    renderBrowseCourseCards();

    const firstPageResult = await apiGetCourses({
      sort: "newest",
      page: 1,
    });

    if (!firstPageResult?.ok) {
      browseFiltersState.coursesLoaded = true;
      renderBrowseCoursesEmpty("Unable to load courses right now.");
      return;
    }

    const firstPage = normalizeCoursesResponse(firstPageResult);
    const lastPage = Number(firstPage.meta.lastPage) || 1;
    const total = Number(firstPage.meta.total) || firstPage.items.length;
    const allCourses = [...firstPage.items];

    for (let page = 2; page <= lastPage; page += 1) {
      const nextPageResult = await apiGetCourses({
        sort: "newest",
        page,
      });

      if (!nextPageResult?.ok) {
        break;
      }

      const nextPage = normalizeCoursesResponse(nextPageResult);
      allCourses.push(...nextPage.items);
    }

    browseFiltersState.courses = allCourses;
    browseFiltersState.coursesLoaded = true;
    browseFiltersState.totalCourses = total;
    browseFiltersState.currentPage = 1;
    renderSortUI();
    renderBrowseCourseCards();
  }

  async function loadBrowseFilters() {
    if (!isBrowseCoursesPage()) return;

    const [categoriesResult, topicsResult, instructorsResult] =
      await Promise.all([
        apiGetCategories(),
        apiGetTopics(),
        apiGetInstructors(),
      ]);

    if (!categoriesResult?.ok || !topicsResult?.ok || !instructorsResult?.ok) {
      renderBrowseFiltersError("Could not load filters right now.");
      return;
    }

    browseFiltersState.categories = normalizeCollection(categoriesResult).map(
      (category) => ({
        id: Number(category.id),
        name: category.name || "Unknown category",
        icon: category.icon || category.name || "",
      }),
    );
    browseFiltersState.topics = normalizeCollection(topicsResult).map(
      (topic) => ({
        id: Number(topic.id),
        categoryId: Number(topic.categoryId ?? topic.category_id),
        name: topic.name || "Unknown topic",
      }),
    );
    browseFiltersState.instructors = normalizeCollection(instructorsResult).map(
      (instructor) => ({
        id: Number(instructor.id),
        name: instructor.name || "Unknown instructor",
        avatar: instructor.avatar || "./assets/profilepic.png",
      }),
    );

    renderBrowseFilters();
  }

  function toggleSortDropdown(forceOpen) {
    const sortRoot = document.getElementById("browseSort");
    if (!sortRoot) return;

    if (typeof forceOpen === "boolean") {
      sortRoot.classList.toggle("is-open", forceOpen);
    } else {
      sortRoot.classList.toggle("is-open");
    }

    renderSortUI();
  }

  async function handleSortChange(nextSort) {
    if (!nextSort || nextSort === browseFiltersState.currentSort) {
      toggleSortDropdown(false);
      return;
    }

    browseFiltersState.currentSort = nextSort;
    browseFiltersState.currentPage = 1;
    renderSortUI();
    toggleSortDropdown(false);
    renderBrowseCourseCards();
  }

  function handlePaginationChange(rawPage) {
    const nextPage = Number(rawPage);
    if (!Number.isFinite(nextPage) || nextPage < 1) return;

    const totalPages = Math.max(
      1,
      Math.ceil(getFilteredCourses().length / browseFiltersState.pageSize),
    );
    if (nextPage > totalPages) return;

    browseFiltersState.currentPage = nextPage;
    renderBrowseCourseCards();
  }

  function openBrowseCourses() {
    if (isBrowseCoursesPage()) {
      const browsePageMain = document.querySelector(".browse-page-main");
      if (browsePageMain) {
        browsePageMain.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      window.scrollTo({
        behavior: "smooth",
        top: 0,
      });
      return;
    }

    window.location.href = "browse-courses.html";
  }

  function findFooterBrowseCoursesLink() {
    const footerLinks = Array.from(
      document.querySelectorAll(".footer .list p"),
    );
    return (
      footerLinks.find(
        (element) => element.textContent.trim() === "Browse Courses",
      ) || null
    );
  }

  function bindBrowseCoursesUI() {
    const headerBrowseLink = document.querySelector(
      ".header .browse:not(.enrolled)",
    );
    const footerBrowseLink = findFooterBrowseCoursesLink();
    const browseFilters = document.querySelector(".filters");
    const clearFiltersButton = document.getElementById("clearFiltersButton");
    const browseSort = document.getElementById("browseSort");
    const browseSortButton = document.getElementById("browseSortButton");
    const browseSortDropdown = document.getElementById("browseSortDropdown");
    const browsePagination = document.getElementById("browsePagination");
    const browseButtons = Array.from(
      document.querySelectorAll("button"),
    ).filter((button) => button.textContent.trim() === "Browse Courses");

    headerBrowseLink?.addEventListener("click", openBrowseCourses);
    footerBrowseLink?.addEventListener("click", openBrowseCourses);
    browseButtons.forEach((button) => {
      button.addEventListener("click", openBrowseCourses);
    });

    browseFilters?.addEventListener("click", (event) => {
      const filterButton = event.target.closest("[data-filter-group]");
      if (!filterButton) return;

      toggleSelection(
        filterButton.dataset.filterGroup,
        filterButton.dataset.filterId,
      );
    });

    clearFiltersButton?.addEventListener("click", clearAllBrowseFilters);

    browseSortButton?.addEventListener("click", () => {
      toggleSortDropdown();
    });

    browseSortDropdown?.addEventListener("click", (event) => {
      const item = event.target.closest("[data-sort-value]");
      if (!item) return;
      handleSortChange(item.dataset.sortValue);
    });

    browsePagination?.addEventListener("click", (event) => {
      const pageButton = event.target.closest("[data-page]");
      if (!pageButton || pageButton.disabled) return;
      handlePaginationChange(pageButton.dataset.page);
    });

    document.addEventListener("click", (event) => {
      if (!browseSort?.contains(event.target)) {
        toggleSortDropdown(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        toggleSortDropdown(false);
      }
    });

    loadBrowseFilters();
    loadBrowseCourses();
  }

  window.openBrowseCourses = openBrowseCourses;

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", bindBrowseCoursesUI);
  } else {
    bindBrowseCoursesUI();
  }
})();
