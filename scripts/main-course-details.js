// Entry point for course-details.html
(function () {
  const container = document.querySelector(".course-detail-container");
  if (!container) return;

  const titleEl = document.getElementById("course-title");
  const weeksEl = document.getElementById("weeks");
  const hoursEl = document.getElementById("hours");
  const ratingEl = document.getElementById("rating");
  const categoryEl = document.getElementById("category");
  const categoryIconEl = document.getElementById("courseCategoryIcon");
  const authorEl = document.getElementById("author");
  const descriptionEl = document.getElementById("description");
  const priceEl = document.getElementById("price");
  const basePriceEl = document.getElementById("basePrice");
  const sessionModifierEl = document.getElementById("sessionModifier");
  const locationEl = document.querySelector(".location");
  const mainImageEl = document.querySelector(".course-detail-main-image");
  const authorAvatarEl = document.querySelector(".course-detail-avatar");
  const authBoxEl = document.querySelector(".course-detail-auth-box");
  const signInBtn = document.querySelector(".course-detail-signin");
  const enrollBtn = document.querySelector(".course-detail-enroll");
  const selectionPanelEl = document.getElementById("courseSelectionPanel");
  const priceBoxEl = document.querySelector(".course-detail-price-box");
  const progressPanelEl = document.getElementById("courseProgressPanel");
  const progressLabelEl = document.getElementById("courseProgressLabel");
  const progressFillEl = document.getElementById("courseProgressFill");
  const completeCourseBtnEl = document.getElementById("completeCourseBtn");
  const completeCourseBtnLabelEl = document.getElementById(
    "completeCourseBtnLabel",
  );
  const completeCourseBtnIconEl = document.getElementById(
    "completeCourseBtnIcon",
  );
  const courseRatingDisplayEl = document.getElementById("courseRatingDisplay");
  const courseRatingDisplayStarsEl = document.getElementById(
    "courseRatingDisplayStars",
  );
  const courseProgressBadgeEl = document.getElementById("courseProgressBadge");
  const enrolledWeeklyScheduleEl = document.getElementById(
    "enrolledWeeklySchedule",
  );
  const enrolledTimeSlotEl = document.getElementById("enrolledTimeSlot");
  const enrolledSessionTypeIconEl = document.getElementById(
    "enrolledSessionTypeIcon",
  );
  const enrolledSessionTypeEl = document.getElementById("enrolledSessionType");
  const enrolledLocationRowEl = document.getElementById("enrolledLocationRow");
  const enrolledLocationEl = document.getElementById("enrolledLocation");
  const stateMessageEl = document.getElementById("courseStateMessage");
  const courseWarningEl = document.getElementById("courseWarning");
  const courseWarningTitleEl = document.getElementById("courseWarningTitle");
  const courseWarningDescriptionEl = document.getElementById(
    "courseWarningDescription",
  );
  const courseWarningActionEl = document.getElementById("courseWarningAction");
  const weeklyScheduleOptionsEl = document.getElementById(
    "weeklyScheduleOptions",
  );
  const timeSlotOptionsEl = document.getElementById("timeSlotOptions");
  const sessionTypeOptionsEl = document.getElementById("sessionTypeOptions");
  const dropdownTriggers = Array.from(
    document.querySelectorAll(".course-detail-dropdown-trigger"),
  );
  const profileIncompletePopupEl = document.getElementById(
    "profileIncompletePopup",
  );
  const profileIncompleteConfirmBtn = document.getElementById(
    "profileIncompleteConfirmBtn",
  );
  const profileIncompleteCancelBtn = document.getElementById(
    "profileIncompleteCancelBtn",
  );
  const enrollmentConfirmedPopupEl = document.getElementById(
    "enrollmentConfirmedPopup",
  );
  const enrollmentConfirmedDoneBtn = document.getElementById(
    "enrollmentConfirmedDoneBtn",
  );
  const enrollmentConflictPopupEl = document.getElementById(
    "enrollmentConflictPopup",
  );
  const enrollmentConflictPopupTextEl = document.getElementById(
    "enrollmentConflictPopupText",
  );
  const enrollmentConflictContinueBtn = document.getElementById(
    "enrollmentConflictContinueBtn",
  );
  const enrollmentConflictCancelBtn = document.getElementById(
    "enrollmentConflictCancelBtn",
  );
  const courseFinishedPopupEl = document.getElementById("courseFinishedPopup");
  const courseFinishedPopupTextEl = document.getElementById(
    "courseFinishedPopupText",
  );
  const courseFinishedDoneBtnEl = document.getElementById(
    "courseFinishedDoneBtn",
  );
  const courseFinishedStarsEl = document.getElementById("courseFinishedStars");

  const state = {
    courseId: null,
    course: null,
    weeklySchedules: [],
    timeSlots: [],
    sessionTypes: [],
    enrollments: [],
    currentEnrollment: null,
    selectedScheduleId: null,
    selectedTimeSlotId: null,
    selectedSessionTypeId: null,
    enrollmentGuard: null,
    pendingConflict: null,
    loadingTimeSlots: false,
    loadingSessionTypes: false,
    timeSlotCache: {},
    sessionTypeCache: {},
    selectedCourseRating: 0,
    submittedCourseRating: 0,
    completingCourse: false,
  };

  const ENROLL_DISABLED_STYLES = {
    backgroundColor: "rgba(238, 237, 252, 1)",
    color: "rgba(183, 179, 244, 1)",
  };

  const TIME_SLOT_ICON_MAP = {
    morning: "./assets/morning.png",
    afternoon: "./assets/afternoon.png",
    evening: "./assets/night.png",
    night: "./assets/night.png",
  };

  const PLACEHOLDER_TIME_SLOTS = [
    {
      id: "placeholder-morning",
      label: "Morning",
      detail: "9:00 AM - 11:00 AM",
      icon: "./assets/morning.png",
    },
    {
      id: "placeholder-afternoon",
      label: "Afternoon",
      detail: "2:00 PM - 4:00 PM",
      icon: "./assets/afternoon.png",
    },
    {
      id: "placeholder-evening",
      label: "Evening",
      detail: "6:00 PM - 8:00 PM",
      icon: "./assets/night.png",
    },
  ];

  const PLACEHOLDER_SESSION_TYPES = [
    {
      id: "placeholder-online",
      name: "Online",
      priceModifier: 0,
      availableSeats: null,
      location: "",
      icon: "./assets/online.svg",
    },
    {
      id: "placeholder-inperson",
      name: "In-person",
      priceModifier: 50,
      availableSeats: null,
      location: "Tbilisi Campus",
      icon: "./assets/inperson.svg",
    },
    {
      id: "placeholder-hybrid",
      name: "Hybrid",
      priceModifier: 30,
      availableSeats: null,
      location: "Tbilisi Campus",
      icon: "./assets/hybrid.svg",
    },
  ];

  const CATEGORY_ICON_CLASS_BY_NAME = {
    development: "category-icon--development",
    design: "category-icon--design",
    business: "category-icon--business",
    marketing: "category-icon--marketing",
    "data science": "category-icon--datascience",
    "data-science": "category-icon--datascience",
    datascience: "category-icon--datascience",
  };

  function getSavedCourseRatingStorageKey(courseId) {
    return `redberry-course-rating:${String(courseId || "")}`;
  }

  function loadSavedCourseRating(courseId) {
    if (!courseId) return 0;

    try {
      const storedValue = window.localStorage.getItem(
        getSavedCourseRatingStorageKey(courseId),
      );
      const parsedValue = Number(storedValue);
      return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0;
    } catch (error) {
      return 0;
    }
  }

  function saveSubmittedCourseRating(courseId, rating) {
    if (!courseId) return;

    try {
      window.localStorage.setItem(
        getSavedCourseRatingStorageKey(courseId),
        String(rating),
      );
    } catch (error) {
      // Ignore storage failures and keep the current in-memory state.
    }
  }

  function clearSubmittedCourseRating(courseId) {
    if (!courseId) return;

    try {
      window.localStorage.removeItem(getSavedCourseRatingStorageKey(courseId));
    } catch (error) {
      // Ignore storage failures and keep the current in-memory state.
    }
  }

  function normalizeTimeSlotKey(label) {
    return String(label || "")
      .toLowerCase()
      .replace(/\s*\(.+\)$/, "")
      .trim();
  }

  function normalizeSessionTypeKey(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");
  }

  function getDisplayTimeSlots() {
    const availableSlots = new Map(
      state.timeSlots.map((slot) => [normalizeTimeSlotKey(slot.label), slot]),
    );
    const usedKeys = new Set();

    const mergedSlots = PLACEHOLDER_TIME_SLOTS.map((placeholder) => {
      const key = normalizeTimeSlotKey(placeholder.label);
      const matchedSlot = availableSlots.get(key);
      if (matchedSlot) {
        usedKeys.add(key);
        return {
          ...matchedSlot,
          isUnavailable: false,
        };
      }

      return {
        ...placeholder,
        isUnavailable: true,
      };
    });

    state.timeSlots.forEach((slot) => {
      const key = normalizeTimeSlotKey(slot.label);
      if (!usedKeys.has(key)) {
        mergedSlots.push({
          ...slot,
          isUnavailable: false,
        });
      }
    });

    return mergedSlots;
  }

  function getDisplaySessionTypes() {
    const availableSessionTypes = new Map(
      state.sessionTypes.map((sessionType) => [
        normalizeSessionTypeKey(sessionType.name),
        sessionType,
      ]),
    );
    const usedKeys = new Set();

    const mergedSessionTypes = PLACEHOLDER_SESSION_TYPES.map((placeholder) => {
      const key = normalizeSessionTypeKey(placeholder.name);
      const matchedSessionType = availableSessionTypes.get(key);
      if (matchedSessionType) {
        usedKeys.add(key);
        return {
          ...matchedSessionType,
          isUnavailable: false,
        };
      }

      return {
        ...placeholder,
        isUnavailable: true,
      };
    });

    state.sessionTypes.forEach((sessionType) => {
      const key = normalizeSessionTypeKey(sessionType.name);
      if (!usedKeys.has(key)) {
        mergedSessionTypes.push({
          ...sessionType,
          isUnavailable: false,
        });
      }
    });

    return mergedSessionTypes;
  }

  function extractList(payload) {
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    if (Array.isArray(payload?.data?.courses)) return payload.data.courses;
    if (Array.isArray(payload)) return payload;
    return [];
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

  function formatPrice(value) {
    const numericValue = Number(value ?? 0);
    return `$${numericValue.toFixed(2)}`;
  }

  function getPriceModifierLabel(modifier) {
    const numericModifier = Number(modifier ?? 0);
    return numericModifier > 0 ? `+$${numericModifier.toFixed(2)}` : "Included";
  }

  function getTimeSlotIcon(label) {
    const normalizedLabel = String(label || "").toLowerCase();
    return TIME_SLOT_ICON_MAP[normalizedLabel] || "./assets/time.png";
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
      return {
        label: "In-person",
        icon: "./assets/inperson.svg",
      };
    }

    if (normalizedValue.includes("hybrid")) {
      return {
        label: "Hybrid",
        icon: "./assets/hybrid.svg",
      };
    }

    if (normalizedValue.includes("online")) {
      return {
        label: "Online",
        icon: "./assets/online.svg",
      };
    }

    return {
      label: toTitleCase(rawValue),
      icon: "./assets/online.svg",
    };
  }

  function formatTimeValue(value) {
    if (!value) return "";
    const [hoursText, minutesText] = String(value).split(":");
    const hours = Number(hoursText);
    const minutes = Number(minutesText || 0);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return String(value);
    }

    const suffix = hours >= 12 ? "PM" : "AM";
    const normalizedHours = hours % 12 || 12;
    return `${normalizedHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
  }

  function splitTimeSlotLabel(label, startTime, endTime) {
    const text = String(label || "").trim();
    const bracketMatch = text.match(/^(.+?)\s*\((.+)\)$/);
    if (bracketMatch) {
      return {
        title: bracketMatch[1].trim(),
        detail: bracketMatch[2].trim(),
      };
    }

    const detail =
      startTime && endTime
        ? `${formatTimeValue(startTime)} - ${formatTimeValue(endTime)}`
        : "Time not specified";

    return {
      title: text || "Time Slot",
      detail,
    };
  }

  function normalizeCoursePayload(result) {
    return extractList(result);
  }

  function normalizeCourse(course) {
    const basePrice = Number(
      firstValue(course, ["basePrice", "price", "cost"], 0),
    );
    const averageRating = Number(
      firstValue(course, ["avgRating", "rating", "score"], 0),
    );
    const reviewCount = Number(
      firstValue(course, ["reviewCount", "reviewsCount", "ratingCount"], 0),
    );

    return {
      id: String(firstValue(course, ["id"], "")),
      title: getDisplayText(
        firstValue(course, ["title", "name"], "Untitled course"),
        "Untitled course",
      ),
      description: getDisplayText(
        firstValue(
          course,
          ["description", "details", "short_description"],
          "No description available.",
        ),
        "No description available.",
      ),
      image: firstValue(
        course,
        ["image", "thumbnail", "cover"],
        "./assets/cardimage.png",
      ),
      rating: Number.isFinite(averageRating) ? averageRating.toFixed(1) : "0.0",
      reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
      category: getDisplayText(
        firstValue(course, ["category.name", "category", "track"], "General"),
        "General",
      ),
      categoryIcon: getDisplayText(
        firstValue(
          course,
          ["category.icon", "categoryIcon", "category_icon"],
          "development",
        ),
        "development",
      ),
      instructorName: getDisplayText(
        firstValue(
          course,
          ["instructor.name", "mentor.name", "author.name", "teacher"],
          "Course instructor",
        ),
        "Course instructor",
      ),
      instructorAvatar: firstValue(
        course,
        ["instructor.avatar", "mentor.avatar", "author.avatar"],
        "./assets/profilepic.png",
      ),
      weeks: firstValue(
        course,
        ["durationWeeks", "duration_weeks", "weeks"],
        "12 Weeks",
      ),
      basePrice: Number.isFinite(basePrice) ? basePrice : 0,
    };
  }

  function getCategoryIconClass(categoryName, categoryIcon) {
    const iconKey = String(categoryIcon || categoryName || "")
      .trim()
      .toLowerCase();
    return CATEGORY_ICON_CLASS_BY_NAME[iconKey] || "category-icon--development";
  }

  function normalizeWeeklySchedule(item, index = 0) {
    return {
      id: String(firstValue(item, ["id"], index + 1)),
      label: getDisplayText(
        firstValue(item, ["label", "name", "title"], `Schedule ${index + 1}`),
        `Schedule ${index + 1}`,
      ),
    };
  }

  function normalizeTimeSlot(item, index = 0) {
    const label = firstValue(
      item,
      ["label", "name", "title"],
      `Time Slot ${index + 1}`,
    );
    const startTime = firstValue(item, ["startTime", "start_time"], "");
    const endTime = firstValue(item, ["endTime", "end_time"], "");
    const split = splitTimeSlotLabel(label, startTime, endTime);

    return {
      id: String(firstValue(item, ["id"], index + 1)),
      label: split.title,
      detail: split.detail,
      startTime,
      endTime,
      icon: getTimeSlotIcon(split.title),
    };
  }

  function normalizeSessionType(item, index = 0) {
    const rawName = getDisplayText(
      firstValue(item, ["name", "label", "type"], `Session ${index + 1}`),
      `Session ${index + 1}`,
    );
    const sessionTypePresentation = getSessionTypePresentation(rawName);

    const modifier = Number(
      firstValue(item, ["priceModifier", "price_modifier", "modifier"], 0),
    );
    const seats = Number(
      firstValue(item, ["availableSeats", "available_seats", "seats"], 0),
    );

    return {
      id: String(firstValue(item, ["id"], index + 1)),
      courseScheduleId: firstValue(
        item,
        ["courseScheduleId", "course_schedule_id"],
        null,
      ),
      name: sessionTypePresentation.label,
      priceModifier: Number.isFinite(modifier) ? modifier : 0,
      availableSeats: Number.isFinite(seats) ? seats : 0,
      location: getDisplayText(firstValue(item, ["location", "place"], ""), ""),
      icon: sessionTypePresentation.icon,
    };
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
      weeklyScheduleId: firstValue(
        item,
        [
          "weeklySchedule.id",
          "weekly_schedule.id",
          "schedule.weeklySchedule.id",
          "schedule.weekly_schedule.id",
          "courseSchedule.weeklySchedule.id",
          "courseSchedule.weekly_schedule.id",
          "course_schedule.weeklySchedule.id",
          "course_schedule.weekly_schedule.id",
          "course_schedule.schedule.id",
          "weekly_schedule_id",
          "course_schedule.weekly_schedule_id",
        ],
        null,
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
        "",
      ),
      timeSlotId: firstValue(
        item,
        [
          "timeSlot.id",
          "time_slot.id",
          "schedule.timeSlot.id",
          "schedule.time_slot.id",
          "courseSchedule.timeSlot.id",
          "courseSchedule.time_slot.id",
          "course_schedule.timeSlot.id",
          "course_schedule.time_slot.id",
          "time_slot_id",
          "course_schedule.time_slot_id",
        ],
        null,
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
        "",
      ),
      sessionTypeLabel: getDisplayText(sessionTypePresentation.label, ""),
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
        "",
      ),
      progress: Number.isFinite(progress)
        ? Math.max(0, Math.min(100, progress))
        : 0,
      completedAt: firstValue(item, ["completedAt", "completed_at"], null),
    };
  }

  function setCompleteButtonLoading(isLoading) {
    if (!completeCourseBtnEl || !completeCourseBtnLabelEl) return;

    completeCourseBtnEl.disabled = isLoading;
    completeCourseBtnLabelEl.textContent = isLoading
      ? completeCourseBtnEl.classList.contains("is-retake")
        ? "Retaking..."
        : "Completing..."
      : completeCourseBtnEl.classList.contains("is-retake")
        ? "Retake Course"
        : "Complete Course";
  }

  function updateCourseRatingStars() {
    if (!courseFinishedStarsEl) return;

    courseFinishedStarsEl
      .querySelectorAll(".course-rating-star")
      .forEach((button) => {
        const rating = Number(button.dataset.rating || 0);
        const image = button.querySelector("img");
        if (!image) return;

        image.src =
          rating <= state.selectedCourseRating
            ? "./assets/filledstar.svg"
            : "./assets/emptystar.svg";
      });
  }

  function updateCourseRatingDisplay() {
    if (!courseRatingDisplayEl || !courseRatingDisplayStarsEl) return;

    const hasRating = Number(state.submittedCourseRating) > 0;
    courseRatingDisplayEl.classList.toggle("hidden", !hasRating);
    courseRatingDisplayEl.hidden = !hasRating;

    courseRatingDisplayStarsEl
      .querySelectorAll("img")
      .forEach((image, index) => {
        image.src =
          index < state.submittedCourseRating
            ? "./assets/filledstar.svg"
            : "./assets/emptystar.svg";
      });
  }

  function setDisplayedCourseRating(averageRating, reviewCount = null) {
    const normalizedAverage = Number(averageRating);
    const nextAverage = Number.isFinite(normalizedAverage)
      ? normalizedAverage
      : 0;

    state.course.rating = nextAverage.toFixed(1);
    if (reviewCount != null) {
      const normalizedReviewCount = Number(reviewCount);
      if (Number.isFinite(normalizedReviewCount)) {
        state.course.reviewCount = normalizedReviewCount;
      }
    }

    if (ratingEl) {
      ratingEl.textContent = state.course.rating;
    }
  }

  function updateDisplayedAverageFromReviewSubmission(
    submittedRating,
    responseData,
  ) {
    const nextAverage = firstValue(responseData, [
      "avgRating",
      "averageRating",
      "course.avgRating",
      "course.rating",
      "data.avgRating",
      "data.course.avgRating",
    ]);
    const nextReviewCount = firstValue(responseData, [
      "reviewCount",
      "reviewsCount",
      "ratingCount",
      "course.reviewCount",
      "data.reviewCount",
      "data.course.reviewCount",
    ]);

    if (
      nextAverage !== null &&
      nextAverage !== undefined &&
      nextAverage !== ""
    ) {
      setDisplayedCourseRating(nextAverage, nextReviewCount);
      return;
    }

    const currentAverage = Number(state.course?.rating ?? 0);
    const currentReviewCount = Number(state.course?.reviewCount ?? 0);
    const safeAverage = Number.isFinite(currentAverage) ? currentAverage : 0;
    const safeReviewCount = Number.isFinite(currentReviewCount)
      ? currentReviewCount
      : 0;
    const calculatedAverage =
      (safeAverage * safeReviewCount + Number(submittedRating)) /
      (safeReviewCount + 1);

    setDisplayedCourseRating(calculatedAverage, safeReviewCount + 1);
  }

  function getEnrollmentCompletionState(enrollment) {
    const progress = Math.max(
      0,
      Math.min(100, Number(enrollment?.progress ?? 0)),
    );

    return {
      progress,
      isCompleted: Boolean(enrollment?.completedAt) || progress >= 100,
    };
  }

  function isEnrollmentCompleted(enrollment) {
    return getEnrollmentCompletionState(enrollment).isCompleted;
  }

  function updateCompletionState(enrollment) {
    if (
      !completeCourseBtnEl ||
      !completeCourseBtnLabelEl ||
      !completeCourseBtnIconEl ||
      !courseProgressBadgeEl
    ) {
      return;
    }

    const isCompleted = isEnrollmentCompleted(enrollment);

    courseProgressBadgeEl.textContent = isCompleted ? "Completed" : "Enrolled";
    courseProgressBadgeEl.classList.toggle("is-completed", isCompleted);
    completeCourseBtnEl.classList.toggle("is-retake", isCompleted);
    completeCourseBtnLabelEl.textContent = isCompleted
      ? "Retake Course"
      : "Complete Course";
    completeCourseBtnIconEl.src = isCompleted
      ? "./assets/retake.svg"
      : "./assets/completecrs.svg";

    if (!isCompleted) {
      state.submittedCourseRating = 0;
    }

    updateCourseRatingDisplay();
  }

  function openCourseFinishedPopup() {
    state.selectedCourseRating = 0;
    updateCourseRatingStars();

    if (courseFinishedPopupTextEl) {
      courseFinishedPopupTextEl.textContent = `You've completed “${state.course?.title || "this course"}” Course!`;
    }

    showPopup(courseFinishedPopupEl);
  }

  function getSelectedSchedule() {
    return state.weeklySchedules.find(
      (item) => String(item.id) === String(state.selectedScheduleId),
    );
  }

  function getSelectedTimeSlot() {
    return state.timeSlots.find(
      (item) => String(item.id) === String(state.selectedTimeSlotId),
    );
  }

  function getSelectedSessionType() {
    return state.sessionTypes.find(
      (item) => String(item.id) === String(state.selectedSessionTypeId),
    );
  }

  function isProfileDataComplete(profileData) {
    if (!profileData) return false;
    if (profileData.profileComplete) return true;

    const fullName = String(profileData.fullName || "").trim();
    const mobileNumber = String(profileData.mobileNumber || "")
      .replace(/\D/g, "")
      .trim();
    const age = Number(profileData.age);

    return Boolean(
      fullName &&
      mobileNumber.length === 9 &&
      mobileNumber.startsWith("5") &&
      Number.isFinite(age) &&
      age >= 16 &&
      age <= 120,
    );
  }

  function showPopup(popupEl) {
    if (!popupEl) return;
    popupEl.classList.remove("hidden");
  }

  function hidePopup(popupEl) {
    if (!popupEl) return;
    popupEl.classList.add("hidden");
  }

  function setStatusMessage(message, type = "info") {
    if (!stateMessageEl) return;
    if (!message) {
      stateMessageEl.hidden = true;
      stateMessageEl.textContent = "";
      stateMessageEl.dataset.state = "";
      return;
    }

    stateMessageEl.hidden = false;
    stateMessageEl.textContent = message;
    stateMessageEl.dataset.state = type;
  }

  function setEnrollButtonEnabled(enabled) {
    if (!enrollBtn || state.currentEnrollment) return;

    enrollBtn.disabled = !enabled;
    enrollBtn.classList.toggle("is-disabled", !enabled);
    enrollBtn.setAttribute("aria-disabled", enabled ? "false" : "true");

    if (enabled) {
      enrollBtn.style.backgroundColor = "";
      enrollBtn.style.color = "";
      return;
    }

    enrollBtn.style.backgroundColor = ENROLL_DISABLED_STYLES.backgroundColor;
    enrollBtn.style.color = ENROLL_DISABLED_STYLES.color;
  }

  function updateWarningUI(guard) {
    state.enrollmentGuard = guard;

    if (authBoxEl) {
      authBoxEl.hidden = true;
      authBoxEl.style.display = "none";
    }

    if (state.currentEnrollment) {
      if (courseWarningEl) courseWarningEl.hidden = true;
      setEnrollButtonEnabled(false);
      return;
    }

    if (!courseWarningEl) {
      setEnrollButtonEnabled(!guard);
      return;
    }

    if (!guard) {
      courseWarningEl.hidden = true;
      if (courseWarningActionEl) {
        courseWarningActionEl.hidden = true;
      }
      setEnrollButtonEnabled(true);
      return;
    }

    courseWarningEl.hidden = false;
    if (courseWarningActionEl) {
      courseWarningActionEl.hidden = false;
    }

    if (guard === "auth") {
      if (courseWarningTitleEl) {
        courseWarningTitleEl.innerHTML =
          '<img src="./assets/warning.svg" alt="" /><p>Authentication Required</p>';
      }
      if (courseWarningDescriptionEl) {
        courseWarningDescriptionEl.textContent =
          "You need sign in to your profile before enrolling in this course.";
      }
      if (courseWarningActionEl) {
        courseWarningActionEl.textContent = "Sign In";
      }
    }

    if (guard === "profile") {
      if (courseWarningTitleEl) {
        courseWarningTitleEl.innerHTML =
          '<img src="./assets/warning.svg" alt="" /><p>Complete your profile</p>';
      }
      if (courseWarningDescriptionEl) {
        courseWarningDescriptionEl.textContent =
          "You need to fill in your profile details before enrolling in this course.";
      }
      if (courseWarningActionEl) {
        courseWarningActionEl.innerHTML = "Complete &#8594;";
      }
    }

    setEnrollButtonEnabled(false);
  }

  async function refreshEnrollmentGuard(profileOverride = null) {
    if (state.currentEnrollment) {
      updateWarningUI(null);
      return;
    }

    if (typeof isLoggedIn !== "function" || !isLoggedIn()) {
      updateWarningUI("auth");
      return;
    }

    const rawProfile = profileOverride || (await getProfile());
    if (!rawProfile) {
      updateWarningUI(
        typeof isLoggedIn === "function" && isLoggedIn() ? "profile" : "auth",
      );
      return;
    }

    const normalizedProfile = normalizeProfileData(rawProfile);
    if (!normalizedProfile || !isProfileDataComplete(normalizedProfile)) {
      updateWarningUI("profile");
      return;
    }

    updateWarningUI(null);
  }

  function setTriggerExpanded(trigger, expanded) {
    trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
    trigger.classList.toggle("active", expanded);
    const arrow = trigger.querySelector(".course-detail-dropdown-arrow");
    if (arrow) {
      arrow.style.transform = expanded ? "rotate(180deg)" : "rotate(0deg)";
    }
  }

  function updateTriggerValidity() {
    dropdownTriggers.forEach((trigger) => {
      const targetId = trigger.dataset.target;
      const isTimeTrigger = targetId === "timeSlotOptionsWrap";
      const isSessionTrigger = targetId === "sessionTypeOptionsWrap";
      const isInvalid =
        (isTimeTrigger && !state.selectedScheduleId) ||
        (isSessionTrigger && !state.selectedTimeSlotId);

      trigger.classList.toggle("inctive", isInvalid);
    });
  }

  function closeAllDropdowns() {
    dropdownTriggers.forEach((trigger) => {
      setTriggerExpanded(trigger, false);
      const wrap = document.getElementById(trigger.dataset.target);
      if (wrap) {
        wrap.hidden = true;
      }
    });
    updateTriggerValidity();
  }

  function setDropdownOpen(targetId, expanded) {
    const trigger = dropdownTriggers.find(
      (item) => item.dataset.target === targetId,
    );
    const wrap = document.getElementById(targetId);
    if (!trigger || !wrap) return;
    if (trigger.classList.contains("inctive")) return;

    setTriggerExpanded(trigger, expanded);
    wrap.hidden = !expanded;
    updateTriggerValidity();
  }

  function toggleDropdown(targetId) {
    if (state.currentEnrollment) return;

    const trigger = dropdownTriggers.find(
      (item) => item.dataset.target === targetId,
    );
    if (!trigger || trigger.classList.contains("inctive")) return;

    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    setDropdownOpen(targetId, !isExpanded);
  }

  function updatePriceSummary() {
    const basePrice = Number(state.course?.basePrice ?? 0);
    const selectedSessionType = getSelectedSessionType();
    const modifier = Number(selectedSessionType?.priceModifier ?? 0);
    const total = basePrice + modifier;

    if (basePriceEl) basePriceEl.textContent = formatPrice(basePrice);
    if (sessionModifierEl) {
      sessionModifierEl.textContent = selectedSessionType
        ? getPriceModifierLabel(selectedSessionType.priceModifier)
        : "Not selected";
    }
    if (priceEl) priceEl.textContent = formatPrice(total);
  }

  function getSeatStatusMarkup(sessionType) {
    if (sessionType.availableSeats == null) {
      return '<p style="margin-top:4px;width:100%;text-align:center;font-family:Inter;font-size:12px;font-weight:500;color:rgba(138,138,138,1);">Select previous options first</p>';
    }

    if (sessionType.availableSeats <= 0) {
      return '<p style="margin-top:4px;width:100%;text-align:center;font-family:Inter;font-size:12px;font-weight:600;color:rgba(220,38,38,1);">Fully Booked</p>';
    }

    if (sessionType.availableSeats < 5) {
      return `
        <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:4px;width:100%;text-align:center;font-family:Inter;font-size:12px;font-weight:600;color:rgba(217,119,6,1);">
          <img src="./assets/warning.svg" alt="" style="width:16px;height:16px;" />
          <span>Only ${sessionType.availableSeats} seats left!</span>
        </div>`;
    }

    return `<p style="margin-top:4px;width:100%;text-align:center;font-family:Inter;font-size:12px;font-weight:500;color:rgba(82,82,82,1);">${sessionType.availableSeats} Seats Available</p>`;
  }

  function renderWeeklySchedules() {
    if (!weeklyScheduleOptionsEl) return;

    if (!state.weeklySchedules.length) {
      weeklyScheduleOptionsEl.innerHTML =
        '<button class="course-detail-btn inctive" type="button">No weekly schedules available</button>';
      return;
    }

    weeklyScheduleOptionsEl.innerHTML = state.weeklySchedules
      .map(
        (schedule) => `
          <button
            class="course-detail-btn${String(schedule.id) === String(state.selectedScheduleId) ? " active" : ""}"
            type="button"
            data-schedule-id="${schedule.id}"
          >
            ${schedule.label}
          </button>`,
      )
      .join("");

    weeklyScheduleOptionsEl
      .querySelectorAll("[data-schedule-id]")
      .forEach((button) => {
        button.addEventListener("click", async () => {
          const nextScheduleId = button.dataset.scheduleId;
          if (String(nextScheduleId) === String(state.selectedScheduleId)) {
            return;
          }

          state.selectedScheduleId = nextScheduleId;
          state.selectedTimeSlotId = null;
          state.selectedSessionTypeId = null;
          state.timeSlots = [];
          state.sessionTypes = [];
          setStatusMessage("");
          renderWeeklySchedules();
          renderTimeSlots();
          renderSessionTypes();
          updatePriceSummary();
          updateTriggerValidity();
          await loadTimeSlots(nextScheduleId);
          setDropdownOpen("timeSlotOptionsWrap", true);
        });
      });
  }

  function renderTimeSlots() {
    if (!timeSlotOptionsEl) return;

    if (!state.selectedScheduleId) {
      timeSlotOptionsEl.innerHTML = PLACEHOLDER_TIME_SLOTS.map(
        (slot) => `
          <button class="course-detail-btn inctive" type="button" disabled>
            <img src="${slot.icon}" alt="" />
            <div>
              <p class="third">${slot.label}</p>
              <p class="hours">${slot.detail}</p>
            </div>
          </button>`,
      ).join("");
      return;
    }

    if (state.loadingTimeSlots) {
      timeSlotOptionsEl.innerHTML = PLACEHOLDER_TIME_SLOTS.map(
        (slot) => `
          <button class="course-detail-btn inctive" type="button" disabled>
            <img src="${slot.icon}" alt="" />
            <div>
              <p class="third">${slot.label}</p>
              <p class="hours">Loading...</p>
            </div>
          </button>`,
      ).join("");
      return;
    }

    if (!state.timeSlots.length) {
      timeSlotOptionsEl.innerHTML = PLACEHOLDER_TIME_SLOTS.map(
        (slot) => `
          <button class="course-detail-btn inctive" type="button" disabled>
            <img src="${slot.icon}" alt="" />
            <div>
              <p class="third">${slot.label}</p>
              <p class="hours">Unavailable</p>
            </div>
          </button>`,
      ).join("");
      return;
    }

    timeSlotOptionsEl.innerHTML = getDisplayTimeSlots()
      .map(
        (slot) => `
          <button
            class="course-detail-btn${String(slot.id) === String(state.selectedTimeSlotId) ? " active" : ""}${slot.isUnavailable ? " inctive" : ""}"
            type="button"
            data-time-slot-id="${slot.id}"
            ${slot.isUnavailable ? "disabled" : ""}
          >
            <img src="${slot.icon}" alt="" />
            <div>
              <p class="third">${slot.label}</p>
              <p class="hours">${slot.isUnavailable ? "Unavailable" : slot.detail}</p>
            </div>
          </button>`,
      )
      .join("");

    timeSlotOptionsEl
      .querySelectorAll("[data-time-slot-id]")
      .forEach((button) => {
        button.addEventListener("click", async () => {
          const nextTimeSlotId = button.dataset.timeSlotId;
          if (String(nextTimeSlotId) === String(state.selectedTimeSlotId)) {
            return;
          }

          state.selectedTimeSlotId = nextTimeSlotId;
          state.selectedSessionTypeId = null;
          state.sessionTypes = [];
          setStatusMessage("");
          renderTimeSlots();
          renderSessionTypes();
          updatePriceSummary();
          updateTriggerValidity();
          await loadSessionTypes(state.selectedScheduleId, nextTimeSlotId);
          setDropdownOpen("sessionTypeOptionsWrap", true);
        });
      });
  }

  function renderSessionTypes() {
    if (!sessionTypeOptionsEl) return;

    if (!state.selectedTimeSlotId) {
      sessionTypeOptionsEl.innerHTML = PLACEHOLDER_SESSION_TYPES.map(
        (sessionType) => {
          const locationMarkup = sessionType.location
            ? `<div class="location"><img src="./assets/location.png" alt="" />${sessionType.location}</div>`
            : "";
          const seatMarkup = getSeatStatusMarkup(sessionType);

          return `
            <div style="display:flex;flex-direction:column;flex:1;gap:8px;">
              <button class="course-detail-btn session inctive" type="button" disabled>
                <img src="${sessionType.icon}" alt="" />
                <div>
                  <p class="third">${sessionType.name}</p>
                  ${locationMarkup}
                  <p class="extrapay">${getPriceModifierLabel(sessionType.priceModifier)}</p>
                </div>
              </button>
              <div>${seatMarkup}</div>
            </div>`;
        },
      ).join("");
      return;
    }

    if (state.loadingSessionTypes) {
      sessionTypeOptionsEl.innerHTML = PLACEHOLDER_SESSION_TYPES.map(
        (sessionType) => {
          const locationMarkup = sessionType.location
            ? `<div class="location"><img src="./assets/location.png" alt="" />${sessionType.location}</div>`
            : "";

          return `
            <div style="display:flex;flex-direction:column;flex:1;gap:8px;">
              <button class="course-detail-btn session inctive" type="button" disabled>
                <img src="${sessionType.icon}" alt="" />
                <div>
                  <p class="third">${sessionType.name}</p>
                  ${locationMarkup}
                  <p class="extrapay">${getPriceModifierLabel(sessionType.priceModifier)}</p>
                </div>
              </button>
              <div><p style="margin-top:4px;width:100%;text-align:center;font-family:Inter;font-size:12px;font-weight:500;color:rgba(138,138,138,1);">Loading...</p></div>
            </div>`;
        },
      ).join("");
      return;
    }

    if (!state.sessionTypes.length) {
      sessionTypeOptionsEl.innerHTML = PLACEHOLDER_SESSION_TYPES.map(
        (sessionType) => {
          const locationMarkup = sessionType.location
            ? `<div class="location"><img src="./assets/location.png" alt="" />${sessionType.location}</div>`
            : "";

          return `
            <div style="display:flex;flex-direction:column;flex:1;gap:8px;">
              <button class="course-detail-btn session inctive" type="button" disabled>
                <img src="${sessionType.icon}" alt="" />
                <div>
                  <p class="third">${sessionType.name}</p>
                  ${locationMarkup}
                  <p class="extrapay">${getPriceModifierLabel(sessionType.priceModifier)}</p>
                </div>
              </button>
              <div><p style="margin-top:4px;width:100%;text-align:center;font-family:Inter;font-size:12px;font-weight:500;color:rgba(138,138,138,1);">Unavailable</p></div>
            </div>`;
        },
      ).join("");
      return;
    }

    sessionTypeOptionsEl.innerHTML = getDisplaySessionTypes()
      .map((sessionType) => {
        const isDisabled =
          sessionType.isUnavailable || sessionType.availableSeats <= 0;
        const locationMarkup = sessionType.location
          ? `<div class="location"><img src="./assets/location.png" alt="" />${sessionType.location}</div>`
          : "";
        const seatMarkup = getSeatStatusMarkup(sessionType);

        return `
          <div style="display:flex;flex-direction:column;flex:1;gap:8px;">
            <button
              class="course-detail-btn session${String(sessionType.id) === String(state.selectedSessionTypeId) ? " active" : ""}${isDisabled ? " inctive" : ""}"
              type="button"
              data-session-type-id="${sessionType.id}"
              ${isDisabled ? "disabled" : ""}
            >
              <img src="${sessionType.icon}" alt="" />
              <div>
                <p class="third">${sessionType.name}</p>
                ${locationMarkup}
                <p class="extrapay">${getPriceModifierLabel(sessionType.priceModifier)}</p>
              </div>
            </button>
            <div>${seatMarkup}</div>
          </div>`;
      })
      .join("");

    sessionTypeOptionsEl
      .querySelectorAll("[data-session-type-id]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          state.selectedSessionTypeId = button.dataset.sessionTypeId;
          setStatusMessage("");
          renderSessionTypes();
          updatePriceSummary();
          updateTriggerValidity();
        });
      });
  }

  function renderProgress(enrollment) {
    if (!progressPanelEl) return;

    const { progress } = getEnrollmentCompletionState(enrollment);
    const displayProgress = isEnrollmentCompleted(enrollment) ? 100 : progress;
    progressPanelEl.hidden = false;
    if (progressLabelEl) {
      progressLabelEl.textContent = `${displayProgress}% complete`;
    }
    if (progressFillEl) {
      progressFillEl.style.width = `${displayProgress}%`;
    }
    if (enrolledWeeklyScheduleEl) {
      enrolledWeeklyScheduleEl.textContent =
        enrollment?.weeklyScheduleLabel || "Not available";
    }
    if (enrolledTimeSlotEl) {
      enrolledTimeSlotEl.textContent =
        enrollment?.timeSlotLabel || "Not available";
    }
    if (enrolledSessionTypeEl) {
      enrolledSessionTypeEl.textContent =
        enrollment?.sessionTypeLabel || "Not available";
    }
    if (enrolledSessionTypeIconEl) {
      enrolledSessionTypeIconEl.src =
        enrollment?.sessionTypeIcon || "./assets/online.svg";
    }
    if (enrolledLocationEl) {
      enrolledLocationEl.textContent = enrollment?.location || "-";
    }
    if (enrolledLocationRowEl) {
      enrolledLocationRowEl.hidden = !enrollment?.location;
    }

    updateCompletionState(enrollment);
  }

  function syncCourseMode() {
    const isEnrolled = Boolean(state.currentEnrollment);

    if (selectionPanelEl) {
      selectionPanelEl.hidden = isEnrolled;
    }
    if (priceBoxEl) {
      priceBoxEl.hidden = isEnrolled;
    }
    if (progressPanelEl) {
      progressPanelEl.hidden = !isEnrolled;
    }

    if (isEnrolled) {
      if (courseWarningEl) {
        courseWarningEl.hidden = true;
      }
      renderProgress(state.currentEnrollment);
      setStatusMessage("");
      setEnrollButtonEnabled(false);
      return;
    }

    if (progressPanelEl) {
      progressPanelEl.hidden = true;
    }
  }

  async function loadWeeklySchedules() {
    if (!state.courseId) return;

    const result = await apiGetCourseWeeklySchedules(state.courseId);
    if (!result?.ok) {
      state.weeklySchedules = [];
      renderWeeklySchedules();
      setStatusMessage("Unable to load weekly schedules right now.", "error");
      return;
    }

    state.weeklySchedules = extractList(result.data).map(
      normalizeWeeklySchedule,
    );
    renderWeeklySchedules();
    updateTriggerValidity();
  }

  async function loadTimeSlots(weeklyScheduleId) {
    if (!state.courseId || !weeklyScheduleId) return;

    const timeSlotCacheKey = String(weeklyScheduleId);
    if (state.timeSlotCache[timeSlotCacheKey]) {
      state.timeSlots = state.timeSlotCache[timeSlotCacheKey];
      renderTimeSlots();
      updateTriggerValidity();
      return;
    }

    state.loadingTimeSlots = true;
    renderTimeSlots();
    const result = await apiGetCourseTimeSlots(
      state.courseId,
      weeklyScheduleId,
    );
    state.loadingTimeSlots = false;

    if (!result?.ok) {
      state.timeSlots = [];
      renderTimeSlots();
      setStatusMessage(
        "Unable to load time slots for the selected schedule.",
        "error",
      );
      return;
    }

    state.timeSlots = extractList(result.data).map(normalizeTimeSlot);
    state.timeSlotCache[timeSlotCacheKey] = state.timeSlots;
    renderTimeSlots();
    updateTriggerValidity();
  }

  async function loadSessionTypes(weeklyScheduleId, timeSlotId) {
    if (!state.courseId || !weeklyScheduleId || !timeSlotId) return;

    const sessionTypeCacheKey = `${weeklyScheduleId}:${timeSlotId}`;
    if (state.sessionTypeCache[sessionTypeCacheKey]) {
      state.sessionTypes = state.sessionTypeCache[sessionTypeCacheKey];
      renderSessionTypes();
      updateTriggerValidity();
      return;
    }

    state.loadingSessionTypes = true;
    renderSessionTypes();
    const result = await apiGetCourseSessionTypes(
      state.courseId,
      weeklyScheduleId,
      timeSlotId,
    );
    state.loadingSessionTypes = false;

    if (!result?.ok) {
      state.sessionTypes = [];
      renderSessionTypes();
      setStatusMessage(
        "Unable to load session types for the selected time slot.",
        "error",
      );
      return;
    }

    state.sessionTypes = extractList(result.data).map(normalizeSessionType);
    state.sessionTypeCache[sessionTypeCacheKey] = state.sessionTypes;
    renderSessionTypes();
    updateTriggerValidity();
  }

  async function loadEnrollments() {
    state.enrollments = [];
    state.currentEnrollment = null;

    if (typeof isLoggedIn !== "function" || !isLoggedIn()) {
      return;
    }

    const token = getToken();
    if (!token) return;

    const result = await apiGetEnrollments(token);
    if (!result?.ok) {
      return;
    }

    state.enrollments = extractList(result.data).map(normalizeEnrollment);
    state.currentEnrollment =
      state.enrollments.find(
        (item) => String(item.courseId) === String(state.courseId),
      ) || null;
  }

  function findScheduleConflict() {
    if (!state.selectedScheduleId || !state.selectedTimeSlotId) {
      return null;
    }

    return (
      state.enrollments.find((enrollment) => {
        if (String(enrollment.courseId) === String(state.courseId)) {
          return false;
        }

        return (
          String(enrollment.weeklyScheduleId) ===
            String(state.selectedScheduleId) &&
          String(enrollment.timeSlotId) === String(state.selectedTimeSlotId)
        );
      }) || null
    );
  }

  function buildConflictText(conflict) {
    if (!conflict) {
      const selectedSchedule = getSelectedSchedule();
      const selectedTimeSlot = getSelectedTimeSlot();
      return `You are already enrolled in another course with the same schedule: ${selectedSchedule?.label || "Selected schedule"} at ${selectedTimeSlot?.label || "Selected time slot"}`;
    }

    return `You are already enrolled in ${conflict.courseTitle || "another course"} with the same schedule: ${conflict.weeklyScheduleLabel || "Selected schedule"} at ${conflict.timeSlotLabel || "Selected time slot"}`;
  }

  function buildEnrollmentPayload(continueAnyway = false) {
    const selectedSessionType = getSelectedSessionType();
    const courseScheduleId = Number(selectedSessionType?.courseScheduleId);
    const payload = {
      course_id: Number(state.courseId),
      courseId: Number(state.courseId),
      weekly_schedule_id: Number(state.selectedScheduleId),
      weeklyScheduleId: Number(state.selectedScheduleId),
      time_slot_id: Number(state.selectedTimeSlotId),
      timeSlotId: Number(state.selectedTimeSlotId),
      session_type_id: Number(state.selectedSessionTypeId),
      sessionTypeId: Number(state.selectedSessionTypeId),
    };

    if (Number.isFinite(courseScheduleId) && courseScheduleId > 0) {
      payload.course_schedule_id = courseScheduleId;
      payload.courseScheduleId = courseScheduleId;
    }

    if (continueAnyway) {
      payload.ignore_conflict = true;
      payload.ignoreConflict = true;
      payload.force = true;
      payload.continue_anyway = true;
    }

    return payload;
  }

  function getEnrollmentErrorMessage(result) {
    const validationErrors = result?.data?.errors;
    if (validationErrors && typeof validationErrors === "object") {
      const firstValidationMessage = Object.values(validationErrors)
        .flat()
        .find((value) => typeof value === "string" && value.trim());

      if (firstValidationMessage) {
        return firstValidationMessage;
      }
    }

    return (
      result?.data?.message ||
      result?.data?.error ||
      result?.error?.message ||
      "Enrollment failed. Please try again."
    );
  }

  async function submitEnrollment(continueAnyway = false) {
    const token = getToken();
    if (!token) {
      updateWarningUI("auth");
      if (typeof window.openLogin === "function") {
        window.openLogin();
      }
      return;
    }

    const result = await apiCreateEnrollment(
      token,
      buildEnrollmentPayload(continueAnyway),
    );

    if (!result?.ok) {
      const message = getEnrollmentErrorMessage(result);

      if (/conflict/i.test(String(message))) {
        state.pendingConflict = findScheduleConflict();
        if (enrollmentConflictPopupTextEl) {
          enrollmentConflictPopupTextEl.textContent = buildConflictText(
            state.pendingConflict,
          );
        }
        showPopup(enrollmentConflictPopupEl);
        return;
      }

      setStatusMessage(message, "error");
      return;
    }

    hidePopup(enrollmentConflictPopupEl);
    await loadEnrollments();
    await refreshEnrollmentGuard();
    syncCourseMode();
    showPopup(enrollmentConfirmedPopupEl);
  }

  async function completeCurrentCourse() {
    if (!state.currentEnrollment?.id || state.completingCourse) {
      if (isEnrollmentCompleted(state.currentEnrollment)) {
        openCourseFinishedPopup();
      }
      return;
    }

    state.completingCourse = true;
    setCompleteButtonLoading(true);
    setStatusMessage("");

    const token = getToken();
    if (!token) {
      state.completingCourse = false;
      setCompleteButtonLoading(false);
      updateWarningUI("auth");
      if (typeof window.openLogin === "function") {
        window.openLogin();
      }
      return;
    }

    const result = await apiCompleteEnrollment(
      token,
      state.currentEnrollment.id,
    );

    state.completingCourse = false;
    setCompleteButtonLoading(false);

    if (!result?.ok) {
      return;
    }

    state.currentEnrollment = {
      ...state.currentEnrollment,
      progress: 100,
      completedAt:
        firstValue(result?.data, ["completedAt", "completed_at"], null) ||
        new Date().toISOString(),
    };

    await loadEnrollments();
    await refreshEnrollmentGuard();
    syncCourseMode();
    openCourseFinishedPopup();
  }

  async function retakeCurrentCourse() {
    if (!state.currentEnrollment?.id || state.completingCourse) {
      return;
    }

    state.completingCourse = true;
    setCompleteButtonLoading(true);

    const token = getToken();
    if (!token) {
      state.completingCourse = false;
      setCompleteButtonLoading(false);
      updateWarningUI("auth");
      if (typeof window.openLogin === "function") {
        window.openLogin();
      }
      return;
    }

    const result = await apiDeleteEnrollment(token, state.currentEnrollment.id);

    state.completingCourse = false;
    setCompleteButtonLoading(false);

    if (!result?.ok) {
      return;
    }

    hidePopup(courseFinishedPopupEl);
    clearSubmittedCourseRating(state.courseId);
    state.submittedCourseRating = 0;
    updateCourseRatingDisplay();
    state.currentEnrollment = null;
    state.selectedScheduleId = null;
    state.selectedTimeSlotId = null;
    state.selectedSessionTypeId = null;
    state.weeklySchedules = [];
    state.timeSlots = [];
    state.sessionTypes = [];
    state.timeSlotCache = {};
    state.sessionTypeCache = {};
    updatePriceSummary();

    await loadEnrollments();
    await refreshEnrollmentGuard();
    syncCourseMode();
    await loadWeeklySchedules();
    renderTimeSlots();
    renderSessionTypes();
    updateTriggerValidity();
    closeAllDropdowns();
    setDropdownOpen("weeklyScheduleOptionsWrap", true);
  }

  async function handleEnrollClick() {
    setStatusMessage("");

    if (state.currentEnrollment) {
      syncCourseMode();
      return;
    }

    if (state.enrollmentGuard === "auth") {
      if (typeof window.openLogin === "function") {
        window.openLogin();
      }
      return;
    }

    if (state.enrollmentGuard === "profile") {
      showPopup(profileIncompletePopupEl);
      return;
    }

    if (
      !state.selectedScheduleId ||
      !state.selectedTimeSlotId ||
      !state.selectedSessionTypeId
    ) {
      setStatusMessage(
        "Choose weekly schedule, time slot, and session type before enrolling.",
        "error",
      );
      return;
    }

    const selectedSessionType = getSelectedSessionType();
    if (!selectedSessionType || selectedSessionType.availableSeats <= 0) {
      setStatusMessage(
        "The selected session type is fully booked. Please choose another option.",
        "error",
      );
      return;
    }

    const conflict = findScheduleConflict();
    if (conflict) {
      state.pendingConflict = conflict;
      if (enrollmentConflictPopupTextEl) {
        enrollmentConflictPopupTextEl.textContent = buildConflictText(conflict);
      }
      showPopup(enrollmentConflictPopupEl);
      return;
    }

    await submitEnrollment(false);
  }

  function renderCourse(course) {
    state.course = normalizeCourse(course);
    state.courseId = state.course.id;
    state.submittedCourseRating = loadSavedCourseRating(state.courseId);

    if (titleEl) titleEl.textContent = state.course.title;
    if (descriptionEl) descriptionEl.textContent = state.course.description;
    if (weeksEl) {
      weeksEl.textContent =
        typeof state.course.weeks === "number"
          ? `${state.course.weeks} Weeks`
          : String(state.course.weeks);
    }
    if (hoursEl) {
      const numericWeeks = Number(state.course.weeks);
      hoursEl.textContent = Number.isFinite(numericWeeks)
        ? `${numericWeeks * 16} Hours`
        : "-";
    }
    if (ratingEl) ratingEl.textContent = state.course.rating;
    if (categoryEl) categoryEl.textContent = state.course.category;
    if (categoryIconEl) {
      categoryIconEl.className = `category-icon ${getCategoryIconClass(
        state.course.category,
        state.course.categoryIcon,
      )}`;
    }
    if (authorEl) authorEl.textContent = state.course.instructorName;
    if (mainImageEl) {
      mainImageEl.src = state.course.image;
      mainImageEl.alt = state.course.title;
    }
    if (authorAvatarEl) {
      authorAvatarEl.src = state.course.instructorAvatar;
      authorAvatarEl.alt = state.course.instructorName;
    }
    if (locationEl) {
      locationEl.innerHTML = `Home &gt; Browse &gt; <span style="color: rgba(79, 70, 229, 1)">${state.course.category}</span>`;
    }

    state.selectedScheduleId = null;
    state.selectedTimeSlotId = null;
    state.selectedSessionTypeId = null;
    state.weeklySchedules = [];
    state.timeSlots = [];
    state.sessionTypes = [];
    state.timeSlotCache = {};
    state.sessionTypeCache = {};
    updatePriceSummary();
    updateCourseRatingDisplay();
  }

  function renderError(message) {
    container.innerHTML = `
      <div class="course-detail-left">
        <h1 class="course-detail-title">Course details unavailable</h1>
        <p class="course-detail-description">${message}</p>
      </div>`;
  }

  async function findCourseById(courseId) {
    const featuredResult = await apiGetFeaturedCourses();
    const featuredCourses = normalizeCoursePayload(featuredResult);
    const featuredMatch = featuredCourses.find(
      (course) => String(course?.id) === String(courseId),
    );

    if (featuredMatch) {
      return featuredMatch;
    }

    const firstPageResult = await apiGetCourses({ sort: "newest", page: 1 });
    if (!firstPageResult?.ok) {
      return null;
    }

    const firstPageCourses = normalizeCoursePayload(firstPageResult);
    const firstPageMatch = firstPageCourses.find(
      (course) => String(course?.id) === String(courseId),
    );
    if (firstPageMatch) {
      return firstPageMatch;
    }

    const lastPage = Number(firstPageResult?.data?.meta?.lastPage ?? 1) || 1;

    for (let page = 2; page <= lastPage; page += 1) {
      const pageResult = await apiGetCourses({ sort: "newest", page });
      if (!pageResult?.ok) {
        continue;
      }

      const pageCourses = normalizeCoursePayload(pageResult);
      const pageMatch = pageCourses.find(
        (course) => String(course?.id) === String(courseId),
      );
      if (pageMatch) {
        return pageMatch;
      }
    }

    return null;
  }

  function bindPopupEvents() {
    if (profileIncompleteConfirmBtn) {
      profileIncompleteConfirmBtn.addEventListener("click", () => {
        hidePopup(profileIncompletePopupEl);
        if (typeof window.openProfile === "function") {
          window.openProfile();
        }
      });
    }

    if (profileIncompleteCancelBtn) {
      profileIncompleteCancelBtn.addEventListener("click", () => {
        hidePopup(profileIncompletePopupEl);
      });
    }

    if (enrollmentConfirmedDoneBtn) {
      enrollmentConfirmedDoneBtn.addEventListener("click", () => {
        hidePopup(enrollmentConfirmedPopupEl);
      });
    }

    if (enrollmentConflictCancelBtn) {
      enrollmentConflictCancelBtn.addEventListener("click", () => {
        hidePopup(enrollmentConflictPopupEl);
      });
    }

    if (enrollmentConflictContinueBtn) {
      enrollmentConflictContinueBtn.addEventListener("click", async () => {
        await submitEnrollment(true);
      });
    }

    if (courseFinishedDoneBtnEl) {
      courseFinishedDoneBtnEl.addEventListener("click", async () => {
        if (state.selectedCourseRating > 0) {
          const token = getToken();

          if (token && state.courseId) {
            const reviewResult = await apiCreateCourseReview(
              token,
              state.courseId,
              {
                rating: state.selectedCourseRating,
              },
            );

            if (reviewResult?.ok) {
              updateDisplayedAverageFromReviewSubmission(
                state.selectedCourseRating,
                reviewResult.data,
              );
            }
          }

          state.submittedCourseRating = state.selectedCourseRating;
          saveSubmittedCourseRating(state.courseId, state.selectedCourseRating);
          updateCourseRatingDisplay();
        }

        hidePopup(courseFinishedPopupEl);
      });
    }

    if (courseFinishedStarsEl) {
      courseFinishedStarsEl
        .querySelectorAll(".course-rating-star")
        .forEach((button) => {
          button.addEventListener("click", () => {
            state.selectedCourseRating = Number(button.dataset.rating || 0);
            updateCourseRatingStars();
          });
        });
    }

    [
      profileIncompletePopupEl,
      enrollmentConfirmedPopupEl,
      enrollmentConflictPopupEl,
      courseFinishedPopupEl,
    ].forEach((popupEl) => {
      if (!popupEl) return;
      popupEl.addEventListener("click", (event) => {
        if (event.target === popupEl) {
          hidePopup(popupEl);
        }
      });
    });
  }

  async function refreshAfterAuthChange(profileOverride = null) {
    await loadEnrollments();
    await refreshEnrollmentGuard(profileOverride);
    syncCourseMode();
  }

  async function initializeCourseState() {
    await loadEnrollments();
    await refreshEnrollmentGuard();
    syncCourseMode();

    if (!state.currentEnrollment) {
      await loadWeeklySchedules();
      renderTimeSlots();
      renderSessionTypes();
      updateTriggerValidity();
    }
  }

  async function loadCourseDetails() {
    if (typeof window.updateAuthUI === "function") {
      window.updateAuthUI();
    }

    bindPopupEvents();

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        toggleDropdown(trigger.dataset.target);
      });
      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleDropdown(trigger.dataset.target);
        }
      });
    });

    closeAllDropdowns();

    if (signInBtn && typeof window.openLogin === "function") {
      signInBtn.addEventListener("click", window.openLogin);
    }

    if (courseWarningActionEl) {
      courseWarningActionEl.addEventListener("click", () => {
        if (state.enrollmentGuard === "auth") {
          if (typeof window.openLogin === "function") {
            window.openLogin();
          }
          return;
        }

        if (state.enrollmentGuard === "profile") {
          showPopup(profileIncompletePopupEl);
        }
      });
    }

    if (enrollBtn) {
      enrollBtn.addEventListener("click", async () => {
        await handleEnrollClick();
      });
    }

    if (completeCourseBtnEl) {
      completeCourseBtnEl.addEventListener("click", async () => {
        if (isEnrollmentCompleted(state.currentEnrollment)) {
          await retakeCurrentCourse();
          return;
        }

        await completeCurrentCourse();
      });
    }

    window.addEventListener("auth:login", async () => {
      await refreshAfterAuthChange();
    });
    window.addEventListener("profile:updated", async (event) => {
      await refreshAfterAuthChange(event.detail?.profile ?? null);
    });

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");
    if (!courseId) {
      renderError("No course was selected.");
      return;
    }

    try {
      const selectedCourse = await findCourseById(courseId);

      if (!selectedCourse) {
        renderError("The selected course could not be found.");
        return;
      }

      renderCourse(selectedCourse);
      await initializeCourseState();
    } catch (error) {
      console.error("Failed to load course details:", error);
      renderError("Something went wrong while loading the course details.");
    }
  }

  loadCourseDetails();
})();
