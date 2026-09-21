const STORAGE_KEY = "theme";

function getPreferredTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  document.querySelectorAll("[data-theme-variant]").forEach((el) => {
    el.hidden = el.dataset.themeVariant !== theme;
  });
}

function setTheme(theme) {
  applyTheme(theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

applyTheme(localStorage.getItem(STORAGE_KEY) ?? getPreferredTheme());

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-theme-set]").forEach((button) => {
    button.addEventListener("click", () => setTheme(button.dataset.themeSet));
  });
});
