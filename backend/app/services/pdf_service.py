import os
import pymupdf as fitz
from typing import Dict, Any
from fastapi import HTTPException, status

class PDFService:
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> Dict[str, Any]:
        """
        Extracts clean text and metadata from a PDF file using PyMuPDF.
        """
        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="PDF file does not exist on disk."
            )

        try:
            doc = fitz.open(file_path)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid or corrupted PDF file: {str(e)}"
            )

        try:
            if doc.is_encrypted:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Encrypted or password-protected PDF files are not supported. Please upload an unlocked PDF."
                )

            total_pages = len(doc)
            if total_pages == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The uploaded PDF contains no pages."
                )

            extracted_pages = []
            full_text_list = []

            for page_num in range(total_pages):
                page = doc.load_page(page_num)
                page_text = page.get_text("text").strip()
                if page_text:
                    extracted_pages.append({
                        "page_number": page_num + 1,
                        "char_count": len(page_text),
                        "text": page_text
                    })
                    full_text_list.append(f"--- Page {page_num + 1} ---\n{page_text}")

            combined_text = "\n\n".join(full_text_list).strip()

            if len(combined_text) < 50:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        "Unable to extract readable text from this PDF. "
                        "The document appears to be a scanned image or empty. "
                        "Please upload a text-searchable PDF or notes document."
                    )
                )

            return {
                "page_count": total_pages,
                "text": combined_text,
                "pages": extracted_pages,
                "total_chars": len(combined_text)
            }
        finally:
            doc.close()
