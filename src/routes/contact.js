const express = require('express');
const { db } = require('../config/firebaseAdmin');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const record = {
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };
    await db.collection('contact_messages').add(record);
    res.json({ success: true });
  } catch (err) {
    console.error('Contact submit failed', err);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

module.exports = router;

