from pydantic import BaseModel
from typing import Optional

class ApiKeyUpdateRequest(BaseModel):
    gemini_api_key: str

class ApiKeyStatusResponse(BaseModel):
    is_configured: bool
    model: str
    message: str

class ProfileUpdateRequest(BaseModel):
    full_name: str

