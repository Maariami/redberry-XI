"use strict";

// ─── UI Updates based on auth status ──────────────────────────────────────────
async function updateAuthUI() {
  const buttonsEl = document.querySelector(".buttons");
  const enrolledEl = document.querySelector(".enrolled");
  const proficon = document.querySelector(".proficon");

  if (isLoggedIn()) {
    buttonsEl.classList.remove("logged-out");
    enrolledEl.classList.add("logged-in");
    proficon.classList.add("logged-in");

    // Fetch and display profile data
    await updateProfileDisplay();
  } else {
    buttonsEl.classList.add("logged-out");
    enrolledEl.classList.remove("logged-in");
    proficon.classList.remove("logged-in");
  }
}

function appendCacheBuster(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url, window.location.href);
    parsed.searchParams.set("_ts", String(Date.now()));
    return parsed.toString();
  } catch (error) {
    return `${url}${url.includes("?") ? "&" : "?"}_ts=${Date.now()}`;
  }
}

// ─── Profile display ──────────────────────────────────────────────────────────
async function updateProfileDisplay() {
  const profilePic = document.querySelector(".profilepicture");
  const completeIcon = document.querySelector(".complete");

  try {
    const profileData = normalizeProfileData(await getProfile());
    if (!profileData) return;

    if (profileData.avatar) {
      profilePic.src = appendCacheBuster(profileData.avatar);
    }

    if (profileData.profileComplete) {
      completeIcon.src = "./assets/completed.png";
    } else {
      completeIcon.src = "./assets/incomplete.png";
    }
  } catch (error) {
    console.error("Failed to update profile display:", error);
  }
}

async function getFeaturedCourses() {
  return await apiGetFeaturedCourses();
}

function renderFeaturedCourses(courses) {
  const cards = document.getElementById("featuredCoursesCards");
  if (!cards) {
    console.error("Featured courses container not found.");
    return;
  }

  if (!Array.isArray(courses) || courses.length === 0) {
    cards.innerHTML = `<div class="no-courses">No featured courses available at the moment.</div>`;
    return;
  }

  cards.innerHTML = courses
    .slice(0, 3)
    .map((course, idx) => {
      const image = course.image || "./assets/cardimage.png";
      const title = course.title || "Untitled course";
      const description = course.description || "No description available.";
      const instructor = course.instructor?.name || "Course instructor";
      const ratingValue = Number(course.avgRating) || 0;
      const rating = Number.isFinite(ratingValue)
        ? ratingValue.toFixed(1)
        : "0.0";
      const priceRaw = course.basePrice ?? "0.00";
      const price = Number(priceRaw).toFixed(2);

      // Add data-course-idx for event delegation
      return `
        <div class="card" data-course-idx="${idx}">
          <div>
            <img class="classimage" src="${image}" alt="${title}" />
          </div>
          <div class="coursebaseinfo">
            <p>${instructor}</p>
            <div class="rating">
              <img src="./assets/star.png" alt="Rating" />${rating}
            </div>
          </div>
          <div class="coursetitle">${title}</div>
          <div class="coursedesc">${description}</div>
          <div class="lastcardline">
            <div class="price">
              starting from
              <span
                style="
                  color: rgba(20, 20, 20, 1);
                  font-size: 32px;
                  font-weight: 600;
                "
                >$${price}</span
              >
            </div>
            <button class="details" type="button" data-course-idx="${idx}">View Details</button>
          </div>
        </div>`;
    })
    .join("");

  // Add click event to all details buttons
  cards.querySelectorAll(".details").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = btn.getAttribute("data-course-idx");
      if (courses[idx]) {
        // Pass course id or info in query string for future use
        const courseId = courses[idx].id || idx;
        window.location.href = `course-details.html?id=${encodeURIComponent(courseId)}`;
      }
    });
  });
}

async function loadFeaturedCourses() {
  const result = await getFeaturedCourses();
  const courses =
    result?.ok && Array.isArray(result.data)
      ? result.data
      : result?.ok && Array.isArray(result.data?.data)
        ? result.data.data
        : result?.ok && Array.isArray(result.data?.courses)
          ? result.data.courses
          : null;

  if (Array.isArray(courses)) {
    renderFeaturedCourses(courses);
    return;
  }

  const cards = document.getElementById("featuredCoursesCards");
  if (cards) {
    cards.innerHTML = `<div class="no-courses">Unable to load featured courses.</div>`;
  }

  console.error(
    "Unable to load featured courses:",
    result?.error?.message ||
      result?.error ||
      JSON.stringify(result?.data ?? result),
  );
}

// ─── Init ─────────────────────────────────────────────────────────────────────
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", () => {
    if (typeof updateAuthUI === "function") updateAuthUI();
    if (typeof loadFeaturedCourses === "function") loadFeaturedCourses();
  });
} else {
  if (typeof updateAuthUI === "function") updateAuthUI();
  if (typeof loadFeaturedCourses === "function") loadFeaturedCourses();
}
