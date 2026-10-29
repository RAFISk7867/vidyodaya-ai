from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class StudyItemCreate(BaseModel):
    item_type: str # "assistant_qa", "concept_note", "summary", "question_set"
    title: str
    subject: Optional[str] = None
    topic: Optional[str] = None
    content: str
    metadata_json: Optional[str] = None

class StudyItemResponse(BaseModel):
    id: int
    item_type: str
    title: str
    subject: Optional[str]
    topic: Optional[str]
    content: str
    metadata_json: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RecentActivityItem(BaseModel):
    id: int
    type: str # "quiz", "document", "study_item"
    title: str
    subtitle: str
    date: datetime
    badge: Optional[str] = None

class DashboardStats(BaseModel):
    quizzes_attempted: int
    questions_asked: int
    documents_processed: int
    study_items_saved: int
    average_quiz_score: float
    recent_activities: List[RecentActivityItem]
    score_trend: List[Dict[str, Any]]
