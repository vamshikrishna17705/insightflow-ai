from fastapi import APIRouter
from pydantic import BaseModel
from pathlib import Path
import pandas as pd
from core.ai_insights import generate_insights, answer_data_question

router = APIRouter()

class ChatRequest(BaseModel):
    dataset_id: str
    question: str

@router.get("/{dataset_id}")
def get_insights(dataset_id: str):
    path = Path(f"./datasets/clean/{dataset_id}.parquet")
    if not path.exists():
        return {"error": "Dataset not ready"}
    df = pd.read_parquet(path)
    return {"insights": generate_insights(df, {})}

@router.post("/chat")
def chat(req: ChatRequest):
    path = Path(f"./datasets/clean/{req.dataset_id}.parquet")
    if not path.exists():
        return {"error": "Dataset not ready"}
    df = pd.read_parquet(path)
    return {"answer": answer_data_question(df, req.question)}