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