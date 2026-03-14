const sequence = [
  {
    type: "image",
    src: "img/img1.jpg",
    alt: "Foto 1"
  },
  {
    type: "text",
    main: "La sospensione della realtà",
    sub: "Gaza , October 2025 - Ph. Hosny Salah"
  },
  {
    type: "image",
    src: "img/img4.jpg",
    alt: "Foto 2"
  },
  {
    type: "text",
    main: "La resistenza del futuro",
    sub: "Khan Yunis, May 2025 - Ph. Hosny Salah"
  },
  {
    type: "image",
    src: "img/img7.jpg",
    alt: "Foto 3"
  },
  {
    type: "text",
    main: "La sacralità dei piccoli gesti",
    sub: "Gaza, July 2024 - Ph. Hosny Salah"
  },
  {
    type: "image",
    src: "img/img3.jpg",
    alt: "Foto 3"
  },
  {
    type: "text",
    main: "Il peso della responsabilità",
    sub: "Khan Yunis, September 2025 - Ph. Hosny Salah"
  },
  {
    type: "image",
    src: "img/img7.jpg",
    alt: "Foto 3"
    },
  {
    type: "text",
    main: "La resistenza del futuro",
    sub: "Khan Yunis, May 2025 - Ph. Hosny Salah"
  },
  {
    type: "image",
    src: "img/img7.jpg",
    alt: "Foto 3"
  },
  {
    type: "text",
    main: "La resistenza del futuro",
    sub: "Khan Yunis, May 2025 - Ph. Hosny Salah"
  }
];

const LOCK_DURATION = 5000;

const page = document.body;
const imageView = document.getElementById("imageView");
const textView = document.getElementById("textView");
const mainImage = document.getElementById("mainImage");
const slideMain = document.getElementById("slideMain");
const slideSub = document.getElementById("slideSub");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
let isLocked = true;
let animationFrameId = null;
let lockStartTime = null;

function setMode(mode) {
  page.classList.remove("mode-image", "mode-text");
  page.classList.add(mode === "text" ? "mode-text" : "mode-image");
}

function renderStep(index) {
  const item = sequence[index];

  imageView.classList.remove("is-visible");
  textView.classList.remove("is-visible");

  if (item.type === "image") {
    setMode("image");
    mainImage.src = item.src;
    mainImage.alt = item.alt || "Immagine";
    imageView.classList.add("is-visible");
  } else if (item.type === "text") {
    setMode("text");
    slideMain.textContent = item.main || "";
    slideSub.textContent = item.sub || "";
    textView.classList.add("is-visible");
  }
}

function updateButtons() {
  prevBtn.disabled = isLocked || currentIndex === 0;
  nextBtn.disabled = isLocked || currentIndex === sequence.length - 1;
}

function unlockNavigation() {
  isLocked = false;
  progressBar.style.width = "100%";
  updateButtons();
}

function animateProgress(timestamp) {
  if (lockStartTime === null) {
    lockStartTime = timestamp;
  }

  const elapsed = timestamp - lockStartTime;
  const progress = Math.min(elapsed / LOCK_DURATION, 1);

  progressBar.style.width = `${progress * 100}%`;

  if (progress < 1) {
    animationFrameId = requestAnimationFrame(animateProgress);
  } else {
    unlockNavigation();
  }
}

function lockNavigation() {
  isLocked = true;
  lockStartTime = null;
  progressBar.style.width = "0%";
  updateButtons();

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  animationFrameId = requestAnimationFrame(animateProgress);
}

function goToStep(index) {
  if (index < 0 || index >= sequence.length) return;
  currentIndex = index;
  renderStep(currentIndex);
  lockNavigation();
}

prevBtn.addEventListener("click", () => {
  if (isLocked) return;
  goToStep(currentIndex - 1);
});

nextBtn.addEventListener("click", () => {
  if (isLocked) return;
  goToStep(currentIndex + 1);
});

window.addEventListener(
  "keydown",
  (event) => {
    const blockedKeys = [
      "ArrowRight",
      "ArrowLeft",
      "ArrowUp",
      "ArrowDown",
      "PageDown",
      "PageUp",
      " "
    ];

    if (blockedKeys.includes(event.key)) {
      event.preventDefault();
    }

    if (isLocked) return;

    if (event.key === "ArrowRight" || event.key === "PageDown") {
      goToStep(currentIndex + 1);
    }

    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      goToStep(currentIndex - 1);
    }
  },
  { passive: false }
);

window.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
  },
  { passive: false }
);

renderStep(currentIndex);
lockNavigation();