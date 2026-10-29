from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user import User
from app.models.study_item import StudyItem
from app.models.document import Document
from app.models.quiz import Quiz, QuizAttempt
from app.schemas.history import StudyItemCreate, StudyItemResponse, DashboardStats, RecentActivityItem
from app.utils.security import get_current_user

router = APIRouter(prefix="/history", tags=["Study History & Analytics"])

@router.get("", response_model=List[StudyItemResponse])
def get_study_history(
    item_type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(StudyItem).filter(StudyItem.user_id == current_user.id)
    if item_type:
        query = query.filter(StudyItem.item_type == item_type)
    items = query.order_by(StudyItem.created_at.desc()).limit(100).all()
    return items

@router.post("", response_model=StudyItemResponse, status_code=status.HTTP_201_CREATED)
def save_study_item(
    item_in: StudyItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_item = StudyItem(
        user_id=current_user.id,
        item_type=item_in.item_type,
        title=item_in.title,
        subject=item_in.subject,
        topic=item_in.topic,
        content=item_in.content,
        metadata_json=item_in.metadata_json
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{item_id}", status_code=status.HTTP_200_OK)
def delete_study_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(StudyItem).filter(StudyItem.id == item_id, StudyItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Study item not found.")
    db.delete(item)
    db.commit()
    return {"message": "Study item removed from history."}

@router.get("/dashboard-stats", response_model=DashboardStats)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Real metrics derived from actual database records
    quizzes_count = db.query(QuizAttempt).filter(QuizAttempt.user_id == current_user.id).count()
    qa_count = db.query(StudyItem).filter(
        StudyItem.user_id == current_user.id,
        StudyItem.item_type == "assistant_qa"
    ).count()
    docs_count = db.query(Document).filter(Document.user_id == current_user.id).count()
    total_saved = db.query(StudyItem).filter(StudyItem.user_id == current_user.id).count()

    avg_score_res = db.query(func.avg(QuizAttempt.percentage)).filter(QuizAttempt.user_id == current_user.id).scalar()
    avg_score = round(float(avg_score_res), 1) if avg_score_res is not None else 0.0

    # Build recent activities from quiz attempts, documents, and study items
    recent_attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.created_at.desc())
        .limit(4)
        .all()
    )
    recent_docs = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
        .limit(4)
        .all()
    )
    recent_items = (
        db.query(StudyItem)
        .filter(StudyItem.user_id == current_user.id)
        .order_by(StudyItem.created_at.desc())
        .limit(4)
        .all()
    )

    activities: List[RecentActivityItem] = []
    for att in recent_attempts:
        quiz = db.query(Quiz).filter(Quiz.id == att.quiz_id).first()
        activities.append(RecentActivityItem(
            id=att.id,
            type="quiz",
            title=quiz.title if quiz else "Quiz Attempt",
            subtitle=f"Scored {att.score}/{att.total_questions} ({att.percentage}%)",
            date=att.created_at,
            badge=f"{att.percentage}%"
        ))

    for doc in recent_docs:
        activities.append(RecentActivityItem(
            id=doc.id,
            type="document",
            title=doc.filename,
            subtitle=f"{doc.page_count} pages • {(doc.file_size / 1024):.1f} KB",
            date=doc.created_at,
            badge="PDF"
        ))

    for item in recent_items:
        activities.append(RecentActivityItem(
            id=item.id,
            type="study_item",
            title=item.title,
            subtitle=f"{item.subject or 'General'} • {item.item_type.replace('_', ' ').capitalize()}",
            date=item.created_at,
            badge=item.item_type.split('_')[0].upper()
        ))

    # Sort combined activities by date descending
    activities.sort(key=lambda a: a.date, reverse=True)
    recent_activities = activities[:6]

    # Score trend for Recharts
    past_attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == current_user.id)
        .order_by(QuizAttempt.created_at.asc())
        .limit(10)
        .all()
    )
    score_trend = []
    for idx, att in enumerate(past_attempts, 1):
        score_trend.append({
            "attempt": f"Test {idx}",
            "score": att.score,
            "percentage": att.percentage,
            "total": att.total_questions
        })

    return DashboardStats(
        quizzes_attempted=quizzes_count,
        questions_asked=qa_count,
        documents_processed=docs_count,
        study_items_saved=total_saved,
        average_quiz_score=avg_score,
        recent_activities=recent_activities,
        score_trend=score_trend
    )

