"use strict";

// Keep the portfolio's sliding navigation treatment, with section-aware links.
const navigationLinks = [...document.querySelectorAll(".nav-tabs .tab")];
const navigationSections = navigationLinks.map((link) =>
  document.querySelector(link.hash),
);
function updateNavigation() {
  const threshold =
    document.querySelector("header").getBoundingClientRect().height + 65;
  let current = navigationSections[0];
  for (const section of navigationSections) {
    if (section.getBoundingClientRect().top <= threshold) current = section;
  }
  navigationLinks.forEach((link) => {
    const active = link.hash === `#${current.id}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
let navigationFrame = false;
window.addEventListener(
  "scroll",
  () => {
    if (navigationFrame) return;
    navigationFrame = true;
    requestAnimationFrame(() => {
      updateNavigation();
      navigationFrame = false;
    });
  },
  { passive: true },
);
window.addEventListener("resize", updateNavigation);
updateNavigation();
document.querySelector("#year").textContent = new Date().getFullYear();

// Dialogs keep focus on the page that opened them and support Escape natively.
const galleryDialog = document.querySelector("#gallery-dialog");
const returnFocus = new WeakMap();
function openDialog(dialog, trigger) {
  returnFocus.set(dialog, trigger);
  dialog.showModal();
}
document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});
[galleryDialog].forEach((dialog) => {
  dialog.addEventListener("close", () => {
    returnFocus.get(dialog)?.focus();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
});

// Local photo gallery: filtering, a lightbox and keyboard navigation.
const galleryItems = [...document.querySelectorAll("[data-gallery-item]")];
const galleryImage = document.querySelector("#gallery-full-image");
let currentPhoto = 0;
let visiblePhotos = galleryItems;
function showPhoto(index) {
  currentPhoto = (index + visiblePhotos.length) % visiblePhotos.length;
  const photo = visiblePhotos[currentPhoto];
  galleryImage.src = photo.href;
  galleryImage.alt = photo.querySelector("img").alt;
  document.querySelector("#gallery-caption").textContent =
    photo.dataset.caption;
  document.querySelector("#gallery-count").textContent =
    `${currentPhoto + 1} of ${visiblePhotos.length}`;
  document.querySelector("#gallery-previous").disabled =
    visiblePhotos.length < 2;
  document.querySelector("#gallery-next").disabled = visiblePhotos.length < 2;
}
galleryItems.forEach((photo) => {
  photo.addEventListener("click", (event) => {
    event.preventDefault();
    showPhoto(visiblePhotos.indexOf(photo));
    openDialog(galleryDialog, photo);
  });
});
document.querySelectorAll("[data-gallery-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-gallery-filter]")
      .forEach((filter) =>
        filter.setAttribute("aria-pressed", String(filter === button)),
      );
    galleryItems.forEach((photo) => {
      photo.hidden =
        button.dataset.galleryFilter !== "all" &&
        photo.dataset.category !== button.dataset.galleryFilter;
    });
    visiblePhotos = galleryItems.filter((photo) => !photo.hidden);
    document.querySelector(".gallery-status").textContent =
      `Showing ${visiblePhotos.length} ${visiblePhotos.length === 1 ? "photo" : "photos"}.`;
  });
});
document
  .querySelector("#gallery-previous")
  .addEventListener("click", () => showPhoto(currentPhoto - 1));
document
  .querySelector("#gallery-next")
  .addEventListener("click", () => showPhoto(currentPhoto + 1));
galleryDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(currentPhoto + 1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showPhoto(currentPhoto - 1);
  }
});

// Gentle reveals are progressive enhancement; reduced motion stays static.
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let revealObserver;
function setupMotion() {
  revealObserver?.disconnect();
  document.documentElement.classList.toggle(
    "motion-enabled",
    !motionQuery.matches,
  );
  if (motionQuery.matches || !("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".reveal")
      .forEach((element) => element.classList.add("is-visible"));
    return;
  }
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => revealObserver.observe(element));
}
motionQuery.addEventListener("change", setupMotion);
setupMotion();
