// Dynamically load PayPal SDK and render buttons for checkout per package
(function () {
  let paypalLoaded = false;
  let paypalClientId = '';
  let currency = 'USD';

  async function loadPayPalSdk() {
    if (paypalLoaded) return true;
    const cfgRes = await fetch('/api/config/paypal');
    const cfg = await cfgRes.json();
    paypalClientId = cfg.clientId;
    currency = cfg.currency || 'USD';
    if (!paypalClientId) {
      console.warn('PayPal Client ID missing');
      return false;
    }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=${currency}`;
    script.async = true;
    document.head.appendChild(script);
    await new Promise((resolve) => {
      script.onload = resolve;
    });
    paypalLoaded = true;
    return true;
  }

  async function createOrderOnServer(details) {
    const res = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    return res.json();
  }

  async function captureOrderOnServer(orderId, bookingId) {
    const res = await fetch('/api/payments/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, bookingId })
    });
    return res.json();
  }

  window.startCheckout = async function ({ packageId, amount, title }) {
    const ok = await loadPayPalSdk();
    if (!ok || !window.paypal) {
      alert('Payment temporarily unavailable. Please try again later.');
      return;
    }

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.inset = '0';
    modal.style.background = 'rgba(0,0,0,0.6)';
    modal.style.display = 'grid';
    modal.style.placeItems = 'center';
    modal.style.zIndex = '2000';
    modal.innerHTML = `
      <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:1rem;max-width:480px;width:92%">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.75rem">
          <div style="font-weight:700">Checkout: ${title}</div>
          <button id="pp-close" style="background:none;border:none;color:#fff;font-size:1.2rem;cursor:pointer">✕</button>
        </div>
        <div style="margin-bottom:.75rem;color:#cbd5e1">Amount: ${currency} $${amount}</div>
        <div id="paypal-buttons"></div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#pp-close').onclick = () => modal.remove();

    let bookingId = null;

    window.paypal.Buttons({
      createOrder: async () => {
        const { id, bookingId: bid } = await createOrderOnServer({
          packageId,
          amount,
          currency
        });
        bookingId = bid;
        return id;
      },
      onApprove: async (data) => {
        const result = await captureOrderOnServer(data.orderID, bookingId);
        if (result && result.success) {
          alert('Payment successful! Booking confirmed.');
        } else {
          alert('Payment captured, but there was an issue recording it.');
        }
        modal.remove();
      },
      onCancel: () => {
        modal.remove();
      },
      onError: (err) => {
        console.error(err);
        alert('Payment failed. Please try again later.');
        modal.remove();
      }
    }).render('#paypal-buttons');
  };
})();

