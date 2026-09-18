/* ============================================================
   NAVBAR.JS
   Obiettivo: 1) aggiungere l'effetto "vetro" alla navbar quando
   si scrolla oltre una certa soglia, 2) gestire l'apertura/chiusura
   del menu mobile con l'hamburger animato (stato esposto anche
   agli screen reader via aria-expanded).
   ============================================================ */

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const links = document.querySelector('.navbar__links');
  if (!navbar) return;

  // --- 1. Effetto glass on scroll ---
  // Uso una soglia (50px) invece di "scrollY > 0" per evitare che
  // l'effetto scatti con un minimo scroll accidentale (più naturale).
  const SCROLL_THRESHOLD = 50;
  function handleNavbarScroll() {
    navbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // esegue subito, nel caso la pagina si apra già scrollata

  // --- 2. Menu mobile (hamburger) ---
  if (hamburger && links) {
    const setOpen = (isOpen) => {
      hamburger.classList.toggle('is-open', isOpen);
      links.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
      // Blocco lo scroll del body quando il menu è aperto, per non
      // avere due scroll contemporanei (pagina + menu)
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => {
      setOpen(!hamburger.classList.contains('is-open'));
    });

    // Chiudo il menu quando si clicca un link (utile su mobile:
    // altrimenti il menu resta aperto sopra la sezione appena raggiunta)
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    // Esc chiude il menu, come ci si aspetta da qualsiasi pannello
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
        setOpen(false);
        hamburger.focus();
      }
    });
  }
}
