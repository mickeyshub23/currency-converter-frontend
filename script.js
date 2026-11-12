const API_BASE_URL = window.API_BASE_URL || 'https://your-backend.onrender.com';

const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const resultEl = document.getElementById('result');

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
    resultEl.textContent = 'Failed to load currencies.';
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
    resultEl.textContent = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
  } catch (error) {
    resultEl.textContent = 'Conversion failed.';
  }
}

convertBtn.addEventListener('click', convert);
amountInput.addEventListener('input', convert);
loadCurrencies();
