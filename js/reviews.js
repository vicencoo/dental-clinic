const reviewsTrack = document.querySelector("#reviewsTrack");
const reviewsDots = document.querySelector("#reviewsDots");
const reviewsPrev = document.querySelector("#reviewsPrev");
const reviewsNext = document.querySelector("#reviewsNext");
const reviewsCarousel = document.querySelector("#reviewsCarousel");
let activeReviewIndex = 1;
let swipeStartX = 0;
let swipeDeltaX = 0;
let reviewAnimationTimeout;

let currentReviews = [];
let currentTranslate = (key) => key;

export const setReviewsData = (reviews, translate) => {
  currentReviews = reviews;
  currentTranslate = translate;
  activeReviewIndex = wrapIndex(activeReviewIndex);
};

const wrapIndex = (index) => {
  if (!currentReviews.length) return 0;
  return (index + currentReviews.length) % currentReviews.length;
};

const reviewCardTemplate = (review, position) => {
  const isMain = position === "main";
  const sizeClasses = isMain
    ? "min-h-72 scale-100 bg-white/10 p-9 shadow-2xl shadow-black/20 md:min-h-86 md:p-10"
    : "hidden min-h-64 scale-[0.94] bg-white/4 p-7 opacity-80 md:block md:min-h-70";
  const textClasses = isMain
    ? "text-lg leading-8 text-white/90"
    : "text-base leading-7 text-white/70";

  return `
    <article class="review-card rounded-3xl border border-white/10 ${sizeClasses} backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-[#c9a47a]/40">
      <div class="flex items-center justify-between gap-4">
       <p class="text-[#c9a47a]" aria-label="${review.rating} ${currentTranslate("reviews.star")}">
        ${"★".repeat(review.rating)}
        </p>
        <span class="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/55">${review.treatment}</span>
      </div>
      <p class="mt-6 ${textClasses}">${review.text}</p>
      <div class="mt-8 flex items-center gap-3">
        <div class="grid h-11 w-11 place-items-center rounded-full bg-[#c9a47a] font-serif text-lg text-[#0d2430]">${review.name.charAt(0)}</div>
        <div>
          <h4 class="font-semibold text-white">${review.name}</h4>
          <p class="text-xs uppercase tracking-widest text-white/45">
            ${currentTranslate("reviews.verified")}
          </p>
        </div>
      </div>
    </article>
  `;
};

const animateReviews = (direction) => {
  if (!reviewsTrack || !direction) return;

  reviewsTrack.classList.remove("reviews-animate-next", "reviews-animate-prev");
  void reviewsTrack.offsetWidth;
  reviewsTrack.classList.add(
    direction > 0 ? "reviews-animate-next" : "reviews-animate-prev",
  );

  window.clearTimeout(reviewAnimationTimeout);
  reviewAnimationTimeout = window.setTimeout(() => {
    reviewsTrack.classList.remove(
      "reviews-animate-next",
      "reviews-animate-prev",
    );
  }, 620);
};

export const renderReviews = (direction = 0) => {
  if (!reviewsTrack || !reviewsDots || !currentReviews.length) return;

  const previous = currentReviews[wrapIndex(activeReviewIndex - 1)];
  const active = currentReviews[wrapIndex(activeReviewIndex)];
  const next = currentReviews[wrapIndex(activeReviewIndex + 1)];

  reviewsTrack.innerHTML = [
    reviewCardTemplate(previous, "side"),
    reviewCardTemplate(active, "main"),
    reviewCardTemplate(next, "side"),
  ].join("");

  reviewsDots.innerHTML = currentReviews
    .map(
      (_, index) => `
        <button
          class="h-2.5 rounded-full transition ${index === activeReviewIndex ? "w-8 bg-[#c9a47a]" : "w-2.5 bg-white/25 hover:bg-white/45"}"
          type="button"
          aria-label="${currentTranslate("reviews.show")} ${index + 1}"
          data-review-dot="${index}"
        ></button>
      `,
    )
    .join("");

  reviewsDots.querySelectorAll("[data-review-dot]").forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetIndex = Number(dot.dataset.reviewDot);
      if (targetIndex === activeReviewIndex) return;

      const directDistance = targetIndex - activeReviewIndex;

      const wrappedDistance =
        Math.abs(directDistance) > currentReviews.length / 2
          ? directDistance > 0
            ? directDistance - currentReviews.length
            : directDistance + currentReviews.length
          : directDistance;

      activeReviewIndex = targetIndex;
      renderReviews(wrappedDistance > 0 ? 1 : -1);
    });
  });

  animateReviews(direction);
};

const showReview = (direction) => {
  activeReviewIndex = wrapIndex(activeReviewIndex + direction);
  renderReviews(direction);
};

reviewsPrev?.addEventListener("click", () => showReview(-1));
reviewsNext?.addEventListener("click", () => showReview(1));

reviewsCarousel?.addEventListener("pointerdown", (event) => {
  swipeStartX = event.clientX;
  swipeDeltaX = 0;
  reviewsCarousel.setPointerCapture(event.pointerId);
});

reviewsCarousel?.addEventListener("pointermove", (event) => {
  if (!swipeStartX) return;
  swipeDeltaX = event.clientX - swipeStartX;
});

reviewsCarousel?.addEventListener("pointerup", (event) => {
  reviewsCarousel.releasePointerCapture(event.pointerId);
  if (Math.abs(swipeDeltaX) > 45) {
    showReview(swipeDeltaX < 0 ? 1 : -1);
  }
  swipeStartX = 0;
  swipeDeltaX = 0;
});

reviewsCarousel?.addEventListener("pointercancel", () => {
  swipeStartX = 0;
  swipeDeltaX = 0;
});
