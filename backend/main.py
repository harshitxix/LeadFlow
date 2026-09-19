from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import leads, analysis

app = FastAPI(title="LeadFlow AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(leads.router, prefix="/api/leads", tags=["leads"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])

@app.get("/")
def root():
    return {"message": "LeadFlow AI API is running"}
