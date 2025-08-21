from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List


class PatientInput(BaseModel):
    age: int = Field(..., ge=0, le=120)
    sex: str = Field(..., description="male or female")
    bmi: float = Field(..., ge=10, le=80)
    smoking_status: int = Field(..., ge=0, le=2, description="0=never, 1=former, 2=current")
    physical_activity: int = Field(..., ge=0, le=3)
    diet_quality: int = Field(..., ge=0, le=3)
    systolic_bp: float = Field(..., ge=60, le=250)
    diastolic_bp: float = Field(..., ge=30, le=150)
    total_cholesterol: float = Field(..., ge=80, le=400)
    hdl_cholesterol: float = Field(..., ge=10, le=150)
    fasting_glucose: float = Field(..., ge=50, le=400)
    hba1c: float = Field(..., ge=3, le=20)
    family_history_cvd: int = Field(..., ge=0, le=1)
    family_history_diabetes: int = Field(..., ge=0, le=1)


class DiseaseRiskOutput(BaseModel):
    probability: float
    category: str
    top_factors: List[Dict[str, Any]]


class PredictResponse(BaseModel):
    disclaimer: str
    risks: Dict[str, DiseaseRiskOutput]
    raw_probabilities: Dict[str, float]


class HealthResponse(BaseModel):
    status: str
    disclaimer: str