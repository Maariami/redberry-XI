"use strict";

// ─── Auth token storage ───────────────────────────────────────────────────────
function saveToken(token) {
  if (typeof token !== "string") {
    return false;
  }

  const normalizedToken = token.trim();
  if (
    !normalizedToken ||
    normalizedToken === "undefined" ||
    normalizedToken === "null"
  ) {
    return false;
  }

  localStorage.setItem("auth_token", normalizedToken);
  window.dispatchEvent(new CustomEvent("auth:login"));
  return true;
}
function getToken() {
  const token = localStorage.getItem("auth_token");
  if (!token || token === "undefined" || token === "null") {
    return null;
  }

  return token;
}
function clearToken() {
  localStorage.removeItem("auth_token");
}
function isLoggedIn() {
  return Boolean(getToken());
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
  if (typeof window.updateAuthUI === "function") {
    window.updateAuthUI();
  }

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

  const profile = await apiGetProfile(token);
  if (!profile) {
    // Clear invalid token and update UI if the session is no longer valid.
    clearToken();
    if (typeof window.updateAuthUI === "function") {
      window.updateAuthUI();
    }
  }
  return profile;
}

async function updateProfile(profileData) {
  const token = getToken();
  if (!token) return null;
  return await apiUpdateProfile(token, profileData);
}
