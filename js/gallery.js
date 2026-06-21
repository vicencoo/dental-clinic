import { gallery } from "../src/constants/gallery.js";
import { observeRevealItems } from "../utils/observeRevealItems.js";

const galleryWrapper = document.getElementById("gallery-wrapper");
const videoModal = document.getElementById("videoModal");
const modalImage = document.getElementById("modalImage");

export const renderImages = () => {
  if (!galleryWrapper) return;

  galleryWrapper.innerHTML = gallery
    .map(
      (image) => `
        <img
          src="${image.src}"
          loading="lazy"
          decoding="async"
          class="reveal h-80 w-full rounded-4xl object-cover shadow-lg cursor-zoom-in transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02] will-change-transform ${image.lower ? "md:mt-10" : ""}"
          alt="${image.alt}"
          data-i18n-alt="alt.tools"
          data-image-id="${image.id}"
        />
      `,
    )
    .join("");

  observeRevealItems(galleryWrapper.querySelectorAll(".reveal"));

  document.querySelectorAll("[data-image-id]").forEach((img) => {
    img.addEventListener("click", () => {
      const image = gallery.find(
        (item) => item.id === Number(img.dataset.imageId),
      );
      modalImage.classList.remove("hidden");
      modalImage.src = image.src;
      videoModal.classList.remove("hidden");
      videoModal.classList.add("flex");
    });
  });
};
