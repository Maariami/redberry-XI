// Reusable enrolled-courses sidebar shared across pages
(function () {
  if (window.__redberryEnrolledCoursesInitialized) return;
  window.__redberryEnrolledCoursesInitialized = true;

  const enrolledState = {
    featuredCoursesById: new Map(),
    catalogCoursesById: new Map(),
    enrollments: [],
    loadingEnrollments: false,
    catalogLoaded: false,
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getNestedValue(source, path) {
    return String(path)
      .split(".")
      .reduce((acc, part) => acc?.[part], source);
  }

  function firstValue(source, paths, fallback = null) {
    for (const path of paths) {
      const value = getNestedValue(source, path);
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }

    return fallback;
  }

  function getDisplayText(value, fallback = "") {
    if (typeof value === "string") {
      return value.trim() || fallback;
    }

    if (typeof value === "number") {
      return String(value);
    }

    if (value && typeof value === "object") {
      return getDisplayText(
        value.name || value.title || value.label || value.subject || "",
        fallback,
      );
    }

    return fallback;
  }

  function toTitleCase(value) {
    return String(value || "")
      .replace(/[-_]/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  function getSessionTypePresentation(value) {
    const rawValue = String(value || "").trim();
    const normalizedValue = rawValue.toLowerCase().replace(/[_\s]+/g, "-");

    if (normalizedValue.includes("in-person")) {
      return { label: "In-person", icon: "./assets/inperson.svg" };
    }

    if (normalizedValue.includes("hybrid")) {
      return { label: "Hybrid", icon: "./assets/hybrid.svg" };
    }

    if (normalizedValue.includes("online")) {
      return { label: "Online", icon: "./assets/online.svg" };
    }

    return { label: toTitleCase(rawValue), icon: "./assets/online.svg" };
  }

  function normalizeCoursePayload(result) {
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.data?.data)) return result.data.data;
    if (Array.isArray(result?.data?.courses)) return result.data.courses;
    if (Array.isArray(result)) return result;
    return [];
  }

  function normalizeEnrollment(item) {
    const courseId = firstValue(
      item,
      ["courseId", "course_id", "course.id"],
      null,
    );
    const progress = Number(
      firstValue(
        item,
        [
          "progress",
          "progressPercentage",
          "progress_percentage",
          "completionPercentage",
          "completion_percentage",
        ],
        0,
      ),
    );

    const sessionTypePresentation = getSessionTypePresentation(
      firstValue(
        item,
        [
          "sessionType.name",
          "sessionType.label",
          "sessionType.type",
          "schedule.sessionType.name",
          "schedule.sessionType.label",
          "schedule.sessionType.type",
          "session_type",
          "session_type.name",
          "session_type.label",
          "session_type.type",
          "courseSchedule.sessionType.name",
          "courseSchedule.sessionType.label",
          "courseSchedule.session_type.name",
          "courseSchedule.session_type.label",
          "course_schedule.sessionType.name",
          "course_schedule.sessionType.label",
          "course_schedule.session_type.name",
          "course_schedule.session_type.label",
          "sessionType",
        ],
        "",
      ),
    );

    return {
      id: firstValue(item, ["id"], null),
      courseId: courseId != null ? String(courseId) : null,
      courseTitle: getDisplayText(
        firstValue(
          item,
          [
            "course.title",
            "course.name",
            "schedule.course.title",
            "schedule.course.name",
            "course_schedule.course.title",
            "course_schedule.course.name",
            "courseSchedule.course.title",
            "courseSchedule.course.name",
          ],
          "",
        ),
        "",
      ),
      weeklyScheduleLabel: getDisplayText(
        firstValue(
          item,
          [
            "weeklySchedule.label",
            "weeklySchedule.name",
            "weeklySchedule.title",
            "schedule.weeklySchedule.label",
            "schedule.weeklySchedule.name",
            "schedule.weeklySchedule.title",
            "schedule.weekly_schedule.label",
            "schedule.weekly_schedule.name",
            "schedule.weekly_schedule.title",
            "weekly_schedule",
            "weekly_schedule.label",
            "weekly_schedule.name",
            "weekly_schedule.title",
            "courseSchedule.weeklySchedule.label",
            "courseSchedule.weeklySchedule.name",
            "courseSchedule.weekly_schedule.label",
            "courseSchedule.weekly_schedule.name",
            "course_schedule.weeklySchedule.label",
            "course_schedule.weeklySchedule.name",
            "course_schedule.weekly_schedule.label",
            "course_schedule.weekly_schedule.name",
            "course_schedule.schedule.label",
            "course_schedule.schedule.name",
            "schedule.label",
            "schedule.name",
          ],
          "",
        ),
        "Not available",
      ),
      timeSlotLabel: getDisplayText(
        firstValue(
          item,
          [
            "timeSlot.label",
            "timeSlot.name",
            "timeSlot.title",
            "schedule.timeSlot.label",
            "schedule.timeSlot.name",
            "schedule.timeSlot.title",
            "schedule.time_slot.label",
            "schedule.time_slot.name",
            "schedule.time_slot.title",
            "time_slot",
            "time_slot.label",
            "time_slot.name",
            "time_slot.title",
            "courseSchedule.timeSlot.label",
            "courseSchedule.timeSlot.name",
            "courseSchedule.time_slot.label",
            "courseSchedule.time_slot.name",
            "course_schedule.timeSlot.label",
            "course_schedule.timeSlot.name",
            "course_schedule.time_slot.label",
            "course_schedule.time_slot.name",
            "slot.label",
            "slot.name",
          ],
          "",
        ),
        "Not available",
      ),
      sessionTypeLabel: getDisplayText(
        sessionTypePresentation.label,
        "Not available",
      ),
      sessionTypeIcon: sessionTypePresentation.icon,
      location: getDisplayText(
        firstValue(
          item,
          [
            "location",
            "schedule.location",
            "courseSchedule.location",
            "course_schedule.location",
            "sessionType.location",
            "schedule.sessionType.location",
            "session_type.location",
            "courseSchedule.sessionType.location",
            "courseSchedule.session_type.location",
            "course_schedule.sessionType.location",
            "course_schedule.session_type.location",
            "place",
          ],
          "",
        ),
        "Not available",
      ),
      progress: Number.isFinite(progress)
        ? Math.max(0, Math.min(100, progress))
        : 0,
    };
  }

  function findFooterEnrolledCoursesLink() {
    const existing = document.getElementById("footerEnrolledCoursesLink");
    if (existing) return existing;

    const footerLinks = Array.from(
      document.querySelectorAll(".footer .list p"),
    );
    const match = footerLinks.find(
      (element) => element.textContent.trim() === "Enrolled Courses",
    );

    if (match && !match.id) {
      match.id = "footerEnrolledCoursesLink";
    }

    return match || null;
  }

  function ensureEnrolledCoursesModal() {
    let overlay = document.getElementById("enrolledCoursesOverlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "modal-overlay hidden enrolledmodal-overlay";
    overlay.id = "enrolledCoursesOverlay";
    overlay.innerHTML = `
      <div
        class="enrolledmodal"
        id="enrolledCoursesModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enrolledCoursesTitle"
      >
        <div class="enrolltitle">
          <p id="enrolledCoursesTitle">Enrolled Courses</p>
          <p id="enrolledCoursesCount">Total Enrollments 0</p>
        </div>
        <div class="enrolledcards" id="enrolledCoursesList"></div>
      </div>`;

    document.body.appendChild(overlay);
    return overlay;
  }

  function getEnrollmentCardData(enrollment) {
    const courseMeta =
      enrolledState.featuredCoursesById.get(String(enrollment.courseId)) ||
      enrolledState.catalogCoursesById.get(String(enrollment.courseId)) ||
      {};
    const courseTitle =
      enrollment.courseTitle || courseMeta.title || "Untitled course";
    const courseImage = courseMeta.image || "./assets/cardimage.png";
    const instructorName =
      courseMeta.instructor?.name ||
      getDisplayText(courseMeta.lecturer, "Course instructor") ||
      "Course instructor";
    const ratingValue = Number(courseMeta.avgRating ?? courseMeta.rating ?? 0);
    const rating = Number.isFinite(ratingValue)
      ? ratingValue.toFixed(1)
      : "0.0";

    return {
      courseId: enrollment.courseId || "",
      courseTitle,
      courseImage,
      instructorName,
      rating,
      progress: enrollment.progress,
      weeklyScheduleLabel: enrollment.weeklyScheduleLabel,
      timeSlotLabel: enrollment.timeSlotLabel,
      sessionTypeIcon: enrollment.sessionTypeIcon,
      sessionTypeLabel: enrollment.sessionTypeLabel,
      location: enrollment.location,
    };
  }

  function setFooterEnrolledCoursesActive(isActive) {
    const footerEnrolledCoursesLink = findFooterEnrolledCoursesLink();
    footerEnrolledCoursesLink?.classList.toggle("active", isActive);
  }

  function renderEnrollmentCards() {
    const enrolledCoursesList = document.getElementById("enrolledCoursesList");
    const enrolledCoursesCount = document.getElementById(
      "enrolledCoursesCount",
    );

    if (!enrolledCoursesList || !enrolledCoursesCount) return;

    enrolledCoursesCount.textContent = `Total Enrollments ${enrolledState.enrollments.length}`;

    if (enrolledState.loadingEnrollments) {
      enrolledCoursesList.innerHTML =
        '<div class="enrolledmodal-loading">Loading enrolled courses...</div>';
      return;
    }

    if (!enrolledState.enrollments.length) {
      enrolledCoursesList.innerHTML = `
        <div class="enrolledmodal-empty">
          <img src="./assets/empty.svg" alt="" />
          <div class="emptytitle">No Enrolled Courses Yet</div>
          <div class="emptydec">
            Your learning journey starts here! Browse courses to get started.
          </div>
          <div class="browsebutton">Browse Courses</div>
        </div>`;

      const browseButton = enrolledCoursesList.querySelector(".browsebutton");
      browseButton?.addEventListener("click", () => {
        closeEnrolledCoursesModal();

        if (typeof window.openBrowseCourses === "function") {
          window.openBrowseCourses();
          return;
        }

        window.location.href = "index.html#startlearning";
      });
      return;
    }

    enrolledCoursesList.innerHTML = enrolledState.enrollments
      .map((enrollment) => {
        const cardData = getEnrollmentCardData(enrollment);

        return `
          <div class="enrolledcard" data-course-id="${cardData.courseId}">
            <div class="enrolledmodallineone">
              <img src="${escapeHtml(cardData.courseImage)}" alt="${escapeHtml(cardData.courseTitle)}" />
              <div class="enrolledinfos">
                <div class="lineoneofenrolled">
                  <div class="enrolledleacturer">
                    Instructor
                    <span style="color: rgba(102, 102, 102, 1)">${escapeHtml(cardData.instructorName)}</span>
                  </div>
                  <div class="enrolledrating">
                    <img src="./assets/star.png" alt="" />${escapeHtml(cardData.rating)}
                  </div>
                </div>
                <p class="enrolledtitle">${escapeHtml(cardData.courseTitle)}</p>
                <div class="enrolledslot weekdays">
                  <img src="./assets/cal.svg" alt="" />${escapeHtml(cardData.weeklyScheduleLabel)}
                </div>
                <div class="enrolledslot times">
                  <img src="./assets/time.png" alt="" />${escapeHtml(cardData.timeSlotLabel)}
                </div>
                <div class="enrolledslot types">
                  <img src="${escapeHtml(cardData.sessionTypeIcon)}" alt="" />${escapeHtml(cardData.sessionTypeLabel)}
                </div>
                <div class="enrolledslot locations">
                  <img src="./assets/location.png" alt="" />${escapeHtml(cardData.location)}
                </div>
              </div>
            </div>
            <div class="enrolledmodallinetwo">
              <div class="courseprogress">
                ${cardData.progress}% complete
                <div class="course-progress-bar">
                  <div class="course-progress-fill" style="width: ${cardData.progress}%;"></div>
                </div>
              </div>
              <button class="viewcoursebtn" type="button" data-course-id="${cardData.courseId}">View</button>
            </div>
          </div>`;
      })
      .join("");

    enrolledCoursesList.querySelectorAll(".viewcoursebtn").forEach((button) => {
      button.addEventListener("click", () => {
        const courseId = button.dataset.courseId;
        if (!courseId) return;
        window.location.href = `course-details.html?id=${encodeURIComponent(courseId)}`;
      });
    });
  }

  async function ensureFeaturedCoursesMap() {
    if (enrolledState.featuredCoursesById.size > 0) return;

    const result = await apiGetFeaturedCourses();
    const courses = normalizeCoursePayload(result);
    courses.forEach((course) => {
      const id = String(firstValue(course, ["id"], ""));
      if (id) {
        enrolledState.featuredCoursesById.set(id, course);
      }
    });
  }

  async function ensureCatalogCoursesMap(courseIds = []) {
    const missingCourseIds = courseIds.filter(
      (courseId) =>
        courseId &&
        !enrolledState.featuredCoursesById.has(String(courseId)) &&
        !enrolledState.catalogCoursesById.has(String(courseId)),
    );

    if (!missingCourseIds.length || enrolledState.catalogLoaded) return;

    let currentPage = 1;
    let lastPage = 1;

    do {
      const result = await apiGetCourses({ sort: "newest", page: currentPage });
      const courses = normalizeCoursePayload(result);
      const meta = result?.data?.meta ?? {};

      courses.forEach((course) => {
        const id = String(firstValue(course, ["id"], ""));
        if (id) {
          enrolledState.catalogCoursesById.set(id, course);
        }
      });

      lastPage = Number(meta.lastPage) || currentPage;
      currentPage += 1;
    } while (currentPage <= lastPage);

    enrolledState.catalogLoaded = true;
  }

  async function loadEnrolledCourses(options = {}) {
    const { promptLogin = true } = options;

    if (typeof isLoggedIn !== "function" || !isLoggedIn()) {
      if (typeof window.openLogin === "function") {
        if (promptLogin) {
          window.openLogin();
        }
      }
      return { ok: false, requiresLogin: true, courses: [] };
    }

    const token = typeof getToken === "function" ? getToken() : null;
    if (!token) {
      return { ok: false, requiresLogin: true, courses: [] };
    }

    enrolledState.loadingEnrollments = true;
    renderEnrollmentCards();

    await ensureFeaturedCoursesMap();

    const result = await apiGetEnrollments(token);
    enrolledState.loadingEnrollments = false;

    if (!result?.ok) {
      enrolledState.enrollments = [];
      renderEnrollmentCards();
      return { ok: false, courses: [] };
    }

    enrolledState.enrollments = normalizeCoursePayload(result.data).map(
      normalizeEnrollment,
    );

    await ensureCatalogCoursesMap(
      enrolledState.enrollments.map((enrollment) => enrollment.courseId),
    );

    renderEnrollmentCards();
    return {
      ok: true,
      courses: enrolledState.enrollments.map(getEnrollmentCardData),
    };
  }

  function openEnrolledCoursesModalUI() {
    const enrolledCoursesOverlay = ensureEnrolledCoursesModal();
    enrolledCoursesOverlay.classList.remove("hidden");
    setFooterEnrolledCoursesActive(true);
    document.body.style.overflow = "hidden";
  }

  function closeEnrolledCoursesModal() {
    const enrolledCoursesOverlay = document.getElementById(
      "enrolledCoursesOverlay",
    );
    if (!enrolledCoursesOverlay) return;
    enrolledCoursesOverlay.classList.add("hidden");
    setFooterEnrolledCoursesActive(false);
    document.body.style.overflow = "";
  }

  async function handleOpenEnrolledCourses() {
    const result = await loadEnrolledCourses({ promptLogin: true });
    if (!result.ok) return;
    openEnrolledCoursesModalUI();
  }

  function bindEnrolledCoursesUI() {
    const headerEnrolledCoursesLink = document.querySelector(
      ".header .browse.enrolled",
    );
    const footerEnrolledCoursesLink = findFooterEnrolledCoursesLink();
    const enrolledCoursesOverlay = ensureEnrolledCoursesModal();

    headerEnrolledCoursesLink?.addEventListener(
      "click",
      handleOpenEnrolledCourses,
    );
    footerEnrolledCoursesLink?.addEventListener(
      "click",
      handleOpenEnrolledCourses,
    );
    enrolledCoursesOverlay.addEventListener("click", (event) => {
      if (event.target === enrolledCoursesOverlay) {
        closeEnrolledCoursesModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        !enrolledCoursesOverlay.classList.contains("hidden")
      ) {
        closeEnrolledCoursesModal();
      }
    });
  }

  window.openEnrolledCoursesModal = handleOpenEnrolledCourses;
  window.closeEnrolledCoursesModal = closeEnrolledCoursesModal;
  window.getEnrolledCoursesData = (options = {}) =>
    loadEnrolledCourses({ promptLogin: false, ...options });

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", bindEnrolledCoursesUI);
  } else {
    bindEnrolledCoursesUI();
  }
})();
