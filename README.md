# Travel Website (Node.js + Firebase + PayPal)

Fully functional, responsive travel website with packages, bookings, PayPal payments, and contact form using Firebase Firestore.

## Quick Start

1. Copy `.env.example` to `.env` and fill values.
2. Provide Firebase Admin credentials via one of:
   - Set `GOOGLE_APPLICATION_CREDENTIALS=./config/serviceAccountKey.json` and place the JSON there, or
   - Set `FIREBASE_SERVICE_ACCOUNT_BASE64` to base64 of the JSON content.
3. Install dependencies and start:

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Seeding Packages
On first request to `/api/packages`, if no packages exist, the API seeds 5 demo packages.

## PayPal Notes
Use sandbox credentials for testing. The frontend loads the PayPal JS SDK dynamically from `/api/config/paypal`.

