# Samuel Gentile — Portfolio

Sito personale statico (HTML5 / CSS3 / Vanilla JS), pronto per il deploy su GitHub Pages.

## Struttura del progetto

```
portfolio/
├── index.html
├── about.html
├── services.html
├── projects.html
├── contact.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── css/
│   ├── variables.css   → design system (colori, font, spaziature)
│   ├── style.css       → stili base e componenti
│   ├── animations.css  → keyframes
│   └── responsive.css  → media query mobile/tablet
├── js/
│   ├── main.js         → entry point, orchestratore
│   ├── cursor.js       → cursore custom
│   ├── navbar.js       → navbar sticky + menu mobile
│   ├── scroll.js       → reveal, progress bar, back-to-top, contatori
│   └── animations.js   → particelle hero + typing effect
├── assets/
│   ├── images/         ⚠️ DA COMPLETARE (vedi sotto)
│   ├── icons/           ⚠️ favicon.ico mancante
│   ├── videos/
│   └── fonts/
└── projects/
    ├── lucifero.html
    ├── toolkit.html
    ├── training.html
    └── molinari.html
```

## ⚠️ Cose da aggiungere prima del deploy

Il codice è completo e funzionante, ma alcuni asset binari (immagini, favicon) **non sono stati generati** e vanno aggiunti manualmente:

1. **Favicon**: aggiungi un file `assets/icons/favicon.ico`
2. **Immagini progetti**: aggiungi in `assets/images/`:
   - `lucifero-cover.jpg`
   - `toolkit-cover.jpg`
   - `training-cover.jpg`
   - `molinari-cover.jpg`
   - `og-cover.jpg` (immagine di anteprima per la condivisione social, 1200x630px consigliato)
3. **Font**: il sito usa Google Fonts (Inter) via CDN — nessuna azione richiesta, ma se vuoi ospitare i font localmente per performance/privacy, scaricali in `assets/fonts/`.
4. **Link social reali**: sostituisci i placeholder `#` per LinkedIn e il link "Scarica CV" con i tuoi URL reali.
5. **Form di contatto**: essendo un sito statico, l'invio del form è attualmente simulato in `main.js` (`initContactForm`). Per un invio reale, collega un servizio come Formspree, EmailJS o Netlify Forms.
6. **Dominio**: sostituisci `https://samuelgentile.dev/` in `sitemap.xml`, `robots.txt` e nei meta Open Graph con il tuo dominio reale (o l'URL di GitHub Pages).

## Deploy su GitHub Pages

1. Crea una repository su GitHub e carica tutto il contenuto della cartella `portfolio/`
2. Vai su **Settings → Pages**
3. Seleziona il branch `main` e la cartella `/root`
4. Il sito sarà live su `https://tuo-username.github.io/nome-repo/`

## Estensioni future (già previste dall'architettura)

Grazie alla separazione in variabili CSS e moduli JS indipendenti, il progetto è pronto per essere esteso con: blog, dashboard cliente, autenticazione, CMS, multi-lingua, sistema di prenotazione, chatbot AI, filtri portfolio — senza dover riscrivere le fondamenta.
