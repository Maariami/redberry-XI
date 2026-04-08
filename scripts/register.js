"use strict";

const API_BASE = "https://api.redclass.redberryinternship.ge/api";

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

// ─── Modal open/close ─────────────────────────────────────────────────────────
const registerOverlay = document.getElementById("registerOverlay");
const loginOverlay = document.getElementById("loginOverlay");

function openRegister() {
  loginOverlay.classList.add("hidden");
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
  resetLoginForm();
  loginOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeLogin() {
  loginOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

// Close on overlay click (outside modal)
registerOverlay.addEventListener("click", (e) => {
  if (e.target === registerOverlay) closeRegister();
});
loginOverlay.addEventListener("click", (e) => {
  if (e.target === loginOverlay) closeLogin();
});

// Switch links
document
  .querySelectorAll(".switch-to-login")
  .forEach((el) => el.addEventListener("click", openLogin));
document
  .querySelectorAll(".switch-to-register")
  .forEach((el) => el.addEventListener("click", openRegister));

// Close buttons
document.getElementById("regCloseBtn").addEventListener("click", closeRegister);
document.getElementById("loginCloseBtn").addEventListener("click", closeLogin);

// Keyboard: Escape closes whichever modal is open
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!registerOverlay.classList.contains("hidden")) closeRegister();
    if (!loginOverlay.classList.contains("hidden")) closeLogin();
  }
});

// Public openers — call these from anywhere in your app
window.openRegisterModal = openRegister;
window.openLoginModal = openLogin;

// ════════════════════════════════════════════════════════
//  REGISTRATION
// ════════════════════════════════════════════════════════
const regState = {
  currentStep: 1,
  email: "",
  password: "",
  username: "",
  avatar: null,
};

const dashes = [1, 2, 3].map((n) => document.getElementById(`dash${n}`));
const steps = [1, 2, 3].map((n) => document.getElementById(`step${n}`));
const stepSuccess = document.getElementById("stepSuccess");
const regBackBtn = document.getElementById("regBackBtn");

const regEmail = document.getElementById("regEmail");
const regEmailError = document.getElementById("regEmailError");
const regNextBtn1 = document.getElementById("regNextBtn1");

const regPassword = document.getElementById("regPassword");
const regConfirmPassword = document.getElementById("regConfirmPassword");
const regPasswordError = document.getElementById("regPasswordError");
const regConfirmPasswordError = document.getElementById(
  "regConfirmPasswordError",
);
const regNextBtn2 = document.getElementById("regNextBtn2");

const regUsername = document.getElementById("regUsername");
const regUsernameError = document.getElementById("regUsernameError");
const avatarDropzone = document.getElementById("avatarDropzone");
const avatarFile = document.getElementById("avatarFile");
const avatarPreviewArea = document.getElementById("avatarPreviewArea");
const regAvatarError = document.getElementById("regAvatarError");
const regSignupBtn = document.getElementById("regSignupBtn");
const regGlobalError = document.getElementById("regGlobalError");

regNextBtn1.dataset.label = "Next";
regNextBtn2.dataset.label = "Next";
regSignupBtn.dataset.label = "Sign Up";

// ── Step navigation ──
function goToStep(n) {
  regState.currentStep = n;
  steps.forEach((s, i) => s.classList.toggle("hidden", i !== n - 1));
  stepSuccess.classList.add("hidden");
  dashes.forEach((d, i) => {
    d.className = "dash";
    if (i < n - 1) d.classList.add("finished");
    else if (i === n - 1) d.classList.add("opened");
  });
  regBackBtn.style.display = n === 1 ? "none" : "flex";
  clearErr(regGlobalError);
}

regBackBtn.addEventListener("click", () => {
  if (regState.currentStep > 1) goToStep(regState.currentStep - 1);
});

// ── Validation ──
function validateRegEmail() {
  clearErr(regEmailError);
  const v = regEmail.value.trim();
  if (!v) {
    showErr(regEmailError, "Email is required.");
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    showErr(regEmailError, "Enter a valid email address.");
    return false;
  }
  return true;
}

function validatePasswords() {
  clearErr(regPasswordError);
  clearErr(regConfirmPasswordError);
  const pw = regPassword.value;
  const cpw = regConfirmPassword.value;
  let ok = true;
  if (!pw) {
    showErr(regPasswordError, "Password is required.");
    ok = false;
  } else if (pw.length < 3) {
    showErr(regPasswordError, "Password must be at least 3 characters.");
    ok = false;
  }
  if (!cpw) {
    showErr(regConfirmPasswordError, "Please confirm your password.");
    ok = false;
  } else if (pw !== cpw) {
    showErr(regConfirmPasswordError, "Passwords do not match.");
    ok = false;
  }
  return ok;
}

function validateUsername() {
  clearErr(regUsernameError);
  const v = regUsername.value.trim();
  if (!v) {
    showErr(regUsernameError, "Username is required.");
    return false;
  }
  if (v.length < 3) {
    showErr(regUsernameError, "Username must be at least 3 characters.");
    return false;
  }
  return true;
}

// ── Step buttons ──
regNextBtn1.addEventListener("click", async () => {
  if (!validateRegEmail()) return;

  // Hit the API to check if email is already taken before advancing
  setLoading(regNextBtn1, true);
  try {
    const form = new FormData();
    form.append("email", regEmail.value.trim());
    form.append("password", "placeholder123");
    form.append("password_confirmation", "placeholder123");
    form.append("username", "placeholder_user_check");

    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { accept: "application/json" },
      body: form,
    });
    const data = await res.json();

    // Only block if the API returns an email-specific error
    if (!res.ok && data.errors && data.errors.email) {
      showErr(regEmailError, data.errors.email[0]);
      setLoading(regNextBtn1, false);
      return;
    }
  } catch (_) {
    // Network issue — let them proceed, final submit will catch it
  }

  setLoading(regNextBtn1, false);
  regState.email = regEmail.value.trim();
  goToStep(2);
});

regNextBtn2.addEventListener("click", () => {
  if (!validatePasswords()) return;
  regState.password = regPassword.value;
  goToStep(3);
});

// Enter key support
regEmail.addEventListener("keydown", (e) => {
  if (e.key === "Enter") regNextBtn1.click();
});
regConfirmPassword.addEventListener("keydown", (e) => {
  if (e.key === "Enter") regNextBtn2.click();
});
regUsername.addEventListener("keydown", (e) => {
  if (e.key === "Enter") regSignupBtn.click();
});

// ── Avatar ──
function bindUploadLink() {
  const link = document.getElementById("uploadLink");
  if (link)
    link.addEventListener("click", (e) => {
      e.stopPropagation();
      avatarFile.click();
    });
}
avatarDropzone.addEventListener("click", () => avatarFile.click());
avatarDropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  avatarDropzone.classList.add("drag-over");
});
avatarDropzone.addEventListener("dragleave", () =>
  avatarDropzone.classList.remove("drag-over"),
);
avatarDropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  avatarDropzone.classList.remove("drag-over");
  if (e.dataTransfer.files[0]) handleAvatar(e.dataTransfer.files[0]);
});
avatarFile.addEventListener("change", () => {
  if (avatarFile.files[0]) handleAvatar(avatarFile.files[0]);
});
bindUploadLink();

function handleAvatar(file) {
  clearErr(regAvatarError);
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    showErr(regAvatarError, "Only JPG, PNG or WebP allowed.");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showErr(regAvatarError, "File must be under 5 MB.");
    return;
  }
  regState.avatar = file;
  const reader = new FileReader();
  reader.onload = (ev) => {
    avatarPreviewArea.innerHTML = `
      <img src="${ev.target.result}" alt="Avatar preview"
           style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid rgba(79,70,229,1);" />
      <p class="upload-hint" style="margin-top:6px;">${file.name}</p>`;
  };
  reader.readAsDataURL(file);
}

// ── Submit registration ──
regSignupBtn.addEventListener("click", async () => {
  if (!validateUsername()) return;
  regState.username = regUsername.value.trim();
  clearErr(regGlobalError);
  setLoading(regSignupBtn, true);

  try {
    const form = new FormData();
    form.append("email", regState.email);
    form.append("password", regState.password);
    form.append("password_confirmation", regState.password);
    form.append("username", regState.username);
    if (regState.avatar) form.append("avatar", regState.avatar);

    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { accept: "application/json" },
      body: form,
    });
    const data = await res.json();

    if (!res.ok) {
      // Show API validation errors on the correct field if possible
      if (data.errors) {
        if (data.errors.email) {
          showErr(regEmailError, data.errors.email[0]);
          goToStep(1);
        }
        if (data.errors.username) {
          showErr(regUsernameError, data.errors.username[0]);
        }
        if (data.errors.password) {
          showErr(regPasswordError, data.errors.password[0]);
          goToStep(2);
        }
        const other = Object.entries(data.errors)
          .filter(
            ([k]) =>
              ![
                "email",
                "username",
                "password",
                "password_confirmation",
              ].includes(k),
          )
          .map(([, v]) => v[0])
          .join(" ");
        if (other) showErr(regGlobalError, other);
      } else {
        showErr(
          regGlobalError,
          data.message || "Registration failed. Please try again.",
        );
      }
      setLoading(regSignupBtn, false);
      return;
    }

    // Save token if returned
    if (data.token) saveToken(data.token);
    else if (data.data?.token) saveToken(data.data.token);

    showRegSuccess();
  } catch {
    showErr(regGlobalError, "Network error. Please check your connection.");
    setLoading(regSignupBtn, false);
  }
});

function showRegSuccess() {
  steps.forEach((s) => s.classList.add("hidden"));
  stepSuccess.classList.remove("hidden");
  regBackBtn.style.display = "none";
  dashes.forEach((d) => {
    d.className = "dash finished";
  });
  // Auto-close after 2 seconds and notify the app
  setTimeout(() => {
    closeRegister();
    window.dispatchEvent(new CustomEvent("auth:login"));
  }, 2000);
}

function resetRegisterForm() {
  regEmail.value = "";
  regPassword.value = "";
  regConfirmPassword.value = "";
  regUsername.value = "";
  regState.avatar = null;
  avatarFile.value = "";
  avatarPreviewArea.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa"
         stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 16 12 12 8 16"/>
      <line x1="12" y1="12" x2="12" y2="21"/>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
    </svg>
    <p>Drag and drop or <span class="upload-link" id="uploadLink">Upload file</span></p>
    <p class="upload-hint">JPG, PNG or WebP</p>`;
  bindUploadLink();
  [
    regEmailError,
    regPasswordError,
    regConfirmPasswordError,
    regUsernameError,
    regAvatarError,
    regGlobalError,
  ].forEach(clearErr);
  goToStep(1);
}

// ════════════════════════════════════════════════════════
//  LOGIN
// ════════════════════════════════════════════════════════
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginEmailError = document.getElementById("loginEmailError");
const loginPasswordError = document.getElementById("loginPasswordError");
const loginGlobalError = document.getElementById("loginGlobalError");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");

loginSubmitBtn.dataset.label = "Log In";

function validateLoginEmail() {
  clearErr(loginEmailError);
  const v = loginEmail.value.trim();
  if (!v) {
    showErr(loginEmailError, "Email is required.");
    return false;
  }
  if (v.length < 3) {
    showErr(loginEmailError, "Must be at least 3 characters.");
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    showErr(loginEmailError, "Enter a valid email address.");
    return false;
  }
  return true;
}

function validateLoginPassword() {
  clearErr(loginPasswordError);
  const v = loginPassword.value;
  if (!v) {
    showErr(loginPasswordError, "Password is required.");
    return false;
  }
  if (v.length < 3) {
    showErr(loginPasswordError, "Must be at least 3 characters.");
    return false;
  }
  return true;
}

loginSubmitBtn.addEventListener("click", async () => {
  const emailOk = validateLoginEmail();
  const passOk = validateLoginPassword();
  if (!emailOk || !passOk) return;

  clearErr(loginGlobalError);
  setLoading(loginSubmitBtn, true);

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email: loginEmail.value.trim(),
        password: loginPassword.value,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      if (data.errors) {
        if (data.errors.email) showErr(loginEmailError, data.errors.email[0]);
        if (data.errors.password)
          showErr(loginPasswordError, data.errors.password[0]);
        const other = Object.entries(data.errors)
          .filter(([k]) => !["email", "password"].includes(k))
          .map(([, v]) => v[0])
          .join(" ");
        if (other) showErr(loginGlobalError, other);
      } else {
        showErr(loginGlobalError, data.message || "Invalid email or password.");
      }
      setLoading(loginSubmitBtn, false);
      return;
    }

    if (data.token) saveToken(data.token);
    else if (data.data?.token) saveToken(data.data.token);

    closeLogin();
    window.dispatchEvent(new CustomEvent("auth:login"));
  } catch {
    showErr(loginGlobalError, "Network error. Please check your connection.");
    setLoading(loginSubmitBtn, false);
  }
});

// Enter key
loginEmail.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginSubmitBtn.click();
});
loginPassword.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginSubmitBtn.click();
});

function resetLoginForm() {
  loginEmail.value = "";
  loginPassword.value = "";
  [loginEmailError, loginPasswordError, loginGlobalError].forEach(clearErr);
  setLoading(loginSubmitBtn, false);
  loginSubmitBtn.textContent = loginSubmitBtn.dataset.label;
  loginSubmitBtn.disabled = false;
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

// ─── Init ─────────────────────────────────────────────────────────────────────
goToStep(1);

// Example: open login modal on page load if not logged in
if (isLoggedIn()) openRegister();
