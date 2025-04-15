# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import api
from .models.email_model import Base
from sqlalchemy import create_engine
from config import settings

app = FastAPI(title="Email Fraud Detection API", version="1.0.0")

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api.router, prefix="/api", tags=["Email Analysis"])

# Create database tables on startup
@app.on_event("startup")
async def startup():
    engine = create_engine(f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}/{settings.DB_NAME}")
    Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"message": "Email Fraud Detection API is running"}
