# HYPER — Energy Drinks Website

Tech stack: PHP (frontend rendering), CSS/HTML, and NodeJS (Express API).

## Run locally

- API (NodeJS):
  1. Install deps
     ```bash
     cd /workspace/hyper
     npm install
     ```
  2. Start API
     ```bash
     npm run start
     ```
     The API runs on http://localhost:4000

- PHP site:
  1. In a separate terminal, start the built-in PHP server pointing to `public/`:
     ```bash
     php -S localhost:8000 -t /workspace/hyper/public
     ```
  2. Visit http://localhost:8000

The PHP site fetches data from the Node API at `http://localhost:4000`. To change this, set env var `HYPER_API_BASE` before starting PHP:

```bash
HYPER_API_BASE=http://localhost:4000 php -S localhost:8000 -t /workspace/hyper/public
```

## Structure

```
/workspace/hyper
├── data/                # JSON data files consumed by API
├── public/              # PHP site (served as web root)
│   ├── assets/
│   │   ├── css/styles.css
│   │   └── js/main.js
│   ├── partials/
│   │   ├── config.php
│   │   ├── footer.php
│   │   ├── header.php
│   │   └── nav.php
│   ├── index.php
│   ├── products.php
│   ├── product.php
│   ├── stories.php
│   ├── story.php
│   ├── events.php
│   └── athletes.php
├── server.js            # NodeJS Express API
└── package.json
```

## Notes
- Design inspired by Red Bull: bold hero video, card grids, high-contrast palette (deep blue, red, yellow).
- Replace stock Unsplash/coverr media with your own brand assets when available.