"use strict";

(function () {
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginEmailError = document.getElementById("loginEmailError");
  const loginPasswordError = document.getElementById("loginPasswordError");
  const loginGlobalError = document.getElementById("loginGlobalError");
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");

  const EYE_OPEN = "./assets/open Eye.png";
  const EYE_SHUT = "./assets/Eye.png";

  document.querySelectorAll(".eye-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);
      const icon = button.querySelector(".eye-icon");
      if (!input || !icon) return;

      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      icon.src = showing ? EYE_OPEN : EYE_SHUT;
    });
  });

  if (!loginEmail || !loginPassword || !loginSubmitBtn) {
    return;
  }

  loginSubmitBtn.dataset.label = "Log In";

  function resetLoginForm() {
    loginEmail.value = "";
    loginPassword.value = "";
    [loginEmailError, loginPasswordError, loginGlobalError].forEach(clearErr);
    setLoading(loginSubmitBtn, false);
    loginSubmitBtn.textContent = loginSubmitBtn.dataset.label;
    loginSubmitBtn.disabled = false;
  }

  async function handleLoginSubmit() {
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

    if (email.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showErr(
        loginEmailError,
        "Please enter a valid email with at least 3 characters.",
      );
      setLoading(loginSubmitBtn, false);
      return;
    }

    if (password.trim().length < 3) {
      showErr(loginPasswordError, "Password must be at least 3 characters.");
      setLoading(loginSubmitBtn, false);
      return;
    }

    const result = await login({ email, password });
    const token = result?.data?.token ?? result?.data?.data?.token ?? null;

    if (result?.ok && token) {
      saveToken(token);
      if (typeof window.updateAuthUI === "function") {
        window.updateAuthUI();
      }
      if (typeof window.closeLogin === "function") {
        window.closeLogin();
      }
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
  }

  loginSubmitBtn.addEventListener("click", handleLoginSubmit);

  loginEmail.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleLoginSubmit();
    }
  });

  loginPassword.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleLoginSubmit();
    }
  });

  loginEmail.addEventListener("blur", () => {
    const value = loginEmail.value.trim();
    clearErr(loginEmailError);

    if (!value) {
      showErr(loginEmailError, "Email is required.");
      return;
    }

    if (value.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showErr(
        loginEmailError,
        "Please enter a valid email with at least 3 characters.",
      );
    }
  });

  loginPassword.addEventListener("blur", () => {
    const value = loginPassword.value.trim();
    clearErr(loginPasswordError);

    if (!value) {
      showErr(loginPasswordError, "Password is required.");
      return;
    }

    if (value.length < 3) {
      showErr(loginPasswordError, "Password must be at least 3 characters.");
    }
  });

  window.resetLoginForm = resetLoginForm;
})();
