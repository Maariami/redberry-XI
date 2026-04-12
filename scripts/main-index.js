// Entry point for index.html
(function () {
  // Only run if on index.html
  if (!document.querySelector(".slider")) return;

  const continueLearningSection = document.querySelector(
    ".startlearning.continue",
  );
  const continueLearningCardsEl = document.getElementById(
    "continueLearningCards",
  );
  const continueLearningOverlayEl = document.getElementById(
    "continueLearningOverlay",
  );
  const continueLearningLoginButtonEl = document.getElementById(
    "continueLearningLoginButton",
  );
  const seeAllButton = continueLearningSection?.querySelector(".seeallbtn");
  const featuredCoursesSection = document
    .getElementById("featuredCoursesCards")
    ?.closest(".startlearning");
  const dummyContinueLearningCourses = [
    {
      courseId: "",
      courseImage: "./assets/dummyimage.svg",
      instructorName: "Marilyn Mango",
      rating: "4.9",
      courseTitle: "Advanced React & TypeScript Development",
      progress: 65,
    },
    {
      courseId: "",
      courseImage: "./assets/dummyimage.svg",
      instructorName: "Marilyn Mango",
      rating: "4.9",
      courseTitle: "Advanced React & TypeScript Development",
      progress: 65,
    },
    {
      courseId: "",
      courseImage: "./assets/dummyimage.svg",
      instructorName: "Marilyn Mango",
      rating: "4.9",
      courseTitle: "Advanced React & TypeScript Development",
      progress: 65,
    },
  ];

  function setContinueLearningVisibility(isVisible) {
    if (!continueLearningSection) return;
    continueLearningSection.hidden = !isVisible;
  }

  function setContinueLearningLocked(isLocked) {
    if (!continueLearningCardsEl || !continueLearningOverlayEl) return;

    continueLearningCardsEl.classList.toggle("is-locked", isLocked);
    continueLearningOverlayEl.classList.toggle("hidden", !isLocked);
    continueLearningOverlayEl.setAttribute("aria-hidden", String(!isLocked));
  }

  function setContinueLearningPosition(isAuthorized) {
    if (!continueLearningSection || !featuredCoursesSection) return;

    if (isAuthorized) {
      featuredCoursesSection.parentNode?.insertBefore(
        continueLearningSection,
        featuredCoursesSection,
      );
      return;
    }

    featuredCoursesSection.insertAdjacentElement(
      "afterend",
      continueLearningSection,
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

  function renderContinueLearningState(
    title,
    description,
    actionLabel,
    action,
  ) {
    if (!continueLearningCardsEl) return;
    setContinueLearningVisibility(true);
    setContinueLearningLocked(false);

    continueLearningCardsEl.innerHTML = `
      <div class="continue-learning-state">
        <p class="continue-learning-state__title">${escapeHtml(title)}</p>
        <p class="continue-learning-state__description">${escapeHtml(description)}</p>
        ${
          actionLabel
            ? `<button class="browsebutton continue-learning-state__action" type="button">${escapeHtml(actionLabel)}</button>`
            : ""
        }
      </div>`;

    if (!actionLabel) return;

    continueLearningCardsEl
      .querySelector(".continue-learning-state__action")
      ?.addEventListener("click", action);
  }

  function renderContinueLearningCourses(courses, options = {}) {
    if (!continueLearningCardsEl) return;

    const { openLoginOnView = false, useDummyCardStyling = false } = options;
    setContinueLearningVisibility(true);
    setContinueLearningLocked(useDummyCardStyling);

    continueLearningCardsEl.innerHTML = courses
      .map(
        (course) => `
          <article class="card continue-learning-card${useDummyCardStyling ? " continue-learning-card--dummy" : ""}" data-course-id="${escapeHtml(course.courseId)}">
          <div class="continue-learning-card__content">
            <img
              class="classimage continue-learning-card__image"
              src="${escapeHtml(course.courseImage)}"
              alt="${escapeHtml(course.courseTitle)}"
            />
            <div class="continue-learning-card__info"
            >
            <div class="coursebaseinfo continue-learning-card__meta">
              <p>Lecturer <span style="color: rgba(102, 102, 102, 1)"> ${escapeHtml(course.instructorName)}</span></p>
              <div class="rating">
                <img src="./assets/star.png" alt="" />${escapeHtml(course.rating)}
              </div>
              
            </div>
             <div class="coursetitle continue-learning-card__title">
              ${escapeHtml(course.courseTitle)}
            </div>
            </div>
           
            </div>
            <div class="continue-learning-card__footer">
              <div class="continue-learning-card__progress">
                <span>${escapeHtml(course.progress)}% complete</span>
                <div class="course-progress-bar">
                  <div class="course-progress-fill" style="width: ${escapeHtml(course.progress)}%;"></div>
                </div>
              </div>
              <button
                class="viewcoursebtn continue-learning-view"
                type="button"
                data-course-id="${escapeHtml(course.courseId)}"
              >
                View
              </button>
            </div>
          </article>`,
      )
      .join("");

    continueLearningCardsEl
      .querySelectorAll(".continue-learning-view")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const { courseId } = button.dataset;
          if (!courseId) {
            if (openLoginOnView && typeof window.openLogin === "function") {
              window.openLogin();
            }
            return;
          }
          window.location.href = `course-details.html?id=${encodeURIComponent(courseId)}`;
        });
      });
  }

  async function loadContinueLearning() {
    if (!continueLearningCardsEl) return;

    setContinueLearningPosition(false);

    renderContinueLearningState(
      "Loading your courses",
      "We are pulling your enrolled courses now.",
    );

    if (typeof window.getEnrolledCoursesData !== "function") {
      renderContinueLearningState(
        "Continue learning is unavailable",
        "The enrollment data source is not ready on this page.",
      );
      return;
    }

    const result = await window.getEnrolledCoursesData();

    if (result?.requiresLogin) {
      setContinueLearningPosition(false);
      renderContinueLearningCourses(dummyContinueLearningCourses, {
        openLoginOnView: true,
        useDummyCardStyling: true,
      });
      return;
    }

    if (!result?.ok) {
      setContinueLearningPosition(true);
      renderContinueLearningState(
        "Could not load your courses",
        "Please try again in a moment.",
      );
      return;
    }

    if (!result.courses?.length) {
      setContinueLearningPosition(true);
      setContinueLearningVisibility(false);
      setContinueLearningLocked(false);
      return;
    }

    setContinueLearningPosition(true);
    renderContinueLearningCourses(result.courses.slice(0, 3));
  }

  // Update header/footer for auth state
  if (typeof window.updateAuthUI === "function") window.updateAuthUI();

  // Load featured courses
  if (typeof loadFeaturedCourses === "function") loadFeaturedCourses();

  seeAllButton?.addEventListener("click", () => {
    if (!continueLearningSection || continueLearningSection.hidden) return;
    if (typeof window.openEnrolledCoursesModal === "function") {
      window.openEnrolledCoursesModal();
    }
  });

  continueLearningLoginButtonEl?.addEventListener("click", () => {
    if (typeof window.openLogin === "function") {
      window.openLogin();
    }
  });

  loadContinueLearning();
  window.addEventListener("auth:login", loadContinueLearning);

  // ...add more index-specific logic as needed
})();
