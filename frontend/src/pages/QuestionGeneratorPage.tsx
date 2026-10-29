import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../api';
import { QuestionGenerateResponse, QuestionItem } from '../types';
import { Toast } from '../components/common/Toast';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';

export const QuestionGeneratorPage: React.FC = () => {
  const [subject, setSubject] = useState('Data Structures and Algorithms');
  const [topic, setTopic] = useState('Binary Search Trees and AVL Trees');
  const [questionType, setQuestionType] = useState('5_mark');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(4);

  const [response, setResponse] = useState<QuestionGenerateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedAnswers, setExpandedAnswers] = useState<Record<number, boolean>>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      setError('Please provide subject and topic.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const data = await api.generateQuestions({
        subject: subject.trim(),
        topic: topic.trim(),
        question_type: questionType,
        difficulty,
        count,
      });
      setResponse(data);
      // Auto expand first 2 answers
      const initialExpanded: Record<number, boolean> = {};
      data.questions.forEach((q, idx) => {
        initialExpanded[q.id] = idx < 2;
      });
      setExpandedAnswers(initialExpanded);
    } catch (err: any) {
      setError(err.message || 'Failed to generate questions. Verify your Gemini API key in Settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyQuestion = (q: QuestionItem) => {
    const text = `Question (${q.marks} Marks):\n${q.question}\n\nKey Points:\n${q.key_points.join('\n')}\n\nModel Answer:\n${q.model_answer}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Form Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <HelpCircle className="w-4 h-4" />
          <span>University Marking Key Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          AI Examination Question Generator
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
          Generate rigorous 2-mark definitions, 5-mark working answers, or 10-mark full essays aligned with university examination patterns.
        </p>

        {error && (
          <Toast type="error" message={error} onClose={() => setError(null)} className="mb-6" />
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
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
                placeholder="e.g. Data Structures and Algorithms"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Topic / Unit Syllabus
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Binary Search Trees and AVL Trees"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Question Type / Mark Format
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value="2_mark">2-Mark Questions (Definition & Key Formula)</option>
                <option value="5_mark">5-Mark Questions (Working Principle + Example)</option>
                <option value="10_mark">10-Mark Questions (Full Descriptive & Analysis)</option>
                <option value="important_exam">Important Examination Questions (Mixed)</option>
                <option value="short_answer">Short-Answer Questions</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value="Easy">Easy (Foundational Recall)</option>
                <option value="Medium">Medium (Application & Standard Exam)</option>
                <option value="Hard">Hard (Deep Analytical & Edge Cases)</option>
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
                <option value={3}>3 Questions</option>
                <option value={4}>4 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={8}>8 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Examination Questions</span>
            </button>
          </div>
        </form>
      </div>

      {isLoading && <LoadingSpinner message="Formulating structured exam questions with model marking keys..." />}

      {/* Questions Output List */}
      {response && !isLoading && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/60 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
            <span>{response.disclaimer}</span>
            <span className="font-bold">{response.questions.length} Questions Generated</span>
          </div>

          <div className="space-y-4">
            {response.questions.map((q) => {
              const isExpanded = !!expandedAnswers[q.id];
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  {/* Question Header */}
                  <div className="p-6 flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {q.marks} Marks
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          Difficulty: {q.difficulty}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {q.question}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyQuestion(q)}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Copy Question & Answer"
                      >
                        {copiedId === q.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => toggleExpand(q.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Answer' : 'Model Answer'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Marking Scheme Checklist */}
                  {q.expected_answer_structure && q.expected_answer_structure.length > 0 && (
                    <div className="px-6 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-b border-slate-100 dark:border-slate-800 text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Expected Evaluator Marking Structure:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {q.expected_answer_structure.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                          >
                            <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                            <span>{item}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Model Answer Body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-4"
                      >
                        <div>
                          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider block mb-2">
                            Structured Model Answer:
                          </span>
                          <MarkdownRenderer content={q.model_answer} />
                        </div>

                        {q.key_points && q.key_points.length > 0 && (
                          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 text-xs">
                            <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">
                              Mandatory Scoring Keywords:
                            </span>
                            <p className="text-slate-700 dark:text-slate-300">
                              {q.key_points.join(' • ')}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
