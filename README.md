# ⚡ InsightFlow AI — Intelligent Business Analytics Platform
## 🌐 Live Demo
- **App:** https://insightflow-hkyh5pwa0-vamshi-krishnas-projects1.vercel.app
- **API:** https://insightflow-ai-backend.onrender.com/docs
> Upload raw business data → get AI-powered dashboards, forecasts, anomaly detection, and plain-English insights automatically.

![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green?style=flat-square)
![React](https://img.shields.io/badge/React-Vite-61dafb?style=flat-square)
![Gemini](https://img.shields.io/badge/Gemini-AI-orange?style=flat-square)

## 🎯 What It Does

| Step | What Happens |
|------|-------------|
| 📤 Upload | Drag-drop CSV / Excel / JSON |
| 🔧 ETL | Auto-clean, deduplicate, type-infer, feature-engineer |
| 📊 Dashboard | KPI cards, revenue trends, column analytics |
| 🚨 Anomalies | Flag outliers using Isolation Forest |
| 🤖 AI Insights | Gemini generates plain-English business insights |
| 💬 Chat | Ask natural language questions about your data |

## 🛠️ Tech Stack

**Backend:** Python · FastAPI · Pandas · Scikit-learn · XGBoost · Gemini AI

**Frontend:** React · Vite · Glassmorphism UI

**ML Models:** Isolation Forest · XGBoost · K-Means

## 🚀 Quick Start

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

Add your Gemini API key to `backend/.env`: