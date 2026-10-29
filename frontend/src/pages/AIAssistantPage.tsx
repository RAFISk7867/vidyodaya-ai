import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Trash2,
  Copy,
  Check,
  Sparkles,
  BotMessageSquare,
  BookOpen,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { api, ApiError } from '../api';
import { ChatMessage } from '../types';
import { MarkdownRenderer } from '../components/common/MarkdownRenderer';
import { Toast } from '../components/common/Toast';

export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Hello! I am your **Vidyodaya Academic Mentor**. Ask me any academic question, request concept explanations, or ask for structured **2-mark, 5-mark, or 10-mark** university examination answers.\n\nYou can also configure the Subject and Explanation Level above to tailor my response to your syllabus.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [topic, setTopic] = useState('');
  const [explanationLevel, setExplanationLevel] = useState('Intermediate');
  const [answerLength, setAnswerLength] = useState('5-Mark Answer');
  const [showConfig, setShowConfig] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    'Analyzing academic concept...',
    'Synthesizing key points & solution...',
    'Formatting structured examination answer...',
  ];

  useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((s) => (s + 1) % 3);
    }, 2200);
    return () => clearInterval(interval);
  }, [isLoading]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputQuery.trim(),
      subject,
      topic: topic || undefined,
      explanation_level: explanationLevel,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setError(null);
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome-1')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await api.ask({
        question: userMessage.content,
        subject,
        topic: topic || undefined,
        explanation_level: explanationLevel,
        answer_length: answerLength,
        conversation_history: historyPayload,
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        subject: res.subject,
        topic: res.topic,
        explanation_level: res.explanation_level,
        key_takeaways: res.key_takeaways,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(
        err.message ||
          'Failed to generate response. Please ensure your Gemini API key is configured in Settings.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyAnswer = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Conversation cleared. How can I help with your studies next?',
        timestamp: new Date().toISOString(),
      },
    ]);
    setError(null);
  };

  const samplePrompts = [
    'Explain Normalization in DBMS with a suitable 5-mark answer example.',
    'What is Dijkstra\'s shortest path algorithm? Provide step-by-step logic.',
    'Explain the ACID properties of transactions with real banking examples.',
    'Compare Process vs Thread in Operating Systems for a 10-mark question.',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Top Configuration & Control Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BotMessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                AI Academic Mentor
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Subject: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{subject}</span> • Level:{' '}
                <span className="font-semibold">{explanationLevel}</span> • Target: <span className="font-semibold">{answerLength}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Query Settings</span>
              {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Clear Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Configuration Form */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
            >
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Subject / Discipline
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. DBMS, Physics, Calculus"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Specific Topic (Optional)
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. BCNF Decomposition"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Explanation Level
                </label>
                <select
                  value={explanationLevel}
                  onChange={(e) => setExplanationLevel(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Beginner">Beginner (Intuitive & Analogies)</option>
                  <option value="Intermediate">Intermediate (University Standard)</option>
                  <option value="Advanced">Advanced (Rigorous & In-depth)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Desired Length / Scheme
                </label>
                <select
                  value={answerLength}
                  onChange={(e) => setAnswerLength(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Short">Short (Concise summary)</option>
                  <option value="Medium">Medium (Balanced)</option>
                  <option value="2-Mark Answer">2-Mark Answer (Crisp points)</option>
                  <option value="5-Mark Answer">5-Mark Answer (Structured + Example)</option>
                  <option value="10-Mark Answer">10-Mark Answer (Full Essay & Diagram)</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 sm:p-5 ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white'
                }`}
              >
                {/* Assistant Metadata Header & Copy */}
                {!isUser && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      Vidyodaya Academic Solution
                    </span>
                    <button
                      onClick={() => handleCopyAnswer(msg.content, msg.id)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Copy Answer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Message Body with Safe Markdown */}
                {isUser ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                ) : (
                  <MarkdownRenderer content={msg.content} className="text-sm" />
                )}

                {/* Key Takeaways Pill Box if available */}
                {!isUser && msg.key_takeaways && msg.key_takeaways.length > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 text-xs">
                    <span className="font-bold text-indigo-700 dark:text-indigo-300 block mb-1">
                      Exam High-Yield Takeaways:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-300">
                      {msg.key_takeaways.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Loading Thinking Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-center text-slate-500 dark:text-slate-400 text-xs"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {loadingMessages[loadingStep]}
              </span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error notification if any */}
      {error && (
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800">
          <Toast type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* Suggested Academic Prompts if chat is brief */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap gap-2">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInputQuery(prompt)}
              className="text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-end gap-2"
      >
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask an academic question in ${subject}... (Enter to send, Shift+Enter for new line)`}
            className="w-full resize-none px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all custom-scrollbar"
          />
        </div>

        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20 transition-all shrink-0"
          title="Send Query"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

