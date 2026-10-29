import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.quiz import Quiz, QuizAttempt
from app.schemas.quiz import (
    QuizGenerateRequest, QuizResponse, QuizPublicQuestion,
    QuizSubmitRequest, QuizAttemptResponse, AnswerReviewItem, QuizHistoryItem
)
from app.services.quiz_service import QuizService
from app.utils.security import get_current_user

router = APIRouter(prefix="/quizzes", tags=["Quizzes and Mock Tests"])

@router.post("/generate", response_model=QuizResponse)
def generate_quiz(
    req: QuizGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    questions_data = QuizService.generate_quiz_questions(
        subject=req.subject,
        topic=req.topic,
        difficulty=req.difficulty,
        count=req.count,
        is_mock_test=req.is_mock_test or False,
        source_context=req.source_context
    )

    quiz_title = f"{'Mock Test' if req.is_mock_test else 'Quiz'}: {req.subject} - {req.topic}"

    quiz = Quiz(
        user_id=current_user.id,
        title=quiz_title,
        subject=req.subject,
        topic=req.topic,
        difficulty=req.difficulty,
        time_limit_minutes=req.time_limit_minutes or 15,
        questions_json=json.dumps(questions_data)
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    public_questions = [
        QuizPublicQuestion(
            id=q["id"],
            question=q["question"],
            options=q["options"],
            topic=q.get("topic")
        )
        for q in questions_data
    ]

    return QuizResponse(
        id=quiz.id,
        title=quiz.title,
        subject=quiz.subject,
        topic=quiz.topic,
        difficulty=quiz.difficulty,
        time_limit_minutes=quiz.time_limit_minutes,
        is_mock_test=req.is_mock_test or False,
        total_questions=len(public_questions),
        questions=public_questions,
        created_at=quiz.created_at
    )

@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz(
    quiz_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == current_user.id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")

    questions_data = json.loads(quiz.questions_json)
    public_questions = [
        QuizPublicQuestion(
            id=q["id"],
            question=q["question"],
            options=q["options"],
            topic=q.get("topic")
        )
        for q in questions_data
    ]

    return QuizResponse(
        id=quiz.id,
        title=quiz.title,
        subject=quiz.subject,
        topic=quiz.topic,
        difficulty=quiz.difficulty,
        time_limit_minutes=quiz.time_limit_minutes,
        is_mock_test="Mock Test" in quiz.title,
        total_questions=len(public_questions),
        questions=public_questions,
        created_at=quiz.created_at
    )

@router.post("/{quiz_id}/submit", response_model=QuizAttemptResponse)
def submit_quiz(
    quiz_id: int,
    submission: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == current_user.id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found.")

    stored_questions = json.loads(quiz.questions_json)
    user_answers_dict = [a.model_dump() for a in submission.answers]

    # Evaluate strictly on backend
    evaluation = QuizService.evaluate_quiz(stored_questions, user_answers_dict)

    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz.id,
        score=evaluation["score"],
        total_questions=evaluation["total_questions"],
        percentage=evaluation["percentage"],
        time_taken_seconds=submission.time_taken_seconds,
        answers_json=json.dumps(user_answers_dict),
        topics_to_review_json=json.dumps(evaluation["topics_to_review"])
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    review_items = [AnswerReviewItem(**item) for item in evaluation["review"]]

    return QuizAttemptResponse(
        id=attempt.id,
        quiz_id=quiz.id,
        title=quiz.title,
        score=evaluation["score"],
        total_questions=evaluation["total_questions"],
        percentage=evaluation["percentage"],
        time_taken_seconds=submission.time_taken_seconds,
        topics_to_review=evaluation["topics_to_review"],
        review=review_items,
        created_at=attempt.created_at
    )

@router.get("/history/list", response_model=List[QuizHistoryItem])
def get_quiz_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.created_at.desc())
        .limit(30)
        .all()
    )

    history = []
    for att in attempts:
        quiz = db.query(Quiz).filter(Quiz.id == att.quiz_id).first()
        history.append(QuizHistoryItem(
            attempt_id=att.id,
            quiz_id=att.quiz_id,
            title=quiz.title if quiz else "Archived Quiz",
            subject=quiz.subject if quiz else "General",
            topic=quiz.topic if quiz else "Review",
            score=att.score,
            total_questions=att.total_questions,
            percentage=att.percentage,
            created_at=att.created_at
        ))
    return history

