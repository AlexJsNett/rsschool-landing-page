document.addEventListener("DOMContentLoaded", () => {
  const tabs = Array.from(document.querySelectorAll("[data-category-btn]"));

  if (!tabs.length) return;

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
