from fastapi import APIRouter
from pathlib import Path
import pandas as pd

router = APIRouter()

@router.get("/{dataset_id}")
def get_dashboard(dataset_id: str):
    path = Path(f"./datasets/clean/{dataset_id}.parquet")
    if not path.exists():
        return {"error": "Dataset not ready. Wait 10 seconds and try again."}
    df = pd.read_parquet(path)
    num_cols = df.select_dtypes(include='number').columns.tolist()
    summary = {}
    for col in num_cols[:6]:
        summary[col] = {
            "total": round(float(df[col].sum()), 2),
            "mean":  round(float(df[col].mean()), 2),
            "max":   round(float(df[col].max()), 2),
            "min":   round(float(df[col].min()), 2),
        }
    monthly = {}
    date_cols = df.select_dtypes(include='datetime64').columns.tolist()
    if date_cols and num_cols:
        df['_month'] = df[date_cols[0]].dt.to_period('M').astype(str)
        monthly = df.groupby('_month')[num_cols[0]].sum().round(2).to_dict()
    return {
        "dataset_id": dataset_id,
        "rows": len(df),
        "columns": list(df.columns),
        "numeric_columns": num_cols,
        "summary": summary,
        "monthly_trend": monthly,
    }