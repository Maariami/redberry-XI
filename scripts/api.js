"use strict";

// ─── API Configuration ───────────────────────────────────────────────────────
const API_BASE = "https://api.redclass.redberryinternship.ge/api";

// ─── Login & Logout API ─────────────────────────────────────────────────────
async function login(credentials) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Login error:", error);
    return { ok: false, error };
  }
}

async function apiLogout(token) {
  try {
    const res = await fetch(`${API_BASE}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    return res.ok;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

// ─── Registration API ───────────────────────────────────────────────────────
async function checkEmail(email) {
  try {
    const form = new FormData();
    form.append("email", email);
    const res = await fetch(`${API_BASE}/check-email`, {
      method: "POST",
      headers: { accept: "application/json" },
      body: form,
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Email check error:", error);
    return { ok: false, error };
  }
}

async function register(userData) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { accept: "application/json" },
      body: userData, // FormData
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Registration error:", error);
    return { ok: false, error };
  }
}

// ─── Profile API ────────────────────────────────────────────────────────────
async function apiGetProfile(token) {
  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch profile:", error);
  }
  return null;
}

async function apiUpdateProfile(token, profileData) {
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: profileData, // FormData
    });

    const contentType = res.headers.get("content-type") || "";
    let body;
    if (contentType.includes("application/json")) {
      body = await res.json();
    } else {
      body = { message: await res.text() };
    }

    return {
      ok: res.ok,
      status: res.status,
      data: body,
    };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { ok: false, error };
  }
}
