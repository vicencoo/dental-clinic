const videoAssets = [
  {
    id: 1,
    poster: "/public/images/dental-9.webp",
    videoSrc: "/public/videos/video-1.mp4",
  },
  {
    id: 2,
    poster: "/public/images/dental-10.png",
    videoSrc: "/public/videos/video-2.mp4",
  },
  {
    id: 3,
    poster: "/public/images/dental-11.webp",
    videoSrc: "/public/videos/video-3.mp4",
  },
  {
    id: 4,
    poster: "/public/images/dental-12.webp",
    videoSrc: "/public/videos/video-4.mp4",
  },
  {
    id: 5,
    poster: "/public/images/dental-8.webp",
    videoSrc: "/public/videos/video-5.mp4",
  },
  {
    id: 6,
    poster: "/public/images/dental-2.webp",
    videoSrc: "/public/videos/video-2.mp4",
  },
];

const translations = window.LOTUS_TRANSLATIONS || {};
let currentLanguage = localStorage.getItem("luminaLanguage") || "sq";
let reviews = [];
let videos = [];

const revealItems = document.querySelectorAll(".reveal");
const videosWrapper = document.getElementById("videos-wrapper");
const languageSelector = document.getElementById("languageSelector");
const languageToggle = document.getElementById("languageToggle");
const languageMenu = document.getElementById("languageMenu");
const languageFlag = document.getElementById("languageFlag");
const languageCode = document.getElementById("languageCode");
const languageOptions = document.querySelectorAll("[data-language]");

const languageMeta = {
  sq: { code: "SQ", flag: "🇦🇱" },
  en: { code: "EN", flag: "🇬🇧" },
  it: { code: "IT", flag: "🇮🇹" },
};

const translate = (key) =>
  translations[currentLanguage]?.[key] || translations.en[key] || key;

const closeLanguageMenu = () => {
  languageMenu?.classList.add("hidden");
  languageToggle?.setAttribute("aria-expanded", "false");
};

const openLanguageMenu = () => {
  languageMenu?.classList.remove("hidden");
  languageToggle?.setAttribute("aria-expanded", "true");
};

const toggleLanguageMenu = () => {
  if (languageMenu?.classList.contains("hidden")) {
    openLanguageMenu();
  } else {
    closeLanguageMenu();
  }
};

const updateLanguageButton = () => {
  const meta = languageMeta[currentLanguage] || languageMeta.en;

  if (languageFlag) {
    languageFlag.textContent = meta.flag;
  }

  if (languageCode) {
    languageCode.textContent = meta.code;
  }

  languageOptions.forEach((option) => {
    const isSelected = option.dataset.language === currentLanguage;
    option.setAttribute("aria-selected", String(isSelected));
    option.classList.toggle("bg-[#f8f3ee]", isSelected);
    option.classList.toggle("text-[#b78148]", isSelected);
  });
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          window.setTimeout(
            () => {
              entry.target.style.transitionDelay = "0ms";
            },
            Number(entry.target.dataset.revealDelay || 0) + 750,
          );
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((item, index) => {
    const delay = Math.min(index % 4, 3) * 90;
    item.dataset.revealDelay = String(delay);
    item.style.transitionDelay = `${delay}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const reviewsTrack = document.querySelector("#reviewsTrack");
const reviewsDots = document.querySelector("#reviewsDots");
const reviewsPrev = document.querySelector("#reviewsPrev");
const reviewsNext = document.querySelector("#reviewsNext");
const reviewsCarousel = document.querySelector("#reviewsCarousel");
let activeReviewIndex = 1;
let swipeStartX = 0;
let swipeDeltaX = 0;
let reviewAnimationTimeout;

const wrapIndex = (index) => (index + reviews.length) % reviews.length;

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
        <p class="text-[#c9a47a]" aria-label="${review.rating} ${translate("reviews.star")}">${"★".repeat(review.rating)}</p>
        <span class="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/55">${review.treatment}</span>
      </div>
      <p class="mt-6 ${textClasses}">${review.text}</p>
      <div class="mt-8 flex items-center gap-3">
        <div class="grid h-11 w-11 place-items-center rounded-full bg-[#c9a47a] font-serif text-lg text-[#0d2430]">${review.name.charAt(0)}</div>
        <div>
          <h4 class="font-semibold text-white">${review.name}</h4>
          <p class="text-xs uppercase tracking-widest text-white/45">${translate("reviews.verified")}</p>
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

const renderReviews = (direction = 0) => {
  if (!reviewsTrack || !reviewsDots) return;

  const previous = reviews[wrapIndex(activeReviewIndex - 1)];
  const active = reviews[wrapIndex(activeReviewIndex)];
  const next = reviews[wrapIndex(activeReviewIndex + 1)];

  reviewsTrack.innerHTML = [
    reviewCardTemplate(previous, "side"),
    reviewCardTemplate(active, "main"),
    reviewCardTemplate(next, "side"),
  ].join("");

  reviewsDots.innerHTML = reviews
    .map(
      (_, index) => `
        <button
          class="h-2.5 rounded-full transition ${index === activeReviewIndex ? "w-8 bg-[#c9a47a]" : "w-2.5 bg-white/25 hover:bg-white/45"}"
          type="button"
          aria-label="${translate("reviews.show")} ${index + 1}"
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
        Math.abs(directDistance) > reviews.length / 2
          ? directDistance > 0
            ? directDistance - reviews.length
            : directDistance + reviews.length
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

const renderVideos = () => {
  if (!videosWrapper) return;

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
            <h3 class="font-serif text-xl">${video.title}</h3>
            <p class="mt-2 text-sm leading-6 text-[#65757b]">
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

      modalVideo.src = video.videoSrc;
      videoModal.classList.remove("hidden");
      videoModal.classList.add("flex");
      modalVideo.play();
    });
  });
};

const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const closeVideoModal = document.getElementById("closeVideoModal");

closeVideoModal?.addEventListener("click", () => {
  modalVideo.pause();
  modalVideo.src = "";
  videoModal.classList.add("hidden");
  videoModal.classList.remove("flex");
});

const applyLanguage = (language) => {
  currentLanguage = translations[language] ? language : "en";
  const dictionary = translations[currentLanguage];

  document.documentElement.lang = currentLanguage;
  document.title = translate("meta.title");
  localStorage.setItem("luminaLanguage", currentLanguage);

  updateLanguageButton();

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent =
      dictionary[element.dataset.i18n] || element.textContent;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder =
      dictionary[element.dataset.i18nPlaceholder] || element.placeholder;
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.alt = dictionary[element.dataset.i18nAlt] || element.alt;
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute(
      "aria-label",
      dictionary[element.dataset.i18nAriaLabel] ||
        element.getAttribute("aria-label"),
    );
  });

  document.querySelectorAll("[data-i18n-value]").forEach((element) => {
    element.value = dictionary[element.dataset.i18nValue] || element.value;
  });

  reviews = dictionary.reviews;
  videos = videoAssets.map((asset, index) => ({
    ...asset,
    title: dictionary.videos[index]?.[0] || "",
    text: dictionary.videos[index]?.[1] || "",
  }));

  activeReviewIndex = wrapIndex(activeReviewIndex);
  renderReviews();
  renderVideos();
};

languageToggle?.addEventListener("click", toggleLanguageMenu);

languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    applyLanguage(option.dataset.language);
    closeLanguageMenu();
  });
});

document.addEventListener("click", (event) => {
  if (!languageSelector?.contains(event.target)) {
    closeLanguageMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLanguageMenu();
  }
});

applyLanguage(currentLanguage);
