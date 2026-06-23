import { aboutGalleryData } from "../constants/aboutGallery.js";

const aboutGalleryWrapper = document.getElementById("aboutGalleryTrack");

export const aboutGallery = () => {
  if (!aboutGalleryWrapper || !aboutGalleryData?.length) return;

  aboutGalleryWrapper.innerHTML = aboutGalleryData
    .map(
      (image) => `
            <img
              src="${image.image}"
              loading="lazy"
              decoding="async"
              class="about-gallery-image h-56 min-w-[82%] rounded-3xl object-cover sm:min-w-[48%] lg:min-w-[31%]"
              alt="Bright dental chair and clinic room"
              data-i18n-alt="alt.room"
            />`,
    )
    .join("");
};
