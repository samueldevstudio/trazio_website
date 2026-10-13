function initMediaReveal() {
  const items = document.querySelectorAll('.reveal-media:not(.is-visible)');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    revealAllMedia();
    return;
  }

  // Osservo il contenitore: con il clip-path l'immagine non risulta mai visibile
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.reveal-media').forEach((el) => el.classList.add('is-visible'));
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  new Set(Array.from(items, (el) => el.parentElement)).forEach((parent) => observer.observe(parent));
}

function revealAllMedia() {
  document.querySelectorAll('.reveal-media').forEach((el) => el.classList.add('is-visible'));
}

function initBackToTop() {
  const button = document.querySelector('.back-to-top');
  if (!button) return;

  function toggleVisibility() {
    button.classList.toggle('is-visible', window.scrollY > 500);
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });
  toggleVisibility();
}

function initMethodProgress() {
  const list = document.querySelector('.method-list');
  if (!list) return;

  const items = Array.from(list.querySelectorAll('.method-item'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setProgress(progress) {
    list.style.setProperty('--progress', progress.toFixed(3));
    items.forEach((item, i) => {
      item.classList.toggle('is-active', progress >= i / items.length + 0.01 || progress === 1);
    });
  }

  if (reduceMotion) {
    setProgress(1);
    return;
  }

  let ticking = false;
  function update() {
    ticking = false;
    const rect = list.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.85;
    const end = vh * 0.5;
    const progress = (start - rect.top) / (start - end + rect.height);
    setProgress(Math.min(Math.max(progress, 0), 1));
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}
