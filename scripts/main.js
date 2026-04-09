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

// ─── Eye toggles (works for both modals) ─────────────────────────────────────
// Open eye = password hidden | Closed eye = password visible
const EYE_OPEN = "./assets/open Eye.png";
const EYE_SHUT = "./assets/Eye.png";

document.querySelectorAll(".eye-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const img = btn.querySelector(".eye-icon");

    const showing = input.type === "text";

    // toggle password visibility
    input.type = showing ? "password" : "text";

    // change icon
    img.src = showing ? EYE_OPEN : EYE_SHUT;
  });
});

// ─── Login ───────────────────────────────────────────────────────────────────
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginEmailError = document.getElementById("loginEmailError");
const loginPasswordError = document.getElementById("loginPasswordError");
const loginGlobalError = document.getElementById("loginGlobalError");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");
loginSubmitBtn.dataset.label = "Log In";

function resetLoginForm() {
  loginEmail.value = "";
  loginPassword.value = "";
  [loginEmailError, loginPasswordError, loginGlobalError].forEach(clearErr);
  setLoading(loginSubmitBtn, false);
  loginSubmitBtn.textContent = loginSubmitBtn.dataset.label;
  loginSubmitBtn.disabled = false;
}

loginSubmitBtn.addEventListener("click", async () => {
  clearErr(loginEmailError);
  clearErr(loginPasswordError);
  clearErr(loginGlobalError);
  setLoading(loginSubmitBtn, true);

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    if (!email) showErr(loginEmailError, "Email is required.");
    if (!password) showErr(loginPasswordError, "Password is required.");
    setLoading(loginSubmitBtn, false);
    return;
  }

  const result = await login({ email, password });

  const token = result?.data?.token ?? result?.data?.data?.token;
  if (result?.ok && token) {
    saveToken(token);
    updateAuthUI();
    closeLogin();
  } else {
    const message =
      result?.data?.message ||
      result?.data?.errors?.email?.[0] ||
      result?.data?.errors?.password?.[0] ||
      result?.error?.message ||
      "Login failed.";
    showErr(loginGlobalError, message);
  }

  setLoading(loginSubmitBtn, false);
});

// Enter key support
loginEmail.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginSubmitBtn.click();
});
loginPassword.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginSubmitBtn.click();
});

// ─── Header button handlers ───────────────────────────────────────────────────
document.querySelector(".login").addEventListener("click", openLogin);
document.querySelector(".signup").addEventListener("click", openRegister);

// ─── Close buttons ───────────────────────────────────────────────────────────
document.getElementById("regCloseBtn").addEventListener("click", closeRegister);
document.getElementById("loginCloseBtn").addEventListener("click", closeLogin);
document
  .getElementById("profileCloseBtn")
  .addEventListener("click", attemptCloseProfile);

// Keyboard: Escape closes whichever modal is open
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!registerOverlay.classList.contains("hidden")) closeRegister();
    if (!loginOverlay.classList.contains("hidden")) closeLogin();
    if (!profileOverlay.classList.contains("hidden")) attemptCloseProfile();
  }
});

document.querySelector(".proficon").addEventListener("click", () => {
  if (isLoggedIn()) openProfile();
});

// Listen for auth changes
window.addEventListener("auth:login", updateAuthUI);

// ─── Init ─────────────────────────────────────────────────────────────────────
goToStep(1);
updateAuthUI();
