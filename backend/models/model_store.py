import os
from typing import Dict, Any, List, Tuple

import numpy as np
import joblib

from ..schemas import PatientInput
from .train import train_and_save_models, FEATURES


def _category_from_probability(p: float) -> str:
    if p < 0.33:
        return "Low"
    if p < 0.66:
        return "Medium"
    return "High"


class ModelStore:
    def __init__(self, models_dir: str) -> None:
        self.models_dir = models_dir
        os.makedirs(self.models_dir, exist_ok=True)
        self.models: Dict[str, Dict[str, Any]] = {}
        self._ensure_models()

    def _ensure_models(self) -> None:
        expected = ["diabetes", "hypertension", "cvd"]
        missing = [name for name in expected if not os.path.exists(self._path(name))]
        if missing:
            train_and_save_models(self.models_dir)
        for name in expected:
            self.models[name] = joblib.load(self._path(name))

    def _path(self, name: str) -> str:
        return os.path.join(self.models_dir, f"{name}.joblib")

    def _vectorize(self, payload: PatientInput) -> np.ndarray:
        # Map PatientInput to FEATURES order
        sex_male = 1 if payload.sex.lower().startswith("m") else 0
        vector = np.array([
            payload.age,
            sex_male,
            payload.bmi,
            payload.smoking_status,
            payload.physical_activity,
            payload.diet_quality,
            payload.systolic_bp,
            payload.diastolic_bp,
            payload.total_cholesterol,
            payload.hdl_cholesterol,
            payload.fasting_glucose,
            payload.hba1c,
            payload.family_history_cvd,
            payload.family_history_diabetes,
        ], dtype=float)
        return vector.reshape(1, -1)

    def _top_factors(self, model_obj: Dict[str, Any], input_vector: np.ndarray, top_k: int = 3) -> List[Dict[str, Any]]:
        features = model_obj.get("features", FEATURES)
        mean = model_obj["mean"]
        std = model_obj["std"]
        coefs = model_obj["weights"]
        standardized = (input_vector.ravel() - mean) / std
        contributions = coefs * standardized

        order = np.argsort(-np.abs(contributions))[:top_k]
        top = []
        for idx in order:
            top.append({
                "feature": features[idx],
                "contribution": float(contributions[idx]),
                "coefficient": float(coefs[idx]),
                "value": float(input_vector.ravel()[idx]),
            })
        return top

    def predict_risks(self, payload: PatientInput) -> Dict[str, Any]:
        x = self._vectorize(payload)
        risks: Dict[str, Any] = {}
        raw_probabilities: Dict[str, float] = {}

        for name, model_obj in self.models.items():
            mean = model_obj["mean"]
            std = model_obj["std"]
            w = model_obj["weights"]
            b = model_obj["bias"]
            x_std = (x.ravel() - mean) / std
            logit = float(x_std @ w + b)
            prob = 1.0 / (1.0 + np.exp(-logit))
            cat = _category_from_probability(prob)
            top_factors = self._top_factors(model_obj, x)
            risks[name] = {
                "probability": prob,
                "category": cat,
                "top_factors": top_factors,
            }
            raw_probabilities[name] = prob

        return {"risks": risks, "raw_probabilities": raw_probabilities}