from fastapi import APIRouter
from pydantic import BaseModel
from pathlib import Path
import pandas as pd
import numpy as np
from core.ml_models import segment_customers

router = APIRouter()

class SegmentationRequest(BaseModel):
    features: list[str] = []
    k: int = 5

@router.post("/{dataset_id}")
def run_segmentation(dataset_id: str, req: SegmentationRequest):
    path = Path(f"./datasets/clean/{dataset_id}.parquet")
    if not path.exists():
        return {"error": "Dataset not ready"}
    df = pd.read_parquet(path)
    
    num_cols = []
    for col in df.select_dtypes(include=[np.number]).columns:
        if not any(hint in col.lower() for hint in ['id', 'index', 'key', 'order']):
            num_cols.append(col)
            
    if not num_cols:
        num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
    selected_features = req.features
    if not selected_features:
        selected_features = num_cols[:3] # Default to first 3 numeric columns
        
    if not selected_features:
        return {"error": "No suitable numeric columns found for clustering"}
        
    for f in selected_features:
        if f not in df.columns:
            return {"error": f"Feature '{f}' not found in dataset"}
            
    df_clean = df.dropna(subset=selected_features)
    if len(df_clean) < req.k:
        return {"error": f"Not enough data points ({len(df_clean)}) to form {req.k} clusters."}
        
    try:
        results = segment_customers(df_clean, selected_features, req.k)
        
        # Profile the clusters (add segment descriptors and averages)
        df_clean['_cluster'] = results['labels']
        segment_names = {
            0: "Champions",
            1: "Loyal",
            2: "At Risk",
            3: "New Customers",
            4: "Lost",
        }
        df_clean['_segment'] = df_clean['_cluster'].map(lambda x: segment_names.get(x, f"Cluster {x}"))
        
        # Calculate cluster averages for profiling
        profiles = df_clean.groupby('_segment')[selected_features].mean().round(2).to_dict(orient="index")
        
        profile_list = []
        for seg_name, vals in profiles.items():
            profile_list.append({
                "segment": seg_name,
                "size": results['cluster_sizes'].get(seg_name, 0),
                "averages": vals
            })
            
        results['profiles'] = profile_list
        return results
    except Exception as e:
        return {"error": f"Segmentation failed: {str(e)}"}
