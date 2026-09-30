import { loadProducts, getDefaultSizeIndex, formatPrice } from "./products.js";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;

  const panel = modal.querySelector(".modal__panel");
  const imageEl = modal.querySelector("[data-modal-image]");
  const titleEl = modal.querySelector("[data-modal-title]");
  const descEl = modal.querySelector("[data-modal-desc]");
  const sizesEl = modal.querySelector("[data-modal-sizes]");
  const additivesEl = modal.querySelector("[data-modal-additives]");
  const totalEl = modal.querySelector("[data-modal-total]");
  const closeButtons = modal.querySelectorAll("[data-modal-close]");

  const ADDITIVE_PRICE = 0.3;

  let productsById = new Map();
  let sizes = [];
  let activeSizeIndex = 0;
  let activeAdditives = new Set();

  // Load errors are already reported on the page by catalog.js.
  loadProducts()
    .then((products) => {
      productsById = new Map(products.map((product) => [product.id, product]));
    })
    .catch(() => {});

  function createChip(badgeText, labelText) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    const badge = document.createElement("span");
    badge.className = "chip__badge";
    badge.textContent = badgeText;
    chip.append(badge, labelText);
    return chip;
  }

  function updateTotal() {
    const total =
      sizes[activeSizeIndex].price + activeAdditives.size * ADDITIVE_PRICE;
    totalEl.textContent = formatPrice(total);
  }

  function renderSizeChips(product) {
    sizesEl.replaceChildren();
    sizes = product.sizes;

    sizes.forEach((size, index) => {
      const chip = createChip(size.label, `${size.volume} ${product.unit}`);
      chip.classList.toggle("is-active", index === activeSizeIndex);
      chip.addEventListener("click", () => {
        activeSizeIndex = index;
        sizesEl
          .querySelectorAll(".chip")
          .forEach((el, elIndex) => el.classList.toggle("is-active", elIndex === index));
        updateTotal();
      });
      sizesEl.appendChild(chip);
    });
  }

  function renderAdditiveChips(additives) {
    additivesEl.replaceChildren();
    activeAdditives = new Set();

    additives.forEach((additive, index) => {
      const chip = createChip(String(index + 1), additive);
      chip.addEventListener("click", () => {
        if (activeAdditives.has(additive)) {
          activeAdditives.delete(additive);
        } else {
          activeAdditives.add(additive);
        }
        chip.classList.toggle("is-active", activeAdditives.has(additive));
        updateTotal();
      });
      additivesEl.appendChild(chip);
    });
  }

  function openModal(product) {
    activeSizeIndex = getDefaultSizeIndex(product);

    imageEl.src = product.image;
    imageEl.alt = product.title;
    titleEl.textContent = product.title;
    descEl.textContent = product.desc;

    renderSizeChips(product);
    renderAdditiveChips(product.additives);
    updateTotal();

    modal.hidden = false;
    document.body.classList.add("no-scroll");
    panel.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  document.addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    const product = card && productsById.get(card.dataset.id);
    if (product) openModal(product);
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeModal));

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
});
