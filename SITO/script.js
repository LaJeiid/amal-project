const images = [
  { src: "https://picsum.photos/id/1015/1200/800", alt: "Immagine 1" },
  { src: "https://picsum.photos/id/1025/1200/800", alt: "Immagine 2" },
  { src: "https://picsum.photos/id/1035/1200/800", alt: "Immagine 3" }
];

const LOCK_DURATION = 5000;

const mainImage = document.getElementById("mainImage");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
let isLocked = true;
let animationFrameId = null;
let lockStartTime = null;

function renderImage(index) {
  const item = images[index];
  mainImage.src = item.src;
  mainImage.alt = item.alt;
}

function updateButtons() {
  prevBtn.disabled = isLocked || currentIndex === 0;
  nextBtn.disabled = isLocked || currentIndex === images.length - 1;
}

function unlockNavigation() {
  isLocked = false;
  progressBar.style.width = "100%";
  updateButtons();
}

function animateProgress(timestamp) {
  if (!lockStartTime) {
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

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  animationFrameId = requestAnimationFrame(animateProgress);
}

function goToImage(index) {
  if (index < 0 || index >= images.length) return;
  currentIndex = index;
  renderImage(currentIndex);
  lockNavigation();
}

prevBtn.addEventListener("click", () => {
  if (isLocked) return;
  goToImage(currentIndex - 1);
});

nextBtn.addEventListener("click", () => {
  if (isLocked) return;
  goToImage(currentIndex + 1);
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
      goToImage(currentIndex + 1);
    }

    if (event.key === "ArrowLeft" || event.key === "PageUp") {
      goToImage(currentIndex - 1);
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

renderImage(currentIndex);
lockNavigation();