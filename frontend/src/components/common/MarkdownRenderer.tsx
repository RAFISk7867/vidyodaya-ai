import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className={`prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-4 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white mt-4 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base md:text-lg font-medium text-indigo-700 dark:text-indigo-400 mt-3 mb-1">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-2 leading-relaxed text-slate-700 dark:text-slate-300">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-2 space-y-1 text-slate-700 dark:text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-700 dark:text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-r text-slate-700 dark:text-slate-300 italic">
              {children}
            </blockquote>
          ),
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeText = String(children).replace(/\n$/, '');
            const isBlock = match || codeText.includes('\n');

            if (isBlock) {
              const codeId = Math.random().toString(36).substring(7);
              return (
                <div className="relative group my-3 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 text-sm">
                  <div className="flex justify-between items-center px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                    <span>{match ? match[1] : 'code'}</span>
                    <button
                      onClick={() => handleCopy(codeText, codeId)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                      title="Copy code"
                    >
                      {copiedCode === codeId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto font-mono text-xs md:text-sm leading-relaxed">
                    <code>{codeText}</code>
                  </pre>
                </div>
              );
            }

            return (
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-mono text-xs md:text-sm">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 bg-slate-100 dark:bg-slate-900 text-left font-semibold text-slate-900 dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

