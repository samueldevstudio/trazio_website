/* ============================================================
   MAIN.JS
   Obiettivo: punto di ingresso unico del sito. Aspetta che il DOM
   sia pronto e poi inizializza, in ordine logico, tutti i moduli
   definiti negli altri file JS (cursor.js, navbar.js, scroll.js,
   animations.js). Gestisce anche il loading screen e i ripple
   sui bottoni.

   Perché un solo entry point: evita di dover aggiungere N tag
   <script> con N "DOMContentLoaded" sparsi — tutto parte da qui,
   in un ordine controllato e leggibile.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCustomCursor();   // da cursor.js
  initNavbar();          // da navbar.js
  initScrollReveal();    // da scroll.js
  initScrollProgress();  // da scroll.js
  initBackToTop();       // da scroll.js
  initParallax();        // da scroll.js
  initSkillBars();       // da scroll.js
  initStatCounters();    // da scroll.js
  initParticles();       // da animations.js
  initTypingEffect();    // da animations.js
  initButtonRipple();
  initContactForm();
  initImageFallback();
});

/* --- Fallback immagini: se un'immagine progetto non carica (404),
   nascondo l'icona "rotta" del browser e mostro uno sfondo elegante
   con il titolo del progetto al suo posto. --- */
function initImageFallback() {
  document.querySelectorAll('.project-card__media img').forEach((img) => {
    img.addEventListener('error', () => {
      const wrapper = img.closest('.project-card__media');
      if (!wrapper) return;
      wrapper.classList.add('is-missing');
      // Uso il testo alternativo dell'immagine come etichetta del placeholder
      wrapper.dataset.fallbackLabel = img.alt || 'Anteprima non disponibile';
    });
  });
}

/* --- Loading screen: nascosto dopo che la pagina è pronta,
   con un piccolo delay minimo per evitare un "flash" troppo rapido
   che sembrerebbe un bug più che un caricamento --- */
function initLoader() {
  const loader = document.querySelector('.loader');
  const hero = document.querySelector('.hero');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('is-hidden');
      if (hero) hero.classList.add('is-loaded'); // fa partire le animazioni di entrata della hero
    }, 600);
  });
}

/* --- Effetto ripple sui bottoni: genera un cerchio che si espande
   dal punto esatto del click, poi si rimuove da solo --- */
function initButtonRipple() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.className = 'btn__ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      this.appendChild(ripple);
      // Rimuovo l'elemento dopo la durata dell'animazione (0.6s in CSS),
      // altrimenti si accumulano nodi inutili nel DOM
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* --- Form di contatto con Formspree.
   Invia email reali tramite Formspree (configurato in js/config.js).
   Include validazione, stato di caricamento e feedback utente. --- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Verifica che l'endpoint Formspree sia configurato
    if (!CONFIG.formspreeEndpoint) {
      alert('Il form di contatto non è ancora configurato. Vedi js/config.js per istruzioni.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Raccoglie automaticamente tutti i campi del form
    // (nome, email, azienda, tipo di progetto, messaggio, ecc.)
    const formData = new FormData(form);
    const dataToSend = Object.fromEntries(formData.entries());

    // Validazione base
    const name = dataToSend.name?.trim();
    const email = dataToSend.email?.trim();
    const message = dataToSend.message?.trim();

    if (!name || !email || !message) {
      alert('Per favore compila tutti i campi obbligatori.');
      return;
    }

    // Subject personalizzato
    dataToSend._subject = 'Nuova richiesta dal portfolio - ' + name;

    // Stato di caricamento
    submitBtn.textContent = 'Invio in corso...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(CONFIG.formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (response.ok) {
        submitBtn.textContent = 'Messaggio inviato ✓';
        form.reset();
        
        // Ripristina il bottone dopo 3 secondi
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error(data.error || 'Errore nell\'invio del messaggio');
      }
    } catch (error) {
      console.error('Errore form:', error);
      submitBtn.textContent = 'Errore - Riprova';
      submitBtn.disabled = false;
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
      }, 3000);
    }
  });
}
