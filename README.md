## TRAZIO website

Sito statico (HTML, CSS, JavaScript) pubblicato su GitHub Pages con il dominio `www.trazio.it`.

## Struttura

```
index.html, about.html, services.html, projects.html, contact.html, 404.html
privacy-policy.html, cookie-policy.html, terms-of-service.html
robots.txt, sitemap.xml, CNAME

css/
  variables.css     colori, font, spaziature
  style.css         layout e componenti
  animations.css    hero, copertine dei lavori, linea del metodo
  responsive.css    tablet e mobile

js/
  config.js         endpoint Formspree e dati del sito
  main.js           avvio, form contatti, fallback immagini
  navbar.js         navbar e menu mobile
  scroll.js         copertine, metodo, torna su
  projects.js       progetti da projects.json
  projects.json     dati dei progetti
  calculator.js     calcolatore preventivo (services.html)

assets/             font, immagini, icone
projects/           pagine dei singoli progetti
```

## Note

- `assets/images/trazio-bimi-logo.svg` serve al BIMI delle email: non va rimosso anche se il sito non lo usa.
- Il sito non usa cookie né analytics, quindi non c'è banner. Se si aggiunge un servizio esterno va aggiornata la cookie policy e la Content-Security-Policy nelle pagine.
- I prezzi in `js/calculator.js` devono coincidere con quelli in `services.html`.

## In locale

```bash
python3 -m http.server 8000
```

Poi apri http://localhost:8000.
