from pathlib import Path
from datetime import datetime
import shutil
import re

# ============================================================
# CONFIGURAZIONE
# ============================================================

BASE_DIR = Path.cwd()

SERVICES = BASE_DIR / "services.html"
CSS = BASE_DIR / "css" / "style.css"

if not SERVICES.exists():
    raise FileNotFoundError(f"File non trovato: {SERVICES}")

if not CSS.exists():
    raise FileNotFoundError(f"File non trovato: {CSS}")

# ============================================================
# BACKUP
# ============================================================

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
BACKUP_DIR = BASE_DIR / f"BACKUP_SERVICES_{timestamp}"

BACKUP_DIR.mkdir(exist_ok=True)

shutil.copy2(SERVICES, BACKUP_DIR / "services.html")
shutil.copy2(CSS, BACKUP_DIR / "style.css")

print()
print("✅ Backup creato:")
print(BACKUP_DIR)
print()

# ============================================================
# LETTURA FILE
# ============================================================

html = SERVICES.read_text(encoding="utf-8")
css = CSS.read_text(encoding="utf-8")

original_html = html
original_css = css

# ============================================================
# 1. RIMOZIONE PACCHETTI DUPLICATI
# ============================================================

# Manteniamo solamente il blocco compreso tra questi marker.
# Se esiste il blocco nuovo, eliminiamo tutto il contenuto
# precedente della sezione pacchetti.

pricing_start = "<!-- PRICING_PACKAGES_START -->"
pricing_end = "<!-- PRICING_PACKAGES_END -->"

if pricing_start in html and pricing_end in html:

    start_marker = html.index(pricing_start)
    end_marker = html.index(pricing_end) + len(pricing_end)

    # Trova il precedente titolo "PACCHETTI" tramite la struttura
    # del file e rimuove il vecchio blocco compreso tra il primo
    # blocco pacchetti e quello nuovo.

    before_pricing = html[:start_marker]

    old_package_section = re.search(
        r'\n\s*<!--\s*PACCHETTI\s*-->\s*.*?\n\s*</div>\s*\n\s*<!--\s*PRICING_PACKAGES_START\s*-->',
        before_pricing,
        flags=re.DOTALL | re.IGNORECASE
    )

    if old_package_section:
        replacement = "\n\n<!-- PRICING_PACKAGES_START -->"
        html = (
            html[:old_package_section.start()]
            + replacement
            + html[start_marker + len(pricing_start):]
        )

        print("✅ Vecchio blocco Pacchetti duplicato rimosso.")

    else:
        print("ℹ️ Nessun vecchio blocco Pacchetti duplicato trovato.")

else:
    print("⚠️ Marker pricing non trovati.")
    print("Nessuna modifica automatica alla sezione Pacchetti.")

# ============================================================
# 2. TABELLA COMPARATIVA
# ============================================================

comparison_marker = "<!-- PRICING_COMPARISON_START -->"

comparison_section = f"""
<!-- PRICING_COMPARISON_START -->

<div class="section-header reveal u-mt-5xl">

<span class="section-eyebrow">
Confronta i pacchetti
</span>

<h2 class="section-title">
Cosa include ogni soluzione
</h2>

<p class="section-subtitle">
Un confronto rapido per aiutarti a scegliere il punto di partenza
più adatto alla tua attività.
</p>

</div>

<div class="pricing-table-wrapper reveal">

<table class="pricing-table">

<thead>
<tr>
<th>Caratteristica</th>
<th>START</th>
<th>BUSINESS</th>
<th>CUSTOM</th>
</tr>
</thead>

<tbody>

<tr>
<td>Analisi iniziale</td>
<td>✓</td>
<td>✓</td>
<td>✓</td>
</tr>

<tr>
<td>Design personalizzato</td>
<td>✓</td>
<td>✓</td>
<td>✓</td>
</tr>

<tr>
<td>Responsive mobile / tablet / desktop</td>
<td>✓</td>
<td>✓</td>
<td>✓</td>
</tr>

<tr>
<td>Fino a 5 sezioni / pagine</td>
<td>✓</td>
<td>✓</td>
<td>Su misura</td>
</tr>

<tr>
<td>Modulo contatti</td>
<td>✓</td>
<td>✓</td>
<td>Su misura</td>
</tr>

<tr>
<td>Collegamento social</td>
<td>✓</td>
<td>✓</td>
<td>✓</td>
</tr>

<tr>
<td>SEO di base</td>
<td>—</td>
<td>✓</td>
<td>Su misura</td>
</tr>

<tr>
<td>SEO locale</td>
<td>—</td>
<td>✓</td>
<td>Su richiesta</td>
</tr>

<tr>
<td>Animazioni avanzate</td>
<td>—</td>
<td>✓</td>
<td>Su misura</td>
</tr>

<tr>
<td>Ottimizzazione performance</td>
<td>Base</td>
<td>Avanzata</td>
<td>Su misura</td>
</tr>

<tr>
<td>Galleria e contenuti multimediali</td>
<td>—</td>
<td>✓</td>
<td>Su misura</td>
</tr>

<tr>
<td>Dominio e pubblicazione</td>
<td>✓</td>
<td>✓</td>
<td>✓</td>
</tr>

<tr>
<td>Supporto post-pubblicazione</td>
<td>Iniziale</td>
<td>✓</td>
<td>Definito nel progetto</td>
</tr>

<tr>
<td>Tempi indicativi</td>
<td>1–2 settimane</td>
<td>2–4 settimane</td>
<td>Da definire</td>
</tr>

<tr class="pricing-table__price">
<td>Prezzo</td>
<td>da 590€</td>
<td>da 1.190€</td>
<td>Preventivo</td>
</tr>

</tbody>

</table>

</div>

<!-- PRICING_COMPARISON_END -->
"""

# Inseriamo la tabella subito dopo la fine del blocco pricing.
if "<!-- PRICING_COMPARISON_START -->" not in html:

    if pricing_end in html:
        html = html.replace(
            pricing_end,
            pricing_end + "\n" + comparison_section,
            1
        )

        print("✅ Tabella comparativa aggiunta.")

    else:
        print("⚠️ Impossibile inserire la tabella comparativa.")

else:
    print("ℹ️ Tabella comparativa già presente.")

# ============================================================
# 3. MANUTENZIONE
# ============================================================

maintenance_start = "<!-- MAINTENANCE_PLANS_START -->"
maintenance_end = "<!-- MAINTENANCE_PLANS_END -->"

maintenance_section = f"""
<!-- MAINTENANCE_PLANS_START -->

<div class="section-header reveal u-mt-5xl">

<span class="section-eyebrow">
Supporto
</span>

<h2 class="section-title">
Manutenzione e gestione
</h2>

<p class="section-subtitle">
Mantieni il tuo sito aggiornato, sicuro e funzionale
con un servizio di assistenza continuativo.
</p>

</div>

<div class="grid grid--3 maintenance-grid">

<!-- BASE -->

<div class="card package-card reveal">

<h3 class="service-card__title">
BASE
</h3>

<p>
Per chi vuole mantenere il sito aggiornato
con un supporto essenziale.
</p>

<div class="package-card__price">
49€/mese
</div>

<ul class="package-card__list">

<li>Aggiornamento contenuti</li>

<li>Modifica di testi e immagini</li>

<li>Controlli tecnici di base</li>

<li>Piccoli interventi</li>

<li>Assistenza via email</li>

</ul>

<a href="contact.html" class="btn btn--secondary">
Richiedi informazioni
</a>

</div>


<!-- STANDARD -->

<div class="card package-card package-card--featured reveal" data-delay="150">

<div class="package-card__badge">
Consigliato
</div>

<h3 class="service-card__title">
STANDARD
</h3>

<p>
Per attività che desiderano un supporto
più completo e continuativo.
</p>

<div class="package-card__price">
99€/mese
</div>

<ul class="package-card__list">

<li>Tutto il piano BASE</li>

<li>Aggiornamenti contenuti più frequenti</li>

<li>Controlli tecnici periodici</li>

<li>Backup periodici</li>

<li>Interventi di manutenzione ordinaria</li>

<li>Assistenza prioritaria</li>

</ul>

<a href="contact.html" class="btn btn--primary">
Richiedi informazioni
</a>

</div>


<!-- PREMIUM -->

<div class="card package-card reveal" data-delay="300">

<h3 class="service-card__title">
PREMIUM
</h3>

<p>
Per chi necessita di una gestione digitale
più completa e di interventi personalizzati.
</p>

<div class="package-card__price">
199€/mese
</div>

<ul class="package-card__list">

<li>Tutto il piano STANDARD</li>

<li>Gestione contenuti continuativa</li>

<li>Monitoraggio tecnico</li>

<li>Backup e controlli periodici</li>

<li>Interventi prioritari</li>

<li>Supporto dedicato</li>

</ul>

<a href="contact.html" class="btn btn--secondary">
Parliamone
</a>

</div>

</div>

<p class="maintenance-note reveal">
I piani di manutenzione possono essere personalizzati in base
alle esigenze del progetto. Interventi straordinari e nuove
funzionalità vengono valutati separatamente.
</p>

<!-- MAINTENANCE_PLANS_END -->
"""

if maintenance_start in html and maintenance_end in html:

    start = html.index(maintenance_start)
    end = html.index(maintenance_end) + len(maintenance_end)

    html = (
        html[:start]
        + maintenance_section.strip()
        + html[end:]
    )

    print("✅ Sezione manutenzione aggiornata.")

else:

    # Cerca il vecchio blocco manutenzione.
    maintenance_pattern = re.compile(
        r'<!--\s*MANUTENZIONE\s*-->.*?(?=<!--\s*PROCESSO\s*-->)',
        flags=re.DOTALL | re.IGNORECASE
    )

    match = maintenance_pattern.search(html)

    if match:

        html = (
            html[:match.start()]
            + maintenance_section.strip()
            + "\n\n"
            + html[match.end():]
        )

        print("✅ Vecchia sezione manutenzione sostituita.")

    else:

        print("⚠️ Sezione manutenzione non trovata.")
        print("La manutenzione non è stata modificata.")

# ============================================================
# 4. CSS TABELLA E MANUTENZIONE
# ============================================================

css_section = """
/* ============================================================
   PRICING COMPARISON TABLE
   ============================================================ */

.pricing-table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin-top: var(--space-3xl);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: rgba(255,255,255,0.02);
}

.pricing-table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  text-align: left;
}

.pricing-table th,
.pricing-table td {
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.pricing-table th {
  font-weight: var(--fw-semibold);
  color: var(--color-text-primary);
  background: rgba(255,255,255,0.04);
}

.pricing-table td {
  color: var(--color-text-secondary);
}

.pricing-table tbody tr:last-child td {
  border-bottom: none;
}

.pricing-table__price td {
  font-weight: var(--fw-bold);
  color: var(--color-primary-light);
}

.pricing-table tbody tr:hover td {
  background: rgba(255,255,255,0.025);
}


/* ============================================================
   MAINTENANCE PLANS
   ============================================================ */

.maintenance-grid {
  margin-top: var(--space-3xl);
}

.maintenance-grid .package-card {
  height: 100%;
}

.maintenance-note {
  max-width: 850px;
  margin: var(--space-2xl) auto 0;
  text-align: center;
  color: var(--color-text-muted);
  line-height: 1.7;
}


/* ============================================================
   RESPONSIVE PRICING TABLE
   ============================================================ */

@media (max-width: 768px) {

  .pricing-table-wrapper {
    border-radius: var(--radius-md);
  }

  .pricing-table th,
  .pricing-table td {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--fs-small);
  }

}
"""

if "PRICING COMPARISON TABLE" not in css:

    css += "\n\n" + css_section.strip() + "\n"

    print("✅ CSS tabella e manutenzione aggiunto.")

else:

    print("ℹ️ CSS pricing già presente.")

# ============================================================
# 5. SALVATAGGIO
# ============================================================

SERVICES.write_text(html, encoding="utf-8")
CSS.write_text(css, encoding="utf-8")

print()
print("============================================")
print("🎉 OPERAZIONE COMPLETATA")
print("============================================")
print()

print("File modificati:")
print("  • services.html")
print("  • css/style.css")

print()
print("Backup disponibile in:")
print(f"  • {BACKUP_DIR}")

print()
print("⚠️ NON è stato eseguito git add, commit o push.")
print()

print("Controlla le modifiche con:")
print("  git diff --stat")

print()
print("Poi controlla il diff completo con:")
print("  git diff")

print()
print("Se tutto è corretto, potrai eseguire:")
print("  git add services.html css/style.css")
print('  git commit -m "Update pricing comparison and maintenance plans"')
print("  git push")

print()

if html == original_html and css == original_css:
    print("⚠️ ATTENZIONE: nessun cambiamento rilevato.")

else:
    print("✅ I file sono stati modificati correttamente.")

print()
