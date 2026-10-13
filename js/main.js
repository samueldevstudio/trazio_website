// Un errore in un modulo non deve bloccare gli altri
function runSafe(fn, name, onError) {
  try {
    fn();
  } catch (err) {
    console.error(`Errore nell'inizializzazione di "${name}":`, err);
    if (onError) onError();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  runSafe(initNavbar, 'initNavbar');
  runSafe(initMediaReveal, 'initMediaReveal', revealAllMedia);
  runSafe(initBackToTop, 'initBackToTop');
  runSafe(initMethodProgress, 'initMethodProgress');
  runSafe(initContactForm, 'initContactForm');
  runSafe(initImageFallback, 'initImageFallback');
});

// Se una copertina non carica, mostro il titolo al suo posto
function initImageFallback() {
  document.querySelectorAll('.project-card__media img').forEach((img) => {
    img.addEventListener('error', () => {
      const wrapper = img.closest('.project-card__media');
      if (!wrapper) return;
      wrapper.classList.add('is-missing');
      wrapper.dataset.fallbackLabel = img.alt || 'Anteprima non disponibile';
    });
  });
}

// Form contatti (Formspree, endpoint in config.js)
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!CONFIG.formspreeEndpoint) {
      alert('Il form di contatto non è ancora configurato. Vedi js/config.js per istruzioni.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

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

    // Tutti i campi, compreso il consenso privacy
    const dataToSend = {};
    new FormData(form).forEach((value, key) => {
      dataToSend[key] = value;
    });
    if (!dataToSend._subject) {
      dataToSend._subject = 'Nuova richiesta dal sito TRAZIO - ' + name;
    }

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

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error(data.error || 'Errore nell\'invio del messaggio');
      }
    } catch (error) {
      console.error('Errore form:', error);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      setStatus('Il messaggio non è partito. Riprova tra qualche minuto oppure scrivimi a info@trazio.it.', 'error');
    }
  });
}
