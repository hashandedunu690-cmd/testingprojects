require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Firebase Admin SDK (side-effect import)
require('./src/config/firebaseAdmin');

const packagesRouter = require('./src/routes/packages');
const contactRouter = require('./src/routes/contact');
const paymentsRouter = require('./src/routes/payments');
const bookingsRouter = require('./src/routes/bookings');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// PayPal client configuration endpoint for frontend
app.get('/api/config/paypal', (req, res) => {
  res.json({
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    currency: 'USD'
  });
});

// API routes
app.use('/api/packages', packagesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/bookings', bookingsRouter);

// Fallback to index.html for SPA-like navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

