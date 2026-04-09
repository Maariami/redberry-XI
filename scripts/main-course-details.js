// Entry point for course-details.html
(function () {
  const container = document.querySelector(".course-detail-container");
  if (!container) return;

  const titleEl = document.getElementById("course-title");
  const weeksEl = document.getElementById("weeks");
  const hoursEl = document.getElementById("hours");
  const ratingEl = document.getElementById("rating");
  const categoryEl = document.getElementById("category");
  const authorEl = document.getElementById("author");
  const descriptionEl = document.getElementById("description");
  const priceEl = document.getElementById("price");
  const locationEl = document.querySelector(".location");
  const mainImageEl = document.querySelector(".course-detail-main-image");
  const authorAvatarEl = document.querySelector(".course-detail-avatar");
  const authBoxEl = document.querySelector(".course-detail-auth-box");
  const signInBtn = document.querySelector(".course-detail-signin");
  const enrollBtn = document.querySelector(".course-detail-enroll");
  const sessionTypeBox = document.querySelectorAll(".course-detail-box")[2];

  function formatPrice(value) {
    const numericValue = Number(value ?? 0);
    return `$${numericValue.toFixed(2)}`;
  }

  function normalizeCoursePayload(result) {
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.data?.data)) return result.data.data;
    if (Array.isArray(result?.data?.courses)) return result.data.courses;
    return [];
  }

  function getCourseField(course, keys, fallback = "") {
    for (const key of keys) {
      const value = key.split(".").reduce((acc, part) => acc?.[part], course);
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
    return fallback;
  }

  function renderButtonGroup(items, activeIndex = 0, className = "") {
    if (!Array.isArray(items) || items.length === 0) {
      return '<button class="course-detail-btn inctive" type="button">Not specified</button>';
    }

    return items
      .map((item, index) => {
        const label = typeof item === "string" ? item : item?.label || "Option";
        const detail = typeof item === "object" ? item?.detail : "";
        const icon = typeof item === "object" ? item?.icon : "";
        const activeClass = index === activeIndex ? " active" : "";

        if (className.includes("timesslots")) {
          return `
            <button class="course-detail-btn${activeClass}" type="button">
              ${icon ? `<img src="${icon}" alt="" />` : ""}
              <div>
                <p class="third">${label}</p>
                <p class="hours">${detail || "Time not specified"}</p>
              </div>
            </button>`;
        }

        return `<button class="course-detail-btn${activeClass}" type="button">${label}</button>`;
      })
      .join("");
  }

  function renderSessionTypes(course) {
    if (!sessionTypeBox) return;

    const existingButtons = sessionTypeBox.querySelector(
      ".course-detail-buttons",
    );
    const sessionTypes = getCourseField(
      course,
      ["sessionTypes", "session_types"],
      [],
    );
    const normalizedSessionTypes = Array.isArray(sessionTypes)
      ? sessionTypes.map((item) =>
          typeof item === "string"
            ? item
            : item?.name || item?.label || item?.type || "Session type",
        )
      : [];

    const buttonsMarkup = `
      <div class="course-detail-buttons">
        ${renderButtonGroup(normalizedSessionTypes, 0)}
      </div>`;

    if (existingButtons) {
      existingButtons.outerHTML = buttonsMarkup;
    } else {
      sessionTypeBox.insertAdjacentHTML("beforeend", buttonsMarkup);
    }
  }

  function renderCourse(course) {
    const title = getCourseField(course, ["title", "name"], "Untitled course");
    const description = getCourseField(
      course,
      ["description", "details", "short_description"],
      "No description available.",
    );
    const image = getCourseField(
      course,
      ["image", "thumbnail", "cover"],
      "./assets/cardimage.png",
    );
    const price = getCourseField(course, ["basePrice", "price", "cost"], 0);
    const rating = Number(
      getCourseField(course, ["avgRating", "rating", "score"], 0),
    ).toFixed(1);
    const category = getCourseField(
      course,
      ["category.name", "category", "track"],
      "General",
    );
    const instructorName = getCourseField(
      course,
      ["instructor.name", "mentor.name", "author.name", "teacher"],
      "Course instructor",
    );
    const instructorAvatar = getCourseField(
      course,
      ["instructor.avatar", "mentor.avatar", "author.avatar"],
      "./assets/profilepic.png",
    );
    const weeks = getCourseField(
      course,
      ["durationWeeks", "duration_weeks", "weeks"],
      "12 Weeks",
    );
    const hours = getCourseField(
      course,
      ["durationHours", "duration_hours", "hours"],
      "128 Hours",
    );
    const schedules = getCourseField(
      course,
      ["schedules", "scheduleOptions"],
      ["Mon - Wed", "Tue - Thu", "Weekend"],
    );
    const timeSlots = getCourseField(
      course,
      ["timeSlots", "time_slots"],
      [
        {
          label: "Morning",
          detail: "9:00 AM - 12:00 PM",
          icon: "./assets/morning.png",
        },
        {
          label: "Afternoon",
          detail: "1:00 PM - 4:00 PM",
          icon: "./assets/afternoon.png",
        },
        {
          label: "Night",
          detail: "6:00 PM - 9:00 PM",
          icon: "./assets/night.png",
        },
      ],
    );

    if (titleEl) titleEl.textContent = title;
    if (descriptionEl) descriptionEl.textContent = description;
    if (weeksEl)
      weeksEl.textContent =
        typeof weeks === "number" ? `${weeks} Weeks` : String(weeks);
    if (hoursEl)
      hoursEl.textContent =
        typeof hours === "number" ? `${hours} Hours` : String(hours);
    if (ratingEl) ratingEl.textContent = rating;
    if (categoryEl) categoryEl.textContent = category;
    if (authorEl) authorEl.textContent = instructorName;
    if (priceEl) priceEl.textContent = formatPrice(price);
    if (mainImageEl) {
      mainImageEl.src = image;
      mainImageEl.alt = title;
    }
    if (authorAvatarEl) {
      authorAvatarEl.src = instructorAvatar;
      authorAvatarEl.alt = instructorName;
    }
    if (locationEl) {
      locationEl.innerHTML = `Home &gt; Browse &gt; <span style="color: rgba(79, 70, 229, 1)">${category}</span>`;
    }

    const buttonGroups = container.querySelectorAll(".course-detail-buttons");
    if (buttonGroups[0]) {
      buttonGroups[0].innerHTML = renderButtonGroup(
        Array.isArray(schedules) ? schedules : [String(schedules)],
        0,
      );
    }
    if (buttonGroups[1]) {
      buttonGroups[1].innerHTML = renderButtonGroup(
        Array.isArray(timeSlots) ? timeSlots : [],
        0,
        "timesslots",
      );
      buttonGroups[1].classList.add("timesslots");
    }

    renderSessionTypes(course);
  }

  function renderError(message) {
    container.innerHTML = `
      <div class="course-detail-left">
        <h1 class="course-detail-title">Course details unavailable</h1>
        <p class="course-detail-description">${message}</p>
      </div>`;
  }

  async function loadCourseDetails() {
    if (typeof updateAuthUI === "function") {
      updateAuthUI();
    }

    if (signInBtn && typeof openLogin === "function") {
      signInBtn.addEventListener("click", openLogin);
    }

    if (enrollBtn) {
      enrollBtn.addEventListener("click", () => {
        if (typeof isLoggedIn === "function" && !isLoggedIn()) {
          if (typeof openLogin === "function") openLogin();
          return;
        }

        enrollBtn.textContent = "Enrollment coming soon";
        enrollBtn.disabled = true;
      });
    }

    if (authBoxEl && typeof isLoggedIn === "function" && isLoggedIn()) {
      authBoxEl.style.display = "none";
    }

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");
    if (!courseId) {
      renderError("No course was selected.");
      return;
    }

    try {
      const result = await apiGetFeaturedCourses();
      const courses = normalizeCoursePayload(result);

      const selectedCourse = courses.find(
        (course) => String(course?.id) === String(courseId),
      );
      if (!selectedCourse) {
        renderError("The selected course could not be found.");
        return;
      }

      renderCourse(selectedCourse);
    } catch (error) {
      console.error("Failed to load course details:", error);
      renderError("Something went wrong while loading the course details.");
    }
  }

  loadCourseDetails();
})();
