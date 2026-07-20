/* ============================================================
   NAVBAR.JS
   Obiettivo: 1) aggiungere l'effetto "vetro" alla navbar quando
   si scrolla oltre una certa soglia, 2) gestire l'apertura/chiusura
   del menu mobile con l'hamburger animato, 3) evidenziare il link
   della sezione attualmente visibile (active link on scroll).
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
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      links.classList.toggle('is-open', isOpen);
      // Blocco lo scroll del body quando il menu è aperto, per non
      // avere due scroll contemporanei (pagina + menu)
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Chiudo il menu quando si clicca un link (utile su mobile:
    // altrimenti il menu resta aperto sopra la sezione appena raggiunta)
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        links.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 3. Link attivo in base alla sezione visibile ---
  // Uso IntersectionObserver invece di calcolare a mano gli scrollY:
  // è più performante perché non gira ad ogni singolo evento di scroll,
  // ma solo quando una sezione entra/esce realmente dallo schermo.
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a[href^="#"]');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle(
                'is-active',
                link.getAttribute('href') === `#${entry.target.id}`
              );
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' } // considera "attiva" la sezione quando occupa la zona centrale dello schermo
    );

    sections.forEach((section) => observer.observe(section));
  }
}
