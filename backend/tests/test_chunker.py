from app.utils.text_chunker import chunk_text, get_focused_context

def test_chunk_text():
    sample = "Sentence one. " * 300
    chunks = chunk_text(sample, chunk_size=500, overlap=50)
    assert len(chunks) > 1
    assert all(len(c) <= 600 for c in chunks)

def test_focused_context():
    text = "Section on Operating Systems and Semaphores. " * 50 + "Section on Compiler Design and Parsing. " * 50
    focused = get_focused_context(text, query="Compiler Parsing", max_chars=1000)
    assert len(focused) <= 1000
    assert "Compiler" in focused

