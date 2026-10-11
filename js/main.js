/* ============================================================
   MAIN.JS
   Obiettivo: punto di ingresso unico del sito. Aspetta che il DOM
   sia pronto e poi inizializza, in ordine logico, tutti i moduli
   definiti negli altri file JS (navbar.js, scroll.js).

   Perché un solo entry point: evita di dover aggiungere N tag
   <script> con N "DOMContentLoaded" sparsi — tutto parte da qui,
   in un ordine controllato e leggibile.
   ============================================================ */

// Esegue ogni init in isolamento: se uno di questi moduli lancia un
// errore (es. su un browser particolare), non deve bloccare gli altri —
// altrimenti, per esempio, le copertine dei progetti (che partono
// nascoste via CSS) resterebbero coperte. onError è il ripiego.
function runSafe(fn, name, onError) {
  try {
    fn();
  } catch (err) {
    console.error(`Errore nell'inizializzazione di "${name}":`, err);
    if (onError) onError();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  runSafe(initNavbar, 'initNavbar');                // da navbar.js
  runSafe(initMediaReveal, 'initMediaReveal', revealAllMedia); // da scroll.js
  runSafe(initBackToTop, 'initBackToTop');          // da scroll.js
  runSafe(initMethodProgress, 'initMethodProgress'); // da scroll.js
  runSafe(initContactForm, 'initContactForm');
  runSafe(initImageFallback, 'initImageFallback');
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

    // Messaggio sotto il pulsante (role="status"): letto anche dai lettori
    // di schermo. state: 'error' | 'success' | '' per il colore.
    const status = form.querySelector('.form-status');
    const setStatus = (text, state = '') => {
      if (!status) return;
      status.textContent = text;
      status.dataset.state = state;
    };

    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const messageField = form.querySelector('#message');
    const name = nameField ? nameField.value.trim() : '';
    const email = emailField ? emailField.value.trim() : '';
    const message = messageField ? messageField.value.trim() : '';

    if (!name || !email || !message) {
      setStatus('Compila nome, email e messaggio prima di inviare.', 'error');
      return;
    }

    // Costruisce il payload da TUTTI i campi presenti nel form (inclusi
    // checkbox come il consenso privacy), non solo dai tre principali,
    // altrimenti dati come il consenso non arrivano mai a Formspree
    const dataToSend = {};
    new FormData(form).forEach((value, key) => {
      dataToSend[key] = value;
    });
    if (!dataToSend._subject) {
      dataToSend._subject = 'Nuova richiesta dal sito TRAZIO - ' + name;
    }

    // Stato di caricamento
    submitBtn.textContent = 'Invio in corso...';
    submitBtn.disabled = true;
    setStatus('');

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
        submitBtn.textContent = 'Messaggio inviato';
        setStatus("Messaggio inviato. Ti rispondo all'indirizzo email che hai indicato.", 'success');
        form.reset();

        // Ripristina il bottone dopo 3 secondi (il messaggio sotto resta)
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error(data.error || 'Errore nell\'invio del messaggio');
      }
    } catch (error) {
      console.error('Errore form:', error);
      // Il testo scritto resta nei campi: basta premere di nuovo il pulsante
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      setStatus('Il messaggio non è partito. Riprova tra qualche minuto oppure scrivimi a info@trazio.it.', 'error');
    }
  });
}
