import os
from typing import Any, Dict, List

_FIREBASE_ENABLED = os.getenv("FIREBASE_ENABLED", "false").lower() in {"1", "true", "yes"}
_firestore = None
_firestore_query_desc = "DESCENDING"


def _init_firestore_if_enabled() -> None:
    global _firestore, _firestore_query_desc
    if not _FIREBASE_ENABLED:
        return
    if _firestore is not None:
        return
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore
        cred_path = os.getenv(
            "GOOGLE_APPLICATION_CREDENTIALS",
            os.path.join(os.getcwd(), "firebase_config", "serviceAccountKey.json"),
        )
        if not os.path.exists(cred_path):
            raise FileNotFoundError(
                f"Firebase is enabled but credentials not found at {cred_path}."
            )
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        _firestore = firestore.client()
        try:
            _firestore_query_desc = firestore.Query.DESCENDING
        except Exception:
            _firestore_query_desc = "DESCENDING"
    except Exception as exc:
        _firestore = None
        print(f"[firebase] Initialization failed: {exc}")


def save_submission(document: Dict[str, Any]) -> None:
    _init_firestore_if_enabled()
    if _firestore is None:
        return
    try:
        _firestore.collection("ncd_risk_submissions").add(document)
    except Exception as exc:
        print(f"[firebase] Save failed: {exc}")


def get_recent_logs(limit: int = 100) -> List[Dict[str, Any]]:
    _init_firestore_if_enabled()
    if _firestore is None:
        return []
    try:
        docs = (
            _firestore.collection("ncd_risk_submissions")
            .order_by("timestamp", direction=_firestore_query_desc)
            .limit(limit)
            .stream()
        )
        return [doc.to_dict() for doc in docs]
    except Exception as exc:
        print(f"[firebase] Read failed: {exc}")
        return []