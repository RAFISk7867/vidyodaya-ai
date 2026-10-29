from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.study_item import StudyItem
from app.schemas.ai import AskRequest, AskResponse, ExplainRequest, ExplainResponse, SummarizeRequest, SummarizeResponse
from app.services.gemini_service import get_gemini_service
from app.services.summary_service import SummaryService
from app.utils.security import get_current_user_optional

router = APIRouter(prefix="/ai", tags=["AI Study Assistant"])

@router.post("/ask", response_model=AskResponse)
def ask_academic_question(
    req: AskRequest,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    gemini = get_gemini_service()

    # Build conversation context
    history_context = ""
    if req.conversation_history:
        for turn in req.conversation_history[-6:]:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            history_context += f"{role.upper()}: {content}\n"

    system_instruction = (
        "You are Vidyodaya AI, an elite educational academic tutor and examination mentor. "
        "Your mission is to help students truly master concepts, solve doubts, and prepare high-scoring answers. "
        "Guidelines:\n"
        "- Explain difficult concepts simply, intuitively, and systematically.\n"
        "- Provide well-structured answers using markdown headings, bullet points, and code/math blocks where helpful.\n"
        "- For technical concepts, provide concrete examples or analogies.\n"
        "- If asked for exam-oriented answers (e.g. 2-mark, 5-mark, 10-mark), strictly adhere to the expected university marking structure.\n"
        "- Never hallucinate or invent academic citations. If uncertain, state the boundary of knowledge clearly.\n"
        "- Always maintain an encouraging, scholarly, and articulate tone."
    )

    prompt = f"""
{history_context}
Current Academic Query:
Subject: {req.subject or 'General Academic'}
Topic: {req.topic or 'Concept Query'}
Target Explanation Level: {req.explanation_level}
Target Length: {req.answer_length}

Question:
{req.question}

Please provide an exceptional, structured educational response.
"""
    answer_text = gemini.generate_text(
        prompt=prompt,
        system_instruction=system_instruction,
        temperature=0.6
    )

    # Automatically extract key takeaways for quick revision
    key_takeaways = []
    lines = [line.strip("- *• \t") for line in answer_text.split("\n") if line.strip().startswith(("-", "*", "•"))]
    if lines:
        key_takeaways = lines[:4]

    # Save to history if logged in
    if current_user:
        study_item = StudyItem(
            user_id=current_user.id,
            item_type="assistant_qa",
            title=req.question[:100],
            subject=req.subject,
            topic=req.topic,
            content=answer_text
        )
        db.add(study_item)
        db.commit()

    return AskResponse(
        answer=answer_text,
        subject=req.subject,
        topic=req.topic,
        explanation_level=req.explanation_level or "Intermediate",
        key_takeaways=key_takeaways
    )

@router.post("/explain", response_model=ExplainResponse)
def explain_concept(
    req: ExplainRequest,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    result = SummaryService.explain_concept(
        subject=req.subject,
        topic=req.topic,
        explanation_level=req.explanation_level or "Intermediate",
        include_example=req.include_example if req.include_example is not None else True,
        exam_perspective=req.exam_perspective if req.exam_perspective is not None else True
    )

    if current_user:
        study_item = StudyItem(
            user_id=current_user.id,
            item_type="concept_note",
            title=f"Concept: {req.topic}",
            subject=req.subject,
            topic=req.topic,
            content=result.get("detailed_explanation", "")
        )
        db.add(study_item)
        db.commit()

    return ExplainResponse(**result)

@router.post("/summarize", response_model=SummarizeResponse)
def summarize_text(
    req: SummarizeRequest,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    result = SummaryService.summarize_content(
        content=req.content,
        subject=req.subject,
        summary_type=req.summary_type,
        desired_length=req.desired_length or "Medium"
    )

    if current_user:
        study_item = StudyItem(
            user_id=current_user.id,
            item_type="summary",
            title=result.get("title", f"Summary: {req.subject or 'Study Notes'}"),
            subject=req.subject,
            topic=None,
            content=result.get("summary_text", "")
        )
        db.add(study_item)
        db.commit()

    return SummarizeResponse(**result)

