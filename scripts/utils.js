"use strict";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const showErr = (el, msg) => {
  el.textContent = msg;
  el.style.display = "block";
  // Add error class to parent emailinput container
  const container = el.closest(".emailinput");
  if (container) container.classList.add("has-error");
};
const clearErr = (el) => {
  el.textContent = "";
  el.style.display = "none";
  // Remove error class from parent emailinput container
  const container = el.closest(".emailinput");
  if (container) container.classList.remove("has-error");
};

function setLoading(btn, on) {
  btn.disabled = on;
  btn.textContent = on ? "Please wait…" : btn.dataset.label;
}

function setCheckIcon(input, valid) {
  const container = input.closest(".emailinput");
  if (!container) return;
  // The icon is handled via CSS background-image based on classes
}

function normalizeProfileData(profileData) {
  const data = profileData?.data ?? profileData ?? {};
  return {
    username: data.username || data.userName || data.name || data.login || "",
    email: data.email || data.email_address || data.emailAddress || "",
    fullName:
      data.full_name || data.fullName || data.name || data.display_name || "",
    mobileNumber:
      data.mobile_number ||
      data.mobileNumber ||
      data.phone ||
      data.phone_number ||
      "",
    age: data.age ?? data.user_age ?? data.years ?? "",
    avatar: data.avatar || data.avatar_url || data.profile_pic || "",
    profileComplete:
      data.profile_complete || data.profileComplete || data.complete || false,
  };
}
