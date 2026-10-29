import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentResponse, DocumentDetailResponse, DocumentAnalyzeRequest
from app.services.pdf_service import PDFService
from app.services.gemini_service import get_gemini_service
from app.services.summary_service import SummaryService
from app.services.quiz_service import QuizService
from app.utils.security import get_current_user, get_current_user_optional
from app.utils.text_chunker import get_focused_context

router = APIRouter(prefix="/documents", tags=["Documents"])

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=DocumentDetailResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF (.pdf) documents are supported."
        )

    # Read content to check file size
    contents = await file.read()
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum upload size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # Generate unique filename on disk
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    # Extract text using PyMuPDF
    try:
        extraction = PDFService.extract_text_from_pdf(file_path)
    except HTTPException:
        # Clean up file on failure
        if os.path.exists(file_path):
            os.remove(file_path)
        raise

    extracted_text = extraction.get("text", "")
    page_count = extraction.get("page_count", 1)

    # Store in database
    doc_record = Document(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        file_size=len(contents),
        file_type="application/pdf",
        page_count=page_count,
        extracted_text=extracted_text,
        processing_status="completed"
    )
    db.add(doc_record)
    db.commit()
    db.refresh(doc_record)

    preview = extracted_text[:1200] + ("..." if len(extracted_text) > 1200 else "")

    return DocumentDetailResponse(
        id=doc_record.id,
        filename=doc_record.filename,
        file_size=doc_record.file_size,
        file_type=doc_record.file_type,
        page_count=doc_record.page_count,
        processing_status=doc_record.processing_status,
        created_at=doc_record.created_at,
        extracted_text_preview=preview,
        has_full_text=bool(extracted_text),
        summary=doc_record.summary
    )

@router.get("", response_model=List[DocumentResponse])
def get_user_documents(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).all()
    return docs

@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document_details(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    text = doc.extracted_text or ""
    preview = text[:1500] + ("..." if len(text) > 1500 else "")
    return DocumentDetailResponse(
        id=doc.id,
        filename=doc.filename,
        file_size=doc.file_size,
        file_type=doc.file_type,
        page_count=doc.page_count,
        processing_status=doc.processing_status,
        created_at=doc.created_at,
        extracted_text_preview=preview,
        has_full_text=bool(text),
        summary=doc.summary
    )

@router.post("/{document_id}/analyze")
def analyze_document(
    document_id: int,
    req: DocumentAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    if not doc.extracted_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document text is empty or could not be extracted."
        )

    action = req.action.lower()
    subject_label = req.unit_or_topic or doc.filename

    if action == "summarize":
        summary_result = SummaryService.summarize_content(
            content=doc.extracted_text,
            subject=subject_label,
            summary_type="detailed",
            desired_length="Long"
        )
        doc.summary = summary_result.get("summary_text", "")
        db.commit()
        return {"action": action, "data": summary_result}

    elif action in ["generate_questions", "generate_2mark", "generate_5mark", "generate_10mark", "revision_notes"]:
        q_type = "important_exam"
        if action == "generate_2mark":
            q_type = "2_mark"
        elif action == "generate_5mark":
            q_type = "5_mark"
        elif action == "generate_10mark":
            q_type = "10_mark"

        questions = SummaryService.generate_exam_questions(
            subject=doc.filename,
            topic=subject_label,
            question_type=q_type,
            count=req.question_count or 5,
            source_context=doc.extracted_text
        )
        return {"action": action, "data": questions}

    elif action == "generate_mcqs":
        mcqs = QuizService.generate_quiz_questions(
            subject=doc.filename,
            topic=subject_label,
            difficulty="Medium",
            count=req.question_count or 5,
            is_mock_test=False,
            source_context=doc.extracted_text
        )
        # Hide correct answers for client presentation
        public_mcqs = [
            {
                "id": q["id"],
                "question": q["question"],
                "options": q["options"],
                "topic": q.get("topic")
            }
            for q in mcqs
        ]
        return {"action": action, "data": public_mcqs}

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown analysis action: '{req.action}'"
        )

@router.delete("/{document_id}", status_code=status.HTTP_200_OK)
def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    # Remove file from disk if present
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully."}

