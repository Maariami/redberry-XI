"use strict";

// ─── Modal open/close ─────────────────────────────────────────────────────────
const registerOverlay = document.getElementById("registerOverlay");
const loginOverlay = document.getElementById("loginOverlay");
const profileOverlay = document.getElementById("profileOverlay");

function openRegister() {
  loginOverlay.classList.add("hidden");
  profileOverlay.classList.add("hidden");
  resetRegisterForm();
  registerOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeRegister() {
  registerOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

function openLogin() {
  registerOverlay.classList.add("hidden");
  profileOverlay.classList.add("hidden");
  resetLoginForm();
  loginOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeLogin() {
  loginOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

async function openProfile() {
  registerOverlay.classList.add("hidden");
  loginOverlay.classList.add("hidden");
  resetProfileForm();
  profilePreviewImage.src = "./assets/profilepic.png"; // Set default avatar
  await fillProfileForm();
  profileUploadBtn.disabled = !isProfileFormValid();
  profileOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeProfile() {
  profileOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

function attemptCloseProfile() {
  if (confirmCloseProfile()) closeProfile();
}

// Close on overlay click (outside modal)
registerOverlay.addEventListener("click", (e) => {
  if (e.target === registerOverlay) closeRegister();
});
loginOverlay.addEventListener("click", (e) => {
  if (e.target === loginOverlay) closeLogin();
});
profileOverlay.addEventListener("click", (e) => {
  if (e.target === profileOverlay) attemptCloseProfile();
});

// Switch links
document
  .querySelectorAll(".switch-to-login")
  .forEach((el) => el.addEventListener("click", openLogin));
document
  .querySelectorAll(".switch-to-register")
  .forEach((el) => el.addEventListener("click", openRegister));
