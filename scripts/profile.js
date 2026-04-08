"use strict";

const profileFullName = document.getElementById("profileFullName");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const profileAge = document.getElementById("profileAge");
const profileFullNameError = document.getElementById("profileFullNameError");
const profileEmailError = document.getElementById("profileEmailError");
const profilePhoneError = document.getElementById("profilePhoneError");
const profileAgeError = document.getElementById("profileAgeError");
const profileAvatarDropzone = document.getElementById("profileAvatarDropzone");
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
const profileSuccessMessage = document.getElementById("profileSuccessMessage");

let profileAvatarState = null;

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
    "has-success",
    "fullname-valid",
    "fullname-invalid",
    "email-valid",
    "email-invalid",
  );
  if (valid) {
    if (showState) container.classList.add("has-success");
    if (input === profileFullName) container.classList.add("fullname-valid");
    if (input === profileEmail) container.classList.add("email-valid");
    if (showError) clearErr(errorEl);
  } else if (message) {
    if (showState) container.classList.add("has-error");
    if (input === profileFullName) container.classList.add("fullname-invalid");
    if (input === profileEmail) container.classList.add("email-invalid");
    if (showError) showErr(errorEl, message);
  }
}

function validateProfileFullName(showError = true, showState = true) {
  const value = profileFullName.value.trim();
  if (!value) {
    if (showError) {
      setFieldState(
        profileFullName,
        profileFullNameError,
        false,
        "Name is required",
        showState,
        showError,
      );
    } else {
      profileFullName.parentElement.classList.remove(
        "has-error",
        "has-success",
        "fullname-valid",
        "fullname-invalid",
      );
    }
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
      "Name is required",
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

function validateProfileEmail(showError = true, showState = true) {
  const value = profileEmail.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const container = profileEmail.closest(".emailinput");
  if (!container) return false;
  container.classList.remove(
    "has-error",
    "has-success",
    "email-valid",
    "email-invalid",
  );
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
  if (showState) container.classList.add("has-success");
  container.classList.add("email-valid");
  if (showError) clearErr(profileEmailError);
  return true;
}

function validateProfilePhone() {
  clearErr(profilePhoneError);
  const raw = profilePhone.value.trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    setFieldState(
      profilePhone,
      profilePhoneError,
      false,
      "მობილურის ნომერი აუცილებელია",
    );
    return false;
  }
  if (!digits.startsWith("5")) {
    setFieldState(
      profilePhone,
      profilePhoneError,
      false,
      "საქართველოს მობილური ნომერი უნდა იწყებოდეს 5-ით",
    );
    return false;
  }
  if (digits.length !== 9) {
    setFieldState(
      profilePhone,
      profilePhoneError,
      false,
      "მობილურის ნომერი უნდა შედგებოდეს 9 ციფრისგან",
    );
    return false;
  }
  setFieldState(profilePhone, profilePhoneError, true);
  return true;
}

function validateProfileAge() {
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
}

function validateProfileForm() {
  const validName = validateProfileFullName(true, true);
  const validPhone = validateProfilePhone();
  const validAge = validateProfileAge();
  const isValid = validName && validPhone && validAge;
  profileUploadBtn.disabled = !isValid;
  return isValid;
}

function isProfileComplete() {
  return validateProfileForm();
}

function isProfileFormValid() {
  const name = profileFullName.value.trim();
  const phone = profilePhone.value.trim().replace(/\D/g, "");
  const age = Number(profileAge.value);

  const validName =
    name.length >= 3 && name.length <= 50 && /^[\p{L} ]+$/u.test(name);
  const validPhone = phone.length === 9 && phone.startsWith("5");
  const validAge = !Number.isNaN(age) && age >= 16 && age <= 120;

  return validName && validPhone && validAge;
}

function bindProfileUploadLink() {
  const link = document.getElementById("profileUploadLink");
  if (link)
    link.addEventListener("click", (e) => {
      e.stopPropagation();
      profileAvatarFile.click();
    });
}

function resetProfileForm() {
  profileSuccessMessage.style.display = "none";
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
  profileFullName.parentElement.classList.remove(
    "has-error",
    "has-success",
    "fullname-valid",
    "fullname-invalid",
    "email-valid",
    "email-invalid",
  );
  // Email is read-only, so always show as valid
  profileEmail.parentElement.classList.add("has-success", "email-valid");
  profileEmail.parentElement.classList.remove("has-error", "email-invalid");
  profilePhone.parentElement.classList.remove("has-error", "has-success");
  profileAge.parentElement.classList.remove("has-error", "has-success");
  profileUploadBtn.disabled = true;
  bindProfileUploadLink();
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
  const profileData = normalizeProfileData(await getProfile());
  if (!profileData) return;

  profileUsernameLabel.textContent = profileData.username || "Username";
  profileFullName.value = profileData.fullName || "";
  profileEmail.value = profileData.email || "";
  profilePhone.value = profileData.mobileNumber || "";
  profileAge.value = profileData.age ? String(profileData.age) : "";

  // Email is read-only, so always show as valid
  profileEmail.parentElement.classList.add("has-success", "email-valid");
  profileEmail.parentElement.classList.remove("has-error", "email-invalid");
  profileFullName.parentElement.classList.remove(
    "has-error",
    "has-success",
    "fullname-valid",
    "fullname-invalid",
  );

  // Sync modal avatar with header avatar
  const headerAvatar = document.querySelector(".profilepicture");
  profilePreviewImage.src = headerAvatar.src;

  if (profileData.profileComplete) {
    profileCompletionLabel.textContent = "Profile is Complete";
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
      <img src="${ev.target.result}" alt="Avatar preview"
           style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid rgba(79,70,229,1);" />
      <p class="upload-hint" style="margin-top:6px;">${file.name}</p>`;
    profilePreviewImage.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// Event listeners for profile
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
  if (e.dataTransfer.files[0]) handleProfileAvatar(e.dataTransfer.files[0]);
});
profileAvatarFile.addEventListener("change", () => {
  if (profileAvatarFile.files[0])
    handleProfileAvatar(profileAvatarFile.files[0]);
});
profileFullName.addEventListener("input", validateProfileForm);
profilePhone.addEventListener("input", validateProfileForm);
profileAge.addEventListener("change", validateProfileForm);

// Add blur event listeners for real-time validation
profileFullName.addEventListener("blur", () => validateProfileFullName());
profilePhone.addEventListener("blur", () => validateProfilePhone());
profileAge.addEventListener("blur", () => validateProfileAge());

profileUploadBtn.dataset.label = "Update Profile";

profileUploadBtn.addEventListener("click", async () => {
  if (!validateProfileForm()) return;
  profileUploadBtn.disabled = true;
  profileUploadBtn.textContent = "Uploading...";

  const result = await submitProfileUpdate();
  profileUploadBtn.disabled = false;
  profileUploadBtn.textContent = "Update Profile";

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

  profileSuccessMessage.style.display = "block";

  if (result.data.avatar) {
    const avatarUrl = appendCacheBuster(result.data.avatar);
    const headerAvatar = document.querySelector(".profilepicture");
    headerAvatar.src = avatarUrl;
    profilePreviewImage.src = avatarUrl;
  }

  await updateAuthUI(); // Update header UI
  await fillProfileForm(); // Refresh profile data in modal
  validateProfileForm(); // Update validation states and button
  setTimeout(() => {
    profileSuccessMessage.style.display = "none";
  }, 3000); // Keep success message visible longer
});
