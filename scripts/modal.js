(function () {
  const registerOverlay = document.getElementById("registerOverlay");
  const loginOverlay = document.getElementById("loginOverlay");
  const profileOverlay = document.getElementById("profileOverlay");

  function openRegister() {
    if (loginOverlay) loginOverlay.classList.add("hidden");
    if (profileOverlay) profileOverlay.classList.add("hidden");
    if (typeof window.resetRegisterForm === "function") {
      window.resetRegisterForm();
    }
    if (registerOverlay) registerOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeRegister() {
    if (registerOverlay) registerOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function openLogin() {
    if (registerOverlay) registerOverlay.classList.add("hidden");
    if (profileOverlay) profileOverlay.classList.add("hidden");
    if (typeof window.resetLoginForm === "function") {
      window.resetLoginForm();
    }
    if (loginOverlay) loginOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLogin() {
    if (loginOverlay) loginOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  async function openProfile() {
    if (!profileOverlay) return;

    if (typeof isLoggedIn === "function" && !isLoggedIn()) {
      if (typeof openLogin === "function") {
        openLogin();
      }
      return;
    }

    if (registerOverlay) registerOverlay.classList.add("hidden");
    if (loginOverlay) loginOverlay.classList.add("hidden");
    if (typeof window.resetProfileForm === "function") {
      window.resetProfileForm();
    }

    const previewImage = window.profilePreviewImage;
    if (previewImage instanceof HTMLImageElement) {
      previewImage.src = "./assets/profilepic.png";
    }

    if (typeof window.fillProfileForm === "function") {
      await window.fillProfileForm();
    }

    if (
      window.profileUploadBtn instanceof HTMLButtonElement &&
      typeof window.isProfileFormValid === "function"
    ) {
      window.profileUploadBtn.disabled = !window.isProfileFormValid();
    }

    profileOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeProfile() {
    if (profileOverlay) profileOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function attemptCloseProfile() {
    if (
      typeof window.confirmCloseProfile !== "function" ||
      window.confirmCloseProfile()
    ) {
      closeProfile();
    }
  }

  if (registerOverlay) {
    registerOverlay.addEventListener("click", (event) => {
      if (event.target === registerOverlay) closeRegister();
    });
  }

  if (loginOverlay) {
    loginOverlay.addEventListener("click", (event) => {
      if (event.target === loginOverlay) closeLogin();
    });
  }

  if (profileOverlay) {
    profileOverlay.addEventListener("click", (event) => {
      if (event.target === profileOverlay) attemptCloseProfile();
    });
  }

  document
    .querySelectorAll(".switch-to-login")
    .forEach((element) => element.addEventListener("click", openLogin));
  document
    .querySelectorAll(".switch-to-register")
    .forEach((element) => element.addEventListener("click", openRegister));

  window.openRegister = openRegister;
  window.closeRegister = closeRegister;
  window.openLogin = openLogin;
  window.closeLogin = closeLogin;
  window.openProfile = openProfile;
  window.closeProfile = closeProfile;
  window.attemptCloseProfile = attemptCloseProfile;
})();
