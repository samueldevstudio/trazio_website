from pathlib import Path
import shutil
from datetime import datetime
import re

SERVICES = Path("services.html")

if not SERVICES.exists():
    raise FileNotFoundError("services.html non trovato.")

# ============================================================
# BACKUP
# ============================================================

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
BACKUP_DIR = Path(f"BACKUP_REMOVE_OLD_PACKAGES_{timestamp}")
BACKUP_DIR.mkdir()

shutil.copy2(SERVICES, BACKUP_DIR / "services.html")

print()
print("✅ Backup creato:")
print(BACKUP_DIR)
print()

# ============================================================
# LETTURA
# ============================================================

html = SERVICES.read_text(encoding="utf-8")

# ============================================================
# RIMOZIONE VECCHIO BLOCCO PACCHETTI
# ============================================================

start_marker = "<!-- PACCHETTI -->"
end_marker = "<!-- PRICING_PACKAGES_START -->"

start = html.find(start_marker)
end = html.find(end_marker)

if start == -1:
    print("⚠️ Marker <!-- PACCHETTI --> non trovato.")
    print("Nessuna modifica effettuata.")

elif end == -1:
    print("⚠️ Marker <!-- PRICING_PACKAGES_START --> non trovato.")
    print("Nessuna modifica effettuata.")

elif start > end:
    print("⚠️ Struttura inattesa: il vecchio blocco sembra trovarsi dopo quello nuovo.")
    print("Nessuna modifica effettuata.")

else:

    # Conserviamo il nuovo blocco pricing.
    # Eliminiamo tutto ciò che si trova tra:
    #
    # <!-- PACCHETTI -->
    #
    # e
    #
    # <!-- PRICING_PACKAGES_START -->
    #
    # lasciando il marker del nuovo blocco.

    html = (
        html[:start]
        + "\n\n"
        + html[end:]
    )

    SERVICES.write_text(html, encoding="utf-8")

    print("✅ Vecchio blocco PACCHETTI rimosso.")
    print()
    print("Il nuovo blocco pricing è stato mantenuto.")
    print("La tabella comparativa è stata mantenuta.")
    print("La sezione manutenzione è stata mantenuta.")
    print()

print("============================================")
print("OPERAZIONE COMPLETATA")
print("============================================")
print()

print("Backup:")
print(BACKUP_DIR)
print()

print("Controlla ora con:")
print("  grep -n \"PACCHETTI\\|PRICING_PACKAGES_START\\|PRICING_COMPARISON_START\\|MAINTENANCE_PLANS_START\" services.html")
print()

print("Poi:")
print("  git diff --stat")
print()
