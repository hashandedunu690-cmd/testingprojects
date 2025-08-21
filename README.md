# AI Web Service for Early Risk Screening of NCDs

This project provides an educational, non-diagnostic web app to screen early risk for non-communicable diseases (NCDs) such as Type-2 Diabetes, Hypertension, and Cardiovascular Disease based on user-entered lifestyle and health factors.

IMPORTANT: This tool is for educational purposes only and is NOT a medical diagnosis. Always consult a qualified healthcare professional.

## Features
- FastAPI backend with `/predict` and `/health` endpoints
- Simple logistic regression models trained on synthetic placeholder data
- Explainable outputs (top contributing factors)
- Optional Firebase Firestore logging of submissions and scores
- HTML/CSS frontend with input form and admin page for viewing logs

## Tech Stack
- Backend: Python, FastAPI, scikit-learn
- Frontend: HTML, CSS, Vanilla JS
- Optional: Firebase Firestore

## Project Structure
```
backend/
  main.py
  schemas.py
  firebase_utils.py
  models/
    __init__.py
    train.py
    model_store.py
frontend/
  index.html
  admin.html
  styles.css
firebase_config/
  README.md (instructions to add service account JSON)
requirements.txt
README.md
```

## Local Setup
1. Create and activate a virtual environment
```bash
python -m venv .venv
source .venv/bin/activate
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. (Optional) Configure Firebase Firestore
- Place your service account credential JSON at `firebase_config/serviceAccountKey.json`.
- Ensure Firestore is enabled in your Firebase project.
- Set environment variable to enable logging:
```bash
export FIREBASE_ENABLED=true
# Optional admin token to protect logs endpoint
export ADMIN_TOKEN=change-me
```

4. Run the server
```bash
uvicorn backend.main:app --reload
```

5. Open the app
- Frontend: http://localhost:8000/
- Health: http://localhost:8000/health
- Admin logs (optional): http://localhost:8000/admin.html

## Disclaimer
- This application is strictly for educational purposes and is not a substitute for professional medical advice, diagnosis, or treatment.
- Do not ignore professional medical advice because of information received from this app.

