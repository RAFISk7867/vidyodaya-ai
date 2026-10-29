from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict
from datetime import datetime

class QuizOption(BaseModel):
    id: str # "A", "B", "C", "D"
    text: str

class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[QuizOption]
    explanation: Optional[str] = None
    topic: Optional[str] = None

# For frontend quiz taking (we don't expose correct_option directly to prevent client cheating during active quiz)
class QuizPublicQuestion(BaseModel):
    id: int
    question: str
    options: List[QuizOption]
    topic: Optional[str] = None

class QuizQuestionWithAnswer(QuizQuestion):
    correct_option: str # "A", "B", "C", "D"

class QuizGenerateRequest(BaseModel):
    subject: str = Field(..., min_length=2)
    topic: str = Field(..., min_length=2)
    difficulty: str = "Medium" # "Easy", "Medium", "Hard"
    count: int = Field(5, ge=3, le=25)
    time_limit_minutes: Optional[int] = 10
    is_mock_test: Optional[bool] = False
    source_context: Optional[str] = None

class QuizResponse(BaseModel):
    id: int
    title: str
    subject: str
    topic: str
    difficulty: str
    time_limit_minutes: int
    is_mock_test: bool = False
    total_questions: int
    questions: List[QuizPublicQuestion]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class QuizUserAnswer(BaseModel):
    question_id: int
    selected_option: Optional[str] = None # "A", "B", "C", "D" or None if skipped

class QuizSubmitRequest(BaseModel):
    answers: List[QuizUserAnswer]
    time_taken_seconds: int = 0

class AnswerReviewItem(BaseModel):
    question_id: int
    question: str
    options: List[QuizOption]
    selected_option: Optional[str]
    correct_option: str
    is_correct: bool
    explanation: str
    topic: Optional[str]

class QuizAttemptResponse(BaseModel):
    id: int
    quiz_id: int
    title: str
    score: int
    total_questions: int
    percentage: float
    time_taken_seconds: int
    topics_to_review: List[str]
    review: List[AnswerReviewItem]
    created_at: datetime

class QuizHistoryItem(BaseModel):
    attempt_id: int
    quiz_id: int
    title: str
    subject: str
    topic: str
    score: int
    total_questions: int
    percentage: float
    created_at: datetime
