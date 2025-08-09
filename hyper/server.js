const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

function readJson(fileName) {
  const filePath = path.join(__dirname, 'data', fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'hyper-api' });
});

app.get('/api/products', (req, res) => {
  const products = readJson('products.json');
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = readJson('products.json');
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

app.get('/api/stories', (req, res) => {
  const stories = readJson('stories.json');
  res.json(stories);
});

app.get('/api/stories/:id', (req, res) => {
  const stories = readJson('stories.json');
  const story = stories.find(s => s.id === req.params.id);
  if (!story) return res.status(404).json({ error: 'Not found' });
  res.json(story);
});

app.get('/api/events', (req, res) => {
  const events = readJson('events.json');
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`HYPER API running at http://localhost:${PORT}`);
});