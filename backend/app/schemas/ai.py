from pydantic import BaseModel, Field
from typing import Optional, List

class AskRequest(BaseModel):
    question: str = Field(..., min_length=2)
    subject: Optional[str] = "General Academic"
    topic: Optional[str] = None
    explanation_level: Optional[str] = "Intermediate" # Beginner, Intermediate, Advanced
    answer_length: Optional[str] = "Medium" # Short, Medium, Long, 5-Mark, 10-Mark
    conversation_history: Optional[List[dict]] = None

class AskResponse(BaseModel):
    answer: str
    subject: Optional[str]
    topic: Optional[str]
    explanation_level: str
    key_takeaways: Optional[List[str]] = None

class ExplainRequest(BaseModel):
    subject: str = Field(..., min_length=2)
    topic: str = Field(..., min_length=2)
    explanation_level: Optional[str] = "Intermediate" # Beginner, Intermediate, Advanced
    include_example: Optional[bool] = True
    exam_perspective: Optional[bool] = True

class ExplainResponse(BaseModel):
    subject: str
    topic: str
    explanation_level: str
    simple_definition: str
    detailed_explanation: str
    step_by_step_breakdown: List[str]
    practical_example: Optional[str]
    key_takeaways: List[str]
    related_concepts: List[str]

class SummarizeRequest(BaseModel):
    content: str = Field(..., min_length=20)
    subject: Optional[str] = None
    summary_type: str = "detailed" # "quick_revision", "detailed", "bullet_points", "exam_oriented", "key_formulas"
    desired_length: Optional[str] = "Medium" # Short, Medium, Long

class SummarizeResponse(BaseModel):
    summary_type: str
    title: str
    summary_text: str
    key_points: List[str]
    important_terms: List[str]
    formulas_or_rules: Optional[List[str]] = None

