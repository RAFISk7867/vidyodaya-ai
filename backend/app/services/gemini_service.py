import json
import logging
import re
import time
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, status
from google import genai
from google.genai import types
from google.genai.errors import APIError

from app.config import settings, get_effective_gemini_key

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self._client: Optional[genai.Client] = None
        self._current_key: Optional[str] = None

    def _get_client(self) -> genai.Client:
        key = get_effective_gemini_key()
        if not key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Google Gemini API key is not configured. Please add your GEMINI_API_KEY "
                    "in backend/.env or enter it in the Settings page to enable real AI generation."
                )
            )
        
        # If key changed or client not created, instantiate new client
        if self._client is None or self._current_key != key:
            try:
                self._client = genai.Client(api_key=key)
                self._current_key = key
            except Exception as e:
                logger.error(f"Failed to initialize Gemini Client: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to initialize Gemini API client: {str(e)}"
                )
        return self._client

    def is_configured(self) -> bool:
        return bool(get_effective_gemini_key())

    def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.7,
        response_mime_type: Optional[str] = None,
        max_retries: int = 2
    ) -> str:
        """
        Generates text using Google Gemini with retry for transient errors.
        """
        client = self._get_client()
        model_name = settings.GEMINI_MODEL

        config_kwargs: Dict[str, Any] = {"temperature": temperature}
        if system_instruction:
            config_kwargs["system_instruction"] = system_instruction
        if response_mime_type:
            config_kwargs["response_mime_type"] = response_mime_type

        config = types.GenerateContentConfig(**config_kwargs)

        last_error = None
        for attempt in range(max_retries + 1):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=config
                )
                if not response or not response.text:
                    raise ValueError("Empty response received from Gemini API.")
                return response.text.strip()
            except APIError as e:
                last_error = e
                # Check for rate-limiting or server busy
                if e.code in [429, 503] and attempt < max_retries:
                    wait_time = (attempt + 1) * 2
                    logger.warning(f"Gemini transient error ({e.code}). Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                logger.error(f"Gemini API Error: {e}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Gemini AI Service Error: {e.message or 'Request failed'}"
                )
            except Exception as e:
                logger.error(f"Unexpected error calling Gemini API: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to generate AI response: {str(e)}"
                )

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Gemini API temporarily unavailable: {str(last_error)}"
        )

    def generate_structured_json(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2
    ) -> Any:
        """
        Generates and extracts clean JSON from Gemini using native response_mime_type=application/json.
        """
        json_instruction = (
            "You are an academic educational engine. Return strictly valid JSON matching the requested schema. "
            "Never output markdown backticks, conversational preamble, or explanations outside the JSON."
        )
        combined_sys = f"{json_instruction}\n\n{system_instruction}" if system_instruction else json_instruction

        raw_response = self.generate_text(
            prompt=prompt,
            system_instruction=combined_sys,
            temperature=temperature,
            response_mime_type="application/json"
        )

        return self._extract_json(raw_response)

    def _extract_json(self, raw_text: str) -> Any:
        cleaned = raw_text.strip()

        # Remove markdown code fence if model still included it
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        # 1. Standard json.loads with strict=False (allows newlines in string fields)
        try:
            return json.loads(cleaned, strict=False)
        except json.JSONDecodeError:
            pass

        # 2. Extract JSON array or object using regex
        json_match = re.search(r'(\{[\s\S]*\}|\[[\s\S]*\])', cleaned)
        if json_match:
            candidate = json_match.group(0).strip()
            try:
                return json.loads(candidate, strict=False)
            except json.JSONDecodeError:
                # 3. Clean common issues like trailing commas before closing brackets
                candidate_fixed = re.sub(r',\s*([\]}])', r'\1', candidate)
                try:
                    return json.loads(candidate_fixed, strict=False)
                except json.JSONDecodeError as err:
                    logger.error(f"Failed to parse cleaned JSON block: {err}")

        logger.error(f"Raw unparseable text (first 400 chars): {cleaned[:400]}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI model generated an invalid structured format. Please retry."
        )

_gemini_service_instance = GeminiService()

def get_gemini_service() -> GeminiService:
    return _gemini_service_instance
