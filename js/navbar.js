function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const links = document.querySelector('.navbar__links');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 50;
  function handleNavbarScroll() {
    navbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Menu mobile
  if (hamburger && links) {
    const setOpen = (isOpen) => {
      hamburger.classList.toggle('is-open', isOpen);
      links.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => {
      const willOpen = !hamburger.classList.contains('is-open');
      setOpen(willOpen);
      // I link stanno prima del bottone nell'HTML: sposto il focus
      if (willOpen) {
        const firstLink = links.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburger.classList.contains('is-open')) {
        setOpen(false);
        hamburger.focus();
      }
    });
  }
}
