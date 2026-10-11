/* ============================================================
   SCROLL.JS
   Obiettivo: tutto ciò che reagisce allo scroll dell'utente:
   - copertine dei lavori (.reveal-media) che si scoprono quando
     entrano nello schermo, una volta sola
   - metodo: linea di avanzamento che si riempie con lo scroll
   - bottone "torna su" che appare dopo un certo scroll
   ============================================================ */

function initMediaReveal() {
  const items = document.querySelectorAll('.reveal-media:not(.is-visible)');
  if (!items.length) return;

  // Browser senza IntersectionObserver: mostro tutto subito
  if (!('IntersectionObserver' in window)) {
    revealAllMedia();
    return;
  }

  // Osservo il contenitore, non l'immagine: il clip-path la rende
  // "invisibile" anche per l'IntersectionObserver, che non scatterebbe mai.
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.reveal-media').forEach((el) => el.classList.add('is-visible'));
        obs.unobserve(entry.target); // una volta scoperta, resta così
      });
    },
    { threshold: 0.2 } // parte quando un quinto del contenitore è nello schermo
  );

  new Set(Array.from(items, (el) => el.parentElement)).forEach((parent) => observer.observe(parent));
}

// Rete di sicurezza: le copertine partono nascoste via CSS, quindi se
// qualcosa va storto le rendo visibili invece di lasciarle coperte.
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
  // Con "riduci animazioni" il salto in cima è immediato
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });
  toggleVisibility();
}

// --- Metodo: la linea sopra i passi si riempie mentre la sezione
// attraversa lo schermo, e ogni passo si "accende" quando la linea lo
// raggiunge. Mostra la sequenza invece di limitarsi a elencarla. ---
function initMethodProgress() {
  const list = document.querySelector('.method-list');
  if (!list) return;

  const items = Array.from(list.querySelectorAll('.method-item'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setProgress(progress) {
    list.style.setProperty('--progress', progress.toFixed(3));
    items.forEach((item, i) => {
      // un passo è attivo quando la linea ha raggiunto il suo inizio
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
    // 0 quando la lista entra dal basso (85% dello schermo),
    // 1 quando la sua fine arriva a metà schermo
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
