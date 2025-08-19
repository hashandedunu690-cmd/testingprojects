const express = require('express');
const { db } = require('../config/firebaseAdmin');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { packageId, name, email, travelers = 1, notes } = req.body;
    if (!packageId || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const record = {
      packageId,
      name,
      email,
      travelers: Number(travelers) || 1,
      notes: notes || '',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    const ref = await db.collection('bookings').add(record);
    res.json({ success: true, bookingId: ref.id });
  } catch (err) {
    console.error('Create booking failed', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

module.exports = router;

