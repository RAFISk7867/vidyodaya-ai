import logging
from typing import Dict, Any, List, Optional
from app.services.gemini_service import get_gemini_service
from app.utils.text_chunker import get_focused_context

logger = logging.getLogger(__name__)

class SummaryService:
    @staticmethod
    def explain_concept(
        subject: str,
        topic: str,
        explanation_level: str = "Intermediate",
        include_example: bool = True,
        exam_perspective: bool = True
    ) -> Dict[str, Any]:
        gemini = get_gemini_service()

        prompt = f"""
Provide an in-depth academic concept breakdown for:
Subject: {subject}
Topic: {topic}
Target Audience Level: {explanation_level} (Beginner = intuitive analogies; Intermediate = technical depth + logic; Advanced = rigorous theoretical foundations + real-world nuances).
Include Practical Example: {include_example}
Include Exam Preparation Perspective: {exam_perspective}

Return a valid JSON object with the exact fields:
{{
  "subject": "{subject}",
  "topic": "{topic}",
  "explanation_level": "{explanation_level}",
  "simple_definition": "A 1-2 sentence crisp, memorable definition.",
  "detailed_explanation": "A comprehensive explanation structured with clear logic.",
  "step_by_step_breakdown": [
    "Step 1 / Core principle 1",
    "Step 2 / Core principle 2",
    "Step 3 / Core principle 3"
  ],
  "practical_example": "A concrete real-world or code/math scenario demonstrating the concept in action.",
  "key_takeaways": [
    "Crucial point 1 for examinations",
    "Crucial point 2"
  ],
  "related_concepts": [
    "Related concept A",
    "Related concept B",
    "Related concept C"
  ]
}}
"""
        return gemini.generate_structured_json(
            prompt=prompt,
            system_instruction="You are a senior university professor and master educator specializing in high-clarity concept explanations."
        )

    @staticmethod
    def summarize_content(
        content: str,
        subject: Optional[str] = None,
        summary_type: str = "detailed",
        desired_length: str = "Medium"
    ) -> Dict[str, Any]:
        gemini = get_gemini_service()

        focused_content = get_focused_context(content, max_chars=8000)

        prompt = f"""
Summarize the following educational content:
Subject Context: {subject or 'General Academic'}
Summary Style requested: {summary_type} (Options: quick_revision, detailed, bullet_points, exam_oriented, key_formulas)
Length: {desired_length}

Content to summarize:
'''
{focused_content}
'''

Return a valid JSON object with the exact fields:
{{
  "summary_type": "{summary_type}",
  "title": "A descriptive, clear title for this summary",
  "summary_text": "A well-structured markdown summary with proper headings, clear terminology, and readable paragraphs.",
  "key_points": [
    "Key high-yield fact or formula 1",
    "Key high-yield fact or formula 2",
    "Key high-yield fact or formula 3"
  ],
  "important_terms": [
    "Term 1: Short definition",
    "Term 2: Short definition"
  ],
  "formulas_or_rules": [
    "Formula/Rule 1 if applicable or 'N/A'"
  ]
}}
"""
        return gemini.generate_structured_json(
            prompt=prompt,
            system_instruction="You are an expert academic summarizer preparing high-yield study notes for students preparing for semester exams."
        )

    @staticmethod
    def generate_exam_questions(
        subject: str,
        topic: str,
        question_type: str = "important_exam",
        difficulty: str = "Medium",
        count: int = 5,
        source_context: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        gemini = get_gemini_service()

        context_prompt = ""
        if source_context:
            focused = get_focused_context(source_context, query=f"{subject} {topic}", max_chars=4000)
            context_prompt = f"\nUse this provided syllabus / lecture notes as primary context:\n'''\n{focused}\n'''\n"

        prompt = f"""
Generate academic practice questions and model examination answers for:
Subject: {subject}
Topic: {topic}
Question Type: {question_type} (e.g. 2_mark, 5_mark, 10_mark, short_answer, descriptive, important_exam)
Difficulty: {difficulty}
Number of questions: {count}
{context_prompt}

Guidelines for Mark Categories:
- If 2-mark: concise definition, formula, 2 distinct points, no fluff.
- If 5-mark: structured answer with definition, key working/principles, diagram explanation if applicable, 4-5 bullet points, example.
- If 10-mark: comprehensive university exam answer with introduction, architectural/theoretical breakdown, step-by-step mechanism, advantages/disadvantages, example/case study, conclusion.

Return a JSON array of objects with the exact schema:
[
  {{
    "id": 1,
    "question": "Question text suitable for university exam?",
    "marks": 5,
    "difficulty": "{difficulty}",
    "expected_answer_structure": [
      "1. Definition and core premise",
      "2. Working principle / 4 points",
      "3. Illustrative example"
    ],
    "model_answer": "Complete, beautifully formatted model answer with markdown headings and points...",
    "key_points": [
      "Key scoring phrase 1",
      "Key scoring phrase 2"
    ]
  }}
]
"""
        raw_json = gemini.generate_structured_json(
            prompt=prompt,
            system_instruction="You are an experienced university examiner creating practice questions and model marking keys."
        )

        if isinstance(raw_json, dict):
            for k in ["questions", "items", "data", "exam_questions"]:
                if k in raw_json and isinstance(raw_json[k], list):
                    raw_json = raw_json[k]
                    break
            else:
                for v in raw_json.values():
                    if isinstance(v, list):
                        raw_json = v
                        break

        if not isinstance(raw_json, list):
            raise ValueError("Expected a list of generated exam questions.")
        return raw_json

