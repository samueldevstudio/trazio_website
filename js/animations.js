/* ============================================================
   ANIMATIONS.JS
   Obiettivo: 1) disegnare le particelle di sfondo nella hero
   usando <canvas> (più performante di centinaia di <div> animati),
   2) effetto "typing" sul titolo hero.

   Logica particelle: creo N punti con posizione e velocità casuali,
   ad ogni frame li sposto e li ridisegno; se un punto esce dallo
   schermo, lo faccio rientrare dal lato opposto (wrap-around).
   ============================================================ */

function initParticles() {
  const canvas = document.querySelector('.hero__bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 60;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      // Muovo la particella
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap-around: se esce da un lato, rientra dal lato opposto
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`;
      ctx.fill();
    });

    // Disegno linee sottili tra particelle vicine, per un effetto "rete" discreto
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(96, 165, 250, ${0.08 * (1 - distance / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  // Ridisegno tutto se la finestra cambia dimensione (resize del browser)
  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });
}

function initTypingEffect() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;

  // Le parole da alternare sono lette da un attributo data- nell'HTML,
  // separate da virgola, così il contenuto resta modificabile senza toccare il JS
  const words = (el.dataset.typing || '').split(',').map((w) => w.trim());
  if (!words.length) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    el.textContent = currentWord.substring(0, charIndex);

    let delay = isDeleting ? 50 : 120;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 1800; // pausa quando la parola è completa
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}
