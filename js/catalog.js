import { loadProducts, getDefaultSizeIndex, formatPrice } from "./products.js";

const CARD_IMAGE_SIZE = 600;

function createCard(product) {
  const defaultSize = product.sizes[getDefaultSizeIndex(product)];

  const card = document.createElement("li");
  card.className = product.extra ? "card card--extra" : "card";
  card.dataset.id = product.id;

  const photo = document.createElement("div");
  photo.className = "card__photo";
  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.title;
  image.width = CARD_IMAGE_SIZE;
  image.height = CARD_IMAGE_SIZE;
  photo.append(image);

  const title = document.createElement("h3");
  title.textContent = product.title;

  const desc = document.createElement("p");
  desc.textContent = product.desc;

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = formatPrice(defaultSize.price);

  const details = document.createElement("button");
  details.type = "button";
  details.className = "card__details";
  details.textContent = "Details";

  card.append(photo, title, desc, price, details);
  return card;
}

function renderProducts(products) {
  document.querySelectorAll("[data-category-panel]").forEach((list) => {
    const cards = products
      .filter((product) => product.category === list.dataset.categoryPanel)
      .map(createCard);
    list.replaceChildren(...cards);
    list.removeAttribute("aria-busy");
  });
}

function renderLoadError(error) {
  console.error(error);
  document.querySelectorAll("[data-category-panel]").forEach((list) => {
    const message = document.createElement("li");
    message.className = "catalog__message";
    message.setAttribute("role", "alert");
    message.textContent = "Could not load the menu. Please try again later.";
    list.replaceChildren(message);
    list.removeAttribute("aria-busy");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const tabs = Array.from(document.querySelectorAll("[data-category-btn]"));

  if (!tabs.length) return;

  loadProducts().then(renderProducts).catch(renderLoadError);

  const showMoreButtons = Array.from(
    document.querySelectorAll("[data-show-more]"),
  );

  function updateShowMoreVisibility(category) {
    showMoreButtons.forEach((button) => {
      const panel = document.getElementById(
        `panel-${button.dataset.showMore}`,
      );
      const isOwnCategory = button.dataset.showMore === category;
      const alreadyExpanded = panel && panel.classList.contains("is-expanded");
      button.hidden = !isOwnCategory || alreadyExpanded;
    });
  }

  function selectCategory(category) {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.categoryBtn === category;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    document.querySelectorAll('[id^="panel-"]').forEach((panel) => {
      panel.hidden = panel.id !== `panel-${category}`;
    });

    updateShowMoreVisibility(category);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectCategory(tab.dataset.categoryBtn));
  });

  showMoreButtons.forEach((button) => {
    const panel = document.getElementById(`panel-${button.dataset.showMore}`);
    if (!panel) return;

    button.addEventListener("click", () => {
      panel.classList.add("is-expanded");
      button.hidden = true;
    });
  });

  const activeTab = tabs.find((tab) => tab.classList.contains("is-active"));
  updateShowMoreVisibility(
    activeTab ? activeTab.dataset.categoryBtn : tabs[0].dataset.categoryBtn,
  );
});
