/* ============================================================
   CURSOR.JS
   Obiettivo: sostituire il cursore di sistema con un punto +
   un anello che lo segue con un piccolo ritardo (effetto "premium"
   che si vede spesso su siti come Linear/Framer).

   Logica: il "dot" segue il mouse istantaneamente, mentre il
   "ring" lo insegue con un'interpolazione (lerp) frame per frame,
   creando una sensazione di fluidità/elasticità.
   ============================================================ */

function initCustomCursor() {
  // Su dispositivi touch non ha senso: niente mouse reale da inseguire
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isTouchDevice) return;

  const dot = document.createElement('div');
  dot.className = 'custom-cursor';
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  document.body.append(dot, ring);

  // Posizione reale del mouse (target) e posizione attuale dell'anello (che insegue)
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Il dot si muove subito, senza ritardo
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Loop di animazione: ad ogni frame avvicino la posizione dell'anello
  // a quella del mouse di una piccola percentuale (lerp = linear interpolation).
  // Questo crea l'effetto "elastico" di inseguimento.
  function animateRing() {
    const easing = 0.15;
    ringX += (mouseX - ringX) * easing;
    ringY += (mouseY - ringY) * easing;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Ingrandisco il cursore quando passa sopra elementi cliccabili,
  // per dare un feedback visivo di interattività
  const interactiveSelector = 'a, button, .btn, .card, input, textarea, [data-cursor-hover]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      dot.classList.add('is-active');
      ring.classList.add('is-active');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      dot.classList.remove('is-active');
      ring.classList.remove('is-active');
    }
  });

  // Nascondo il cursore quando esce dalla finestra (es. cambio tab)
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}
