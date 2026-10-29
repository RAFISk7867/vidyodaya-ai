import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Trash2,
  Copy,
  Check,
  Eye,
  BotMessageSquare,
  Compass,
  FileCheck2,
  HelpCircle,
  Award,
  Layers,
  X,
} from 'lucide-react';
import { api } from '../api';
import { StudyItem, QuizHistoryItem } from '../types';
import { Toast } from '../components/common/Toast';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';

export const StudyHistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'study_items' | 'quizzes'>('study_items');
  const [filterType, setFilterType] = useState<string>('all');
  const [studyItems, setStudyItems] = useState<StudyItem[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StudyItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [items, quizzes] = await Promise.all([
        api.getStudyHistory(filterType === 'all' ? undefined : filterType),
        api.getQuizHistory(),
      ]);
      setStudyItems(items);
      setQuizHistory(quizzes);
    } catch (err: any) {
      setError(err.message || 'Failed to load study history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterType]);

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('Are you sure you want to remove this item from your study records?')) return;
    try {
      await api.deleteStudyItem(itemId);
      if (selectedItem?.id === itemId) setSelectedItem(null);
      await fetchHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to delete item.');
    }
  };

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assistant_qa':
        return BotMessageSquare;
      case 'concept_note':
        return Compass;
      case 'summary':
        return FileCheck2;
      default:
        return HelpCircle;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <span>Study Records & History</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Access your saved revision notes, AI tutor explanations, and past quiz evaluations
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('study_items')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'study_items'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Study Notes & Materials ({studyItems.length})
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'quizzes'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Quiz Attempts ({quizHistory.length})
          </button>
        </div>
      </div>

      {error && <Toast type="error" message={error} onClose={() => setError(null)} />}

      {loading ? (
        <LoadingSpinner message="Fetching your saved study items..." />
      ) : activeTab === 'study_items' ? (
        <div className="space-y-6">
          {/* Sub Filter */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium">Filter:</span>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'assistant_qa', label: 'Q&A Solutions' },
              { id: 'concept_note', label: 'Concept Deconstructions' },
              { id: 'summary', label: 'Summaries' },
              { id: 'question_set', label: 'Exam Question Sets' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  filterType === f.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {studyItems.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                No Saved Items in this Category
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Items generated through the AI Assistant, Concept Explorer, or Summarizer will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyItems.map((item) => {
                const Icon = getTypeIcon(item.item_type);
                const dateStr = new Date(item.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.item_type.replace('_', ' ')}
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono">
                          {dateStr}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                        {item.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyContent(item.content)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Copy Content"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Quiz Attempts History */
        <div className="space-y-4">
          {quizHistory.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                No Quiz Records Found
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Completed multiple choice tests or mock tests will record their evaluation and scores here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
              {quizHistory.map((q) => {
                const dateStr = new Date(q.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const isPass = q.percentage >= 50;

                return (
                  <div key={q.attempt_id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPass
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {q.percentage}%
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {q.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {q.subject} • Score: {q.score}/{q.total_questions}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {dateStr}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Item Viewer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  {selectedItem.item_type.replace('_', ' ')}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedItem.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-sm text-slate-800 dark:text-slate-200">
              <MarkdownRenderer content={selectedItem.content} />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/50">
              <button
                onClick={() => handleCopyContent(selectedItem.content)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
              >
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

