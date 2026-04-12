(function () {
  // Only run registration logic if registration modal exists
  const regEmail = document.getElementById("regEmail");
  if (!regEmail) return;

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

  function resetRegisterForm() {
    regState.currentStep = 1;
    regState.email = "";
    regState.password = "";
    regState.username = "";
    regState.avatar = null;
    regEmail.value = "";
    regPassword.value = "";
    regConfirmPassword.value = "";
    regUsername.value = "";
    avatarFile.value = "";
    avatarPreviewArea.innerHTML = `
      <img src="./assets/Icon.svg" alt="Upload icon" class="upload-icon" />
      <p>Drag and drop or <span class="upload-link" id="uploadLink">Upload file</span></p>
      <p class="upload-hint">JPG, PNG or WebP</p>`;
    [
      regEmailError,
      regPasswordError,
      regConfirmPasswordError,
      regUsernameError,
      regAvatarError,
      regGlobalError,
    ].forEach(clearErr);
    goToStep(1);
    bindUploadLink();
  }

  function bindUploadLink() {
    const link = document.getElementById("uploadLink");
    if (link)
      link.addEventListener("click", (e) => {
        e.stopPropagation();
        avatarFile.click();
      });
  }

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

  // Event listeners for registration
  regNextBtn1.addEventListener("click", async () => {
    if (!validateRegEmail()) return;
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

  // ── Submit registration ──
  regSignupBtn.addEventListener("click", async () => {
    if (!validateUsername()) return;
    // Extra password match check before submit
    if (regPassword.value !== regConfirmPassword.value) {
      showErr(regConfirmPasswordError, "Passwords do not match.");
      return;
    }
    regState.username = regUsername.value.trim();
    clearErr(regGlobalError);
    setLoading(regSignupBtn, true);

    const form = new FormData();
    form.append("email", regState.email);
    form.append("password", regState.password);
    form.append("password_confirmation", regConfirmPassword.value);
    form.append("username", regState.username);
    if (regState.avatar) form.append("avatar", regState.avatar);

    const result = await register(form);
    setLoading(regSignupBtn, false);
    if (result.ok) {
      const token = result?.data?.token ?? result?.data?.data?.token ?? null;
      const tokenSaved = saveToken(token);

      if (!tokenSaved) {
        showErr(
          regGlobalError,
          "Registration succeeded, but the login token was not returned. Please log in manually.",
        );
        return;
      }

      if (typeof window.updateAuthUI === "function") {
        window.updateAuthUI();
      }
      if (typeof window.closeRegister === "function") {
        window.closeRegister();
      }
      stepSuccess.classList.remove("hidden");
    } else {
      let fieldErrorShown = false;
      if (result.data?.errors) {
        if (result.data.errors.email) {
          showErr(regEmailError, result.data.errors.email[0]);
          fieldErrorShown = true;
        }
        if (result.data.errors.username) {
          showErr(regUsernameError, result.data.errors.username[0]);
          fieldErrorShown = true;
        }
        if (result.data.errors.password) {
          showErr(regPasswordError, result.data.errors.password[0]);
          fieldErrorShown = true;
        }
        if (result.data.errors.avatar) {
          showErr(regAvatarError, result.data.errors.avatar[0]);
          fieldErrorShown = true;
        }
      }
      // Always show a global error if nothing else is shown
      if (!fieldErrorShown) {
        showErr(
          regGlobalError,
          result.data?.message ||
            JSON.stringify(result.data) ||
            "Registration failed.",
        );
      }
    }
  });

  regBackBtn.addEventListener("click", () => {
    if (regState.currentStep > 1) goToStep(regState.currentStep - 1);
  });

  regNextBtn1.dataset.label = "Next";
  regNextBtn2.dataset.label = "Next";
  regSignupBtn.dataset.label = "Sign Up";
})();
