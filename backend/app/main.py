import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings, get_effective_gemini_key
from app.database import create_tables, engine
from app.routers import auth, ai, documents, questions, quizzes, history, settings as settings_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("vidyodaya_backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Vidyodaya AI Database tables...")
    create_tables()
    logger.info("Database initialized successfully.")
    yield
    logger.info("Shutting down Vidyodaya AI backend.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Vidyodaya AI — Intelligent Generative AI Platform for Personalized Learning and Examination Preparation",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS + ["*"], # Permissive in local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handling
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(ai.router, prefix=settings.API_V1_PREFIX)
app.include_router(documents.router, prefix=settings.API_V1_PREFIX)
app.include_router(questions.router, prefix=settings.API_V1_PREFIX)
app.include_router(quizzes.router, prefix=settings.API_V1_PREFIX)
app.include_router(history.router, prefix=settings.API_V1_PREFIX)
app.include_router(settings_router.router, prefix=settings.API_V1_PREFIX)

@app.get("/api/health", tags=["Health"])
def health_check():
    gemini_key = get_effective_gemini_key()
    return {
        "status": "healthy",
        "service": "Vidyodaya AI Backend API",
        "version": settings.VERSION,
        "gemini_configured": bool(gemini_key and len(gemini_key) > 5),
        "database": "sqlite_connected"
    }

# Check for compiled frontend in production
frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"

if frontend_dist.exists() and (frontend_dist / "index.html").exists():
    if (frontend_dist / "assets").exists():
        app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        if full_path.startswith("api"):
            return JSONResponse(status_code=404, content={"detail": "API route not found"})
        requested_file = frontend_dist / full_path
        if requested_file.is_file():
            return FileResponse(requested_file)
        return FileResponse(frontend_dist / "index.html")
else:
    @app.get("/", tags=["Root"])
    def root():
        return {
            "name": settings.PROJECT_NAME,
            "tagline": "Learn Smarter. Rise Higher.",
            "status": "operational",
            "api_documentation": "/api/docs"
        }

