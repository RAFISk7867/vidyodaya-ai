import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return { title: 'Dashboard', subtitle: 'Overview of your learning progress & quick tools' };
      case '/assistant':
        return { title: 'AI Study Assistant', subtitle: 'Chat with your AI academic mentor for questions and answers' };
      case '/concepts':
        return { title: 'Concept Explorer', subtitle: 'Detailed breakdowns, logic steps & real-world examples' };
      case '/pdf-analyzer':
        return { title: 'PDF Analyzer', subtitle: 'Extract text and generate questions directly from syllabus PDFs' };
      case '/summarizer':
        return { title: 'Notes Summarizer', subtitle: 'Condense course notes into high-yield revision summaries' };
      case '/questions':
        return { title: 'Question Generator', subtitle: 'Generate 2-mark, 5-mark, and 10-mark model answers' };
      case '/quiz-generator':
        return { title: 'Quiz Generator', subtitle: 'Interactive multiple choice tests with in-depth rationales' };
      case '/mock-tests':
        return { title: 'Mock Tests', subtitle: 'Timed exam simulation with complete score analysis' };
      case '/history':
        return { title: 'Study History', subtitle: 'Your saved notes, generated question sets, and past quiz attempts' };
      case '/settings':
        return { title: 'Settings', subtitle: 'Account preferences, Gemini API key, and data control' };
      default:
        return { title: 'Vidyodaya AI', subtitle: 'Learn Smarter. Rise Higher.' };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

