const express = require('express');
const { getPayPalClient, paypal } = require('../config/paypalClient');
const { db } = require('../config/firebaseAdmin');

const router = express.Router();

// Create order
router.post('/create-order', async (req, res) => {
  try {
    const { packageId, amount, currency = 'USD', customer } = req.body;
    if (!packageId || !amount) {
      return res.status(400).json({ error: 'Missing packageId or amount' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.headers['Prefer'] = 'return=representation';
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: packageId,
          amount: {
            currency_code: currency,
            value: String(amount)
          }
        }
      ]
    });

    const client = getPayPalClient();
    const order = await client.execute(request);

    // Save a pre-booking record
    const bookingRef = await db.collection('bookings').add({
      packageId,
      status: 'CREATED',
      paypalOrderId: order.result.id,
      amount,
      currency,
      customer: customer || null,
      createdAt: new Date().toISOString()
    });

    res.json({ id: order.result.id, bookingId: bookingRef.id });
  } catch (err) {
    console.error('Create order failed', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Capture order
router.post('/capture-order', async (req, res) => {
  try {
    const { orderId, bookingId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const client = getPayPalClient();
    const capture = await client.execute(request);

    // Update booking record
    const data = {
      status: 'CAPTURED',
      capture,
      updatedAt: new Date().toISOString()
    };
    if (bookingId) {
      await db.collection('bookings').doc(bookingId).set(data, { merge: true });
    }

    res.json({ success: true, capture: capture.result });
  } catch (err) {
    console.error('Capture order failed', err);
    res.status(500).json({ error: 'Failed to capture order' });
  }
});

module.exports = router;

