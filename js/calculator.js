/* ============================================================
   CALCULATOR.JS
   Calcolatore preventivo interattivo (services.html): somma il
   pacchetto base, gli extra selezionati e mostra l'eventuale canone
   mensile di manutenzione. È solo una stima: nessun dato viene
   inviato. I prezzi qui devono coincidere con quelli scritti nelle
   label HTML — se ne aggiungi uno, aggiornali entrambi.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const calc = document.getElementById('price-calculator');
  if (!calc) return;

  const basePackage = { start: 590, business: 1190 };

  const extras = {
    ecommerce: 400,
    multilang: 250,
    booking: 300,
    blog: 250,
    chatbot: 350,
    newsletter: 150,
    copywriting: 200,
    branding: 300,
    hosting: 120,
    rush: 250
  };

  const maintenance = { none: 0, base: 49, standard: 99, premium: 199 };

  // 1190 -> "1.190€" (coerente con le card dei pacchetti). Non uso
  // toLocaleString perché in italiano il separatore parte solo da 5 cifre.
  const euro = (n) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}€`;

  function updateTotal() {
    const pkg = calc.querySelector('input[name="package"]:checked');
    let total = basePackage[pkg ? pkg.value : 'start'] || 0;

    calc.querySelectorAll('input[name="extra"]:checked').forEach((cb) => {
      // Un extra non mappato non deve mai rompere il totale (NaN)
      total += extras[cb.value] || 0;
    });

    const maint = calc.querySelector('input[name="maintenance"]:checked');
    const maintCost = maintenance[maint ? maint.value : 'none'] || 0;

    calc.querySelector('#calc-total').textContent = euro(total);
    calc.querySelector('#calc-maint').textContent = maintCost > 0 ? `+ ${euro(maintCost)}/mese` : '';
  }

  calc.addEventListener('change', updateTotal);
  updateTotal();
});
