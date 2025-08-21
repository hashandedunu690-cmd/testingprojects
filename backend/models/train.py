import os
from typing import List, Tuple, Dict
import numpy as np
import joblib


FEATURES: List[str] = [
    "age",
    "sex_male",
    "bmi",
    "smoking_status",
    "physical_activity",
    "diet_quality",
    "systolic_bp",
    "diastolic_bp",
    "total_cholesterol",
    "hdl_cholesterol",
    "fasting_glucose",
    "hba1c",
    "family_history_cvd",
    "family_history_diabetes",
]


def _generate_synthetic_dataset(n: int, random_seed: int = 42) -> Tuple[np.ndarray, Dict[str, np.ndarray]]:
    rng = np.random.default_rng(random_seed)
    age = rng.integers(18, 90, size=n)
    sex_male = rng.integers(0, 2, size=n)
    bmi = rng.normal(27, 5, size=n).clip(15, 60)
    smoking_status = rng.integers(0, 3, size=n)
    physical_activity = rng.integers(0, 4, size=n)
    diet_quality = rng.integers(0, 4, size=n)
    systolic_bp = rng.normal(125, 20, size=n).clip(80, 220)
    diastolic_bp = rng.normal(80, 12, size=n).clip(40, 120)
    total_cholesterol = rng.normal(200, 40, size=n).clip(100, 350)
    hdl_cholesterol = rng.normal(50, 12, size=n).clip(20, 120)
    fasting_glucose = rng.normal(100, 25, size=n).clip(60, 250)
    hba1c = rng.normal(5.5, 1.0, size=n).clip(3.5, 14)
    family_history_cvd = rng.integers(0, 2, size=n)
    family_history_diabetes = rng.integers(0, 2, size=n)

    X = np.column_stack(
        [
            age,
            sex_male,
            bmi,
            smoking_status,
            physical_activity,
            diet_quality,
            systolic_bp,
            diastolic_bp,
            total_cholesterol,
            hdl_cholesterol,
            fasting_glucose,
            hba1c,
            family_history_cvd,
            family_history_diabetes,
        ]
    )

    raw = {
        "age": age,
        "sex_male": sex_male,
        "bmi": bmi,
        "smoking_status": smoking_status,
        "physical_activity": physical_activity,
        "diet_quality": diet_quality,
        "systolic_bp": systolic_bp,
        "diastolic_bp": diastolic_bp,
        "total_cholesterol": total_cholesterol,
        "hdl_cholesterol": hdl_cholesterol,
        "fasting_glucose": fasting_glucose,
        "hba1c": hba1c,
        "family_history_cvd": family_history_cvd,
        "family_history_diabetes": family_history_diabetes,
    }
    return X, raw


def _label_from_score(score: np.ndarray, bias: float, scale: float, rng: np.random.Generator) -> np.ndarray:
    noise = rng.normal(0, 1, size=score.shape)
    logits = bias + scale * score + noise
    probs = 1 / (1 + np.exp(-logits))
    return (probs > 0.5).astype(int)


def _fit_standardizer(X: np.ndarray) -> Dict[str, np.ndarray]:
    mean = X.mean(axis=0)
    std = X.std(axis=0)
    std[std == 0] = 1.0
    return {"mean": mean, "std": std}


def _apply_standardizer(X: np.ndarray, scaler: Dict[str, np.ndarray]) -> np.ndarray:
    return (X - scaler["mean"]) / scaler["std"]


def _sigmoid(z: np.ndarray) -> np.ndarray:
    return 1.0 / (1.0 + np.exp(-z))


def _fit_logreg_gd(X: np.ndarray, y: np.ndarray, l2: float = 1e-2, lr: float = 0.1, epochs: int = 300) -> Tuple[np.ndarray, float]:
    n_samples, n_features = X.shape
    w = np.zeros(n_features, dtype=float)
    b = 0.0
    for _ in range(epochs):
        z = X @ w + b
        p = _sigmoid(z)
        error = p - y
        grad_w = (X.T @ error) / n_samples + l2 * w
        grad_b = error.mean()
        w -= lr * grad_w
        b -= lr * grad_b
    return w, b


def train_and_save_models(output_dir: str, n_samples: int = 6000, random_seed: int = 42) -> None:
    os.makedirs(output_dir, exist_ok=True)

    X, raw = _generate_synthetic_dataset(n=n_samples, random_seed=random_seed)
    rng = np.random.default_rng(random_seed)

    # Disease-specific scoring heuristics for synthetic labels
    score_diabetes = (
        0.05 * raw["age"]
        + 0.12 * raw["bmi"]
        + 0.18 * raw["fasting_glucose"]
        + 0.20 * raw["hba1c"]
        + 0.25 * raw["family_history_diabetes"]
        + 0.05 * raw["smoking_status"]
        - 0.10 * raw["physical_activity"]
        - 0.06 * raw["diet_quality"]
    )
    y_diabetes = _label_from_score(score_diabetes, bias=-50.0, scale=0.06, rng=rng)

    score_hypertension = (
        0.04 * raw["age"]
        + 0.20 * raw["systolic_bp"]
        + 0.12 * raw["diastolic_bp"]
        + 0.06 * raw["bmi"]
        + 0.07 * raw["smoking_status"]
        + 0.06 * raw["total_cholesterol"]
        - 0.05 * raw["physical_activity"]
        - 0.04 * raw["diet_quality"]
    )
    y_hypertension = _label_from_score(score_hypertension, bias=-40.0, scale=0.05, rng=rng)

    score_cvd = (
        0.05 * raw["age"]
        + 0.10 * raw["bmi"]
        + 0.12 * raw["systolic_bp"]
        + 0.10 * raw["total_cholesterol"]
        - 0.10 * raw["hdl_cholesterol"]
        + 0.08 * raw["smoking_status"]
        + 0.10 * raw["family_history_cvd"]
        - 0.06 * raw["physical_activity"]
        - 0.05 * raw["diet_quality"]
    )
    y_cvd = _label_from_score(score_cvd, bias=-30.0, scale=0.03, rng=rng)

    models_data: Dict[str, Dict[str, np.ndarray]] = {}

    for name, y in {
        "diabetes": y_diabetes,
        "hypertension": y_hypertension,
        "cvd": y_cvd,
    }.items():
        scaler = _fit_standardizer(X)
        X_std = _apply_standardizer(X, scaler)
        w, b = _fit_logreg_gd(X_std, y.astype(float))
        models_data[name] = {
            "weights": w,
            "bias": b,
            "mean": scaler["mean"],
            "std": scaler["std"],
        }

    for name, data in models_data.items():
        path = os.path.join(output_dir, f"{name}.joblib")
        joblib.dump({
            "features": FEATURES,
            "weights": data["weights"],
            "bias": data["bias"],
            "mean": data["mean"],
            "std": data["std"],
        }, path)


if __name__ == "__main__":
    out = os.path.join(os.getcwd(), "backend", "models", "artifacts")
    train_and_save_models(out)