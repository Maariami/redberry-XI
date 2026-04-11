"use strict";

// ─── API Configuration ───────────────────────────────────────────────────────
const API_BASE = "/api";

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

// ─── Featured courses API ───────────────────────────────────────────────────
async function apiGetFeaturedCourses() {
  try {
    const res = await fetch(`${API_BASE}/courses/featured`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Failed to fetch featured courses:", error);
    return { ok: false, error };
  }
}

async function apiGetCourses({ sort = "newest", page = 1 } = {}) {
  try {
    const params = new URLSearchParams({
      sort: String(sort),
      page: String(page),
    });
    const res = await fetch(`${API_BASE}/courses?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return { ok: false, error };
  }
}

async function apiGetCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { ok: false, error };
  }
}

async function apiGetTopics() {
  try {
    const res = await fetch(`${API_BASE}/topics`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    return { ok: false, error };
  }
}

async function apiGetInstructors() {
  try {
    const res = await fetch(`${API_BASE}/instructors`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("Failed to fetch instructors:", error);
    return { ok: false, error };
  }
}

async function apiGetCourseWeeklySchedules(courseId) {
  try {
    const res = await fetch(
      `${API_BASE}/courses/${courseId}/weekly-schedules`,
      {
        headers: { Accept: "application/json" },
      },
    );
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("Failed to fetch weekly schedules:", error);
    return { ok: false, error };
  }
}

async function apiGetCourseTimeSlots(courseId, weeklyScheduleId) {
  try {
    const params = new URLSearchParams({
      weekly_schedule_id: String(weeklyScheduleId),
    });
    const res = await fetch(
      `${API_BASE}/courses/${courseId}/time-slots?${params.toString()}`,
      {
        headers: { Accept: "application/json" },
      },
    );
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("Failed to fetch time slots:", error);
    return { ok: false, error };
  }
}

async function apiGetCourseSessionTypes(
  courseId,
  weeklyScheduleId,
  timeSlotId,
) {
  try {
    const params = new URLSearchParams({
      weekly_schedule_id: String(weeklyScheduleId),
      time_slot_id: String(timeSlotId),
    });
    const res = await fetch(
      `${API_BASE}/courses/${courseId}/session-types?${params.toString()}`,
      {
        headers: { Accept: "application/json" },
      },
    );
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("Failed to fetch session types:", error);
    return { ok: false, error };
  }
}

async function apiGetEnrollments(token) {
  try {
    const res = await fetch(`${API_BASE}/enrollments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("Failed to fetch enrollments:", error);
    return { ok: false, error };
  }
}

async function apiCreateEnrollment(token, payload) {
  try {
    const res = await fetch(`${API_BASE}/enrollments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("Failed to create enrollment:", error);
    return { ok: false, error };
  }
}

async function apiCompleteEnrollment(token, enrollmentId) {
  const endpoint = `${API_BASE}/enrollments/${enrollmentId}/complete`;

  try {
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : null;
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    return { ok: false, error };
  }
}

async function apiDeleteEnrollment(token, enrollmentId) {
  try {
    const res = await fetch(`${API_BASE}/enrollments/${enrollmentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : null;
    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("Failed to delete enrollment:", error);
    return { ok: false, error };
  }
}

async function apiCreateCourseReview(token, courseId, payload) {
  try {
    const res = await fetch(`${API_BASE}/courses/${courseId}/reviews`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : null;

    return { ok: res.ok, data, status: res.status };
  } catch (error) {
    console.error("Failed to create course review:", error);
    return { ok: false, error };
  }
}
