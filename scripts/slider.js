const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const next = document.querySelector(".arrow.right");
const prev = document.querySelector(".arrow.left");

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

showSlide(index);
