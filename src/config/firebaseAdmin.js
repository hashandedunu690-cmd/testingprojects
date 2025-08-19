const admin = require('firebase-admin');

if (!admin.apps.length) {
  let credentials;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const jsonString = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      'base64'
    ).toString('utf8');
    credentials = JSON.parse(jsonString);
  }

  if (credentials) {
    admin.initializeApp({
      credential: admin.credential.cert(credentials)
    });
  } else {
    // Fallback to GOOGLE_APPLICATION_CREDENTIALS file path
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }
}

const db = admin.firestore();

module.exports = { admin, db };

