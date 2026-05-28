import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, BackgroundTasks
from fastapi.responses import JSONResponse
from core.etl import run_etl_pipeline

router = APIRouter()

Path("./datasets/raw").mkdir(parents=True, exist_ok=True)
Path("./datasets/clean").mkdir(parents=True, exist_ok=True)

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
        "status": "processing"
    })

@router.post("/sample")
async def load_sample_dataset():
    # Try multiple paths to find the sample file
    paths_to_try = [
        Path("./datasets/samples/retail_sales_sample.csv"),
        Path("backend/datasets/samples/retail_sales_sample.csv"),
        Path("c:/Users/USER/Desktop/InsightFlow-AI/backend/datasets/samples/retail_sales_sample.csv"),
        Path("../datasets/samples/retail_sales_sample.csv")
    ]
    
    sample_file = None
    for p in paths_to_try:
        if p.exists():
            sample_file = p
            break
            
    if not sample_file:
        return JSONResponse({"error": "Sample file retail_sales_sample.csv not found in paths"}, status_code=404)
        
    dataset_id = "demo_retail"
    raw_path = Path("./datasets/raw") / f"{dataset_id}_retail_sales_sample.csv"
    shutil.copy(sample_file, raw_path)
    
    # Run ETL synchronously so the data is ready instantly for the UI
    try:
        run_etl_pipeline(str(raw_path), dataset_id)
    except Exception as e:
        return JSONResponse({"error": f"ETL failed: {str(e)}"}, status_code=500)
        
    return JSONResponse({
        "dataset_id": dataset_id,
        "filename": "retail_sales_sample.csv",
        "status": "complete"
    })