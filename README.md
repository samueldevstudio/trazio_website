## TRAZIO WEBSITE

Sito statico (HTML, CSS, JavaScript vanilla) pubblicato su GitHub Pages con dominio `www.trazio.it`.

## Struttura del progetto

```
TRAZIO/
├── index.html              → home
├── about.html              → chi sono
├── services.html           → servizi, pacchetti, manutenzione, calcolatore, FAQ
├── projects.html           → progetti (caricati da js/projects.json)
├── contact.html            → contatti (form Formspree)
├── 404.html
├── privacy-policy.html · cookie-policy.html · terms-of-service.html
├── robots.txt · sitemap.xml · CNAME
├── css/
│   ├── variables.css       → design system (colori, font, spaziature)
│   ├── style.css           → reset, layout e tutti i componenti
│   ├── animations.css      → entrata della hero, reveal, liste in sequenza, linea del metodo
│   └── responsive.css      → media query tablet/mobile + reduced motion
├── js/
│   ├── config.js           → endpoint Formspree e dati del sito
│   ├── main.js             → entry point: loader, ripple, form, fallback immagini
│   ├── navbar.js           → navbar sticky + menu mobile accessibile
│   ├── scroll.js           → reveal, progress bar, back-to-top, parallax
│   ├── projects.js         → render dei progetti da projects.json
│   ├── projects.json       → dati dei progetti
│   └── calculator.js       → calcolatore preventivo (solo services.html)
├── assets/
│   ├── fonts/              → Inter e Poppins in woff2 (ospitati sul sito, niente Google Fonts)
│   ├── images/             → cover progetti, screenshot della home (chi sono), pattern, og-cover
│   └── icons/favicon.svg
└── projects/               → pagine dettaglio progetto
```

Il brand kit (`TRAZIO_BRAND_KIT_3/`) resta solo in locale: è in `.gitignore`
per non essere pubblicato sul sito né su GitHub.

## Note

- **Logo**: in navbar, loader e footer il logo è composto da simbolo SVG inline + parola "TRAZIO" in Poppins (classi `.brand-mark` / `.brand-word`), così resta nitido a ogni dimensione. `assets/images/logo-light.svg` è il lockup per fondo chiaro (usato nei dati strutturati); `trazio-bimi-logo.svg` serve al BIMI delle email e non va rimosso anche se il sito non lo usa.
- **Cookie**: il sito non imposta cookie propri e non usa analytics, quindi non c'è banner di consenso. Se in futuro si aggiunge un servizio di analytics, va reintrodotto un banner e aggiornata `cookie-policy.html`.
- **Prezzi**: i prezzi del calcolatore (`js/calculator.js`) devono coincidere con quelli scritti in `services.html`.

## Sviluppo locale

```bash
python3 -m http.server 8000
```

Poi apri http://localhost:8000. La guida per sviluppatori (`README_DEV.md`) e quella di pubblicazione (`DEPLOYMENT.md`) restano solo in locale.
