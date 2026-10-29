import os
from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Vidyodaya AI"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # Security
    SECRET_KEY: str = "vidyodaya-super-secret-key-educational-production-2025-ai"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./vidyodaya.db"
    
    # AI - Google Gemini
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.8-flash"
    
    # File Uploads
    MAX_UPLOAD_SIZE_MB: int = 25
    UPLOAD_DIR: str = str(BASE_DIR / "uploads")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def effective_gemini_model(self) -> str:
        model = (self.GEMINI_MODEL or "").strip()
        # Automatically upgrade deprecated or retired Gemini models
        deprecated = {
            "gemini-2.5-flash",
            "models/gemini-2.5-flash",
            "gemini-1.5-flash",
            "models/gemini-1.5-flash",
            "gemini-1.5-pro",
            "models/gemini-1.5-pro",
            "gemini-1.0-pro",
            "models/gemini-1.0-pro"
        }
        if not model or model.lower() in deprecated:
            return "gemini-3.8-flash"
        return model

settings = Settings()

# Runtime key and model store allows user to update API key and model from Settings UI without restarting
_runtime_gemini_key: Optional[str] = None
_runtime_gemini_model: Optional[str] = None

def get_effective_gemini_key() -> Optional[str]:
    global _runtime_gemini_key
    if _runtime_gemini_key:
        return _runtime_gemini_key
    env_key = os.getenv("GEMINI_API_KEY")
    if env_key:
        return env_key
    return settings.GEMINI_API_KEY

def set_runtime_gemini_key(new_key: Optional[str]) -> None:
    global _runtime_gemini_key
    _runtime_gemini_key = new_key.strip() if new_key else None

def get_effective_gemini_model() -> str:
    global _runtime_gemini_model
    if _runtime_gemini_model:
        return _runtime_gemini_model
    env_model = os.getenv("GEMINI_MODEL")
    if env_model:
        model = env_model.strip()
        deprecated = {
            "gemini-2.5-flash",
            "models/gemini-2.5-flash",
            "gemini-1.5-flash",
            "models/gemini-1.5-flash",
            "gemini-1.5-pro",
            "models/gemini-1.5-pro",
            "gemini-1.0-pro",
            "models/gemini-1.0-pro"
        }
        if model.lower() not in deprecated:
            return model
    return settings.effective_gemini_model

def set_runtime_gemini_model(new_model: Optional[str]) -> None:
    global _runtime_gemini_model
    if new_model and new_model.strip():
        _runtime_gemini_model = new_model.strip()

