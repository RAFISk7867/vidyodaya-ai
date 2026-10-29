# Vidyodaya AI — Intelligent Generative AI Platform

> **Learn Smarter. Rise Higher.**  
> An intelligent Generative AI educational platform for personalized learning, concept deconstruction, and university examination preparation.

---

## 🌟 Executive Overview

**Vidyodaya AI** is a full-stack educational web application designed to help university and college students master complex academic curricula, transform lengthy course materials into high-yield revision summaries, generate structured examination answers (2-mark, 5-mark, and 10-mark formats), and evaluate test readiness through interactive AI quizzes and timed mock tests.

Unlike toy demos, Vidyodaya AI is designed as a SaaS-grade platform with:
- **Production-style Light & Dark UI** crafted with Tailwind CSS and Framer Motion.
- **Server-Side AI Engine** powered by Google Gemini via the official `google-genai` Python SDK.
- **High-Fidelity Document Grounding** utilizing PyMuPDF (`pymupdf`) for local PDF syllabus extraction.
- **Server-Side Answer & Score Verification** preventing client tampering in quizzes and mock tests.
- **Relational Persistence** powered by SQLAlchemy and SQLite (ready for PostgreSQL migration).
- **Secure JWT Authentication & Password Hashing** using standard bcrypt.

---

## 🚀 Key Features & Modules

### 1. 🎓 AI Academic Assistant (`/assistant`)
- Multi-turn conversation with contextual grounding.
- Syllabus-tailored filters: Subject, Topic, Explanation Level (Beginner, Intermediate, Advanced), and Answer Format (Short, Medium, 2-Mark, 5-Mark, 10-Mark).
- Safe Markdown rendering with syntax-highlighted code blocks, tables, and one-click copy.
- Automatic extraction of high-yield examination takeaways.

### 2. 🧭 Concept Explorer (`/concepts`)
- Deconstructs dense theoretical topics into:
  - 1-2 sentence core definitions.
  - Systematic, logically sequenced explanations.
  - Step-by-step mechanisms and principles.
  - Concrete real-world or mathematical examples.
  - Examination scoring points and connected concepts.
- Direct save to persistent Study History.

### 3. 📄 Smart PDF Analyzer (`/pdf-analyzer`)
- Drag-and-drop syllabus upload (supports documents up to 25MB).
- Fast, local text extraction with PyMuPDF.
- One-click grounded AI actions:
  - Comprehensive syllabus summarization.
  - 2-mark definitions and formula points.
  - 5-mark structured answers with working logic.
  - 10-mark full descriptive outlines.
  - Multiple choice question generation grounded directly in the PDF content.

### 4. 📝 AI Notes Summarizer (`/summarizer`)
- Paste raw lecture notes or textbook chapters.
- Multiple high-yield synthesis formats: Quick Revision, Detailed Academic Summary, Bullet Points, Exam Notes, and Key Formulas/Rules.
- One-click copy or export as a downloadable Markdown (`.md`) file.

### 5. ❓ Examination Question Generator (`/questions`)
- Generates practice questions categorized strictly by university marks:
  - **2-Mark Answers**: Definition, formula, 2 distinct points.
  - **5-Mark Answers**: Definition, key working principle, diagram notes, 4-5 bullet points, example.
  - **10-Mark Answers**: Comprehensive descriptive answers with intro, theoretical breakdown, mechanisms, and conclusion.
- Features expected evaluator marking keys and mandatory scoring keywords.

### 6. 🧠 Interactive Quiz Generator (`/quiz-generator`)
- Generates 4-option MCQs (A, B, C, D) aligned with course syllabi.
- 1-question-at-a-time test taking interface with question navigator palette and review modal.
- Server-side scoring (client never receives correct answers upfront).
- In-depth educational explanations for every option and personalized topics to review based on missed questions.

### 7. ⏱️ Timed University Mock Tests (`/mock-tests`)
- Simulates realistic exam conditions with an automated countdown timer.
- Auto-submits upon timer expiration.
- Complete scorecard evaluation with percentage, time taken, and weakness diagnosis.

### 8. 📚 Study History & Records (`/history`)
- Centralized archive of saved Q&A solutions, concept notes, summaries, and question sets.
- Complete history of past quiz attempts with score analytics.
- Search, filter, view details modal, and delete records.

### 9. 📊 Student Dashboard (`/dashboard`)
- Live statistics derived from actual user activity: Quizzes attempted, questions asked, documents processed, and saved study items.
- Score progression area chart powered by Recharts.
- Quick action shortcuts to all tools.
- Recent activity feed.

### 10. ⚙️ Settings & Privacy (`/settings`)
- In-app Google Gemini API Key configuration (enter runtime key or configure in `.env`).
- Live operational status indicator.
- Student profile updates.
- Light/Dark theme switch.
- Complete user data clearing with safety confirmation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Router 6, Recharts, React Markdown |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2, `pydantic-settings` |
| **AI Integration** | Google Gemini API (`google-genai` official SDK, default: `gemini-2.5-flash`) |
| **PDF Extraction** | PyMuPDF (`pymupdf`) |
| **Database** | SQLite with SQLAlchemy 2.0 (PostgreSQL-ready schema) |
| **Security** | PyJWT, Bcrypt password hashing, Bearer Token authentication |
| **Testing** | Pytest, Pytest-Asyncio, HTTPX TestClient |

---

## 📁 Project Structure

```
vidyodaya-ai/
├── backend/
│   ├── app/
│   │   ├── models/            # SQLAlchemy database entities (User, Document, StudyItem, Quiz)
│   │   ├── schemas/           # Pydantic v2 validation models
│   │   ├── routers/           # FastAPI API routers (auth, ai, documents, questions, quizzes, history, settings)
│   │   ├── services/          # Business logic: gemini_service, pdf_service, quiz_service, summary_service
│   │   ├── utils/             # Security (bcrypt, JWT), text chunking
│   │   ├── config.py          # Environment settings
│   │   ├── database.py        # SQLite / SQLAlchemy engine & session maker
│   │   └── main.py            # FastAPI entry point & CORS configuration
│   ├── tests/                 # Automated Pytest suite (health, auth, chunker, pdf, quiz evaluation)
│   ├── uploads/               # Secure document storage
│   ├── requirements.txt       # Python dependencies
│   ├── pytest.ini             # Test runner configuration
│   ├── .env.example           # Example configuration
│   └── .env                   # Local environment variables
├── frontend/
│   ├── src/
│   │   ├── api/               # Centralized fetch API client with JWT handling
│   │   ├── components/
│   │   │   ├── common/        # Navbar, Sidebar, Header, Footer, MarkdownRenderer, LoadingSpinner, Toast
│   │   │   ├── landing/       # HeroSection, FeatureShowcase, HowItWorks, BenefitsSection, CTASection
│   │   │   ├── dashboard/     # StatCard, QuickActionCard, ProgressChart, RecentActivityList
│   │   │   └── quiz/          # QuizRunner, QuizScoreCard
│   │   ├── context/           # AuthContext (JWT session), ThemeContext (Light/Dark)
│   │   ├── pages/             # 10 Application pages + Auth & Landing
│   │   ├── types/             # TypeScript interfaces
│   │   ├── App.tsx            # Routes configuration
│   │   ├── main.tsx           # React entry point
│   │   └── index.css          # Tailwind CSS & custom scrollbar styles
│   ├── public/
│   │   └── logo.svg           # Branded Vidyodaya AI logo
│   ├── package.json           # Frontend dependencies & scripts
│   ├── tailwind.config.js     # Brand colors & dark mode
│   └── vite.config.ts         # Vite build & API proxy configuration
└── README.md                  # Complete documentation
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js** (v18 or v20+)
- **Python** (v3.10 or v3.11+)
- **Google Gemini API Key** (Get free from [Google AI Studio](https://aistudio.google.com/))

### 1. Backend Setup

```bash
# Navigate to backend directory
cd C:\vidyodaya-ai\backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows Command Prompt:
.\venv\Scripts\activate.bat

# Install dependencies
pip install -r requirements.txt

# Configure your Gemini API Key in backend/.env
# Copy from .env.example or edit backend/.env:
# GEMINI_API_KEY=your_actual_gemini_api_key_here

# Start the FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend API will be available at:
- **API URL:** `http://127.0.0.1:8000`
- **Interactive OpenAPI Docs:** `http://127.0.0.1:8000/api/docs`
- **Health Check:** `http://127.0.0.1:8000/api/health`

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd C:\vidyodaya-ai\frontend

# Install node dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will be available at:
- **Web App:** `http://localhost:5173`

---

## 🧪 Running Tests

### Backend Automated Tests
All 7 unit and integration tests run using pytest:

```bash
cd C:\vidyodaya-ai\backend
.\venv\Scripts\pytest -v
```

Test suite covers:
- `test_health.py`: Health check and root endpoints.
- `test_auth.py`: Registration, JWT generation, protected `/me` endpoint, and credential validation.
- `test_chunker.py`: Text chunking and query context selection.
- `test_pdf_service.py`: PyMuPDF document extraction and validation.
- `test_quiz_evaluation.py`: Server-side scoring, percentage computation, and diagnostic recommendations.

### Frontend Build Verification
Verify TypeScript compilation and asset bundling:

```bash
cd C:\vidyodaya-ai\frontend
npm run build
```

---

## 🔑 Setting the Gemini API Key

You have two convenient ways to set your Google Gemini API key:

1. **Via Configuration File:**
   Open `backend/.env` and set:
   ```env
   GEMINI_API_KEY="AIzaSyYourActualKeyHere..."
   ```

2. **Via Application Settings UI:**
   - Log in to Vidyodaya AI (`http://localhost:5173/login`)
   - Click **Settings** in the sidebar.
   - Enter your Gemini API key in the **Google Gemini API Integration** section and click **Set API Key**.
   - The key is dynamically applied to your session immediately without restarting the server!

---

## 🔒 Security & Privacy Architecture

- **No Key Exposure:** The Gemini API key is managed strictly on the FastAPI server and is never transmitted to client browsers.
- **Password Protection:** Passwords are hashed using bcrypt with salt rounds; plain-text passwords are never saved.
- **Server-Side Scoring:** Quiz answers are kept on the server during tests to ensure authentic scoring and prevent client-side answer inspection.
- **Document Isolation:** Uploaded PDFs are stored in private local directories mapped exclusively to the authenticated user ID.
- **Safe Markdown Rendering:** AI responses are rendered using sanitizing components that do not execute arbitrary HTML or JavaScript.

---

## 📜 License

Created for educational excellence.
Vidyodaya AI — *Learn Smarter. Rise Higher.*

