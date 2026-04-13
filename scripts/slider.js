const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const next = document.querySelector(".arrow.right");
const prev = document.querySelector(".arrow.left");
const slideButtons = document.querySelectorAll(".slide .content button");

let index = 0;

function updateArrowState() {
  prev.classList.toggle("disabled", index === 0);
  next.classList.toggle("disabled", index === slides.length - 1);
}

function showSlide(i) {
  slides.forEach((s) => s.classList.remove("active"));
  dots.forEach((d) => d.classList.remove("active"));

  slides[i].classList.add("active");
  dots[i].classList.add("active");
  updateArrowState();
}

next.onclick = () => {
  if (index >= slides.length - 1) return;
  index++;
  showSlide(index);
};

prev.onclick = () => {
  if (index <= 0) return;
  index--;
  showSlide(index);
};

function openContinueLearning() {
  const continueLearningSection = document.querySelector(
    ".startlearning.continue",
  );

  if (
    continueLearningSection &&
    !continueLearningSection.hidden &&
    typeof continueLearningSection.scrollIntoView === "function"
  ) {
    continueLearningSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    return;
  }

  if (typeof window.openEnrolledCoursesModal === "function") {
    window.openEnrolledCoursesModal();
    return;
  }

  if (typeof window.openLogin === "function") {
    window.openLogin();
  }
}

function openFeaturedCourses() {
  const featuredSection = document
    .getElementById("featuredCoursesCards")
    ?.closest(".startlearning");

  if (featuredSection && typeof featuredSection.scrollIntoView === "function") {
    featuredSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    return;
  }

  if (typeof window.openBrowseCourses === "function") {
    window.openBrowseCourses();
  }
}

slideButtons[0]?.addEventListener("click", () => {
  if (typeof window.openBrowseCourses === "function") {
    window.openBrowseCourses();
  }
});

slideButtons[1]?.addEventListener("click", () => {
  openContinueLearning();
});

slideButtons[2]?.addEventListener("click", () => {
  openFeaturedCourses();
});

showSlide(index);
