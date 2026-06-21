export const updateVideoCards = (videos) => {
  document.querySelectorAll("[data-video-index]").forEach((card) => {
    const video = videos[Number(card.dataset.videoIndex)];
    if (!video) return;

    const poster = card.querySelector("[data-video-poster]");
    const title = card.querySelector("[data-video-title]");
    const text = card.querySelector("[data-video-text]");

    if (poster) poster.alt = video.title;
    if (title) title.textContent = video.title;
    if (text) text.textContent = video.text;
  });
};
