import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './components/common/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ConceptExplorerPage } from './pages/ConceptExplorerPage';
import { PdfAnalyzerPage } from './pages/PdfAnalyzerPage';
import { NotesSummarizerPage } from './pages/NotesSummarizerPage';
import { QuestionGeneratorPage } from './pages/QuestionGeneratorPage';
import { QuizGeneratorPage } from './pages/QuizGeneratorPage';
import { MockTestsPage } from './pages/MockTestsPage';
import { StudyHistoryPage } from './pages/StudyHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Learning Dashboard Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/assistant" element={<AIAssistantPage />} />
              <Route path="/concepts" element={<ConceptExplorerPage />} />
              <Route path="/pdf-analyzer" element={<PdfAnalyzerPage />} />
              <Route path="/summarizer" element={<NotesSummarizerPage />} />
              <Route path="/questions" element={<QuestionGeneratorPage />} />
              <Route path="/quiz-generator" element={<QuizGeneratorPage />} />
              <Route path="/mock-tests" element={<MockTestsPage />} />
              <Route path="/history" element={<StudyHistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

