import { videoAssets } from "../constants/videoAssets.js";
import { aboutGallery } from "./aboutGallery.js";
import { renderImages } from "./gallery.js";
import { renderReviews, setReviewsData } from "./reviews.js";
import { servicesJs } from "./services.js";
import { renderVideos } from "./videos.js";

const translations = window.LOTUS_TRANSLATIONS || {};
const urlLanguage = new URLSearchParams(window.location.search).get("lang");
let currentLanguage = translations[urlLanguage]
  ? urlLanguage
  : localStorage.getItem("luminaLanguage") || "sq";
let reviews = [];
let videos = [];

const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const i18nPlaceholderElements = document.querySelectorAll(
  "[data-i18n-placeholder]",
);
const i18nAltElements = document.querySelectorAll("[data-i18n-alt]");
const i18nAriaLabelElements = document.querySelectorAll(
  "[data-i18n-aria-label]",
);
const i18nValueElements = document.querySelectorAll("[data-i18n-value]");
const languageSelector = document.getElementById("languageSelector");
const languageToggle = document.getElementById("languageToggle");
const languageMenu = document.getElementById("languageMenu");
const languageFlag = document.getElementById("languageFlag");
const languageCode = document.getElementById("languageCode");
const languageOptions = document.querySelectorAll("[data-language]");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuLinks = document.querySelectorAll("#mobileMenu a");
const navLinks = document.querySelectorAll("[data-nav-section]");
const navSections = document.querySelectorAll(
  "#top, #about, #services, #gallery, #reviews, #contact",
);
const backToTopButton = document.getElementById("backToTopButton");
const whatsappButton = document.getElementById("whatsappButton");
const aboutGalleryTrack = document.getElementById("aboutGalleryTrack");
const aboutGalleryPrev = document.querySelector("[data-about-gallery-prev]");
const aboutGalleryNext = document.querySelector("[data-about-gallery-next]");

const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const modalImage = document.getElementById("modalImage");
const closeVideoModal = document.getElementById("closeVideoModal");

const languageMeta = {
  sq: { code: "SQ", flag: "🇦🇱" },
  en: { code: "EN", flag: "🇬🇧" },
  it: { code: "IT", flag: "🇮🇹" },
  fr: { code: "FR", flag: "FR" },
};

languageMeta.es = { code: "ES", flag: "ES" };
languageMeta.de = { code: "DE", flag: "DE" };

const languageFlagImages = {
  sq: "/public/flags/albania.png",
  en: "/public/flags/english.png",
  it: "/public/flags/italian.png",
  fr: "/public/flags/france.png",
  es: "/public/flags/spain.png",
  de: "/public/flags/german.png",
};

const languageLocales = {
  sq: "sq_AL",
  en: "en_US",
  it: "it_IT",
  fr: "fr_FR",
  es: "es_ES",
  de: "de_DE",
};

const siteUrl = "https://www.lotusdentalclinic.al/";

const translate = (key) =>
  translations[currentLanguage]?.[key] || translations.en[key] || key;

const translateEnglish = (key) => translations.en?.[key] || key;

const closeLanguageMenu = () => {
  if (languageMenu?.classList.contains("hidden")) return;

  languageMenu?.classList.add("hidden");
  languageToggle?.setAttribute("aria-expanded", "false");
};

const openLanguageMenu = () => {
  if (!languageMenu?.classList.contains("hidden")) return;

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

const closeMobileMenu = () => {
  if (mobileMenu?.classList.contains("hidden")) return;

  mobileMenu?.classList.add("hidden");
  mobileMenuToggle?.classList.remove("is-open");
  mobileMenuToggle?.setAttribute("aria-expanded", "false");
};

const openMobileMenu = () => {
  if (!mobileMenu?.classList.contains("hidden")) return;

  mobileMenu?.classList.remove("hidden");
  mobileMenuToggle?.classList.add("is-open");
  mobileMenuToggle?.setAttribute("aria-expanded", "true");
  closeLanguageMenu();
};

const toggleMobileMenu = () => {
  if (mobileMenu?.classList.contains("hidden")) {
    openMobileMenu();
  } else {
    closeMobileMenu();
  }
};

const updateLanguageButton = () => {
  const meta = languageMeta[currentLanguage] || languageMeta.en;

  if (languageFlag) {
    if (languageFlag instanceof HTMLImageElement) {
      languageFlag.src =
        languageFlagImages[currentLanguage] || languageFlagImages.en;
      languageFlag.alt = "";
    } else {
      languageFlag.textContent = meta.flag;
    }
  }

  if (languageCode) {
    languageCode.textContent = meta.code;
  }

  languageOptions.forEach((option) => {
    const isSelected = option.dataset.language === currentLanguage;
    option.setAttribute("aria-selected", String(isSelected));
    option.classList.toggle("bg-[#e8fafd]", isSelected);
    option.classList.toggle("text-[#0c8da3]", isSelected);
  });
};

const updateActiveNav = (sectionId) => {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.navSection === sectionId);
  });
};

const getActiveSectionId = () => {
  const scrollPosition = window.scrollY + window.innerHeight * 0.35;
  let activeSectionId = "top";

  navSections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      activeSectionId = section.id;
    }
  });

  return activeSectionId;
};

const syncActiveNav = () => {
  updateActiveNav(getActiveSectionId());
};

const updateBackToTopVisibility = () => {
  const shouldShow = window.scrollY > 420;

  backToTopButton?.classList.toggle("is-visible", shouldShow);
  backToTopButton?.classList.toggle("is-hidden", !shouldShow);
};

const updateWhatsappLink = () => {
  if (!whatsappButton) return;

  const message = translate("whatsapp.message");
  whatsappButton.href = `https://wa.me/355698422428?text=${encodeURIComponent(message)}`;
};

const setMetaContent = (selector, value) => {
  const element = document.querySelector(selector);

  if (element && value) {
    element.setAttribute("content", value);
  }
};

const getLanguageUrl = (language) => {
  const url = new URL(siteUrl);

  if (language !== "sq") {
    url.searchParams.set("lang", language);
  }

  return url.toString();
};

const syncLanguageUrl = () => {
  if (!window.history?.replaceState) return;

  const url = new URL(window.location.href);

  if (currentLanguage === "sq") {
    url.searchParams.delete("lang");
  } else {
    url.searchParams.set("lang", currentLanguage);
  }

  window.history.replaceState(
    {},
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
};

const updateDocumentMeta = () => {
  const title = translate("meta.title");
  const description = translate("meta.description");
  const languageUrl = getLanguageUrl(currentLanguage);

  document.title = title;
  document
    .querySelector('link[rel="canonical"]')
    ?.setAttribute("href", languageUrl);
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', languageUrl);
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  setMetaContent(
    'meta[property="og:locale"]',
    languageLocales[currentLanguage] || languageLocales.en,
  );
};

const formatCounterValue = (value, decimals, suffix) => {
  const formattedValue =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();

  return `${formattedValue}${suffix}`;
};

const animateCounter = (counter) => {
  const target = Number(counter.dataset.counterTarget || 0);
  const decimals = Number(counter.dataset.counterDecimals || 0);
  const suffix = counter.dataset.counterSuffix || "";
  const duration = 1600;
  const startTime = performance.now();

  const tick = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = target * easedProgress;

    counter.textContent = formatCounterValue(currentValue, decimals, suffix);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    }
  };

  window.requestAnimationFrame(tick);
};

const startCounters = () => {
  counters.forEach((counter) => {
    if (counter.dataset.counterStarted === "true") return;

    counter.dataset.counterStarted = "true";
    animateCounter(counter);
  });
};

const scrollAboutGallery = (direction) => {
  if (!aboutGalleryTrack) return;

  aboutGalleryTrack.scrollBy({
    left: direction * aboutGalleryTrack.clientWidth * 0.7,
    behavior: "auto",
  });
};

const enableAboutGalleryWheel = () => {
  if (!aboutGalleryTrack) return;

  aboutGalleryTrack.addEventListener(
    "wheel",
    (event) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;
      const direction = Math.sign(delta);

      if (!direction) return;

      const atStart = aboutGalleryTrack.scrollLeft <= 2;
      const atEnd =
        aboutGalleryTrack.scrollLeft + aboutGalleryTrack.clientWidth >=
        aboutGalleryTrack.scrollWidth - 2;

      if ((direction < 0 && atStart) || (direction > 0 && atEnd)) {
        return;
      }

      event.preventDefault();
      aboutGalleryTrack.scrollLeft += delta;
    },
    { passive: false },
  );
};

const enableAboutGalleryDrag = () => {
  if (!aboutGalleryTrack) return;

  let isDragging = false;
  let hasDragged = false;
  let startX = 0;
  let startScrollLeft = 0;
  let lastX = 0;
  let lastTime = 0;
  let dragVelocity = 0;
  let momentumFrame;

  const stopMomentum = () => {
    window.cancelAnimationFrame(momentumFrame);
  };

  const startMomentum = () => {
    stopMomentum();

    const glide = () => {
      dragVelocity *= 0.94;

      if (Math.abs(dragVelocity) < 0.08) return;

      aboutGalleryTrack.scrollLeft -= dragVelocity * 16;
      momentumFrame = window.requestAnimationFrame(glide);
    };

    momentumFrame = window.requestAnimationFrame(glide);
  };

  const stopDragging = () => {
    if (!isDragging) return;

    isDragging = false;
    aboutGalleryTrack.classList.remove("is-dragging");

    if (hasDragged) {
      startMomentum();
    }
  };

  aboutGalleryTrack.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.pointerType !== "mouse") return;

    stopMomentum();
    isDragging = true;
    hasDragged = false;
    startX = event.clientX;
    lastX = event.clientX;
    lastTime = performance.now();
    dragVelocity = 0;
    startScrollLeft = aboutGalleryTrack.scrollLeft;
    aboutGalleryTrack.classList.add("is-dragging");
    aboutGalleryTrack.setPointerCapture(event.pointerId);
  });

  aboutGalleryTrack.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    const dragDistance = event.clientX - startX;
    const now = performance.now();
    const elapsed = Math.max(16, now - lastTime);

    if (Math.abs(dragDistance) > 4) {
      hasDragged = true;
      event.preventDefault();
    }

    aboutGalleryTrack.scrollLeft = startScrollLeft - dragDistance;
    dragVelocity = ((event.clientX - lastX) / elapsed) * 0.85;
    lastX = event.clientX;
    lastTime = now;
  });

  aboutGalleryTrack.addEventListener(
    "click",
    (event) => {
      if (!hasDragged) return;

      event.preventDefault();
      event.stopPropagation();
      hasDragged = false;
    },
    true,
  );

  aboutGalleryTrack.addEventListener("pointerup", stopDragging);
  aboutGalleryTrack.addEventListener("pointercancel", stopDragging);
  aboutGalleryTrack.addEventListener("lostpointercapture", stopDragging);
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

closeVideoModal?.addEventListener("click", () => {
  modalVideo.pause();
  modalImage.classList.add("hidden");
  modalVideo.classList.add("hidden");
  modalVideo.src = "";
  modalImage.src = "";
  videoModal.classList.add("hidden");
  videoModal.classList.remove("flex");
});

const applyLanguage = (language) => {
  currentLanguage = translations[language] ? language : "en";
  const dictionary = translations[currentLanguage];

  document.documentElement.lang = currentLanguage;
  syncLanguageUrl();
  updateDocumentMeta();
  localStorage.setItem("luminaLanguage", currentLanguage);

  updateLanguageButton();
  updateWhatsappLink();

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent =
      dictionary[element.dataset.i18n] || element.textContent;
  });

  i18nPlaceholderElements.forEach((element) => {
    element.placeholder =
      dictionary[element.dataset.i18nPlaceholder] || element.placeholder;
  });

  i18nAltElements.forEach((element) => {
    element.alt = dictionary[element.dataset.i18nAlt] || element.alt;
  });

  i18nAriaLabelElements.forEach((element) => {
    element.setAttribute(
      "aria-label",
      dictionary[element.dataset.i18nAriaLabel] ||
        element.getAttribute("aria-label"),
    );
  });

  i18nValueElements.forEach((element) => {
    element.value = dictionary[element.dataset.i18nValue] || element.value;
  });

  reviews = translations.en?.reviews || dictionary.reviews || [];
  videos = videoAssets.map((asset, index) => ({
    ...asset,
    title: dictionary.videos[index]?.[0] || "",
    text: dictionary.videos[index]?.[1] || "",
  }));

  setReviewsData(reviews, translateEnglish);
  renderReviews();
  renderVideos(videos);
};

languageToggle?.addEventListener("click", toggleLanguageMenu);
mobileMenuToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleMobileMenu();
});

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    updateActiveNav(link.dataset.navSection);
  });
});

aboutGalleryPrev?.addEventListener("click", () => scrollAboutGallery(-1));
aboutGalleryNext?.addEventListener("click", () => scrollAboutGallery(1));
enableAboutGalleryWheel();
enableAboutGalleryDrag();

let activeNavFrame;

const queueActiveNavSync = () => {
  window.cancelAnimationFrame(activeNavFrame);
  activeNavFrame = window.requestAnimationFrame(() => {
    syncActiveNav();
    updateBackToTopVisibility();
  });
};

window.addEventListener("scroll", queueActiveNavSync, { passive: true });
window.addEventListener("resize", queueActiveNavSync);

languageOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.dataset.language === currentLanguage) {
      closeLanguageMenu();
      closeMobileMenu();
      return;
    }

    applyLanguage(option.dataset.language);
    closeLanguageMenu();
    closeMobileMenu();
  });
});

document.addEventListener("click", (event) => {
  if (!languageSelector?.contains(event.target)) {
    closeLanguageMenu();
  }

  if (
    !mobileMenu?.contains(event.target) &&
    !mobileMenuToggle?.contains(event.target)
  ) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLanguageMenu();
    closeMobileMenu();
  }
});

syncActiveNav();
updateBackToTopVisibility();
startCounters();
renderImages();
aboutGallery();
servicesJs();
// renderVideos();

applyLanguage(currentLanguage);
