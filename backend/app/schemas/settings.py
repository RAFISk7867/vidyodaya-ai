from pydantic import BaseModel
from typing import Optional, List

class ApiKeyUpdateRequest(BaseModel):
    gemini_api_key: Optional[str] = None
    model: Optional[str] = None

class ApiKeyStatusResponse(BaseModel):
    is_configured: bool
    model: str
    message: str
    available_models: List[str] = ["gemini-flash-lite-latest", "gemini-3.8-flash", "gemini-3.5-flash"]

class ProfileUpdateRequest(BaseModel):
    full_name: str


