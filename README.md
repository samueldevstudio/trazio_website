## TRAZIO WEBSITE

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
│   ├── images/         
│   ├── icons/          
│   ├── videos/
│   └── fonts/
└── projects/
    ├── lucifero.html
    ├── toolkit.html
    ├── training.html
    └── molinari.html
```


## Estensioni future (già previste dall'architettura)

Grazie alla separazione in variabili CSS e moduli JS indipendenti, il progetto è pronto per essere esteso con: blog, dashboard cliente, autenticazione, CMS, multi-lingua, sistema di prenotazione, chatbot AI, filtri portfolio — senza dover riscrivere le fondamenta