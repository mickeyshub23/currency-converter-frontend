const API_BASE_URL = window.API_BASE_URL || 'https://currency-converter-backend-iz0b.onrender.com';

const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const resultEl = document.getElementById('result');

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

async function loadCurrencies() {
  try {
    const response = await fetch(`${API_BASE_URL}/currencies`);
    const currencies = await response.json();
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    Object.entries(currencies).forEach(([code, name]) => {
      const fromOption = new Option(`${code} — ${name}`, code);
      const toOption = new Option(`${code} — ${name}`, code);
      fromSelect.add(fromOption);
      toSelect.add(toOption);
    });
    fromSelect.value = 'USD';
    toSelect.value = 'EUR';
  } catch (error) {
    resultEl.innerHTML = '<div class="result-placeholder">Failed to load currencies.</div>';
  }
}

async function convert() {
  const from = fromSelect.value;
  const to = toSelect.value;
  const amount = amountInput.value;
  if (!amount) return;
  try {
    const response = await fetch(
      `${API_BASE_URL}/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}`
    );
    const data = await response.json();
    const formattedAmount = formatNumber(amount);
    const formattedResult = formatNumber(data.result.toFixed(2));
    resultEl.innerHTML = `<span class="result-value">${formattedAmount} ${from} = ${formattedResult} ${to}</span>`;
  } catch (error) {
    resultEl.innerHTML = '<div class="result-placeholder">Conversion failed.</div>';
  }
}

convertBtn.addEventListener('click', convert);
amountInput.addEventListener('input', convert);
swapBtn.addEventListener('click', () => {
  const fromVal = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = fromVal;
  if (amountInput.value) convert();
});
loadCurrencies();
