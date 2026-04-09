// Entry point for index.html
(function () {
  // Only run if on index.html
  if (!document.querySelector(".slider")) return;

  // Update header/footer for auth state
  if (typeof updateAuthUI === "function") updateAuthUI();

  // Load featured courses
  if (typeof loadFeaturedCourses === "function") loadFeaturedCourses();

  // ...add more index-specific logic as needed
})();
