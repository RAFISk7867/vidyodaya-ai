import json
import logging
import re
import time
from typing import Optional, Dict, Any, List
from fastapi import HTTPException, status
from google import genai
from google.genai import types
from google.genai.errors import APIError

from app.config import settings, get_effective_gemini_key, get_effective_gemini_model

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
        max_retries: int = 1
    ) -> str:
        """
        Generates text using Google Gemini with ultra-low latency optimizations,
        disabled thinking overhead for speed, and intelligent model failover.
        """
        client = self._get_client()

        # Candidate fallback models in priority order: active model first, then ultra-fast flash-lite
        primary_model = get_effective_gemini_model()
        candidate_models = [
            primary_model,
            "gemini-flash-lite-latest",
            "gemini-3.8-flash",
            "gemini-3.5-flash",
            "gemini-3.5-flash-lite"
        ]
        seen = set()
        models_to_try = [m for m in candidate_models if not (m in seen or seen.add(m))]

        config_kwargs: Dict[str, Any] = {"temperature": temperature}
        if system_instruction:
            config_kwargs["system_instruction"] = system_instruction
        if response_mime_type:
            config_kwargs["response_mime_type"] = response_mime_type

        # Optimize latency: disable thinking tokens overhead (which adds 5-15s delay on newer Gemini models)
        try:
            config_kwargs["thinking_config"] = types.ThinkingConfig(thinking_budget=0)
        except Exception:
            pass

        config = types.GenerateContentConfig(**config_kwargs)

        last_error = None

        for model_name in models_to_try:
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
                    err_msg = (e.message or "").lower()

                    # If model doesn't support thinking_config, remove it and retry immediately
                    if "thinking" in err_msg and getattr(config, "thinking_config", None):
                        config.thinking_config = None
                        continue

                    # If model is discontinued, deprecated, not found, or rate limited (429/400/404)
                    # immediately failover to the next candidate model
                    if (
                        e.code in [400, 404, 429]
                        or "quota" in err_msg
                        or "no longer available" in err_msg
                        or "not supported" in err_msg
                        or "not found" in err_msg
                    ):
                        logger.warning(
                            f"Model {model_name} unavailable (code {e.code}: {e.message}). "
                            f"Switching to fallback model in candidate queue..."
                        )
                        break  # Break out to next model in models_to_try

                    # Transient 503 error - short wait and retry on same model
                    if e.code == 503 and attempt < max_retries:
                        time.sleep(1.0)
                        continue

                    # Other permanent API error
                    break
                except Exception as e:
                    last_error = e
                    logger.error(f"Error calling {model_name}: {e}")
                    break

        # If all candidates exhausted, raise informative error
        error_msg = getattr(last_error, "message", str(last_error))
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini AI Service Error: {error_msg}"
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
