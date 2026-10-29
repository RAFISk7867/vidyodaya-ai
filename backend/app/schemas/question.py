from pydantic import BaseModel, Field
from typing import Optional, List

class QuestionGenerateRequest(BaseModel):
    subject: str = Field(..., min_length=2)
    topic: str = Field(..., min_length=2)
    question_type: str = "important_exam" # "short_answer", "descriptive", "2_mark", "5_mark", "10_mark", "important_exam"
    difficulty: str = "Medium" # "Easy", "Medium", "Hard"
    count: int = Field(5, ge=1, le=20)
    source_context: Optional[str] = None # Optional text from PDF or syllabus

class QuestionItem(BaseModel):
    id: int
    question: str
    marks: int
    difficulty: str
    expected_answer_structure: List[str]
    model_answer: str
    key_points: List[str]

class QuestionGenerateResponse(BaseModel):
    subject: str
    topic: str
    question_type: str
    disclaimer: str = "AI-generated practice questions and structured answers for academic preparation."
    questions: List[QuestionItem]

