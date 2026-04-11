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

    renderBrowseFilters();
  }

  function clearAllBrowseFilters() {
    browseFiltersState.selectedCategoryIds.clear();
    browseFiltersState.selectedTopicIds.clear();
    browseFiltersState.selectedInstructorIds.clear();
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

    loadBrowseFilters();
  }

  window.openBrowseCourses = openBrowseCourses;

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", bindBrowseCoursesUI);
  } else {
    bindBrowseCoursesUI();
  }
})();
