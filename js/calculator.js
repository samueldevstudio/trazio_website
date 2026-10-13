// I prezzi devono coincidere con quelli scritti in services.html

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
    rush: 250
  };

  const maintenance = { none: 0, base: 49, standard: 99, premium: 199 };

  // toLocaleString('it') non separa le migliaia sotto 10.000
  const euro = (n) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}€`;

  function updateTotal() {
    const pkg = calc.querySelector('input[name="package"]:checked');
    let total = basePackage[pkg ? pkg.value : 'start'] || 0;

    calc.querySelectorAll('input[name="extra"]:checked').forEach((cb) => {
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
