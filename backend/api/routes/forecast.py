from fastapi import APIRouter
from pydantic import BaseModel
from pathlib import Path
import pandas as pd
from core.ml_models import forecast_xgboost

router = APIRouter()

class ForecastRequest(BaseModel):
    target_col: str
    periods: int = 6

@router.post("/{dataset_id}")
def run_forecast(dataset_id: str, req: ForecastRequest):
    path = Path(f"./datasets/clean/{dataset_id}.parquet")
    if not path.exists():
        return {"error": "Dataset not ready"}
    df = pd.read_parquet(path)
    if req.target_col not in df.columns:
        return {"error": "Column not found", "available_columns": df.select_dtypes(include='number').columns.tolist()}
    return forecast_xgboost(df, req.target_col, req.periods)