import pandas as pd
import json
import sys
from core.ai_insights import answer_data_question

def test_invoice_generation():
    print("Testing Invoice Generation...")
    df = pd.read_csv("datasets/samples/retail_sales_sample.csv")
    
    # 1. Ask for order 1001
    res = answer_data_question(df, "Generate invoice for order 1001")
    
    # 2. Extract and parse JSON
    assert "```json" in res, "Should contain ```json codeblock"
    json_str = res.replace("```json", "").replace("```", "").strip()
    data = json.loads(json_str)
    
    # 3. Assert invoice details
    assert data["document_type"] in ["invoice", "bill", "receipt"]
    assert data["invoice_number"] == "INV-2024-1001"
    assert data["customer_id"] == "C001"
    assert len(data["items"]) == 1
    assert data["items"][0]["description"] == "iPhone 15 (Electronics)"
    assert data["items"][0]["quantity"] == 2
    assert data["items"][0]["price"] == 79999.0
    assert data["items"][0]["total"] == 159998.0
    assert data["subtotal"] == 159998.0
    assert data["grand_total"] == round(159998.0 * 1.18, 2)
    print("[OK] Invoice generation verified successfully.")

def test_financial_report_generation():
    print("Testing Financial Report Generation...")
    df = pd.read_csv("datasets/samples/retail_sales_sample.csv")
    
    # 1. Ask for report
    res = answer_data_question(df, "Generate a financial report")
    
    # 2. Extract and parse JSON
    assert "```json" in res, "Should contain ```json codeblock"
    json_str = res.replace("```json", "").replace("```", "").strip()
    data = json.loads(json_str)
    
    # 3. Assert report details
    assert data["document_type"] == "financial_report"
    assert "financial_metrics" in data
    metrics = data["financial_metrics"]
    assert metrics["total_income"] == round(df["revenue"].sum(), 2)
    assert metrics["total_expenses"] == round(df["revenue"].sum() * 0.62, 2)
    assert metrics["net_margin"] == 38.0 # (1 - 0.62) * 100
    assert "advice_block" in metrics
    assert len(data["report_sections"]) >= 3
    print("[OK] Financial report generation verified successfully.")

if __name__ == "__main__":
    try:
        test_invoice_generation()
        test_financial_report_generation()
        print("\nALL BACKEND TESTS PASSED!")
    except Exception as e:
        print("\nTEST FAILED:", str(e))
        sys.exit(1)
