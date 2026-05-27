from fastapi import APIRouter
from pathlib import Path
import pandas as pd
from core.ml_models import detect_anomalies

router = APIRouter()

@router.get("/{dataset_id}")
def get_anomalies(dataset_id: str):
    path = Path(f"./datasets/clean/{dataset_id}.parquet")
    if not path.exists():
        return {"error": "Dataset not ready"}
    df = pd.read_parquet(path)
    num_cols = df.select_dtypes(include='number').columns.tolist()
    if not num_cols:
        return {"error": "No numeric columns found"}
    return detect_anomalies(df, num_cols[:3])