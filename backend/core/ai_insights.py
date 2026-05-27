import os
import json
import pandas as pd
import urllib.request
from dotenv import load_dotenv

load_dotenv()

GEMINI_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_URL = GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + str(GEMINI_KEY)


def call_gemini(prompt):
    body = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")
    req = urllib.request.Request(GEMINI_URL, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as res:
        result = json.loads(res.read())
        return result["candidates"][0]["content"]["parts"][0]["text"]


def generate_insights(df, stats):
    summary = {"rows": len(df), "columns": list(df.columns), "stats": df.describe().to_dict()}
    prompt = "You are a business analyst. Return ONLY a JSON array of 3 insights. Each has: title, body, type (trend or anomaly or opportunity), confidence (0-100). No markdown. Just JSON array. Data: " + json.dumps(summary, default=str)
    try:
        text = call_gemini(prompt)
        text = text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        return [{"title": "Analysis ready", "body": "Dataset has " + str(len(df)) + " rows.", "type": "trend", "confidence": 95}]


def answer_data_question(df, question):
    summary = df.describe(include="all").to_string()
    prompt = "Data summary:\n" + summary + "\n\nQuestion: " + question + "\nAnswer in 2-3 sentences using specific numbers."
    try:
        return call_gemini(prompt)
    except Exception as e:
        return "Could not answer: " + str(e)