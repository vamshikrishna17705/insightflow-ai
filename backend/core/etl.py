import pandas as pd
import numpy as np
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


def run_etl_pipeline(file_path: str, dataset_id: str) -> dict:
    logger.info(f"[ETL] Starting pipeline for dataset {dataset_id}")
    df = extract(file_path)
    report = {"dataset_id": dataset_id, "raw_rows": len(df), "steps": []}
    df, clean_report = clean(df)
    report["steps"].append(clean_report)
    df, transform_report = transform(df)
    report["steps"].append(transform_report)
    load(df, dataset_id)
    report["status"] = "complete"
    report["final_rows"] = len(df)
    logger.info(f"[ETL] Complete. {report['final_rows']} rows loaded.")
    return report


def extract(file_path: str) -> pd.DataFrame:
    path = Path(file_path)
    ext = path.suffix.lower()
    
    if ext == ".csv":
        for enc in ["utf-8", "latin-1", "cp1252"]:
            try:
                return pd.read_csv(file_path, encoding=enc)
            except Exception:
                continue
    elif ext in [".tsv", ".txt"]:
        for sep in ["\t", ",", ";"]:
            for enc in ["utf-8", "latin-1", "cp1252"]:
                try:
                    df = pd.read_csv(file_path, sep=sep, encoding=enc)
                    if len(df.columns) > 1: # Successfully split columns
                        return df
                except Exception:
                    continue
    elif ext in [".xlsx", ".xls"]:
        return pd.read_excel(file_path)
    elif ext == ".json":
        try:
            return pd.read_json(file_path)
        except Exception:
            # Try reading line-delimited json
            return pd.read_json(file_path, lines=True)
    elif ext == ".parquet":
        return pd.read_parquet(file_path)
    elif ext == ".xml":
        try:
            return pd.read_xml(file_path)
        except Exception as e:
            raise ValueError(f"Failed to read XML: {str(e)}")
            
    # Unknown extension or fallback check: try parsing as CSV/TSV, then JSON
    for enc in ["utf-8", "latin-1"]:
        try:
            # Try as CSV
            df = pd.read_csv(file_path, sep=",", encoding=enc)
            if len(df.columns) > 1 and len(df) > 0:
                return df
        except Exception:
            pass
        try:
            # Try as TSV
            df = pd.read_csv(file_path, sep="\t", encoding=enc)
            if len(df.columns) > 1 and len(df) > 0:
                return df
        except Exception:
            pass
        try:
            # Try as JSON
            return pd.read_json(file_path)
        except Exception:
            pass
            
    raise ValueError(f"Unsupported or unparseable file format: {ext or 'None'}")


def clean(df: pd.DataFrame) -> tuple:
    report = {"step": "clean"}
    missing_before = int(df.isnull().sum().sum())
    dupes_before = int(df.duplicated().sum())

    df = df.dropna(how="all", axis=1).dropna(how="all", axis=0)

    for col in df.columns:
        if df[col].isnull().sum() == 0:
            continue
        if df[col].dtype in [np.float64, np.int64]:
            df[col] = df[col].fillna(df[col].median())
        else:
            mode = df[col].mode()
            fill_val = mode[0] if not mode.empty else "Unknown"
            df[col] = df[col].fillna(fill_val)

    df = df.drop_duplicates()

    df.columns = (
        df.columns.str.lower()
        .str.strip()
        .str.replace(r"[^a-z0-9_]", "_", regex=True)
        .str.replace(r"_+", "_", regex=True)
        .str.strip("_")
    )

    df = df.infer_objects()

    date_hints = ["date", "time", "created", "updated", "ordered", "timestamp"]
    for col in df.columns:
        if any(hint in col for hint in date_hints):
            try:
                df[col] = pd.to_datetime(df[col], infer_datetime_format=True)
            except Exception:
                pass

    report["missing_values_fixed"] = missing_before
    report["duplicates_removed"] = dupes_before
    report["columns_after_clean"] = list(df.columns)
    return df, report


def transform(df: pd.DataFrame) -> tuple:
    report = {"step": "transform", "features_added": []}

    date_cols = df.select_dtypes(include=["datetime64[ns]"]).columns
    for col in date_cols:
        df[f"{col}_year"] = df[col].dt.year
        df[f"{col}_month"] = df[col].dt.month
        df[f"{col}_quarter"] = df[col].dt.quarter
        df[f"{col}_dayofweek"] = df[col].dt.dayofweek
        report["features_added"] += [f"{col}_year", f"{col}_month"]

    numeric_cols = df.select_dtypes(include=[np.number]).columns[:3]
    for col in numeric_cols:
        df[f"{col}_rolling_mean_7"] = df[col].rolling(7, min_periods=1).mean()
        df[f"{col}_rolling_std_7"] = df[col].rolling(7, min_periods=1).std().fillna(0)

    return df, report


def load(df: pd.DataFrame, dataset_id: str):
    out_dir = Path("./datasets/clean")
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{dataset_id}.parquet"
    df.to_parquet(out_path, index=False)
    logger.info(f"[ETL] Saved to {out_path}")