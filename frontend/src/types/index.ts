// TypeScript definitions for Vidyodaya AI

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  subject?: string;
  topic?: string;
  explanation_level?: string;
  key_takeaways?: string[];
  timestamp: string;
}

export interface ConceptExplanation {
  subject: string;
  topic: string;
  explanation_level: string;
  simple_definition: string;
  detailed_explanation: string;
  step_by_step_breakdown: string[];
  practical_example?: string;
  key_takeaways: string[];
  related_concepts: string[];
}

export interface SummaryResult {
  summary_type: string;
  title: string;
  summary_text: string;
  key_points: string[];
  important_terms: string[];
  formulas_or_rules?: string[];
}

export interface QuestionItem {
  id: number;
  question: string;
  marks: number;
  difficulty: string;
  expected_answer_structure: string[];
  model_answer: string;
  key_points: string[];
}

export interface QuestionGenerateResponse {
  subject: string;
  topic: string;
  question_type: string;
  disclaimer: string;
  questions: QuestionItem[];
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizPublicQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  topic?: string;
}

export interface QuizResponse {
  id: number;
  title: string;
  subject: string;
  topic: string;
  difficulty: string;
  time_limit_minutes: number;
  is_mock_test: boolean;
  total_questions: number;
  questions: QuizPublicQuestion[];
  created_at: string;
}

export interface AnswerReviewItem {
  question_id: number;
  question: string;
  options: QuizOption[];
  selected_option: string | null;
  correct_option: string;
  is_correct: boolean;
  explanation: string;
  topic?: string;
}

export interface QuizAttemptResponse {
  id: number;
  quiz_id: number;
  title: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken_seconds: number;
  topics_to_review: string[];
  review: AnswerReviewItem[];
  created_at: string;
}

export interface QuizHistoryItem {
  attempt_id: number;
  quiz_id: number;
  title: string;
  subject: string;
  topic: string;
  score: number;
  total_questions: number;
  percentage: number;
  created_at: string;
}

export interface DocumentItem {
  id: number;
  filename: string;
  file_size: number;
  file_type: string;
  page_count: number;
  processing_status: string;
  created_at: string;
  extracted_text_preview?: string;
  has_full_text?: boolean;
  summary?: string;
}

export interface StudyItem {
  id: number;
  item_type: 'assistant_qa' | 'concept_note' | 'summary' | 'question_set';
  title: string;
  subject?: string;
  topic?: string;
  content: string;
  metadata_json?: string;
  created_at: string;
}

export interface RecentActivityItem {
  id: number;
  type: 'quiz' | 'document' | 'study_item';
  title: string;
  subtitle: string;
  date: string;
  badge?: string;
}

export interface DashboardStats {
  quizzes_attempted: number;
  questions_asked: number;
  documents_processed: number;
  study_items_saved: number;
  average_quiz_score: number;
  recent_activities: RecentActivityItem[];
  score_trend: {
    attempt: string;
    score: number;
    percentage: number;
    total: number;
  }[];
}

export interface GeminiStatus {
  is_configured: boolean;
  model: string;
  message: string;
}
