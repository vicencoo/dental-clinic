import { videoAssets } from "../src/constants/videoAssets.js";
import { renderImages } from "./gallery.js";
import { renderReviews, setReviewsData } from "./reviews.js";
import { renderVideos } from "./videos.js";

const translations = window.LOTUS_TRANSLATIONS || {};
let currentLanguage = localStorage.getItem("luminaLanguage") || "sq";
let reviews = [];
let videos = [];

const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const i18nElements = document.querySelectorAll("[data-i18n]");
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

const videoModal = document.getElementById("videoModal");
const modalVideo = document.getElementById("modalVideo");
const modalImage = document.getElementById("modalImage");
const closeVideoModal = document.getElementById("closeVideoModal");

const languageMeta = {
  sq: { code: "SQ", flag: "🇦🇱" },
  en: { code: "EN", flag: "🇬🇧" },
  it: { code: "IT", flag: "🇮🇹" },
};

languageMeta.es = { code: "ES", flag: "ES" };
languageMeta.de = { code: "DE", flag: "DE" };

const languageFlagImages = {
  sq: "/public/flags/albania.png",
  en: "/public/flags/english.png",
  it: "/public/flags/italian.png",
  es: "/public/flags/spain.png",
  de: "/public/flags/german.png",
};

const translate = (key) =>
  translations[currentLanguage]?.[key] || translations.en[key] || key;

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
  document.title = translate("meta.title");
  localStorage.setItem("luminaLanguage", currentLanguage);

  updateLanguageButton();
  updateWhatsappLink();

  i18nElements.forEach((element) => {
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

  reviews = dictionary.reviews;
  videos = videoAssets.map((asset, index) => ({
    ...asset,
    title: dictionary.videos[index]?.[0] || "",
    text: dictionary.videos[index]?.[1] || "",
  }));

  setReviewsData(reviews, translate);
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
// renderVideos();

applyLanguage(currentLanguage);
