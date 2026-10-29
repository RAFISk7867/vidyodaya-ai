import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.study_item import StudyItem
from app.schemas.question import QuestionGenerateRequest, QuestionGenerateResponse, QuestionItem
from app.services.summary_service import SummaryService
from app.utils.security import get_current_user_optional

router = APIRouter(prefix="/questions", tags=["Question Generation"])

@router.post("/generate", response_model=QuestionGenerateResponse)
def generate_questions(
    req: QuestionGenerateRequest,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    raw_questions = SummaryService.generate_exam_questions(
        subject=req.subject,
        topic=req.topic,
        question_type=req.question_type,
        difficulty=req.difficulty,
        count=req.count,
        source_context=req.source_context
    )

    clean_items: list[QuestionItem] = []
    for idx, item in enumerate(raw_questions, 1):
        raw_marks = item.get("marks", 5)
        parsed_marks = 5
        try:
            if isinstance(raw_marks, (int, float)):
                parsed_marks = int(raw_marks)
            elif isinstance(raw_marks, str):
                nums = re.findall(r'\d+', raw_marks)
                if nums:
                    parsed_marks = int(nums[0])
        except Exception:
            parsed_marks = 5

        # Handle answer structure
        raw_struct = item.get("expected_answer_structure", [])
        if isinstance(raw_struct, str):
            clean_struct = [s.strip("- *• ") for s in raw_struct.split("\n") if s.strip()]
        elif isinstance(raw_struct, list):
            clean_struct = [str(s) for s in raw_struct]
        else:
            clean_struct = []

        # Handle key points
        raw_points = item.get("key_points", [])
        if isinstance(raw_points, str):
            clean_points = [p.strip("- *• ") for p in raw_points.split("\n") if p.strip()]
        elif isinstance(raw_points, list):
            clean_points = [str(p) for p in raw_points]
        else:
            clean_points = []

        clean_items.append(QuestionItem(
            id=int(item.get("id", idx)),
            question=str(item.get("question", "")).strip(),
            marks=parsed_marks,
            difficulty=str(item.get("difficulty", req.difficulty)),
            expected_answer_structure=clean_struct,
            model_answer=str(item.get("model_answer", "")).strip(),
            key_points=clean_points
        ))

    if current_user:
        study_item = StudyItem(
            user_id=current_user.id,
            item_type="question_set",
            title=f"Questions: {req.topic} ({req.question_type})",
            subject=req.subject,
            topic=req.topic,
            content=f"Generated {len(clean_items)} questions for {req.subject} - {req.topic}"
        )
        db.add(study_item)
        db.commit()

    return QuestionGenerateResponse(
        subject=req.subject,
        topic=req.topic,
        question_type=req.question_type,
        questions=clean_items
    )

