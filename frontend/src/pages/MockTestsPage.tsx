import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { api } from '../api';
import { QuizResponse, QuizAttemptResponse } from '../types';
import { QuizRunner } from '../components/quiz/QuizRunner';
import { QuizScoreCard } from '../components/quiz/QuizScoreCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Toast } from '../components/common/Toast';

export const MockTestsPage: React.FC = () => {
  const [subject, setSubject] = useState('Database Management Systems');
  const [topic, setTopic] = useState('Comprehensive Semester Mock Exam');
  const [count, setCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15);
  const [difficulty, setDifficulty] = useState('Hard');

  const [activeTest, setActiveTest] = useState<QuizResponse | null>(null);
  const [testAttempt, setTestAttempt] = useState<QuizAttemptResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartMockTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGenerating(true);
    setTestAttempt(null);

    try {
      const test = await api.generateQuiz({
        subject: subject.trim(),
        topic: topic.trim(),
        difficulty,
        count,
        time_limit_minutes: timeLimit,
        is_mock_test: true,
      });
      setActiveTest(test);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize mock test. Verify your Gemini API key in Settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitTest = async (
    answers: Array<{ question_id: number; selected_option: string | null }>,
    timeTakenSeconds: number
  ) => {
    if (!activeTest) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const attemptRes = await api.submitQuiz(activeTest.id, {
        answers,
        time_taken_seconds: timeTakenSeconds,
      });
      setTestAttempt(attemptRes);
      setActiveTest(null);
    } catch (err: any) {
      setError(err.message || 'Failed to submit test for evaluation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    if (testAttempt) {
      api.getQuiz(testAttempt.quiz_id).then((q) => {
        setTestAttempt(null);
        setActiveTest(q);
      });
    }
  };

  const handleNewTest = () => {
    setTestAttempt(null);
    setActiveTest(null);
  };

  return (
    <div className="space-y-8">
      {testAttempt ? (
        <QuizScoreCard
          attempt={testAttempt}
          onRetake={handleRetake}
          onNewQuiz={handleNewTest}
        />
      ) : activeTest ? (
        <QuizRunner
          quiz={activeTest}
          onSubmit={handleSubmitTest}
          isSubmitting={isSubmitting}
        />
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <GraduationCap className="w-4 h-4" />
              <span>Full-Length Examination Simulation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              Simulate Timed University Mock Tests
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
              Experience authentic test pressure with strict countdown timers, comprehensive multi-concept coverage, and server-side evaluation.
            </p>

            {error && (
              <Toast type="error" message={error} onClose={() => setError(null)} className="mb-6" />
            )}

            {/* Test Guidelines */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 mb-6 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Examination Rules & Protocol:
              </span>
              <p>• The timer will begin immediately when you click "Begin Mock Test".</p>
              <p>• If the timer expires, your test will auto-submit with all current answers.</p>
              <p>• Answers and scores are calculated securely on the server with full topic diagnostics.</p>
            </div>

            <form onSubmit={handleStartMockTest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject / Course
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Database Management Systems"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Test Focus
                  </label>
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Comprehensive Semester Mock Exam"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Rigor Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value="Medium">Medium (Standard College Level)</option>
                    <option value="Hard">Hard (University Examination Standard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Question Count
                  </label>
                  <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  >
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
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
                    <option value={10}>10 Minutes</option>
                    <option value={15}>15 Minutes</option>
                    <option value={20}>20 Minutes</option>
                    <option value={30}>30 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 shadow-md shadow-rose-600/20 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Begin Mock Test</span>
                </button>
              </div>
            </form>
          </div>

          {isGenerating && (
            <LoadingSpinner message="Assembling comprehensive timed mock examination..." />
          )}
        </div>
      )}
    </div>
  );
};

