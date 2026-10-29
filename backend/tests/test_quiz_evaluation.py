from app.services.quiz_service import QuizService

def test_quiz_evaluation_server_side():
    mock_questions = [
        {
            "id": 1,
            "question": "What is the primary function of a DBMS transaction log?",
            "options": [
                {"id": "A", "text": "Atomicity and Durability (WAL)"},
                {"id": "B", "text": "Speeding up disk writes only"},
                {"id": "C", "text": "Compressing database indexes"},
                {"id": "D", "text": "Encrypting network packets"}
            ],
            "correct_option": "A",
            "explanation": "WAL guarantees ACID durability.",
            "topic": "Transactions"
        },
        {
            "id": 2,
            "question": "Which normal form removes transitive dependencies?",
            "options": [
                {"id": "A", "text": "1NF"},
                {"id": "B", "text": "2NF"},
                {"id": "C", "text": "3NF"},
                {"id": "D", "text": "BCNF"}
            ],
            "correct_option": "C",
            "explanation": "3NF requires no non-prime attribute is transitively dependent on any candidate key.",
            "topic": "Normalization"
        }
    ]

    # Student answers: Q1 correct (A), Q2 incorrect (B)
    user_answers = [
        {"question_id": 1, "selected_option": "A"},
        {"question_id": 2, "selected_option": "B"}
    ]

    result = QuizService.evaluate_quiz(mock_questions, user_answers)

    assert result["score"] == 1
    assert result["total_questions"] == 2
    assert result["percentage"] == 50.0
    assert "Normalization" in result["topics_to_review"]
    assert len(result["review"]) == 2
    assert result["review"][0]["is_correct"] is True
    assert result["review"][1]["is_correct"] is False

