import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Brain, CheckCircle, FileText, Award } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-sky-400/15 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          {/* Tagline Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 mb-6 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Learn Smarter. Rise Higher.</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6"
          >
            Your Personal{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 dark:from-indigo-400 dark:via-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">
              AI Learning Companion
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8"
          >
            Understand difficult concepts, transform lengthy notes into concise summaries, generate practice quizzes, and prepare smarter for every examination with Vidyodaya AI.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Start Learning Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
            >
              Explore Features
            </a>
          </motion.div>
        </div>

        {/* Product Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-indigo-200/50 via-slate-100 to-white dark:from-indigo-900/40 dark:via-slate-900 dark:to-slate-950 border border-indigo-200/60 dark:border-indigo-800/60 shadow-2xl shadow-indigo-500/10"
        >
          {/* Mac-like header bar */}
          <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="h-10 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>vidyodaya-ai.edu/study-assistant</span>
              </div>
              <div className="w-12" />
            </div>

            {/* Dashboard Mock UI */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50/50 dark:bg-slate-900/50">
              {/* Left Mini Panel */}
              <div className="md:col-span-4 space-y-3">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Active Topic Breakdown</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    DBMS: 3NF & BCNF Normalization
                  </h4>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span>Concept Clarity</span>
                      <span className="font-semibold text-emerald-600">92%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                      <div className="bg-emerald-500 h-1.5 rounded-full w-[92%]" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-600 text-white shadow-md">
                  <div className="flex items-center gap-2 text-xs font-medium text-indigo-100 mb-1">
                    <Brain className="w-3.5 h-3.5" />
                    <span>Exam Question Generator</span>
                  </div>
                  <p className="text-xs font-semibold">Structured 5-Mark Marking Key Ready</p>
                  <p className="text-[11px] text-indigo-200 mt-1">Definition • Functional Dependency • Candidate Key Proof</p>
                </div>
              </div>

              {/* Right Assistant Response Panel */}
              <div className="md:col-span-8 p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Vidyodaya Academic Mentor</h5>
                    <p className="text-[10px] text-emerald-600 font-medium">Answer tuned for 5-Mark University Examination</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    1. Definition (1 Mark):
                  </p>
                  <p className="pl-3 border-l-2 border-indigo-400 text-slate-600 dark:text-slate-400">
                    A relation schema R is in Third Normal Form (3NF) if for every functional dependency X → A, either X is a superkey or A is a prime attribute.
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    2. Core Distinction from 2NF (2 Marks):
                  </p>
                  <p className="pl-3 border-l-2 border-indigo-400 text-slate-600 dark:text-slate-400">
                    While 2NF eliminates partial dependencies, 3NF strictly eliminates transitive dependencies (e.g. StudentID → DeptID → HOD_Name).
                  </p>
                  <div className="flex items-center gap-2 pt-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Includes Model Diagram & Schema Decomposition Steps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

