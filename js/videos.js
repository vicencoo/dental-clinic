import { updateVideoCards } from "../utils/updateVideoCards.js";

const videosWrapper = document.getElementById("videos-wrapper");
const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");

export const renderVideos = (videos) => {
  if (!videosWrapper) return;

  if (videosWrapper.children.length) {
    updateVideoCards(videos);
    return;
  }

  videosWrapper.innerHTML = videos
    .map(
      (video, index) => `
        <button
          type="button"
          class="group overflow-hidden rounded-4xl bg-white p-3 text-left shadow-xl shadow-[#0d2430]/10 ring-1 ring-[#0d2430]/5 transition hover:-translate-y-1"
          data-video-index="${index}"
        >
          <div class="relative h-64 overflow-hidden rounded-3xl bg-[#0d2430]">
            <img
              src="${video.poster}"
              alt="${video.title}"
              loading="lazy"
              decoding="async"
              data-video-poster
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />

            <div class="absolute inset-0 bg-[#0d2430]/25"></div>

            <div class="absolute inset-0 grid place-items-center">
              <div class="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-2xl text-[#0d2430] shadow-xl">
                ▶
              </div>
            </div>
          </div>

          <div class="flex h-28 flex-col justify-between p-4">
            <h3 class="font-serif text-xl" data-video-title>${video.title}</h3>
            <p class="mt-2 text-sm leading-6 text-[#65757b]" data-video-text>
              ${video.text}
            </p>
          </div>
        </button>
      `,
    )
    .join("");

  document.querySelectorAll("[data-video-index]").forEach((card) => {
    card.addEventListener("click", () => {
      const video = videos[Number(card.dataset.videoIndex)];

      modalVideo.classList.remove("hidden");
      modalVideo.src = video.videoSrc;
      modalVideo.muted = true;
      modalVideo.volume = 0;
      videoModal.classList.remove("hidden");
      videoModal.classList.add("flex");
      modalVideo.play();
    });
  });
};
