// Calcolatore preventivo interattivo — solo stima, nessun invio dati
document.addEventListener('DOMContentLoaded', () => {
  const calc = document.getElementById('price-calculator');
  if (!calc) return;

  const basePackage = { start: 590, business: 1190 };
  const extras = {
    ecommerce: 400,
    multilang: 250,
    seo: 200,
    booking: 300
  };
  const maintenance = { none: 0, base: 49, standard: 99, premium: 199 };

  function updateTotal() {
    const pkg = calc.querySelector('input[name="package"]:checked').value;
    let total = basePackage[pkg];

    calc.querySelectorAll('input[name="extra"]:checked').forEach(cb => {
      total += extras[cb.value];
    });

    const maint = calc.querySelector('input[name="maintenance"]:checked').value;
    const maintCost = maintenance[maint];

    calc.querySelector('#calc-total').textContent = `${total}€`;
    calc.querySelector('#calc-maint').textContent = maintCost > 0 ? `+ ${maintCost}€/mese` : '';
  }

  calc.addEventListener('change', updateTotal);
  updateTotal();
});
