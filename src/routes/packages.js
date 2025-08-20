const express = require('express');
const { db } = require('../config/firebaseAdmin');

const router = express.Router();
const COLLECTION = 'packages';

// Seed 5 sample packages if collection is empty
async function seedPackagesIfEmpty() {
  const snapshot = await db.collection(COLLECTION).limit(1).get();
  if (!snapshot.empty) return;

  const sample = [
    {
      id: 'bali-retreat',
      title: 'Bali Beach Retreat',
      description: 'Relax on pristine beaches and explore temples in Bali.',
      duration: '6 Days / 5 Nights',
      price: 899,
      currency: 'USD',
      image: '/assets/images/bali.jpg'
    },
    {
      id: 'paris-romance',
      title: 'Paris Romance',
      description: 'Experience art, fashion, and cuisine in Paris.',
      duration: '4 Days / 3 Nights',
      price: 1099,
      currency: 'USD',
      image: '/assets/images/paris.jpg'
    },
    {
      id: 'safari-kenya',
      title: 'Kenya Safari Adventure',
      description: 'Wildlife safaris across the Maasai Mara.',
      duration: '7 Days / 6 Nights',
      price: 1799,
      currency: 'USD',
      image: '/assets/images/kenya.jpg'
    },
    {
      id: 'tokyo-discovery',
      title: 'Tokyo Discovery',
      description: 'Tech, tradition, and incredible cuisine in Tokyo.',
      duration: '5 Days / 4 Nights',
      price: 1299,
      currency: 'USD',
      image: '/assets/images/tokyo.jpg'
    },
    {
      id: 'peru-machu',
      title: 'Peru & Machu Picchu',
      description: 'Andean culture and the iconic Machu Picchu ruins.',
      duration: '8 Days / 7 Nights',
      price: 1999,
      currency: 'USD',
      image: '/assets/images/peru.jpg'
    }
  ];

  const batch = db.batch();
  sample.forEach((pkg) => {
    const ref = db.collection(COLLECTION).doc(pkg.id);
    batch.set(ref, pkg);
  });
  await batch.commit();
}

router.get('/', async (req, res) => {
  try {
    await seedPackagesIfEmpty();
    const snapshot = await db.collection(COLLECTION).get();
    const packages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ packages });
  } catch (err) {
    console.error('Error fetching packages', err);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

module.exports = router;

