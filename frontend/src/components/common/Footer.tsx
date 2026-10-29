import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm">
                <img src="/logo.svg" alt="Vidyodaya AI" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                Vidyodaya <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Learn Smarter. Rise Higher. An intelligent educational platform for personalized learning, concept mastery, and university exam preparation.
            </p>
          </div>

          {/* Academic Features */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              Learning Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/assistant" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  AI Study Assistant
                </Link>
              </li>
              <li>
                <Link to="/concepts" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Concept Explorer
                </Link>
              </li>
              <li>
                <Link to="/pdf-analyzer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Smart PDF Analyzer
                </Link>
              </li>
              <li>
                <Link to="/summarizer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Notes Summarizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Exam Prep */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              Examination Preparation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/questions" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  2, 5 & 10 Mark Answers
                </Link>
              </li>
              <li>
                <Link to="/quiz-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Interactive Quiz Generator
                </Link>
              </li>
              <li>
                <Link to="/mock-tests" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Timed Mock Tests
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Study History & Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Benefits & Pedagogical Approach
                </a>
              </li>
              <li>
                <Link to="/settings" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  API Configuration & Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Vidyodaya AI. All academic rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built for academic excellence with</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};

