import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { QuizAttemptResponse } from '../../types';

interface QuizScoreCardProps {
  attempt: QuizAttemptResponse;
  onRetake: () => void;
  onNewQuiz: () => void;
}

export const QuizScoreCard: React.FC<QuizScoreCardProps> = ({
  attempt,
  onRetake,
  onNewQuiz,
}) => {
  const isHighScorer = attempt.percentage >= 80;
  const isPass = attempt.percentage >= 50;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Score Summary Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
          <Award className="w-8 h-8" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
          {isHighScorer ? 'Exceptional Mastery!' : isPass ? 'Solid Attempt!' : 'Needs Targeted Revision'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          {attempt.title} • Completed in {formatTime(attempt.time_taken_seconds)}
        </p>

        {/* Score Ring / Numbers */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 py-4">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {attempt.score} <span className="text-slate-400 text-xl font-normal">/ {attempt.total_questions}</span>
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">Total Score</p>
          </div>

          <div className="w-px h-12 bg-slate-200 dark:bg-slate-800" />

          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {attempt.percentage}%
            </p>
            <p className="text-xs text-slate-500 font-medium mt-1">Accuracy</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake This Quiz</span>
          </button>
          <button
            onClick={onNewQuiz}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate New Quiz</span>
          </button>
        </div>
      </div>

      {/* Recommended Topics to Review */}
      {attempt.topics_to_review && attempt.topics_to_review.length > 0 && (
        <div className="p-6 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60">
          <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Recommended Revision Focus Areas</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
            Based on the questions missed in this test, we recommend revisiting these specific concepts:
          </p>
          <div className="flex flex-wrap gap-2">
            {attempt.topics_to_review.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          Detailed Question Breakdown
        </h4>

        {attempt.review.map((q, idx) => (
          <div
            key={q.question_id}
            className={`p-6 rounded-3xl border transition-all ${
              q.is_correct
                ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                : 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {idx + 1}
                </span>
                {q.is_correct ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Correct</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                    <XCircle className="w-4 h-4" />
                    <span>Incorrect</span>
                  </span>
                )}
              </div>
              {q.topic && (
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {q.topic}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              {q.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {q.options.map((opt) => {
                const isSelected = q.selected_option === opt.id;
                const isCorrect = q.correct_option === opt.id;

                let optStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900';
                if (isCorrect) {
                  optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                } else if (isSelected && !isCorrect) {
                  optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                }

                return (
                  <div key={opt.id} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{opt.id}.</span>
                      <span>{opt.text}</span>
                    </div>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* In-depth educational explanation */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Academic Explanation:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {q.explanation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

