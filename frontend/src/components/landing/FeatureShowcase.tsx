import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BotMessageSquare,
  Compass,
  FileText,
  FileCheck2,
  BrainCircuit,
  GraduationCap,
  History,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export const FeatureShowcase: React.FC = () => {
  const features = [
    {
      name: 'AI Academic Assistant',
      description: 'Ask deep academic doubts and receive rigorously structured answers with clear formulas, analogies, and exam mark guidelines.',
      icon: BotMessageSquare,
      path: '/assistant',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Simplified Concept Explanations',
      description: 'Break down complex theoretical topics into step-by-step logic, practical real-world scenarios, and key examination takeaways.',
      icon: Compass,
      path: '/concepts',
      color: 'from-indigo-500 to-violet-600',
    },
    {
      name: 'Smart PDF Analyzer',
      description: 'Upload syllabus PDFs or lecture slides to extract text, summarize units, and generate targeted question banks grounded in your material.',
      icon: FileText,
      path: '/pdf-analyzer',
      color: 'from-violet-500 to-purple-600',
    },
    {
      name: 'AI Notes Summarizer',
      description: 'Condense lengthy textbooks and messy notes into quick revision bullets, formula cheat-sheets, or detailed exam summaries.',
      icon: FileCheck2,
      path: '/summarizer',
      color: 'from-purple-500 to-pink-600',
    },
    {
      name: 'Interactive Quiz Generator',
      description: 'Test your knowledge with AI-crafted MCQs featuring immediate rationale explanations, question navigators, and weakness diagnosis.',
      icon: BrainCircuit,
      path: '/quiz-generator',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      name: 'Examination Preparation (2, 5 & 10 Mark)',
      description: 'Generate model answers strictly organized by university marking schemes, ensuring your points capture maximum evaluator credit.',
      icon: HelpCircle,
      path: '/questions',
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Mock Tests & Exam Simulation',
      description: 'Experience real timed examination conditions with a countdown timer, question palette, and an in-depth scorecard evaluation.',
      icon: GraduationCap,
      path: '/mock-tests',
      color: 'from-rose-500 to-red-600',
    },
    {
      name: 'Personalized Revision & History',
      description: 'Track your quiz scores, revisit saved question sets, view weakness recommendations, and never lose your study materials.',
      icon: History,
      path: '/history',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
            Core Learning Capabilities
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Academic Mastery
          </h3>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Every feature is purpose-built to help university students absorb concepts faster, test their knowledge, and score higher in semester examinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white mb-5 shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <Link
                  to={feature.path}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

