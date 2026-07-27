# InsightFlow AI 🧠

**AI-powered Business Analytics Platform** — Transform raw data into intelligent dashboards, forecasts, anomalies, and actionable insights automatically.

## 🌐 Live Demo
- **App**: https://insightflow-ai-sigma.vercel.app
- **API**: Full-stack production deployment

## 🎯 What It Does

| Step | What Happens |
|------|-------------|
| 📤 Upload | Drag-drop CSV / Excel / JSON files |
| 🔧 ETL | Auto-clean, deduplicate, type-infer, feature-engineer data |
| 📊 Dashboard | Real-time KPI cards, trends, column analytics |
| 🚨 Anomalies | Detect outliers using Isolation Forest |
| 🤖 AI Insights | Gemini generates plain-English business insights |
| 💬 Chat | Ask natural language questions about your data |

## 🛠️ Tech Stack

**Backend:** Python · FastAPI · Pandas · Scikit-learn · XGBoost · Gemini AI

**Frontend:** React · Vite · Next.js · Glassmorphism UI

**Infrastructure:** Vercel Deployment · RESTful APIs · JWT Authentication

**ML Models:** Isolation Forest · XGBoost · K-Means Clustering

## ✨ Key Features

- **Real-time Analytics**: Instant data processing and visualization
- **AI-Powered Insights**: Automated business intelligence generation
- **Anomaly Detection**: Identify outliers and suspicious patterns
- **Data ETL**: Fully automated data cleaning and preprocessing
- **Responsive UI**: Modern glassmorphism design with full responsiveness
- **Full-Stack Architecture**: Scalable backend with Express.js/FastAPI

## 🚀 Quick Start

```bash
# Backend Setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend Setup
cd frontend
npm install
npm run dev
```

## 📦 Installation

```bash
git clone https://github.com/vamshikrishna17705/insightflow-ai.git
cd insightflow-ai
npm install
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.

---

**Built with ❤️ by Vamshi Krishna**
