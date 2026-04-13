(function () {
  if (window.__redberrySharedShellInitialized) return;
  window.__redberrySharedShellInitialized = true;

  function getHeaderMarkup() {
    return `
      <div class="header">
        <div class="logo"><img src="./assets/Logo.png" alt="" /></div>
        <div class="browse">
          <img class="browse-icon" src="./assets/sparkle.svg" alt="" />
          <div>Browse Courses</div>
        </div>
        <div class="buttons not-logged-in">
          <div class="login">Log In</div>
          <div class="signup">Sign Up</div>
        </div>
        <div class="browse enrolled" id="headerEnrolledCoursesLink">
          <svg
            class="browse-icon"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 7.58333V22.75M13 7.58333C13 6.43406 12.5434 5.33186 11.7308 4.5192C10.9181 3.70655 9.8159 3.25 8.66663 3.25H3.24996C2.96264 3.25 2.68709 3.36414 2.48393 3.5673C2.28076 3.77047 2.16663 4.04602 2.16663 4.33333V18.4167C2.16663 18.704 2.28076 18.9795 2.48393 19.1827C2.68709 19.3859 2.96264 19.5 3.24996 19.5H9.74996C10.6119 19.5 11.4386 19.8424 12.0481 20.4519C12.6576 21.0614 13 21.888 13 22.75M13 7.58333C13 6.43406 13.4565 5.33186 14.2692 4.5192C15.0818 3.70655 16.184 3.25 17.3333 3.25H22.75C23.0373 3.25 23.3128 3.36414 23.516 3.5673C23.7192 3.77047 23.8333 4.04602 23.8333 4.33333V18.4167C23.8333 18.704 23.7192 18.9795 23.516 19.1827C23.3128 19.3859 23.0373 19.5 22.75 19.5H16.25C15.388 19.5 14.5614 19.8424 13.9519 20.4519C13.3424 21.0614 13 21.888 13 22.75"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div>Enrolled Courses</div>
        </div>
        <div class="proficon">
          <img src="./assets/profilepic.png" alt="" class="profilepicture" />
          <img src="./assets/incomplete.png" alt="" class="complete" />
        </div>
      </div>`;
  }

  function getFooterMarkup() {
    return `
      <div class="footer" data-auth-aware-footer="true">
        <div class="lineone">
          <div class="logosfooter">
            <div class="logos">
              <img src="./assets/Logo.png" alt="" />
              <p>Bootcamp</p>
            </div>
            <div class="logotext">
              Your learning journey starts here! Browse courses to get started.
            </div>
            <div class="socials">
              <img src="./assets/Social Media.png" alt="" />
            </div>
          </div>
          <div class="lists">
            <div class="list">
              <p class="listtitle">Explore</p>
              <p id="footerBrowseCoursesLink">Browse Courses</p>
              <p id="footerEnrolledCoursesLink" hidden>Enrolled Courses</p>
            </div>
            <div class="list">
              <p class="listtitle">Account</p>
              <p id="footerProfileLink" hidden>My Profile</p>
              <p id="footerLoginLink">Log In</p>
              <p id="footerSignupLink">Sign Up</p>
            </div>
            <div class="list">
              <p class="listtitle">Contact</p>
              <div>
                <img src="./assets/mail.png" alt="" />
                <p>contact@company.com</p>
              </div>
              <div>
                <img src="./assets/phone.png" alt="" />
                <p>(+995) 555 111 222</p>
              </div>
              <div>
                <img src="./assets/location.png" alt="" />
                <p>Aghmashenebeli St.115</p>
              </div>
            </div>
          </div>
        </div>
        <div class="linetwo">
          <p class="copyright">Copyright © 2026 Redberry International</p>
          <p class="terms">
            All Rights Reserved |
            <span style="color: rgba(79, 70, 229, 1)">Terms and Conditions</span>
            | <span style="color: rgba(79, 70, 229, 1)">Privacy Policy</span>
          </p>
        </div>
      </div>`;
  }

  function getAuthModalsMarkup() {
    return `
      <div class="modal-overlay hidden" id="registerOverlay">
        <div class="createaccount" id="registerModal">
          <button class="back-btn" id="regBackBtn" aria-label="Go back">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#333"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button class="close" id="regCloseBtn" aria-label="Close">
            <img src="./assets/Vector.png" alt="X" />
          </button>
          <div class="cretebody">
            <div class="title">Create Account</div>
            <div class="text">Join and start learning today</div>
            <div class="dashes">
              <div class="dash" id="dash1"></div>
              <div class="dash" id="dash2"></div>
              <div class="dash" id="dash3"></div>
            </div>
            <div class="step" id="step1">
              <div class="emailinput">
                <label class="title" for="regEmail">Email*</label>
                <input class="input" type="email" id="regEmail" placeholder="you@example.com" autocomplete="email" />
                <span class="field-error" id="regEmailError"></span>
              </div>
              <button class="nextbutton" id="regNextBtn1">Next</button>
              <div class="or"><div class="line"></div><span>or</span><div class="line"></div></div>
              <div class="loginop">Already have an account? <span class="loginspan switch-to-login">Log In</span></div>
            </div>
            <div class="step hidden" id="step2">
              <div class="emailinput">
                <label class="title" for="regPassword">Password*</label>
                <div class="input-wrap">
                  <input class="input" type="password" id="regPassword" placeholder="Password" autocomplete="new-password" />
                  <button class="eye-btn" data-target="regPassword" type="button"><img src="./assets/open Eye.png" alt="" class="eye-icon" /></button>
                </div>
                <span class="field-error" id="regPasswordError"></span>
              </div>
              <div class="emailinput" style="margin-top: 16px">
                <label class="title" for="regConfirmPassword">Confirm Password*</label>
                <div class="input-wrap">
                  <input class="input" type="password" id="regConfirmPassword" placeholder="••••••••" autocomplete="new-password" />
                  <button class="eye-btn" data-target="regConfirmPassword" type="button"><img src="./assets/open Eye.png" alt="" class="eye-icon" /></button>
                </div>
                <span class="field-error" id="regConfirmPasswordError"></span>
              </div>
              <button class="nextbutton" id="regNextBtn2">Next</button>
              <div class="or"><div class="line"></div><span>or</span><div class="line"></div></div>
              <div class="loginop">Already have an account? <span class="loginspan switch-to-login">Log In</span></div>
            </div>
            <div class="step hidden" id="step3">
              <div class="emailinput">
                <label class="title" for="regUsername">Username*</label>
                <input class="input" type="text" id="regUsername" placeholder="Username" autocomplete="username" />
                <span class="field-error" id="regUsernameError"></span>
              </div>
              <div class="emailinput" style="margin-top: 16px">
                <label class="title">Upload Avatar</label>
                <div class="avatar-dropzone" id="avatarDropzone">
                  <input type="file" id="avatarFile" accept=".jpg,.jpeg,.png,.webp" hidden />
                  <div class="avatar-preview-area" id="avatarPreviewArea">
                    <img src="./assets/Icon.svg" alt="Upload icon" class="upload-icon" />
                    <p>Drag and drop or <span class="upload-link" id="uploadLink">Upload file</span></p>
                    <p class="upload-hint">JPG, PNG or WebP</p>
                  </div>
                </div>
                <span class="field-error" id="regAvatarError"></span>
              </div>
              <button class="nextbutton" id="regSignupBtn">Sign Up</button>
              <div class="or"><div class="line"></div><span>or</span><div class="line"></div></div>
              <div class="loginop">Already have an account? <span class="loginspan switch-to-login">Log In</span></div>
            </div>
            <div class="step hidden" id="stepSuccess">
              <div class="success-wrap">
                <div class="success-check">✓</div>
                <p class="success-title">You're in!</p>
                <p class="success-sub">Account created successfully. Welcome aboard 🎉</p>
              </div>
            </div>
            <span class="field-error" id="regGlobalError" style="text-align: center; margin-top: 8px; display: none"></span>
          </div>
        </div>
      </div>
      <div class="modal-overlay hidden" id="loginOverlay">
        <div class="createaccount" id="loginModal">
          <button class="close" id="loginCloseBtn" aria-label="Close">
            <img src="./assets/Vector.png" alt="X" />
          </button>
          <div class="cretebody">
            <div class="title">Welcome Back</div>
            <div class="text">Log in to continue your learning</div>
            <div class="login-form">
              <div class="emailinput">
                <label class="title" for="loginEmail">Email</label>
                <input class="input" type="email" id="loginEmail" placeholder="you@example.com" autocomplete="email" />
                <span class="field-error" id="loginEmailError"></span>
              </div>
              <div class="emailinput" style="margin-top: 16px">
                <label class="title" for="loginPassword">Password</label>
                <div class="input-wrap">
                  <input class="input" type="password" id="loginPassword" placeholder="••••••••" autocomplete="current-password" />
                  <button class="eye-btn" data-target="loginPassword" type="button"><img src="./assets/open Eye.png" alt="" class="eye-icon" /></button>
                </div>
                <span class="field-error" id="loginPasswordError"></span>
              </div>
              <span class="field-error" id="loginGlobalError" style="text-align: center; margin-top: 8px; display: none"></span>
              <button class="nextbutton" id="loginSubmitBtn" style="margin-top: 16px">Log In</button>
              <div class="or"><div class="line"></div><span>or</span><div class="line"></div></div>
              <div class="loginop">Don't have an account? <span class="loginspan switch-to-register">Sign Up</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-overlay hidden" id="profileOverlay">
        <div class="createaccount" id="profileModal">
          <button class="close" id="profileCloseBtn" aria-label="Close">
            <img src="./assets/Vector.png" alt="X" />
          </button>
          <div class="cretebody">
            <div class="title">Profile</div>
            <div class="profile-summary">
              <div class="surati">
                <img src="./assets/profilepic.png" alt="Profile" class="profilepicture profile-preview" />
                <img src="./assets/incomplete.png" alt="Status" class="complete profile-status-icon" />
              </div>
              <div class="profile-summary-body">
                <div id="profileUsername" class="profile-name">Username</div>
                <div id="profileCompletion" class="profile-completion status-incomplete">Profile not completed</div>
              </div>
            </div>
            <div class="profile-form">
              <div class="emailinput profile-fullname-field">
                <label class="title" for="profileFullName">Full Name</label>
                <div class="input-wrap">
                  <input class="input" type="text" id="profileFullName" placeholder="Full Name" autocomplete="name" />
                  <img class="field-check-icon" src="./assets/check1.svg" alt="" />
                </div>
                <span class="field-error" id="profileFullNameError"></span>
              </div>
              <div class="emailinput profile-email-field" style="margin-top: 16px">
                <label class="title" for="profileEmail">Email</label>
                <div class="input-wrap">
                  <input class="input" type="email" id="profileEmail" placeholder="you@example.com" autocomplete="email" readonly />
                  <img class="field-check-icon" src="./assets/check.svg" alt="" />
                </div>
                <span class="field-error" id="profileEmailError"></span>
              </div>
              <div class="field-row" style="margin-top: 16px">
                <div class="emailinput profile-phone-field">
                  <label class="title" for="profilePhone">Mobile Number</label>
                  <div class="input-wrap input-wrap--phone">
                    <span class="phone-prefix">+995</span>
                    <input class="input" type="tel" id="profilePhone" placeholder="Phone number" autocomplete="tel" inputmode="numeric" />
                    <img class="field-check-icon" src="./assets/check1.svg" alt="" />
                  </div>
                  <span class="field-error" id="profilePhoneError"></span>
                </div>
                <div class="emailinput profile-age-field">
                  <label class="title" for="profileAge">Age</label>
                  <select class="input profile-age-select" id="profileAge">
                    <option value="">Select age</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="35">35</option><option value="40">40</option><option value="45">45</option><option value="50">50</option><option value="55">55</option><option value="60">60</option><option value="65">65</option><option value="70">70</option><option value="75">75</option><option value="80">80</option><option value="85">85</option><option value="90">90</option><option value="95">95</option><option value="100">100</option><option value="105">105</option><option value="110">110</option><option value="115">115</option><option value="120">120</option>
                  </select>
                  <button
                    class="profile-age-dropdown__trigger"
                    id="profileAgeTrigger"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded="false"
                    aria-controls="profileAgeMenu"
                  >
                    <span class="profile-age-dropdown__value is-placeholder" id="profileAgeValue">Select age</span>
                    <img src="./assets/dropdown.svg" alt="" class="profile-age-dropdown__icon" />
                  </button>
                  <div class="profile-age-dropdown__menu" id="profileAgeMenu" role="listbox"></div>
                  <span class="field-error" id="profileAgeError"></span>
                </div>
              </div>
              <div class="emailinput" style="margin-top: 16px">
                <label class="title">Upload Avatar</label>
                <div class="avatar-dropzone" id="profileAvatarDropzone">
                  <input type="file" id="profileAvatarFile" accept=".jpg,.jpeg,.png,.webp" hidden />
                  <div class="avatar-preview-area" id="profileAvatarPreviewArea">
                    <img src="./assets/Icon.svg" alt="Upload icon" class="upload-icon" />
                    <p>Drag and drop or <span class="upload-link" id="profileUploadLink">Upload file</span></p>
                    <p class="upload-hint">JPG, PNG or WebP</p>
                  </div>
                </div>
                <span class="field-error" id="profileAvatarError"></span>
              </div>
              <button class="nextbutton" id="profileUploadBtn" style="margin-top: 16px">Save Profile</button>
              <span id="profileGlobalError" class="field-error" style="display: none; text-align: center; margin-top: 12px; width: 100%"></span>
              <div id="profileSuccessMessage" class="profile-success" style="display: none; margin-top: 12px; text-align: center">Profile updated successfully ✓</div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderHeader() {
    const mount = document.getElementById("sharedHeader");
    if (mount) {
      mount.outerHTML = getHeaderMarkup();
      return;
    }

    document.body.insertAdjacentHTML("afterbegin", getHeaderMarkup());
  }

  function renderFooter() {
    const mount = document.getElementById("sharedFooter");
    if (mount) {
      mount.outerHTML = getFooterMarkup();
      return;
    }

    document.body.insertAdjacentHTML("beforeend", getFooterMarkup());
  }

  function renderAuthModals() {
    ["registerOverlay", "loginOverlay", "profileOverlay"].forEach((id) => {
      document.getElementById(id)?.remove();
    });

    const mount = document.getElementById("sharedAuthModals");
    if (mount) {
      mount.innerHTML = getAuthModalsMarkup();
      return;
    }

    document.body.insertAdjacentHTML("beforeend", getAuthModalsMarkup());
  }

  function renderSharedShell() {
    if (!document.body) return;
    renderHeader();
    renderFooter();
    renderAuthModals();
  }

  renderSharedShell();
})();
