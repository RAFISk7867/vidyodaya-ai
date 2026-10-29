import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  Bookmark,
  Layers,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../api';
import { ConceptExplanation } from '../types';
import { Toast } from '../components/common/Toast';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ConceptExplorerPage: React.FC = () => {
  const [subject, setSubject] = useState('Operating Systems');
  const [topic, setTopic] = useState('Virtual Memory and Paging');
  const [explanationLevel, setExplanationLevel] = useState('Intermediate');
  const [includeExample, setIncludeExample] = useState(true);
  const [examPerspective, setExamPerspective] = useState(true);

  const [result, setResult] = useState<ConceptExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleExplore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      setError('Please provide both a subject and a concept topic.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setSaved(false);

    try {
      const data = await api.explain({
        subject: subject.trim(),
        topic: topic.trim(),
        explanation_level: explanationLevel,
        include_example: includeExample,
        exam_perspective: examPerspective,
      });
      setResult(data);
    } catch (err: any) {
      setError(
        err.message ||
          'Failed to explore concept. Check your Gemini API key in Settings.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Concept: ${result.topic} (${result.subject})\n\nDefinition:\n${result.simple_definition}\n\nExplanation:\n${result.detailed_explanation}\n\nKey Steps:\n${result.step_by_step_breakdown.join('\n')}\n\nExample:\n${result.practical_example || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToHistory = async () => {
    if (!result || saved) return;
    try {
      await api.saveStudyItem({
        item_type: 'concept_note',
        title: `Concept: ${result.topic}`,
        subject: result.subject,
        topic: result.topic,
        content: result.detailed_explanation,
      });
      setSaved(true);
    } catch {
      // Ignored if already saved
    }
  };

  const presetTopics = [
    { subject: 'Operating Systems', topic: 'Deadlock Detection & Prevention' },
    { subject: 'Database Management', topic: 'ACID Properties and Write-Ahead Logging' },
    { subject: 'Computer Networks', topic: 'TCP 3-Way Handshake and Flow Control' },
    { subject: 'Data Structures', topic: 'AVL Tree Rotations and Balance Factor' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Search & Topic Form Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Compass className="w-4 h-4" />
          <span>Intelligent Concept Deconstruction</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          Master Difficult Academic Topics
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
          Input any complex theoretical subject or concept to generate an intuitive breakdown, step-by-step logic, and exam-focused takeaways.
        </p>

        {error && (
          <Toast type="error" message={error} onClose={() => setError(null)} className="mb-6" />
        )}

        <form onSubmit={handleExplore} className="space-y-4">
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
                placeholder="e.g. Operating Systems"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Concept or Topic Name
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Virtual Memory and Paging"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Depth
              </label>
              <select
                value={explanationLevel}
                onChange={(e) => setExplanationLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value="Beginner">Beginner (Intuitive & Analogies)</option>
                <option value="Intermediate">Intermediate (Standard University)</option>
                <option value="Advanced">Advanced (Rigorous & Graduate)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="includeExample"
                checked={includeExample}
                onChange={(e) => setIncludeExample(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="includeExample" className="text-xs text-slate-700 dark:text-slate-300">
                Include Concrete Example
              </label>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="examPerspective"
                checked={examPerspective}
                onChange={(e) => setExamPerspective(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="examPerspective" className="text-xs text-slate-700 dark:text-slate-300">
                Exam-Marking Perspective
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400">Popular:</span>
              {presetTopics.map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSubject(item.subject);
                    setTopic(item.topic);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  {item.topic}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Concept</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {isLoading && (
        <LoadingSpinner message="Deconstructing academic concept with Gemini AI..." />
      )}

      {/* Structured Result Display */}
      {result && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Card with Copy & Save buttons */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                <span>{result.subject}</span>
                <span>•</span>
                <span>Level: {result.explanation_level}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {result.topic}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleSaveToHistory}
                disabled={saved}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors disabled:opacity-70"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{saved ? 'Saved in History' : 'Save Note'}</span>
              </button>
            </div>
          </div>

          {/* Core Definition Banner */}
          <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60">
            <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Core Definition</span>
            </h4>
            <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {result.simple_definition}
            </p>
          </div>

          {/* Detailed Explanation */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Systematic Explanation</span>
            </h4>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {result.detailed_explanation}
            </div>
          </div>

          {/* Step-by-Step Breakdown */}
          {result.step_by_step_breakdown && result.step_by_step_breakdown.length > 0 && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Step-by-Step Mechanism / Principles
              </h4>
              <div className="space-y-3">
                {result.step_by_step_breakdown.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Practical Example */}
          {result.practical_example && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Illustrative Example</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-50/40 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/60">
                {result.practical_example}
              </p>
            </div>
          )}

          {/* Key Takeaways & Related Concepts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3">
                Key Exam Takeaways
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {result.key_takeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-3">
                Related Concepts to Connect
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.related_concepts.map((concept, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTopic(concept);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium transition-colors"
                  >
                    {concept}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

