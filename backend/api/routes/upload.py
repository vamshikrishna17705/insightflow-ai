import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, BackgroundTasks
from fastapi.responses import JSONResponse
from core.etl import run_etl_pipeline
import pandas as pd
import numpy as np

router = APIRouter()

Path("./datasets/raw").mkdir(parents=True, exist_ok=True)
Path("./datasets/clean").mkdir(parents=True, exist_ok=True)

def _get_preview_data(df: pd.DataFrame, limit: int = 10) -> list:
    """Get preview data from DataFrame for frontend charts"""
    # Get first few rows as preview
    preview_df = df.head(limit)
    return [row.to_dict() for _, row in preview_df.iterrows()]

def _get_numeric_columns(df: pd.DataFrame) -> list:
    """Get numeric columns excluding ID-like columns"""
    num_cols = []
    for col in df.select_dtypes(include=[np.number]).columns:
        if not any(hint in col.lower() for hint in ['id', 'index', 'key', 'order']):
            num_cols.append(col)

    # Fallback to all numeric if empty
    if not num_cols:
        num_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    return num_cols

@router.post("/")
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    dataset_id = str(uuid.uuid4())[:8]
    save_path = Path("./datasets/raw") / f"{dataset_id}_{file.filename}"
    with open(save_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    background_tasks.add_task(run_etl_pipeline, str(save_path), dataset_id)
    return JSONResponse({
        "dataset_id": dataset_id,
        "filename": file.filename,
        "status": "processing",
        "numeric_columns": [],
        "preview_data": []
    })

@router.post("/sample")
async def load_sample_dataset():
    # Get the base directory of the backend (two levels up from this file)
    base_dir = Path(__file__).resolve().parent.parent.parent
    sample_file = base_dir / "datasets" / "samples" / "retail_sales_sample.csv"

    if not sample_file.exists():
        return JSONResponse({"error": "Sample file retail_sales_sample.csv not found"}, status_code=404)

    dataset_id = "demo_retail"
    raw_path = Path("./datasets/raw") / f"{dataset_id}_retail_sales_sample.csv"
    shutil.copy(sample_file, raw_path)

    # Run ETL synchronously so the data is ready instantly for the UI
    try:
        run_etl_pipeline(str(raw_path), dataset_id)
    except Exception as e:
        return JSONResponse({"error": f"ETL failed: {str(e)}"}, status_code=500)

    # Load the processed data to return preview info
    try:
        df = pd.read_parquet(f"./datasets/clean/{dataset_id}.parquet")
        numeric_columns = _get_numeric_columns(df)
        preview_data = _get_preview_data(df)

        return JSONResponse({
            "dataset_id": dataset_id,
            "filename": "retail_sales_sample.csv",
            "status": "complete",
            "numeric_columns": numeric_columns,
            "preview_data": preview_data
        })
    except Exception as e:
        # Fallback if we can't read the processed data
        return JSONResponse({
            "dataset_id": dataset_id,
            "filename": "retail_sales_sample.csv",
            "status": "complete",
            "numeric_columns": [],
            "preview_data": []
        })