import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Cpu, CheckCircle, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Upload Materials or Enter Topic',
      description: 'Upload your syllabus PDF, textbook chapter, or simply type the subject topic you want to master.',
      icon: UploadCloud,
    },
    {
      step: '02',
      title: 'AI Synthesizes Content',
      description: 'Vidyodaya AI creates tailored concept breakdowns, exam-oriented notes, and syllabus-aligned questions.',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'Learn, Practice & Revise',
      description: 'Review structured 2, 5 & 10 mark answers, test yourself with timed quizzes, and track your retention.',
      icon: CheckCircle,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
            Simple 3-Step Workflow
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Vidyodaya AI Accelerates Learning
          </h3>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            From raw textbook pages to high-scoring examination answers in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center text-center group hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
              >
                {/* Step Pill */}
                <div className="absolute top-6 right-6 text-xs font-black text-indigo-300 dark:text-indigo-700">
                  {item.step}
                </div>

                <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>

                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  {item.title}
                </h4>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

