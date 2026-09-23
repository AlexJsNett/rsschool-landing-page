document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector("[data-burger-toggle]");
  const nav = document.getElementById("mobile-nav");

  if (!burger || !nav) return;

  const menuIcon = burger.querySelector('[data-burger-icon="menu"]');
  const closeIcon = burger.querySelector('[data-burger-icon="close"]');

  function setOpen(isOpen) {
    nav.hidden = !isOpen;
    burger.setAttribute("aria-expanded", String(isOpen));
    burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    if (menuIcon) menuIcon.classList.toggle("is-hidden", isOpen);
    if (closeIcon) closeIcon.classList.toggle("is-hidden", !isOpen);
    document.body.classList.toggle("no-scroll", isOpen);
  }

  burger.addEventListener("click", () => setOpen(nav.hidden));

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  nav.addEventListener("click", (event) => {
    if (event.target === nav) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !nav.hidden) setOpen(false);
  });
});
