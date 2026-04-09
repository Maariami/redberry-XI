// Header and footer logic for all pages
(function () {
  function appendCacheBuster(url) {
    if (!url) return url;

    try {
      const parsedUrl = new URL(url, window.location.href);
      parsedUrl.searchParams.set("_ts", String(Date.now()));
      return parsedUrl.toString();
    } catch (error) {
      return `${url}${url.includes("?") ? "&" : "?"}_ts=${Date.now()}`;
    }
  }

  async function updateProfileDisplay() {
    const profilePic = document.querySelector(".header .profilepicture");
    const completeIcon = document.querySelector(".header .complete");

    if (!profilePic || !completeIcon) return;

    try {
      const profileData = normalizeProfileData(await getProfile());
      if (!profileData) return;

      if (profileData.avatar) {
        profilePic.src = appendCacheBuster(profileData.avatar);
      }

      completeIcon.src = profileData.profileComplete
        ? "./assets/completed.png"
        : "./assets/incomplete.png";
    } catch (error) {
      console.error("Failed to update profile display:", error);
    }
  }

  async function updateAuthUI() {
    const buttonsEl = document.querySelector(".buttons");
    const enrolledEl = document.querySelector(".enrolled");
    const proficon = document.querySelector(".proficon");
    if (!buttonsEl || !enrolledEl || !proficon) return;

    if (typeof isLoggedIn === "function" && isLoggedIn()) {
      buttonsEl.classList.remove("logged-out");
      enrolledEl.classList.add("logged-in");
      proficon.classList.add("logged-in");
      await updateProfileDisplay();
    } else {
      buttonsEl.classList.add("logged-out");
      enrolledEl.classList.remove("logged-in");
      proficon.classList.remove("logged-in");
    }
  }

  // Expose globally for other scripts
  window.updateAuthUI = updateAuthUI;
  window.updateProfileDisplay = updateProfileDisplay;

  // Header button handlers
  const loginBtn = document.querySelector(".login");
  if (loginBtn && typeof openLogin === "function")
    loginBtn.addEventListener("click", openLogin);
  const signupBtn = document.querySelector(".signup");
  if (signupBtn && typeof openRegister === "function")
    signupBtn.addEventListener("click", openRegister);
  const proficon = document.querySelector(".proficon");
  if (proficon && typeof openProfile === "function")
    proficon.addEventListener("click", () => {
      if (typeof isLoggedIn === "function" && isLoggedIn()) openProfile();
    });
  const footerProfileLink = document.getElementById("footerProfileLink");
  if (footerProfileLink && typeof openProfile === "function") {
    footerProfileLink.addEventListener("click", () => {
      if (typeof isLoggedIn === "function" && isLoggedIn()) openProfile();
    });
  }

  // Close buttons
  const regCloseBtn = document.getElementById("regCloseBtn");
  if (regCloseBtn && typeof closeRegister === "function")
    regCloseBtn.addEventListener("click", closeRegister);
  const loginCloseBtn = document.getElementById("loginCloseBtn");
  if (loginCloseBtn && typeof closeLogin === "function")
    loginCloseBtn.addEventListener("click", closeLogin);
  const profileCloseBtn = document.getElementById("profileCloseBtn");
  if (profileCloseBtn && typeof attemptCloseProfile === "function")
    profileCloseBtn.addEventListener("click", attemptCloseProfile);

  // Keyboard: Escape closes whichever modal is open
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const registerOverlay = document.getElementById("registerOverlay");
      const loginOverlay = document.getElementById("loginOverlay");
      const profileOverlay = document.getElementById("profileOverlay");

      if (
        registerOverlay &&
        !registerOverlay.classList.contains("hidden") &&
        typeof closeRegister === "function"
      )
        closeRegister();
      if (
        loginOverlay &&
        !loginOverlay.classList.contains("hidden") &&
        typeof closeLogin === "function"
      )
        closeLogin();
      if (
        profileOverlay &&
        !profileOverlay.classList.contains("hidden") &&
        typeof attemptCloseProfile === "function"
      )
        attemptCloseProfile();
    }
  });

  // Listen for auth changes
  window.addEventListener("auth:login", updateAuthUI);

  // Run on load
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", updateAuthUI);
  } else {
    updateAuthUI();
  }
})();
