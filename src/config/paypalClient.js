const paypal = require('@paypal/checkout-server-sdk');

function createPayPalEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const env = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase();

  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.');
  }

  if (env === 'live') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function getPayPalClient() {
  return new paypal.core.PayPalHttpClient(createPayPalEnvironment());
}

module.exports = { paypal, getPayPalClient };

