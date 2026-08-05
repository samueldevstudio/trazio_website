// Gestione Cookie Banner e Consenso - GDPR Compliant
class CookieConsent {
  constructor() {
    this.consentKey = 'trazio_cookie_consent';
    this.consent = this.getConsent();
    this.init();
  }

  init() {
    // Crea il banner se non esiste
    this.createBanner();
    
    // Mostra il banner se non c'è consenso
    if (!this.consent) {
      this.showBanner();
    } else {
      // Applica le preferenze salvate
      this.applyConsent(this.consent);
    }

    // Aggiungi event listeners
    this.addEventListeners();
  }

  getConsent() {
    try {
      const saved = localStorage.getItem(this.consentKey);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Errore nel leggere il consenso cookie:', e);
      return null;
    }
  }

  saveConsent(consent) {
    try {
      localStorage.setItem(this.consentKey, JSON.stringify(consent));
      this.consent = consent;
    } catch (e) {
      console.error('Errore nel salvare il consenso cookie:', e);
    }
  }

  createBanner() {
    if (document.getElementById('cookie-banner')) return;

    const bannerHTML = `
      <div id="cookie-banner" class="cookie-banner" role="dialog" aria-label="Gestione consenso cookie">
        <div class="cookie-banner__inner">
          <div class="cookie-banner__content">
            <h3 class="cookie-banner__title">Utilizziamo i cookie</h3>
            <p class="cookie-banner__text">
              Utilizziamo cookie tecnici essenziali per il funzionamento del sito e cookie analytics per migliorare l'esperienza utente. 
              Puoi scegliere quali cookie accettare o rifiutare.
            </p>
            <div class="cookie-banner__options">
              <label class="cookie-option">
                <input type="checkbox" id="cookie-essential" checked disabled>
                <span>Cookie Essenziali (sempre attivi)</span>
              </label>
              <label class="cookie-option">
                <input type="checkbox" id="cookie-analytics" checked>
                <span>Cookie Analytics</span>
              </label>
            </div>
            <a href="cookie-policy.html" class="cookie-banner__link">Scopri di più nella Cookie Policy</a>
          </div>
          <div class="cookie-banner__actions">
            <button class="btn btn--secondary cookie-banner__btn--accept-all">Accetta Tutti</button>
            <button class="btn btn--secondary cookie-banner__btn--accept-selected">Accetta Selezionati</button>
            <button class="btn btn--secondary cookie-banner__btn--reject">Rifiutta Tutti</button>
          </div>
          <button class="cookie-banner__close" aria-label="Chiudi banner">×</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bannerHTML);
  }

  showBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.add('cookie-banner--visible');
    }
  }

  hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.classList.remove('cookie-banner--visible');
    }
  }

  addEventListeners() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    // Accetta tutti
    const acceptAllBtn = banner.querySelector('.cookie-banner__btn--accept-all');
    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', () => {
        this.acceptAll();
      });
    }

    // Accetta selezionati
    const acceptSelectedBtn = banner.querySelector('.cookie-banner__btn--accept-selected');
    if (acceptSelectedBtn) {
      acceptSelectedBtn.addEventListener('click', () => {
        this.acceptSelected();
      });
    }

    // Rifiutta tutti
    const rejectBtn = banner.querySelector('.cookie-banner__btn--reject');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        this.rejectAll();
      });
    }

    // Chiudi banner
    const closeBtn = banner.querySelector('.cookie-banner__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideBanner();
      });
    }
  }

  acceptAll() {
    const consent = {
      essential: true,
      analytics: true,
      timestamp: new Date().toISOString()
    };
    this.saveConsent(consent);
    this.applyConsent(consent);
    this.hideBanner();
  }

  acceptSelected() {
    const analyticsCheckbox = document.getElementById('cookie-analytics');
    const consent = {
      essential: true,
      analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
      timestamp: new Date().toISOString()
    };
    this.saveConsent(consent);
    this.applyConsent(consent);
    this.hideBanner();
  }

  rejectAll() {
    const consent = {
      essential: true,
      analytics: false,
      timestamp: new Date().toISOString()
    };
    this.saveConsent(consent);
    this.applyConsent(consent);
    this.hideBanner();
  }

  applyConsent(consent) {
    // Essenziali sempre attivi
    console.log('Cookie essenziali attivi');

    // Analytics
    if (consent.analytics) {
      console.log('Cookie analytics attivi');
      this.enableAnalytics();
    } else {
      console.log('Cookie analytics disattivati');
      this.disableAnalytics();
    }
  }

  enableAnalytics() {
    // Qui puoi attivare Google Analytics o altri servizi analytics
    // Esempio: window.dataLayer = window.dataLayer || [];
    // In futuro, quando verrà integrato GA, il codice verrà caricato qui
  }

  disableAnalytics() {
    // Disabilita Google Analytics se presente
    if (window['ga-disable-UA-XXXXX-Y']) {
      window['ga-disable-UA-XXXXX-Y'] = true;
    }
  }

  // Metodo per modificare le preferenze (chiamato dal link nel footer)
  static openPreferences() {
    const instance = new CookieConsent();
    instance.showBanner();
  }
}

// Aggiungi link nel footer per gestire i cookie
function addCookiePreferencesLink() {
  const footer = document.querySelector('.footer');
  if (footer) {
    const existingLink = footer.querySelector('.cookie-preferences-link');
    if (!existingLink) {
      const link = document.createElement('a');
      link.href = '#';
      link.className = 'cookie-preferences-link';
      link.textContent = 'Gestisci Cookie';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        CookieConsent.openPreferences();
      });
      
      const legalSection = footer.querySelector('.footer__legal');
      if (legalSection) {
        legalSection.appendChild(link);
      }
    }
  }
}

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
    addCookiePreferencesLink();
  });
} else {
  new CookieConsent();
  addCookiePreferencesLink();
}