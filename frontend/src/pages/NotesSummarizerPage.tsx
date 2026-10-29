import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck2,
  Sparkles,
  Download,
  Copy,
  Check,
  Bookmark,
  FileText,
  ListOrdered,
  BookOpen,
} from 'lucide-react';
import { api } from '../api';
import { SummaryResult } from '../types';
import { Toast } from '../components/common/Toast';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';

export const NotesSummarizerPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('Operating Systems');
  const [summaryType, setSummaryType] = useState('quick_revision');
  const [desiredLength, setDesiredLength] = useState('Medium');

  const [result, setResult] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 20) {
      setError('Please provide at least 20 characters of study notes to summarize.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setSaved(false);

    try {
      const data = await api.summarize({
        content: content.trim(),
        subject: subject.trim() || undefined,
        summary_type: summaryType,
        desired_length: desiredLength,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Summarization failed. Verify your Gemini API key in Settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const fullDoc = `# ${result.title}\n\n${result.summary_text}\n\n## Key Points\n${result.key_points.map((p) => `- ${p}`).join('\n')}\n\n## Important Terms\n${result.important_terms.map((t) => `- ${t}`).join('\n')}`;
    navigator.clipboard.writeText(fullDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const fullDoc = `# ${result.title}\n\n${result.summary_text}\n\n## Key Points\n${result.key_points.map((p) => `- ${p}`).join('\n')}\n\n## Important Terms\n${result.important_terms.map((t) => `- ${t}`).join('\n')}`;
    const blob = new Blob([fullDoc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.title.replace(/[^a-zA-Z0-9]/g, '_')}_summary.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToHistory = async () => {
    if (!result || saved) return;
    try {
      await api.saveStudyItem({
        item_type: 'summary',
        title: result.title,
        subject: subject || 'General Notes',
        topic: result.summary_type,
        content: result.summary_text,
      });
      setSaved(true);
    } catch {
      // Ignored
    }
  };

  const sampleSnippet = `A semaphore is a synchronization tool introduced by Edsger Dijkstra. A semaphore S is an integer variable that, apart from initialization, is accessed only through two standard atomic operations: wait() and signal(). Originally named P() (proberen = to test) and V() (verhogen = to increment).

Counting semaphores have an unrestricted integer domain and control access to a resource pool with multiple instances. Binary semaphores take only 0 or 1 and behave like mutex locks.

A major critical challenge is Deadlock: where two or more processes are waiting indefinitely for an event that can be caused only by one of the waiting processes. Another issue is Priority Inversion, where a high-priority process is blocked waiting for a resource held by a low-priority process.`;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Input Configuration Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <FileCheck2 className="w-4 h-4" />
          <span>High-Yield Revision Synthesizer</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
          AI Notes Summarizer
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">
          Paste lecture notes, textbook chapters, or transcript excerpts to instantly produce structured revision points, key definitions, and exam notes.
        </p>

        {error && (
          <Toast type="error" message={error} onClose={() => setError(null)} className="mb-6" />
        )}

        <form onSubmit={handleSummarize} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Operating Systems"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Summary Type
              </label>
              <select
                value={summaryType}
                onChange={(e) => setSummaryType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value="quick_revision">Quick Revision (Last-Minute High-Yield)</option>
                <option value="detailed">Detailed Academic Summary</option>
                <option value="bullet_points">Bullet-Point Notes</option>
                <option value="exam_oriented">Exam-Oriented Notes (Mark Scheme)</option>
                <option value="key_formulas">Key Formulas & Rules</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Length
              </label>
              <select
                value={desiredLength}
                onChange={(e) => setDesiredLength(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value="Short">Short (1-2 Min Read)</option>
                <option value="Medium">Medium (Balanced)</option>
                <option value="Long">Long (Comprehensive)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pasted Notes or Chapter Content
              </label>
              <button
                type="button"
                onClick={() => setContent(sampleSnippet)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Load sample excerpt
              </button>
            </div>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste study material here..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar"
            />
            <p className="text-[11px] text-slate-400 text-right mt-1">
              {content.length} characters entered
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !content.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Summary</span>
            </button>
          </div>
        </form>
      </div>

      {isLoading && <LoadingSpinner message="Synthesizing academic summary with Gemini AI..." />}

      {/* Rendered Summary Document */}
      {result && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6"
        >
          {/* Document Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-2 inline-block">
                {result.summary_type.replace('_', ' ')}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {result.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                title="Copy Markdown"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                title="Download Markdown File"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .md</span>
              </button>

              <button
                onClick={handleSaveToHistory}
                disabled={saved}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 transition-colors disabled:opacity-60"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Main Summary Text */}
          <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            <MarkdownRenderer content={result.summary_text} />
          </div>

          {/* Key Points Section */}
          {result.key_points && result.key_points.length > 0 && (
            <div className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-3">
              <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4" />
                <span>High-Yield Key Points</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4">
                {result.key_points.map((pt, i) => (
                  <li key={i} className="leading-relaxed">{pt}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Important Terminology */}
          {result.important_terms && result.important_terms.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Crucial Terminology</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {result.important_terms.map((term, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    {term}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

