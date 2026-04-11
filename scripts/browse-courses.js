// Reusable browse-courses navigation across pages
(function () {
  if (window.__redberryBrowseCoursesInitialized) return;
  window.__redberryBrowseCoursesInitialized = true;

  function isBrowseCoursesPage() {
    return (
      window.location.pathname.endsWith("/browse-courses.html") ||
      window.location.pathname.endsWith("browse-courses.html")
    );
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
    const browseButtons = Array.from(
      document.querySelectorAll("button"),
    ).filter((button) => button.textContent.trim() === "Browse Courses");

    headerBrowseLink?.addEventListener("click", openBrowseCourses);
    footerBrowseLink?.addEventListener("click", openBrowseCourses);
    browseButtons.forEach((button) => {
      button.addEventListener("click", openBrowseCourses);
    });
  }

  window.openBrowseCourses = openBrowseCourses;

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", bindBrowseCoursesUI);
  } else {
    bindBrowseCoursesUI();
  }
})();
