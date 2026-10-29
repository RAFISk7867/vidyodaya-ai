from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_size: int
    file_type: str
    page_count: int
    processing_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class DocumentDetailResponse(DocumentResponse):
    extracted_text_preview: str
    has_full_text: bool
    summary: Optional[str] = None

class DocumentAnalyzeRequest(BaseModel):
    action: str # "summarize", "generate_questions", "generate_2mark", "generate_5mark", "generate_10mark", "revision_notes", "generate_mcqs"
    unit_or_topic: Optional[str] = None
    question_count: Optional[int] = 5
