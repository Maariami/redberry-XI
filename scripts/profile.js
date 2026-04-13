"use strict";

(function () {
  const profileFullName = document.getElementById("profileFullName");
  const profileEmail = document.getElementById("profileEmail");
  const profilePhone = document.getElementById("profilePhone");
  const profileAge = document.getElementById("profileAge");
  const profileAgeField = document.querySelector(".profile-age-field");
  const profileAgeTrigger = document.getElementById("profileAgeTrigger");
  const profileAgeValue = document.getElementById("profileAgeValue");
  const profileAgeMenu = document.getElementById("profileAgeMenu");
  const profileFullNameError = document.getElementById("profileFullNameError");
  const profileEmailError = document.getElementById("profileEmailError");
  const profilePhoneError = document.getElementById("profilePhoneError");
  const profileAgeError = document.getElementById("profileAgeError");
  const profileAvatarDropzone = document.getElementById(
    "profileAvatarDropzone",
  );
  const profileAvatarFile = document.getElementById("profileAvatarFile");
  const profileAvatarPreviewArea = document.getElementById(
    "profileAvatarPreviewArea",
  );
  const profileAvatarError = document.getElementById("profileAvatarError");
  const profileGlobalError = document.getElementById("profileGlobalError");
  const profileUploadLink = document.getElementById("profileUploadLink");
  const profileUploadBtn = document.getElementById("profileUploadBtn");
  const profileUsernameLabel = document.getElementById("profileUsername");
  const profileCompletionLabel = document.getElementById("profileCompletion");
  const profilePreviewImage = document.querySelector(".profile-preview");
  const profileStatusIcon = document.querySelector(".profile-status-icon");
  const profileSuccessMessage = document.getElementById(
    "profileSuccessMessage",
  );

  // Expose for modal.js
  window.profilePreviewImage = profilePreviewImage;
  window.profileUploadBtn = profileUploadBtn;

  let profileAvatarState = null;

  function normalizeProfilePhoneValue(value) {
    const digits = String(value || "").replace(/\D/g, "");

    if (digits.startsWith("995")) {
      return digits.slice(3, 12);
    }

    return digits.slice(0, 9);
  }

  function syncProfileAgeLabel() {
    if (!profileAge || !profileAgeValue) return;

    const selectedOption = profileAge.options[profileAge.selectedIndex];
    const hasValue = Boolean(profileAge.value);

    profileAgeValue.textContent = hasValue
      ? selectedOption?.textContent || profileAge.value
      : "Select age";
    profileAgeValue.classList.toggle("is-placeholder", !hasValue);
  }

  function ensureProfileAgeOptions() {
    if (!profileAge) return;

    const currentValue = String(profileAge.value || "");
    const optionsMarkup = ['<option value="">Select age</option>'];

    for (let age = 16; age <= 120; age += 1) {
      optionsMarkup.push(`<option value="${age}">${age}</option>`);
    }

    profileAge.innerHTML = optionsMarkup.join("");

    if (
      currentValue &&
      Number(currentValue) >= 16 &&
      Number(currentValue) <= 120
    ) {
      profileAge.value = currentValue;
    }
  }

  function closeProfileAgeDropdown() {
    if (!profileAgeField || !profileAgeTrigger) return;
    profileAgeField.classList.remove("is-open");
    profileAgeTrigger.setAttribute("aria-expanded", "false");
  }

  function openProfileAgeDropdown() {
    if (!profileAgeField || !profileAgeTrigger) return;
    profileAgeField.classList.add("is-open");
    profileAgeTrigger.setAttribute("aria-expanded", "true");
  }

  function renderProfileAgeOptions() {
    if (!profileAge || !profileAgeMenu) return;

    ensureProfileAgeOptions();

    profileAgeMenu.innerHTML = Array.from(profileAge.options)
      .filter((option) => option.value)
      .map((option) => {
        const isActive = option.value === profileAge.value;
        return `
          <button
            class="profile-age-dropdown__option${isActive ? " is-active" : ""}"
            type="button"
            data-age-value="${option.value}"
            role="option"
            aria-selected="${isActive ? "true" : "false"}"
          >
            ${option.textContent}
          </button>`;
      })
      .join("");
  }

  function initializeProfileAgeDropdown() {
    if (
      !profileAge ||
      !profileAgeTrigger ||
      !profileAgeMenu ||
      !profileAgeField
    ) {
      return;
    }

    renderProfileAgeOptions();
    syncProfileAgeLabel();

    profileAgeTrigger.addEventListener("click", () => {
      if (profileAgeField.classList.contains("is-open")) {
        closeProfileAgeDropdown();
        return;
      }

      openProfileAgeDropdown();
    });

    profileAgeMenu.addEventListener("click", (event) => {
      const optionButton = event.target.closest("[data-age-value]");
      if (!optionButton) return;

      profileAge.value = optionButton.dataset.ageValue || "";
      renderProfileAgeOptions();
      syncProfileAgeLabel();
      closeProfileAgeDropdown();
      profileAge.dispatchEvent(new Event("change", { bubbles: true }));
      window.validateProfileAge();
    });

    profileAge.addEventListener("change", () => {
      renderProfileAgeOptions();
      syncProfileAgeLabel();
    });

    document.addEventListener("click", (event) => {
      if (!profileAgeField.contains(event.target)) {
        closeProfileAgeDropdown();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeProfileAgeDropdown();
      }
    });
  }

  function appendCacheBuster(url) {
    if (!url) return url;

    try {
      const parsedUrl = new URL(url, window.location.href);
      parsedUrl.searchParams.set("_ts", String(Date.now()));
      return parsedUrl.toString();
    } catch (error) {
      return `${url}${url.includes("?") ? "&" : "?"}_ts=${Date.now()}`;
    }
  }

  function setFieldState(
    input,
    errorEl,
    valid,
    message = "",
    showState = true,
    showError = true,
  ) {
    const container = input.closest(".emailinput");
    if (!container) return;
    container.classList.remove(
      "has-error",
      "fullname-valid",
      "fullname-invalid",
      "email-valid",
      "email-invalid",
    );
    if (valid) {
      if (showError) clearErr(errorEl);
    } else if (message) {
      if (showState) container.classList.add("has-error");
      if (input === profileFullName)
        container.classList.add("fullname-invalid");
      if (input === profileEmail) container.classList.add("email-invalid");
      if (showError) showErr(errorEl, message);
    }
  }

  function validateProfileFullName(showError = true, showState = true) {
    if (!profileFullName) return false;
    const value = profileFullName.value.trim();
    if (!value) {
      setFieldState(
        profileFullName,
        profileFullNameError,
        false,
        "Name is required",
        showState,
        showError,
      );
      return false;
    }

    if (value.length < 3) {
      setFieldState(
        profileFullName,
        profileFullNameError,
        false,
        "Name must be at least 3 characters",
        showState,
        showError,
      );
      return false;
    }

    if (value.length > 50) {
      setFieldState(
        profileFullName,
        profileFullNameError,
        false,
        "Name must not exceed 50 characters",
        showState,
        showError,
      );
      return false;
    }

    if (!/^[\p{L} ]+$/u.test(value)) {
      setFieldState(
        profileFullName,
        profileFullNameError,
        false,
        "Full name can only contain letters and spaces",
        showState,
        showError,
      );
      return false;
    }

    setFieldState(
      profileFullName,
      profileFullNameError,
      true,
      "",
      showState,
      showError,
    );
    return true;
  }

  // Attach real fillProfileForm and confirmCloseProfile to window for modal.js
  window.fillProfileForm = fillProfileForm;
  window.confirmCloseProfile = confirmCloseProfile;
  window.resetProfileForm = resetProfileForm;

  let avatarListenersBound = false;
  function bindAvatarListeners() {
    if (avatarListenersBound || !profileAvatarDropzone || !profileAvatarFile) {
      return;
    }

    profileAvatarDropzone.addEventListener("click", () =>
      profileAvatarFile.click(),
    );
    profileAvatarDropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      profileAvatarDropzone.classList.add("drag-over");
    });
    profileAvatarDropzone.addEventListener("dragleave", () =>
      profileAvatarDropzone.classList.remove("drag-over"),
    );
    profileAvatarDropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      profileAvatarDropzone.classList.remove("drag-over");
      if (e.dataTransfer.files[0]) {
        handleProfileAvatar(e.dataTransfer.files[0]);
      }
    });
    profileAvatarFile.addEventListener("change", () => {
      if (profileAvatarFile.files[0]) {
        handleProfileAvatar(profileAvatarFile.files[0]);
      }
    });

    avatarListenersBound = true;
  }

  // ...add similar element checks for other event listeners as needed...
  // ...add similar element checks for other event listeners as needed...

  // Move all global functions inside IIFE and attach to window if needed
  window.validateProfileEmail = function validateProfileEmail(
    showError = true,
    showState = true,
  ) {
    const value = profileEmail.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const container = profileEmail.closest(".emailinput");
    if (!container) return false;
    container.classList.remove("has-error", "email-valid", "email-invalid");
    if (!value) {
      if (showError) {
        setFieldState(
          profileEmail,
          profileEmailError,
          false,
          "Email is invalid",
          showState,
          showError,
        );
      }
      return false;
    }
    if (!valid) {
      setFieldState(
        profileEmail,
        profileEmailError,
        false,
        "Email is invalid",
        showState,
        showError,
      );
      return false;
    }
    if (showError) clearErr(profileEmailError);
    return true;
  };

  window.validateProfilePhone = function validateProfilePhone() {
    clearErr(profilePhoneError);
    profilePhone.value = normalizeProfilePhoneValue(profilePhone.value);
    const digits = profilePhone.value;
    if (!digits) {
      setFieldState(
        profilePhone,
        profilePhoneError,
        false,
        "Mobile number is required",
      );
      return false;
    }
    if (!digits.startsWith("5")) {
      setFieldState(
        profilePhone,
        profilePhoneError,
        false,
        "Georgian mobile numbers must start with 5",
      );
      return false;
    }
    if (digits.length !== 9) {
      setFieldState(
        profilePhone,
        profilePhoneError,
        false,
        "Please enter a valid Georgian mobile number (9 digits starting with 5)",
      );
      return false;
    }
    setFieldState(profilePhone, profilePhoneError, true);
    return true;
  };

  window.validateProfileAge = function validateProfileAge() {
    clearErr(profileAgeError);
    const value = profileAge.value;
    if (!value) {
      setFieldState(profileAge, profileAgeError, false, "Age is required");
      return false;
    }
    const number = Number(value);
    if (Number.isNaN(number)) {
      setFieldState(profileAge, profileAgeError, false, "Age must be a number");
      return false;
    }
    if (number < 16) {
      setFieldState(
        profileAge,
        profileAgeError,
        false,
        "You must be at least 16 years old to enroll",
      );
      return false;
    }
    if (number > 120) {
      setFieldState(
        profileAge,
        profileAgeError,
        false,
        "Please enter a valid age",
      );
      return false;
    }
    setFieldState(profileAge, profileAgeError, true);
    return true;
  };

  window.validateProfileForm = function validateProfileForm() {
    const validName = validateProfileFullName(true, true);
    const validPhone = window.validateProfilePhone();
    const validAge = window.validateProfileAge();
    const isValid = validName && validPhone && validAge;
    if (profileUploadBtn) {
      profileUploadBtn.disabled = !isValid;
    }
    return isValid;
  };

  window.isProfileComplete = function isProfileComplete() {
    return window.validateProfileForm();
  };

  window.isProfileFormValid = function isProfileFormValid() {
    const name = profileFullName.value.trim();
    const phone = profilePhone.value.trim().replace(/\D/g, "");
    const age = Number(profileAge.value);

    const validName =
      name.length >= 3 && name.length <= 50 && /^[\p{L} ]+$/u.test(name);
    const validPhone = phone.length === 9 && phone.startsWith("5");
    const validAge = !Number.isNaN(age) && age >= 16 && age <= 120;

    return validName && validPhone && validAge;
  };

  function bindProfileUploadLink() {
    const link = document.getElementById("profileUploadLink");
    if (link && profileAvatarFile) {
      // Remove previous click listeners by cloning
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      newLink.addEventListener("click", (e) => {
        e.stopPropagation();
        profileAvatarFile.click();
      });
    }
  }

  function formatFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return "0 KB";
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function getProfileFieldContainer(input) {
    return input?.closest(".emailinput") || null;
  }

  function resetProfileForm() {
    if (!profileUploadBtn || !profileAvatarFile || !profileAvatarPreviewArea) {
      return;
    }
    if (profileSuccessMessage) profileSuccessMessage.style.display = "none";
    if (profileGlobalError) profileGlobalError.style.display = "none";
    profileAvatarState = null;
    profileAvatarFile.value = "";
    profileAvatarPreviewArea.innerHTML = `
    <img src="./assets/Icon.svg" alt="Upload icon" class="upload-icon" />
    <p>Drag and drop or <span class="upload-link" id="profileUploadLink">Upload file</span></p>
    <p class="upload-hint">JPG, PNG or WebP</p>`;
    [
      profileFullNameError,
      profilePhoneError,
      profileAgeError,
      profileAvatarError,
      profileGlobalError,
    ].forEach(clearErr);
    // Don't clear email error since it's read-only and always valid
    getProfileFieldContainer(profileFullName)?.classList.remove(
      "has-error",
      "fullname-valid",
      "fullname-invalid",
      "email-valid",
      "email-invalid",
    );
    getProfileFieldContainer(profileEmail)?.classList.remove(
      "has-error",
      "email-invalid",
    );
    getProfileFieldContainer(profilePhone)?.classList.remove("has-error");
    getProfileFieldContainer(profileAge)?.classList.remove("has-error");
    profileUploadBtn.disabled = true;
    renderProfileAgeOptions();
    syncProfileAgeLabel();
    closeProfileAgeDropdown();
    bindProfileUploadLink();
    bindAvatarListeners();
  }

  function confirmCloseProfile() {
    const profileData = {
      name: profileFullName.value.trim(),
      phone: profilePhone.value.trim(),
      age: profileAge.value,
    };
    if (
      !profileData.name ||
      !profileData.phone ||
      !profileData.age ||
      !isProfileFormValid()
    ) {
      return window.confirm(
        "Your profile is incomplete. You won't be able to enroll in courses until you complete it. Close anyway?",
      );
    }
    return true;
  }

  async function fillProfileForm() {
    if (
      !profileUsernameLabel ||
      !profileFullName ||
      !profileEmail ||
      !profilePhone ||
      !profileAge ||
      !profileCompletionLabel ||
      !profileStatusIcon
    ) {
      return;
    }

    const profileData = normalizeProfileData(await getProfile());
    if (!profileData) return;

    profileUsernameLabel.textContent = profileData.username || "Username";
    profileFullName.value = profileData.fullName || "";
    profileEmail.value = profileData.email || "";
    profilePhone.value = normalizeProfilePhoneValue(profileData.mobileNumber);
    profileAge.value = profileData.age ? String(profileData.age) : "";
    renderProfileAgeOptions();
    syncProfileAgeLabel();

    getProfileFieldContainer(profileEmail)?.classList.remove(
      "has-error",
      "email-invalid",
    );
    getProfileFieldContainer(profileFullName)?.classList.remove(
      "has-error",
      "fullname-valid",
      "fullname-invalid",
    );

    // Sync modal avatar with header avatar
    const headerAvatar = document.querySelector(".header .profilepicture");
    if (profilePreviewImage && headerAvatar) {
      profilePreviewImage.src = headerAvatar.src;
    }

    if (profileData.profileComplete) {
      profileCompletionLabel.textContent = "Profile Complete ✓";
      profileCompletionLabel.classList.remove("status-incomplete");
      profileCompletionLabel.classList.add("status-complete");
      profileStatusIcon.src = "./assets/completed.png";
    } else {
      profileCompletionLabel.textContent = "Incomplete Profile";
      profileCompletionLabel.classList.remove("status-complete");
      profileCompletionLabel.classList.add("status-incomplete");
      profileStatusIcon.src = "./assets/incomplete.png";
    }
  }

  async function submitProfileUpdate() {
    const token = getToken();
    if (!token) return null;

    const form = new FormData();
    form.append("full_name", profileFullName.value.trim());
    form.append("email", profileEmail.value.trim());
    form.append("mobile_number", profilePhone.value.trim());
    if (profileAge.value) form.append("age", profileAge.value);
    if (profileAvatarState) form.append("avatar", profileAvatarState);

    return await updateProfile(form);
  }

  function handleProfileAvatar(file) {
    if (!profileAvatarPreviewArea || !profilePreviewImage) return;
    clearErr(profileAvatarError);
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      showErr(profileAvatarError, "Only JPG, PNG or WebP allowed.");
      return;
    }
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      showErr(
        profileAvatarError,
        "File must be under 2 MB. Choose a smaller image or reduce its resolution.",
      );
      return;
    }
    profileAvatarState = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      profileAvatarPreviewArea.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;justify-content:flex-start;">
        <img
          src="${ev.target.result}"
          alt="Avatar preview"
          style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid rgba(79,70,229,1);flex-shrink:0;"
        />
        <div style="display:flex;flex-direction:column;gap:4px;min-width:0;text-align:left;">
          <p style="margin:0;font-size:14px;font-weight:500;color:rgba(20,20,20,1);word-break:break-word;">${file.name}</p>
          <p style="margin:0;font-size:12px;color:rgba(84,84,84,1);">${formatFileSize(file.size)}</p>
          <p style="margin:0;">
            <span
              class="upload-link"
              id="profileUploadLink"
              style="color:rgba(79,70,229,1);text-decoration:underline;font-size:14px;font-weight:500;cursor:pointer;"
            >Change file</span>
          </p>
        </div>
      </div>`;
      profilePreviewImage.src = ev.target.result;
      bindProfileUploadLink();
    };
    reader.readAsDataURL(file);
  }

  bindAvatarListeners();
  initializeProfileAgeDropdown();
  if (profileFullName) {
    profileFullName.addEventListener("input", validateProfileForm);
    profileFullName.addEventListener("blur", () => validateProfileFullName());
  }
  if (profilePhone) {
    profilePhone.addEventListener("input", () => {
      profilePhone.value = normalizeProfilePhoneValue(profilePhone.value);
      validateProfileForm();
    });
    profilePhone.addEventListener("blur", () => validateProfilePhone());
  }
  if (profileAge) {
    profileAge.addEventListener("change", validateProfileForm);
    profileAge.addEventListener("blur", () => validateProfileAge());
  }
  if (profileUploadBtn) {
    profileUploadBtn.dataset.label = "Save Profile";
    profileUploadBtn.addEventListener("click", async () => {
      if (!validateProfileForm()) return;
      profileUploadBtn.disabled = true;
      profileUploadBtn.textContent = "Saving...";

      const result = await submitProfileUpdate();
      profileUploadBtn.disabled = false;
      profileUploadBtn.textContent = "Save Profile";

      if (!result || result.ok === false) {
        const message =
          result?.data?.message ||
          result?.error?.message ||
          (result?.status === 413
            ? "Image is too large. Choose a smaller file."
            : "Profile update failed. Please try again.");
        showErr(profileGlobalError, message);
        return;
      }

      if (profileSuccessMessage) {
        profileSuccessMessage.style.display = "block";
      }

      const updatedProfile = normalizeProfileData(result.data);
      if (updatedProfile.avatar) {
        const avatarUrl = appendCacheBuster(updatedProfile.avatar);
        const headerAvatar = document.querySelector(".header .profilepicture");
        if (headerAvatar) {
          headerAvatar.src = avatarUrl;
        }
        if (profilePreviewImage) {
          profilePreviewImage.src = avatarUrl;
        }
      }

      await window.updateAuthUI(); // Update header UI
      await fillProfileForm(); // Refresh profile data in modal
      validateProfileForm(); // Update validation states and button
      window.dispatchEvent(
        new CustomEvent("profile:updated", {
          detail: { profile: updatedProfile },
        }),
      );

      if (typeof window.closeProfile === "function") {
        window.closeProfile();
      }

      setTimeout(() => {
        if (profileSuccessMessage) {
          profileSuccessMessage.style.display = "none";
        }
      }, 3000);
    });
  }
})();
