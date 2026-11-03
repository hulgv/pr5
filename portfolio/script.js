const yearElement = document.querySelector("[data-current-year]");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const revealElements = document.querySelectorAll("[data-reveal]");
const progressBar = document.querySelector(".scroll-progress");
const shell = document.querySelector(".shell");

const updateScrollEffects = () => {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrollProgress =
    scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

  if (progressBar) {
    progressBar.style.width = `${scrollProgress * 100}%`;
  }

  if (shell) {
    shell.style.setProperty("--scroll-offset", `${scrollProgress * 35}px`);
  }
};

window.addEventListener("scroll", updateScrollEffects, { passive: true });
updateScrollEffects();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const cursorGlow = document.querySelector(".cursor-glow");
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (cursorGlow && hasFinePointer && !prefersReducedMotion) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let rafId = null;

  const animateGlow = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px)`;
    rafId = requestAnimationFrame(animateGlow);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorGlow.style.opacity = "1";
      if (rafId === null) {
        animateGlow();
      }
    },
    { passive: true },
  );

  window.addEventListener("pointerleave", () => {
    cursorGlow.style.opacity = "0";
  });
} else if (cursorGlow) {
  cursorGlow.remove();
}
