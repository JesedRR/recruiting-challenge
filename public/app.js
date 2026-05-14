const select = document.getElementById('merchant-select');
const totalOrdersEl = document.getElementById('total-orders');
const uniqueCustomersEl = document.getElementById('unique-customers');
const avgOrderEl = document.getElementById('avg-order');
const revenue30dEl = document.getElementById('revenue-30d');
const ordersTbody = document.getElementById('orders-tbody');

const exportFromInput = document.getElementById('export-from');
const exportToInput = document.getElementById('export-to');
const exportCsvBtn = document.getElementById('export-csv-btn');
const exportStatus = document.getElementById('export-status');

let authToken = localStorage.getItem('authToken');

async function getToken(merchantId) {
  const response = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merchantId })
  });
  const { token } = await response.json();
  localStorage.setItem('authToken', token);
  return token;
}

async function apiCall(path) {
  const select = document.querySelector('select');
  const merchantId = select.value;
  
  if (!authToken || authToken === '') {
    authToken = await getToken(merchantId);
  }
  
  return fetch(path, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  }).then((r) => r.json());
}

function money(cents) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

async function refresh() {
  const summary = await apiCall('/api/metrics/summary');
  totalOrdersEl.textContent = summary.total_orders ?? '—';
  uniqueCustomersEl.textContent = summary.unique_customers ?? '—';
  avgOrderEl.textContent = money(summary.avg_order_value_cents ?? 0);

  const now = new Date();
  const thirtyAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const revenue = await apiCall(`/api/revenue?from=${isoDate(thirtyAgo)}&to=${isoDate(now)}`);
  revenue30dEl.textContent = money(revenue.revenue_cents ?? 0);

  const ordersRes = await apiCall('/api/orders?limit=10');
  ordersTbody.innerHTML = '';
  for (const o of ordersRes.orders ?? []) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(o.created_at).toLocaleDateString()}</td>
      <td>${o.customer_email}</td>
      <td>${o.type}</td>
      <td>${money(o.total_amount)}</td>
    `;
    ordersTbody.appendChild(tr);
  }
}

select.addEventListener('change', async () => {
  authToken = null;  // Clear old token
  localStorage.removeItem('authToken');  // Remove from storage
  await refresh();  // Get new token for new merchant
});
refresh();


// Pre-fill with 30-day range
function setDefaultDateRange() {
  const to = new Date();
  const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  exportFromInput.value = isoDate(from);
  exportToInput.value = isoDate(to);
}

exportCsvBtn.addEventListener('click', async () => {
  const from = exportFromInput.value;
  const to = exportToInput.value;

  if (!from || !to) {
    exportStatus.textContent = 'Error: both dates required';
    return;
  }

  if (new Date(to) <= new Date(from)) {
    exportStatus.textContent = 'Error: end date must be after start date';
    return;
  }

  try {
    exportStatus.textContent = 'Downloading...';
    const select = document.querySelector('select');
    const merchantId = select.value;
    
    if (!authToken) {
      authToken = await getToken(merchantId);
    }

    const response = await fetch(
      `/api/orders/export/csv?from=${from}&to=${to}`,
      { headers: { 'Authorization': `Bearer ${authToken}` } }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    exportStatus.textContent = 'Downloaded ✓';
  } catch (error) {
    exportStatus.textContent = `Error: ${error.message}`;
  }
});

setDefaultDateRange();