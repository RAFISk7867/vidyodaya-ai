import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Target, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      title: 'Learn At Your Own Pace',
      description: 'Switch between Beginner, Intermediate, and Advanced explanation depths whenever you need greater theoretical clarity.',
      icon: Clock,
    },
    {
      title: 'Save Critical Revision Time',
      description: 'Convert 100-page course PDFs into distilled high-yield revision points and formula summaries before test day.',
      icon: Zap,
    },
    {
      title: 'Truly Understand Difficult Topics',
      description: 'Get real-world analogies, step-by-step logic breakdowns, and intuitive examples instead of dense jargon.',
      icon: BookOpen,
    },
    {
      title: 'Practice With AI-Generated Questions',
      description: 'Test yourself with fresh, syllabus-aligned multiple choice questions and timed mock examinations with instant diagnostic feedback.',
      icon: Target,
    },
    {
      title: 'Structured Mark-Aligned Answers',
      description: 'Pre-formatted 2-mark definitions, 5-mark working points, and 10-mark full descriptive outlines formatted specifically to score.',
      icon: CheckCircle2,
    },
    {
      title: 'Private & Distraction-Free Learning',
      description: 'A dedicated academic environment with full session persistence, clear note organization, and zero fluff.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-slate-50 dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
            Pedagogical Advantage
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Designed for How Students Actually Learn
          </h3>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Combine modern generative AI with proven cognitive principles: active recall, spaced preparation, and structured marking frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {b.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

