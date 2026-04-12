// Header and footer auth/profile logic shared across pages
(function () {
  if (window.__redberryHeaderFooterInitialized) return;
  window.__redberryHeaderFooterInitialized = true;

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
    const authAwareFooter = document.querySelector(
      '.footer[data-auth-aware-footer="true"]',
    );
    const footerEnrolledCoursesLink = authAwareFooter?.querySelector(
      "#footerEnrolledCoursesLink",
    );
    const footerProfileLink =
      authAwareFooter?.querySelector("#footerProfileLink");
    const footerLoginLink = authAwareFooter?.querySelector("#footerLoginLink");
    const footerSignupLink =
      authAwareFooter?.querySelector("#footerSignupLink");

    if (!buttonsEl || !enrolledEl || !proficon) return;

    if (typeof isLoggedIn === "function" && isLoggedIn()) {
      buttonsEl.classList.remove("logged-out");
      enrolledEl.classList.add("logged-in");
      proficon.classList.add("logged-in");
      if (authAwareFooter) {
        if (footerEnrolledCoursesLink) footerEnrolledCoursesLink.hidden = false;
        if (footerProfileLink) footerProfileLink.hidden = false;
        if (footerLoginLink) footerLoginLink.hidden = true;
        if (footerSignupLink) footerSignupLink.hidden = true;
      }
      await updateProfileDisplay();
    } else {
      buttonsEl.classList.add("logged-out");
      enrolledEl.classList.remove("logged-in");
      proficon.classList.remove("logged-in");
      if (authAwareFooter) {
        if (footerEnrolledCoursesLink) footerEnrolledCoursesLink.hidden = true;
        if (footerProfileLink) footerProfileLink.hidden = true;
        if (footerLoginLink) footerLoginLink.hidden = false;
        if (footerSignupLink) footerSignupLink.hidden = false;
      }
    }
  }

  window.updateAuthUI = updateAuthUI;
  window.updateProfileDisplay = updateProfileDisplay;

  const loginBtn = document.querySelector(".login");
  if (loginBtn && typeof window.openLogin === "function") {
    loginBtn.addEventListener("click", window.openLogin);
  }

  const signupBtn = document.querySelector(".signup");
  if (signupBtn && typeof window.openRegister === "function") {
    signupBtn.addEventListener("click", window.openRegister);
  }

  const headerLogo = document.querySelector(".header .logo");
  if (headerLogo) {
    headerLogo.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  const proficon = document.querySelector(".proficon");
  if (proficon && typeof window.openProfile === "function") {
    proficon.addEventListener("click", () => {
      if (typeof isLoggedIn === "function" && isLoggedIn()) {
        window.openProfile();
      }
    });
  }

  const footerProfileLink = document.getElementById("footerProfileLink");
  if (footerProfileLink && typeof window.openProfile === "function") {
    footerProfileLink.addEventListener("click", () => {
      if (typeof isLoggedIn === "function" && isLoggedIn()) {
        window.openProfile();
      }
    });
  }

  const footerLoginLink = document.getElementById("footerLoginLink");
  if (footerLoginLink && typeof window.openLogin === "function") {
    footerLoginLink.addEventListener("click", window.openLogin);
  }

  const footerSignupLink = document.getElementById("footerSignupLink");
  if (footerSignupLink && typeof window.openRegister === "function") {
    footerSignupLink.addEventListener("click", window.openRegister);
  }

  const regCloseBtn = document.getElementById("regCloseBtn");
  if (regCloseBtn && typeof window.closeRegister === "function") {
    regCloseBtn.addEventListener("click", window.closeRegister);
  }

  const loginCloseBtn = document.getElementById("loginCloseBtn");
  if (loginCloseBtn && typeof window.closeLogin === "function") {
    loginCloseBtn.addEventListener("click", window.closeLogin);
  }

  const profileCloseBtn = document.getElementById("profileCloseBtn");
  if (profileCloseBtn && typeof window.attemptCloseProfile === "function") {
    profileCloseBtn.addEventListener("click", window.attemptCloseProfile);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const registerOverlay = document.getElementById("registerOverlay");
    const loginOverlay = document.getElementById("loginOverlay");
    const profileOverlay = document.getElementById("profileOverlay");

    if (
      registerOverlay &&
      !registerOverlay.classList.contains("hidden") &&
      typeof window.closeRegister === "function"
    ) {
      window.closeRegister();
    }

    if (
      loginOverlay &&
      !loginOverlay.classList.contains("hidden") &&
      typeof window.closeLogin === "function"
    ) {
      window.closeLogin();
    }

    if (
      profileOverlay &&
      !profileOverlay.classList.contains("hidden") &&
      typeof window.attemptCloseProfile === "function"
    ) {
      window.attemptCloseProfile();
    }
  });

  window.addEventListener("auth:login", updateAuthUI);

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", updateAuthUI);
  } else {
    updateAuthUI();
  }
})();
