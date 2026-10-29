import re
from typing import List

def chunk_text(text: str, chunk_size: int = 3000, overlap: int = 300) -> List[str]:
    """
    Splits long text into overlapping chunks respecting sentence or paragraph boundaries.
    """
    if not text:
        return []
    
    cleaned_text = re.sub(r'\s+', ' ', text).strip()
    if len(cleaned_text) <= chunk_size:
        return [cleaned_text]

    chunks = []
    start = 0
    text_length = len(cleaned_text)

    while start < text_length:
        end = start + chunk_size
        if end >= text_length:
            chunks.append(cleaned_text[start:])
            break
        
        # Try to break at a sentence ending or newline near chunk_size
        split_idx = -1
        for punct in ['. ', '.\n', '? ', '! ', '\n\n', '; ']:
            candidate = cleaned_text.rfind(punct, start + chunk_size // 2, end)
            if candidate != -1:
                split_idx = max(split_idx, candidate + len(punct))
        
        if split_idx == -1:
            # Fall back to space
            candidate = cleaned_text.rfind(' ', start + chunk_size // 2, end)
            if candidate != -1:
                split_idx = candidate + 1
            else:
                split_idx = end

        chunks.append(cleaned_text[start:split_idx].strip())
        start = max(start + 1, split_idx - overlap)

    return chunks

def get_focused_context(text: str, query: str = "", max_chars: int = 8000) -> str:
    """
    Extracts relevant context from large documents for prompt grounding.
    """
    if not text:
        return ""
    if len(text) <= max_chars:
        return text

    target_chunk_size = min(2000, max_chars)
    chunks = chunk_text(text, chunk_size=target_chunk_size, overlap=min(200, target_chunk_size // 4))

    if not query:
        # Return first few chunks up to max_chars
        combined = ""
        for c in chunks:
            if len(combined) + len(c) + 2 > max_chars:
                if not combined:
                    combined = c[:max_chars]
                break
            combined += c + "\n\n"
        return combined.strip()

    query_words = set(re.findall(r'\w+', query.lower()))
    scored_chunks = []
    for chunk in chunks:
        chunk_words = set(re.findall(r'\w+', chunk.lower()))
        common = len(query_words.intersection(chunk_words))
        scored_chunks.append((common, chunk))

    # Sort chunks by relevance score descending
    scored_chunks.sort(key=lambda x: x[0], reverse=True)

    result_chunks = []
    total_len = 0
    for score, chunk in scored_chunks:
        if total_len >= max_chars:
            break
        space_left = max_chars - total_len
        if len(chunk) <= space_left:
            result_chunks.append(chunk)
            total_len += len(chunk)
        else:
            if not result_chunks:
                result_chunks.append(chunk[:space_left])
                total_len += space_left
            break

    if not result_chunks and chunks:
        return chunks[0][:max_chars]

    return "\n---\n".join(result_chunks)
