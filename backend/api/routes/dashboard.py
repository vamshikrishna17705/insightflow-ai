from fastapi import APIRouter
from pathlib import Path
import pandas as pd
import numpy as np

router = APIRouter()

@router.get("/{dataset_id}")
def get_dashboard(dataset_id: str):
    path = Path(f"./datasets/clean/{dataset_id}.parquet")
    if not path.exists():
        return {"error": "Dataset not ready. Wait 10 seconds and try again."}
    
    df = pd.read_parquet(path)
    
    # Identify numeric columns (excluding order_id/customer_id hints)
    num_cols = []
    for col in df.select_dtypes(include=[np.number]).columns:
        if not any(hint in col.lower() for hint in ['id', 'index', 'key', 'order']):
            num_cols.append(col)
    
    # Fallback to all numeric if empty
    if not num_cols:
        num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
    summary = {}
    for col in num_cols[:8]:
        summary[col] = {
            "total": round(float(df[col].sum()), 2) if not df[col].isnull().all() else 0,
            "mean":  round(float(df[col].mean()), 2) if not df[col].isnull().all() else 0,
            "max":   round(float(df[col].max()), 2) if not df[col].isnull().all() else 0,
            "min":   round(float(df[col].min()), 2) if not df[col].isnull().all() else 0,
        }
        
    # Analyze categorical columns
    categorical_breakdowns = {}
    cat_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    for col in cat_cols:
        if not any(hint in col.lower() for hint in ['id', 'key', 'dataset']):
            nunique = df[col].nunique()
            if 1 < nunique <= 30: # reasonable classes
                # Get value counts as array of {name, value} for charts
                counts = df[col].value_counts().head(8)
                categorical_breakdowns[col] = [
                    {"name": str(k), "value": int(v)} for k, v in counts.items()
                ]

    # Time series / monthly trend grouping
    monthly = {}
    date_cols = df.select_dtypes(include=['datetime64', 'datetime']).columns.tolist()
    
    # If no datetime column, try to parse potential columns
    if not date_cols:
        date_hints = ["date", "time", "created", "timestamp"]
        for col in df.columns:
            if any(hint in col.lower() for hint in date_hints):
                try:
                    df[col] = pd.to_datetime(df[col], errors='coerce')
                    if not df[col].isnull().all():
                        date_cols.append(col)
                        break
                except:
                    pass

    if date_cols and num_cols:
        try:
            # Sort by date
            df_sorted = df.dropna(subset=[date_cols[0]]).sort_values(by=date_cols[0])
            df_sorted['_month'] = df_sorted[date_cols[0]].dt.to_period('M').astype(str)
            
            # Group by _month and aggregate sum
            grouped = df_sorted.groupby('_month')[num_cols].sum().round(2)
            monthly = {
                "months": grouped.index.tolist(),
                "data": grouped.reset_index().rename(columns={"_month": "month"}).to_dict(orient="records")
            }
        except Exception as e:
            monthly = {"error": f"Failed grouping: {str(e)}"}
            
    return {
        "dataset_id": dataset_id,
        "rows": len(df),
        "columns": list(df.columns),
        "numeric_columns": num_cols,
        "summary": summary,
        "monthly_trend": monthly,
        "categorical_breakdowns": categorical_breakdowns,
    }