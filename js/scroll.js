/* ============================================================
   SCROLL.JS
   Obiettivo: tutto ciò che reagisce allo scroll dell'utente:
   - reveal delle sezioni (fade-in quando entrano nello schermo)
   - liste .stagger: ogni elemento riceve il proprio indice (--i)
     per comparire uno dopo l'altro
   - metodo: linea di avanzamento che si riempie con lo scroll
   - bottone "torna su" che appare dopo un certo scroll
   ============================================================ */

function initScrollReveal() {
  // Prendo tutti gli elementi con classe .reveal (assegnata nell'HTML
  // agli elementi che vogliamo animare quando diventano visibili).
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  // Indice di ogni figlio delle liste .stagger: il CSS lo usa per
  // calcolare il ritardo d'entrata (70ms per elemento)
  document.querySelectorAll('.stagger').forEach((list) => {
    Array.from(list.children).forEach((child, i) => child.style.setProperty('--i', i));
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Piccolo delay a cascata se l'elemento ha data-delay,
          // utile per animare le card di una griglia una dopo l'altra
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          obs.unobserve(entry.target); // una volta mostrato, non serve ricontrollarlo
        }
      });
    },
    { threshold: 0.15 } // si attiva quando il 15% dell'elemento è visibile
  );

  revealElements.forEach((el) => observer.observe(el));
}

function initBackToTop() {
  const button = document.querySelector('.back-to-top');
  if (!button) return;

  function toggleVisibility() {
    button.classList.toggle('is-visible', window.scrollY > 500);
  }

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
