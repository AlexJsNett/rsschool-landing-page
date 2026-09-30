document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector("[data-slider-track]");
  const dotsWrap = document.querySelector("[data-slider-dots]");
  const prevBtn = document.querySelector("[data-slider-prev]");
  const nextBtn = document.querySelector("[data-slider-next]");

  if (!track) return;

  const slides = Array.from(track.querySelectorAll("[data-slider-slide]"));
  const captions = Array.from(
    document.querySelectorAll("[data-slider-caption]"),
  );
  const dots = dotsWrap
    ? Array.from(dotsWrap.querySelectorAll(".slider__dot"))
    : [];

  let activeIndex = slides.findIndex((slide) =>
    slide.classList.contains("is-active"),
  );
  if (activeIndex < 0) activeIndex = 0;

  function render() {
    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.hidden = !isActive;
    });

    captions.forEach((caption, index) => {
      const isActive = index === activeIndex;
      caption.classList.toggle("is-active", isActive);
      caption.hidden = !isActive;
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  }

  function goTo(index) {
    activeIndex = (index + slides.length) % slides.length;
    render();
  }

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(activeIndex + 1));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goTo(index));
  });

  const SWIPE_THRESHOLD = 40;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchLastX = 0;
  let touchLastY = 0;

  function handleSwipeEnd() {
    const deltaX = touchLastX - touchStartX;
    const deltaY = touchLastY - touchStartY;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    goTo(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
  }

  track.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = touchLastX = event.changedTouches[0].clientX;
      touchStartY = touchLastY = event.changedTouches[0].clientY;
    },
    { passive: true },
  );

  track.addEventListener(
    "touchmove",
    (event) => {
      touchLastX = event.changedTouches[0].clientX;
      touchLastY = event.changedTouches[0].clientY;
    },
    { passive: true },
  );

  track.addEventListener("touchend", handleSwipeEnd, { passive: true });
  track.addEventListener("touchcancel", handleSwipeEnd, { passive: true });

  render();
});
