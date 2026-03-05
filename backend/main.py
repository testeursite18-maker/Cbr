"""
Multi-SaaS Platform - Backend API
Architecture modulaire supportant 3 modes: Maçonnerie, Restauration, Pétition
"""

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
import os

from database import init_db, get_db
from routers import auth, admin, masonery, restaurant, petition, upload
from config import settings

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup"""
    await init_db()
    yield

app = FastAPI(
    title="Multi-SaaS Platform API",
    description="Plateforme SaaS multimodale - Maçonnerie, Restauration, Pétition",
    version="1.0.0",
    lifespan=lifespan
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
os.makedirs("uploads/logos", exist_ok=True)
os.makedirs("uploads/portfolio", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(masonery.router, prefix="/api/masonery", tags=["Maçonnerie"])
app.include_router(restaurant.router, prefix="/api/restaurant", tags=["Restauration"])
app.include_router(petition.router, prefix="/api/petition", tags=["Pétition"])

@app.get("/")
async def root():
    return {
        "message": "Multi-SaaS Platform API",
        "version": "1.0.0",
        "modes": ["masonery", "restaurant", "petition"]
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
