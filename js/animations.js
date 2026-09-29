(() => {
  const items = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  items.forEach((el) => io.observe(el));
})();

// Ticker: clone each band's group until it covers the band (+1 spare), then set the loop
// length (--copies) and a constant speed (--duration). Re-runs on resize.
(() => {
  const SPEED = 60; // px per second
  const tracks = document.querySelectorAll(".ticker__track");
  if (!tracks.length) return;

  const fill = (track) => {
    const group = track.querySelector(".ticker__group");
    track
      .querySelectorAll(".ticker__group[data-clone]")
      .forEach((el) => el.remove());
    const groupW = group.getBoundingClientRect().width;
    if (!groupW) return;
    const copies = Math.ceil(track.parentElement.clientWidth / groupW) + 1;
    for (let i = 1; i < copies; i++) {
      const c = group.cloneNode(true);
      c.dataset.clone = "";
      track.appendChild(c);
    }
    track.style.setProperty("--copies", copies);
    track.style.setProperty("--duration", `${groupW / SPEED}s`);
  };

  const run = () => tracks.forEach(fill);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(run);
  let t;
  addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(run, 150);
  });
})();
