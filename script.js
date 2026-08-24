(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealTargets = document.querySelectorAll(
    ".section h2, .section-lead, .audience-list, .package, .steps li, .contact-embed, .payment-note, .carousel, .faq-list, .ai-how, .ai-price, .econ, .econ-note, .result-stat"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const prevBtn = root.querySelector("[data-carousel-prev]");
  const nextBtn = root.querySelector("[data-carousel-next]");
  const dotsWrap = root.querySelector("[data-carousel-dots]");
  let index = 0;

  const dots = slides.map((_, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "carousel-dot";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-label", `Show project ${i + 1}`);
    btn.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(btn);
    return btn;
  });

  function goTo(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      if (active) {
        slide.removeAttribute("hidden");
      } else {
        slide.setAttribute("hidden", "");
      }
      dots[i].setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goTo(index - 1);
    if (event.key === "ArrowRight") goTo(index + 1);
  });

  goTo(0);
})();
