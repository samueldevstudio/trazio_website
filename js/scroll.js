/* ============================================================
   SCROLL.JS
   Obiettivo: tutto ciò che reagisce allo scroll dell'utente:
   - reveal delle sezioni (fade-in quando entrano nello schermo)
   - barra di progresso dello scroll in alto
   - bottone "torna su" che appare dopo un certo scroll
   - leggero effetto parallax sul glow della hero
   ============================================================ */

function initScrollReveal() {
  // Prendo tutti gli elementi con classe .reveal (assegnata nell'HTML
  // agli elementi che vogliamo animare quando diventano visibili).
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

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

function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${percent}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
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

function initParallax() {
  // Effetto molto sottile: il glow della hero si muove leggermente
  // in direzione opposta allo scroll, dando profondità senza esagerare
  // (il brief chiede "mai eccessivo").
  const glow = document.querySelector('.hero__glow');
  if (!glow) return;

  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.2;
    glow.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

// --- Skill bars: animo il riempimento quando la sezione skills entra in vista ---
function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-bar__fill');
  if (!skillFills.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const percent = target.dataset.percent || '0';
          target.style.width = `${percent}%`;
          obs.unobserve(target);
        }
      });
    },
    { threshold: 0.4 }
  );

  skillFills.forEach((fill) => observer.observe(fill));
}

// --- Contatori statistici animati (0 -> valore finale) ---
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-item__number[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1500;
        const startTime = performance.now();

        function tick(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          // easing "ease-out" semplice: parte veloce, rallenta alla fine
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}
