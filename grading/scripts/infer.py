"""
Phase 4 — Grading inference service.

Wraps extract_features() + per-crop classifier + per-crop thresholds into
the exact response shape expected by POST /grading/capture in api-contract.md.

This is what the backend route handler calls directly — it's intentionally
framework-agnostic (no Flask/FastAPI import here) so it can be dropped into
whatever the backend partner is using.

Usage as a library:
    from infer import grade_produce
    result = grade_produce("photo.jpg", crop="tomato")

Usage as a CLI (for quick manual testing):
    python infer.py --image photo.jpg --crop tomato
"""

import argparse
import json
from pathlib import Path

import joblib
import pandas as pd

from features import extract_features, extract_signal_labels, FEATURE_NAMES


CONFIDENCE_THRESHOLD = 0.55  # below this, ask the farmer to retake the photo

MODELS_DIR = Path(__file__).parent.parent / "models"
CONFIG_DIR = Path(__file__).parent.parent / "config"

_model_cache = {}
_threshold_cache = {}


def _load_model(crop: str):
    if crop not in _model_cache:
        model_path = MODELS_DIR / f"{crop}_grader.pkl"
        if not model_path.exists():
            raise FileNotFoundError(
                f"No trained model for crop '{crop}' at {model_path}. "
                f"Run train_classifier.py for this crop first."
            )
        _model_cache[crop] = joblib.load(model_path)
    return _model_cache[crop]


def _load_thresholds(crop: str):
    if crop not in _threshold_cache:
        config_path = CONFIG_DIR / f"{crop}_thresholds.json"
        if not config_path.exists():
            raise FileNotFoundError(f"No threshold config for crop '{crop}' at {config_path}.")
        _threshold_cache[crop] = json.loads(config_path.read_text())
    return _threshold_cache[crop]


def grade_produce(image_path_or_array, crop: str) -> dict:
    """Returns a dict matching the POST /grading/capture response shape from
    api-contract.md. Raises FileNotFoundError if the crop has no trained
    model/config yet (fail loudly in dev; the route handler should catch and
    map this to a clean 4xx for the frontend, not a 500)."""
    thresholds = _load_thresholds(crop)
    model = _load_model(crop)

    features = extract_features(image_path_or_array)
    if features is None:
        return {
            "grade": None,
            "confidence": 0.0,
            "signals": {},
            "price_impact_note": None,
            "status": "no_object_detected",
            "message": "Could not find the item against the background. "
                       "Retake the photo on a plain, contrasting background.",
        }

    feature_vector = pd.DataFrame([[features[name] for name in FEATURE_NAMES]], columns=FEATURE_NAMES)
    proba = model.predict_proba(feature_vector)[0]
    classes = model.classes_
    best_idx = proba.argmax()
    grade = classes[best_idx]
    confidence = float(proba[best_idx])

    signals = extract_signal_labels(features, thresholds)

    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "grade": None,
            "confidence": confidence,
            "signals": signals,
            "price_impact_note": None,
            "status": "low_confidence",
            "message": "Not confident enough to give a grade. Retake the photo "
                       "with the item centered and well-lit.",
        }

    price_impact_pct = thresholds.get("price_impact_pct", {}).get(grade, 0)
    price_impact_note = (
        f"Grade {grade} typically sells about {abs(price_impact_pct)}% "
        f"{'below' if price_impact_pct < 0 else 'at'} top grade at mandi."
        if price_impact_pct != 0 else
        f"Grade {grade} — top grade, no typical price discount."
    )

    return {
        "grade": grade,
        "confidence": round(confidence, 2),
        "signals": signals,
        "price_impact_note": price_impact_note,
        "status": "ok",
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True)
    parser.add_argument("--crop", required=True)
    args = parser.parse_args()
    result = grade_produce(args.image, args.crop)
    print(json.dumps(result, indent=2))
