import {
  AuthResponse,
  User,
  DashboardStats,
  StudyItem,
  DocumentItem,
  QuizResponse,
  QuizAttemptResponse,
  QuizHistoryItem,
  QuestionGenerateResponse,
  ConceptExplanation,
  SummaryResult,
  GeminiStatus,
} from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('vidyodaya_token');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'An error occurred with your request.';
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        if (typeof errorJson.detail === 'string') {
          errorDetail = errorJson.detail;
        } else if (Array.isArray(errorJson.detail)) {
          errorDetail = errorJson.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
        }
      }
    } catch {
      errorDetail = response.statusText || `HTTP ${response.status} error`;
    }
    throw new ApiError(errorDetail, response.status);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: { email: string; full_name: string; password: string }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => request<User>('/auth/me'),

  logout: () => {
    localStorage.removeItem('vidyodaya_token');
    localStorage.removeItem('vidyodaya_user');
  },

  // AI Assistant
  ask: (data: {
    question: string;
    subject?: string;
    topic?: string;
    explanation_level?: string;
    answer_length?: string;
    conversation_history?: Array<{ role: string; content: string }>;
  }) =>
    request<{
      answer: string;
      subject?: string;
      topic?: string;
      explanation_level: string;
      key_takeaways?: string[];
    }>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  explain: (data: {
    subject: string;
    topic: string;
    explanation_level?: string;
    include_example?: boolean;
    exam_perspective?: boolean;
  }) =>
    request<ConceptExplanation>('/ai/explain', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  summarize: (data: {
    content: string;
    subject?: string;
    summary_type?: string;
    desired_length?: string;
  }) =>
    request<SummaryResult>('/ai/summarize', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Questions
  generateQuestions: (data: {
    subject: string;
    topic: string;
    question_type?: string;
    difficulty?: string;
    count?: number;
    source_context?: string;
  }) =>
    request<QuestionGenerateResponse>('/questions/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Quizzes
  generateQuiz: (data: {
    subject: string;
    topic: string;
    difficulty?: string;
    count?: number;
    time_limit_minutes?: number;
    is_mock_test?: boolean;
    source_context?: string;
  }) =>
    request<QuizResponse>('/quizzes/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getQuiz: (quizId: number) => request<QuizResponse>(`/quizzes/${quizId}`),

  submitQuiz: (
    quizId: number,
    data: {
      answers: Array<{ question_id: number; selected_option: string | null }>;
      time_taken_seconds: number;
    }
  ) =>
    request<QuizAttemptResponse>(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getQuizHistory: () => request<QuizHistoryItem[]>('/quizzes/history/list'),

  // Documents
  uploadPdf: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request<DocumentItem>('/documents/upload', {
      method: 'POST',
      body: formData,
    });
  },

  getDocuments: () => request<DocumentItem[]>('/documents'),

  getDocument: (docId: number) => request<DocumentItem>(`/documents/${docId}`),

  analyzeDocument: (
    docId: number,
    data: { action: string; unit_or_topic?: string; question_count?: number }
  ) =>
    request<{ action: string; data: any }>(`/documents/${docId}/analyze`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteDocument: (docId: number) =>
    request<{ message: string }>(`/documents/${docId}`, {
      method: 'DELETE',
    }),

  // Study History
  getStudyHistory: (item_type?: string) => {
    const query = item_type ? `?item_type=${encodeURIComponent(item_type)}` : '';
    return request<StudyItem[]>(`/history${query}`);
  },

  saveStudyItem: (data: {
    item_type: string;
    title: string;
    subject?: string;
    topic?: string;
    content: string;
    metadata_json?: string;
  }) =>
    request<StudyItem>('/history', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteStudyItem: (itemId: number) =>
    request<{ message: string }>(`/history/${itemId}`, {
      method: 'DELETE',
    }),

  getDashboardStats: () => request<DashboardStats>('/history/dashboard-stats'),

  // Settings
  getGeminiStatus: () => request<GeminiStatus>('/settings/gemini-status'),

  updateGeminiKey: (gemini_api_key: string) =>
    request<GeminiStatus>('/settings/update-api-key', {
      method: 'POST',
      body: JSON.stringify({ gemini_api_key }),
    }),

  updateProfile: (data: { full_name: string }) =>
    request<User>('/settings/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteUserData: () =>
    request<{ message: string }>('/settings/delete-data', {
      method: 'DELETE',
    }),
};

