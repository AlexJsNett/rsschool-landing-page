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

  const SIZE_LETTERS = ["S", "M", "L"];
  const SIZE_MULTIPLIERS = [0.85, 1, 1.15];
  const ADDITIVE_PRICE = 0.3;

  let basePrice = 0;
  let sizePrices = [];
  let activeSizeIndex = 1;
  let activeAdditives = new Set();

  function roundToQuarter(value) {
    return Math.round(value / 0.25) * 0.25;
  }

  function formatPrice(value) {
    return `$${value.toFixed(2)}`;
  }

  function updateTotal() {
    const total =
      sizePrices[activeSizeIndex] + activeAdditives.size * ADDITIVE_PRICE;
    totalEl.textContent = formatPrice(total);
  }

  function renderSizeChips(sizes, unit) {
    sizesEl.innerHTML = "";
    sizePrices = sizes.map((size, index) =>
      index === 1 ? basePrice : roundToQuarter(basePrice * SIZE_MULTIPLIERS[index]),
    );

    sizes.forEach((size, index) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.classList.toggle("is-active", index === activeSizeIndex);
      chip.innerHTML = `<span class="chip__badge">${SIZE_LETTERS[index]}</span>${size} ${unit}`;
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
    additivesEl.innerHTML = "";
    activeAdditives = new Set();

    additives.forEach((additive, index) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.innerHTML = `<span class="chip__badge">${index + 1}</span>${additive}`;
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

  function openModal(card) {
    basePrice = parseFloat(card.dataset.price);
    activeSizeIndex = 1;

    imageEl.src = card.dataset.image;
    imageEl.alt = card.dataset.title;
    titleEl.textContent = card.dataset.title;
    descEl.textContent = card.dataset.desc;

    renderSizeChips(card.dataset.sizes.split(","), card.dataset.unit);
    renderAdditiveChips(card.dataset.additives.split(","));
    updateTotal();

    modal.hidden = false;
    document.body.classList.add("no-scroll");
    panel.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  document.querySelectorAll("[data-modal-trigger]").forEach((button) => {
    button.addEventListener("click", () => openModal(button));
  });

  document.querySelectorAll(".card").forEach((card) => {
    const trigger = card.querySelector("[data-modal-trigger]");
    if (!trigger) return;
    card.addEventListener("click", () => openModal(trigger));
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeModal));

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
});
