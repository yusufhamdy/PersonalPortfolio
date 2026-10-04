const STORAGE_KEY = "portfolio-settings";
const DEFAULT_FONT = "tajawal";
const DEFAULT_COLOR = 3;
const FONTS = ["alexandria", "tajawal", "cairo"];

const themeColors = [
  { name: "أزرق", primary: "#3b82f6", secondary: "#06b6d4", accent: "#0ea5e9" },
  { name: "أخضر", primary: "#10b981", secondary: "#059669", accent: "#14b8a6" },
  { name: "وردي", primary: "#f43f5e", secondary: "#f97316", accent: "#fbbf24" },
  { name: "بنفسجي", primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" },
  { name: "برتقالي", primary: "#f59e0b", secondary: "#ea580c", accent: "#ef4444" },
  { name: "أحمر", primary: "#ef4444", secondary: "#f43f5e", accent: "#f97316" },
];

const root = document.documentElement;

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveSettings(changes) {
  const settings = { ...loadSettings(), ...changes };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    // Storage can be blocked, so the page just works without saving
  }
}

/* Active link in the navbar while scrolling */
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const navSections = Array.from(navLinks).map((link) =>
  document.querySelector(link.getAttribute("href"))
);

function updateActiveLink() {
  const position = window.scrollY + 100;
  let currentIndex = 0;

  navSections.forEach((section, index) => {
    const top = section.getBoundingClientRect().top + window.scrollY;
    if (top <= position) {
      currentIndex = index;
    }
  });

  navLinks.forEach((link, index) => {
    link.classList.toggle("active", index === currentIndex);
  });
}

/* Scroll to top button */
const scrollTopButton = document.getElementById("scroll-to-top");

function updateScrollTopButton() {
  const isVisible = window.scrollY > 300;
  scrollTopButton.classList.toggle("opacity-100", isVisible);
  scrollTopButton.classList.toggle("visible", isVisible);
  scrollTopButton.classList.toggle("opacity-0", !isVisible);
  scrollTopButton.classList.toggle("invisible", !isVisible);
}

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  updateActiveLink();
  updateScrollTopButton();
});

/* Dark and light theme */
const themeButton = document.getElementById("theme-toggle-button");

function setDarkMode(isDark) {
  root.classList.toggle("dark", isDark);
  themeButton.setAttribute("aria-pressed", String(isDark));
}

themeButton.addEventListener("click", () => {
  const isDark = !root.classList.contains("dark");
  setDarkMode(isDark);
  saveSettings({ theme: isDark ? "dark" : "light" });
});

/* Portfolio filters */
const filterButtons = document.querySelectorAll(".portfolio-filter");
const portfolioItems = document.querySelectorAll(".portfolio-item");

const activeFilterClasses = [
  "bg-linear-to-r",
  "from-primary",
  "to-secondary",
  "text-white",
  "hover:shadow-lg",
  "hover:shadow-primary/50",
];
const inactiveFilterClasses = [
  "bg-white",
  "dark:bg-slate-800",
  "text-slate-600",
  "dark:text-slate-300",
  "hover:bg-slate-100",
  "dark:hover:bg-slate-700",
  "border",
  "border-slate-300",
  "dark:border-slate-700",
];

function setActiveFilter(selectedButton) {
  filterButtons.forEach((button) => {
    const isActive = button === selectedButton;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    button.classList.remove(...(isActive ? inactiveFilterClasses : activeFilterClasses));
    button.classList.add(...(isActive ? activeFilterClasses : inactiveFilterClasses));
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    setActiveFilter(button);

    portfolioItems.forEach((item) => {
      const matches = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("hidden", !matches);
    });
  });
});

/* Testimonials carousel */
const carousel = document.getElementById("testimonials-carousel");
const cards = carousel.querySelectorAll(".testimonial-card");
const indicators = document.querySelectorAll(".carousel-indicator");
const nextButton = document.getElementById("next-testimonial");
const prevButton = document.getElementById("prev-testimonial");
const largeScreen = window.matchMedia("(min-width: 64rem)");
const mediumScreen = window.matchMedia("(min-width: 40rem)");

let currentSlide = 0;

function getVisibleCards() {
  if (largeScreen.matches) return 3;
  if (mediumScreen.matches) return 2;
  return 1;
}

function getLastSlide() {
  return cards.length - getVisibleCards();
}

function showSlide(index) {
  currentSlide = Math.min(Math.max(index, 0), getLastSlide());
  carousel.style.transform = `translateX(${(currentSlide * 100) / getVisibleCards()}%)`;

  const activeIndicator = Math.min(currentSlide, indicators.length - 1);
  indicators.forEach((indicator, i) => {
    const isActive = i === activeIndicator;
    indicator.setAttribute("aria-selected", String(isActive));
    indicator.classList.toggle("bg-accent", isActive);
    indicator.classList.toggle("scale-125", isActive);
    indicator.classList.toggle("bg-slate-400", !isActive);
    indicator.classList.toggle("dark:bg-slate-600", !isActive);
  });
}

nextButton.addEventListener("click", () => {
  showSlide(currentSlide >= getLastSlide() ? 0 : currentSlide + 1);
});

prevButton.addEventListener("click", () => {
  showSlide(currentSlide <= 0 ? getLastSlide() : currentSlide - 1);
});

indicators.forEach((indicator) => {
  indicator.addEventListener("click", () => {
    showSlide(Number(indicator.dataset.index));
  });
});

window.addEventListener("resize", () => {
  showSlide(currentSlide);
});

/* Settings sidebar */
const settingsToggle = document.getElementById("settings-toggle");
const settingsSidebar = document.getElementById("settings-sidebar");
const closeSettings = document.getElementById("close-settings");
const resetSettings = document.getElementById("reset-settings");
const fontButtons = document.querySelectorAll(".font-option");
const colorsGrid = document.getElementById("theme-colors-grid");

function setSidebarOpen(isOpen) {
  settingsSidebar.classList.toggle("translate-x-full", !isOpen);
  settingsSidebar.setAttribute("aria-hidden", String(!isOpen));
  settingsToggle.setAttribute("aria-expanded", String(isOpen));
  settingsToggle.style.right = isOpen ? "20rem" : "";
}

settingsToggle.addEventListener("click", () => {
  setSidebarOpen(settingsSidebar.classList.contains("translate-x-full"));
});

closeSettings.addEventListener("click", () => {
  setSidebarOpen(false);
});

function applyFont(font) {
  FONTS.forEach((name) => document.body.classList.remove(`font-${name}`));
  document.body.classList.add(`font-${font}`);

  fontButtons.forEach((button) => {
    const isActive = button.dataset.font === font;
    button.classList.toggle("active", isActive);
    button.classList.toggle("border-primary", isActive);
    button.setAttribute("aria-checked", String(isActive));
  });
}

fontButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFont(button.dataset.font);
    saveSettings({ font: button.dataset.font });
  });
});

const activeColorClasses = [
  "ring-2",
  "ring-primary",
  "ring-offset-2",
  "ring-offset-white",
  "dark:ring-offset-slate-900",
];

const colorButtons = themeColors.map((color, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "w-14 h-14 rounded-full border-2 border-slate-300 dark:border-slate-700 transition-transform duration-300 hover:scale-110 cursor-pointer";
  button.style.background = `linear-gradient(135deg, ${color.primary}, ${color.secondary})`;
  button.setAttribute("aria-label", color.name);
  button.addEventListener("click", () => {
    applyColor(index);
    saveSettings({ color: index });
  });
  colorsGrid.appendChild(button);
  return button;
});

function applyColor(index) {
  const color = themeColors[index];
  root.style.setProperty("--color-primary", color.primary);
  root.style.setProperty("--color-secondary", color.secondary);
  root.style.setProperty("--color-accent", color.accent);

  colorButtons.forEach((button, i) => {
    const isActive = i === index;
    activeColorClasses.forEach((name) => button.classList.toggle(name, isActive));
    button.setAttribute("aria-pressed", String(isActive));
  });
}

resetSettings.addEventListener("click", () => {
  applyFont(DEFAULT_FONT);
  applyColor(DEFAULT_COLOR);
  saveSettings({ font: DEFAULT_FONT, color: DEFAULT_COLOR });
});

/* Custom selects in the contact form */
const selects = document.querySelectorAll(".custom-select");

function setSelectOpen(select, isOpen) {
  const options = select.parentElement.querySelector(".custom-options");
  const arrow = select.querySelector("i");
  options.classList.toggle("hidden", !isOpen);
  select.setAttribute("aria-expanded", String(isOpen));
  arrow.style.rotate = isOpen ? "180deg" : "";
}

function closeAllSelects(exceptSelect) {
  selects.forEach((select) => {
    if (select !== exceptSelect) {
      setSelectOpen(select, false);
    }
  });
}

selects.forEach((select) => {
  const options = select.parentElement.querySelectorAll(".custom-option");
  const selectedText = select.querySelector(".selected-text");

  function toggleSelect() {
    const willOpen = select.getAttribute("aria-expanded") !== "true";
    closeAllSelects(select);
    setSelectOpen(select, willOpen);
  }

  select.addEventListener("click", toggleSelect);

  select.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSelect();
    }
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      selectedText.textContent = option.dataset.value;
      selectedText.classList.remove("text-slate-500", "dark:text-slate-400");
      selectedText.classList.add("text-slate-800", "dark:text-white");
      select.dataset.value = option.dataset.value;

      options.forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      setSelectOpen(select, false);
    });
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".custom-select-wrapper")) {
    closeAllSelects();
  }
});

/* Start state */
const savedSettings = loadSettings();
setDarkMode(savedSettings.theme !== "light");
applyFont(FONTS.includes(savedSettings.font) ? savedSettings.font : DEFAULT_FONT);
applyColor(
  Number.isInteger(savedSettings.color) && themeColors[savedSettings.color]
    ? savedSettings.color
    : DEFAULT_COLOR
);
updateActiveLink();
updateScrollTopButton();
showSlide(0);
