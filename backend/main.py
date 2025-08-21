import os
from datetime import datetime
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .schemas import PatientInput, PredictResponse, DiseaseRiskOutput, HealthResponse
from .models.model_store import ModelStore
from . import firebase_utils


DISCLAIMER = (
    "This is an educational tool only and not a medical diagnosis. "
    "Consult a qualified healthcare professional for medical advice."
)

app = FastAPI(title="NCD Risk Screening (Educational)", version="1.0.0")

# CORS for local development and simple deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model store (trains synthetic models on first run if missing)
model_store = ModelStore(models_dir=os.path.join(os.getcwd(), "backend", "models", "artifacts"))


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok", disclaimer=DISCLAIMER)


@app.post("/predict", response_model=PredictResponse)
async def predict(payload: PatientInput) -> PredictResponse:
    try:
        result = model_store.predict_risks(payload)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    # Optional logging
    document: Dict[str, Any] = {
        "timestamp": datetime.utcnow().isoformat(),
        "input": payload.model_dump(),
        "risks": result["risks"],
        "raw_probabilities": result["raw_probabilities"],
        "disclaimer": DISCLAIMER,
    }
    firebase_utils.save_submission(document)

    risks_out = {
        disease: DiseaseRiskOutput(
            probability=vals["probability"],
            category=vals["category"],
            top_factors=vals["top_factors"],
        )
        for disease, vals in result["risks"].items()
    }

    return PredictResponse(
        disclaimer=DISCLAIMER,
        risks=risks_out,
        raw_probabilities=result["raw_probabilities"],
    )


@app.get("/api/admin/logs")
async def admin_logs(limit: int = Query(50, ge=1, le=500), token: str = Query("")):
    admin_token = os.getenv("ADMIN_TOKEN", "")
    if admin_token and token != admin_token:
        raise HTTPException(status_code=403, detail="Forbidden")
    logs = firebase_utils.get_recent_logs(limit=limit)
    return {"count": len(logs), "logs": logs}

# Serve frontend LAST so API routes take precedence
frontend_dir = os.path.join(os.getcwd(), "frontend")
if os.path.isdir(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")