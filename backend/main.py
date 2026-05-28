from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

from api.routes.upload import router as upload_router
from api.routes.dashboard import router as dashboard_router
from api.routes.insights import router as insights_router
from api.routes.forecast import router as forecast_router
from api.routes.anomaly import router as anomaly_router
from api.routes.segmentation import router as segmentation_router

app = FastAPI(title="InsightFlow AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router,    prefix="/api/upload")
app.include_router(dashboard_router, prefix="/api/dashboard")
app.include_router(insights_router,  prefix="/api/insights")
app.include_router(forecast_router,  prefix="/api/forecast")
app.include_router(anomaly_router,   prefix="/api/anomaly")
app.include_router(segmentation_router, prefix="/api/segmentation")

@app.get("/")
def root():
    return {"status": "InsightFlow AI running"}