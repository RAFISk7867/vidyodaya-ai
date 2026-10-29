from app.schemas.auth import (
    UserCreate, UserLogin, UserResponse, Token, TokenData, UserUpdate
)
from app.schemas.ai import (
    AskRequest, AskResponse, ExplainRequest, ExplainResponse, SummarizeRequest, SummarizeResponse
)
from app.schemas.document import (
    DocumentResponse, DocumentDetailResponse, DocumentAnalyzeRequest
)
from app.schemas.question import (
    QuestionGenerateRequest, QuestionItem, QuestionGenerateResponse
)
from app.schemas.quiz import (
    QuizGenerateRequest, QuizQuestion, QuizResponse, QuizSubmitRequest,
    QuizAttemptResponse, QuizHistoryItem
)
from app.schemas.history import (
    StudyItemCreate, StudyItemResponse, DashboardStats, RecentActivityItem
)
from app.schemas.settings import (
    ApiKeyUpdateRequest, ApiKeyStatusResponse, ProfileUpdateRequest
)

