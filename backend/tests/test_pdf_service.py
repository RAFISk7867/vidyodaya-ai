import os
import pymupdf as fitz
from app.services.pdf_service import PDFService

def test_pdf_extraction(tmp_path):
    pdf_path = str(tmp_path / "sample_syllabus.pdf")
    doc = fitz.open()
    page = doc.new_page()
    text = "Unit 1: Data Structures and Algorithms\nBinary Search Trees and Balanced Trees (AVL, Red-Black Trees).\nUnit 2: Graph Algorithms (Dijkstra, Bellman-Ford, Kruskal, Prim)."
    page.insert_text((50, 72), text)
    doc.save(pdf_path)
    doc.close()

    result = PDFService.extract_text_from_pdf(pdf_path)
    assert result["page_count"] == 1
    assert "Binary Search Trees" in result["text"]
    assert "Dijkstra" in result["text"]
    assert len(result["pages"]) == 1

