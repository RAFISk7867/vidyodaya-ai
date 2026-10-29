import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Award,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { api } from '../api';
import { QuizResponse, QuizAttemptResponse } from '../types';
import { QuizRunner } from '../components/quiz/QuizRunner';
import { QuizScoreCard } from '../components/quiz/QuizScoreCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Toast } from '../components/common/Toast';

export const QuizGeneratorPage: React.FC = () => {
  const [subject, setSubject] = useState('Computer Networks');
  const [topic, setTopic] = useState('OSI Model and TCP/IP Protocols');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(10);

  const [activeQuiz, setActiveQuiz] = useState<QuizResponse | null>(null);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttemptResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      setError('Please provide subject and topic.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setQuizAttempt(null);

    try {
      const quiz = await api.generateQuiz({
        subject: subject.trim(),
        topic: topic.trim(),
        difficulty,
        count,
        time_limit_minutes: timeLimit,
        is_mock_test: false,
      });
      setActiveQuiz(quiz);
    } catch (err: any) {
      setError(err.message || 'Failed to generate quiz. Verify your Gemini API key in Settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitQuiz = async (
    answers: Array<{ question_id: number; selected_option: string | null }>,
    timeTakenSeconds: number
  ) => {
    if (!activeQuiz) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const attemptRes = await api.submitQuiz(activeQuiz.id, {
        answers,
        time_taken_seconds: timeTakenSeconds,
      });
      setQuizAttempt(attemptRes);
      setActiveQuiz(null);
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate quiz submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    if (quizAttempt) {
      // Re-fetch original quiz to retake
      api.getQuiz(quizAttempt.quiz_id).then((q) => {
        setQuizAttempt(null);
        setActiveQuiz(q);
      });
    }
  };

  const handleNewQuiz = () => {
    setQuizAttempt(null);
    setActiveQuiz(null);
  };

  return (
    <div className="space-y-8">
      {/* If Score Result is Available */}
      {quizAttempt ? (
        <QuizScoreCard
          attempt={quizAttempt}
          onRetake={handleRetake}
          onNewQuiz={handleNewQuiz}
        />
      ) : activeQuiz ? (
        /* If Active Quiz is Running */
        <QuizRunner
          quiz={activeQuiz}
          onSubmit={handleSubmitQuiz}
          isSubmitting={isSubmitting}
        />
      ) : (
        /* Quiz Generator Configuration Panel */
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <BrainCircuit className="w-4 h-4" />
              <span>Interactive Knowledge Diagnostic</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              AI Multiple Choice Quiz Generator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
              Create custom multiple-choice quizzes tailored to your semester syllabus. Every question includes in-depth explanations and weakness diagnostics.
            </p>

            {error && (
              <Toast type="error" message={error} onClose={() => setError(null)} className="mb-6" />
            )}

            <form onSubmit={handleGenerateQuiz} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Computer Networks"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Topic / Concept Focus
                  </label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. OSI Model and TCP/IP Protocols"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value="Easy">Easy (Recall & Fundamentals)</option>
                    <option value="Medium">Medium (Standard Exam Questions)</option>
                    <option value="Hard">Hard (Deep Analytical Nuances)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Number of Questions
                  </label>
                  <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value={5}>5 Questions (Quick Test)</option>
                    <option value={10}>10 Questions (Standard)</option>
                    <option value={15}>15 Questions (Thorough)</option>
                    <option value={20}>20 Questions (Comprehensive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Time Limit (Minutes)
                  </label>
                  <select
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value={5}>5 Minutes</option>
                    <option value={10}>10 Minutes</option>
                    <option value={15}>15 Minutes</option>
                    <option value={20}>20 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Practice Quiz</span>
                </button>
              </div>
            </form>
          </div>

          {isGenerating && (
            <LoadingSpinner message="Generating syllabus-aligned multiple choice questions..." />
          )}
        </div>
      )}
    </div>
  );
};

