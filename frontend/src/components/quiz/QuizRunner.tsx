import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Send,
  Flag,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import { QuizResponse } from '../../types';

interface QuizRunnerProps {
  quiz: QuizResponse;
  onSubmit: (answers: Array<{ question_id: number; selected_option: string | null }>, timeTaken: number) => void;
  isSubmitting: boolean;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({ quiz, onSubmit, isSubmitting }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const totalTimeSeconds = quiz.time_limit_minutes * 60;
  const timeRemaining = Math.max(0, totalTimeSeconds - secondsElapsed);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => {
        if (prev + 1 >= totalTimeSeconds) {
          clearInterval(timer);
          handleFinalSubmit();
          return totalTimeSeconds;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalTimeSeconds]);

  const currentQ = quiz.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / quiz.total_questions) * 100);

  const handleSelectOption = (optId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
  };

  const toggleFlag = (qId: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleFinalSubmit = () => {
    setShowConfirmModal(false);
    const answersPayload = quiz.questions.map((q) => ({
      question_id: q.id,
      selected_option: selectedAnswers[q.id] || null,
    }));
    onSubmit(answersPayload, secondsElapsed);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Top Status Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
            {quiz.subject} • {quiz.difficulty}
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
            {quiz.title}
          </h3>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border text-xs font-mono font-bold ${
          timeRemaining < 120
            ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
        }`}>
          <Clock className="w-4 h-4" />
          <span>{formatTimer(timeRemaining)}</span>
        </div>
      </div>

      {/* Progress Bar & Question Navigator Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Question {currentIndex + 1} of {quiz.total_questions}
          </span>
          <span>
            Answered: {answeredCount}/{quiz.total_questions}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick jump palette */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {quiz.questions.map((q, idx) => {
            const isAnswered = !!selectedAnswers[q.id];
            const isFlagged = !!flaggedQuestions[q.id];
            const isCurrent = idx === currentIndex;

            let pillStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
            if (isCurrent) {
              pillStyle = 'ring-2 ring-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold text-indigo-600 dark:text-indigo-300';
            } else if (isAnswered) {
              pillStyle = 'bg-indigo-600 text-white font-medium';
            } else if (isFlagged) {
              pillStyle = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-all ${pillStyle}`}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
        >
          <div className="flex items-start justify-between gap-4">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h4>

            <button
              onClick={() => toggleFlag(currentQ.id)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 ${
                flaggedQuestions[currentQ.id]
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700'
              }`}
              title="Flag for review"
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {flaggedQuestions[currentQ.id] ? 'Flagged' : 'Flag'}
              </span>
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <span className="leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentIndex === quiz.total_questions - 1 ? (
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Quiz</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex((prev) => Math.min(quiz.total_questions - 1, prev + 1))}
            className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Ready to Submit?
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              You have answered <span className="font-bold text-indigo-600">{answeredCount}</span> out of{' '}
              <span className="font-bold">{quiz.total_questions}</span> questions.
              {answeredCount < quiz.total_questions && (
                <span className="block mt-1 text-rose-500 font-semibold">
                  You have {quiz.total_questions - answeredCount} unanswered questions!
                </span>
              )}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
              >
                Review Answers
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

