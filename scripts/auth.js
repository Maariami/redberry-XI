"use strict";

// ─── Auth token storage ───────────────────────────────────────────────────────
function saveToken(token) {
  localStorage.setItem("auth_token", token);
}
function getToken() {
  return localStorage.getItem("auth_token");
}
function clearToken() {
  localStorage.removeItem("auth_token");
}
function isLoggedIn() {
  return !!getToken();
}

// ─── Logout function ─────────────────────────────────────────────────────────
async function logout() {
  const token = getToken();
  if (!token) {
    console.log("No active session to logout from");
    return;
  }

  // Call the API logout function
  const success = await apiLogout(token);

  // Clear token regardless of API response
  clearToken();
  updateAuthUI();

  if (success) {
    console.log("Successfully logged out");
  } else {
    console.log("Logged out locally (API call failed)");
  }
}

// Make logout function globally available for console access
window.logout = logout;

// ─── Profile API functions ───────────────────────────────────────────────────
async function getProfile() {
  const token = getToken();
  if (!token) return null;
  return await apiGetProfile(token);
}

async function updateProfile(profileData) {
  const token = getToken();
  if (!token) return null;
  return await apiUpdateProfile(token, profileData);
}
