from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import (
    settings,
    get_effective_gemini_key,
    set_runtime_gemini_key,
    get_effective_gemini_model,
    set_runtime_gemini_model,
)
from app.database import get_db
from app.models.user import User
from app.models.document import Document
from app.models.study_item import StudyItem
from app.models.quiz import Quiz, QuizAttempt
from app.schemas.settings import ApiKeyUpdateRequest, ApiKeyStatusResponse, ProfileUpdateRequest
from app.schemas.auth import UserResponse
from app.utils.security import get_current_user

router = APIRouter(prefix="/settings", tags=["Application Settings"])

@router.get("/gemini-status", response_model=ApiKeyStatusResponse)
def get_gemini_status():
    key = get_effective_gemini_key()
    is_set = bool(key and len(key.strip()) > 5)
    return ApiKeyStatusResponse(
        is_configured=is_set,
        model=get_effective_gemini_model(),
        message="Gemini API is configured and operational." if is_set else "Gemini API key is not yet set. Add your key in backend/.env or configure below."
    )

@router.post("/update-api-key", response_model=ApiKeyStatusResponse)
def update_gemini_api_key(req: ApiKeyUpdateRequest, current_user: User = Depends(get_current_user)):
    if req.gemini_api_key is not None and req.gemini_api_key.strip():
        new_key = req.gemini_api_key.strip()
        set_runtime_gemini_key(new_key)
    
    if req.model is not None and req.model.strip():
        set_runtime_gemini_model(req.model.strip())

    key = get_effective_gemini_key()
    is_set = bool(key and len(key.strip()) > 5)
    return ApiKeyStatusResponse(
        is_configured=is_set,
        model=get_effective_gemini_model(),
        message="Gemini settings successfully updated for this session."
    )

@router.put("/profile", response_model=UserResponse)
def update_profile(
    req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.full_name:
        current_user.full_name = req.full_name.strip()
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/delete-data")
def delete_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Clears all user documents, study items, quizzes, and quiz attempts with full isolation.
    """
    db.query(QuizAttempt).filter(QuizAttempt.user_id == current_user.id).delete()
    db.query(Quiz).filter(Quiz.user_id == current_user.id).delete()
    db.query(Document).filter(Document.user_id == current_user.id).delete()
    db.query(StudyItem).filter(StudyItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "All user study materials, documents, and quiz records deleted successfully."}

