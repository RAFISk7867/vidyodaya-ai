import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-10 sm:p-14 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white text-center shadow-2xl"
        >
          {/* Subtle decorative circles */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/10 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Vidyodaya AI Platform</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Make Every Study Session Count.
            </h3>

            <p className="text-sm sm:text-base text-indigo-100 leading-relaxed mb-8">
              Transform preparation from stressful cramming into systematic, high-confidence mastery. Start with free practice questions, smart summaries, and instant AI tutor assistance.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold text-indigo-900 bg-white hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-100"
            >
              Start Your Learning Journey
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

