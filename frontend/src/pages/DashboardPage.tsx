import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BotMessageSquare,
  FileText,
  FileCheck2,
  BrainCircuit,
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { DashboardStats } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickActionCard } from '../components/dashboard/QuickActionCard';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { RecentActivityList } from '../components/dashboard/RecentActivityCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getDashboardStats();
        setStats(res);
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading your academic dashboard..." />;
  }

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Student';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white shadow-xl"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Academic Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Welcome back, {firstName}!
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 leading-relaxed mb-6">
            Ready to make progress today? Ask academic queries, summarize lecture PDFs, or test your retention with an AI mock test.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-indigo-950 bg-white hover:bg-indigo-50 shadow-sm transition-all"
            >
              <BotMessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Ask AI Tutor</span>
            </Link>
            <Link
              to="/quiz-generator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600/80 hover:bg-indigo-600 border border-white/15 transition-all"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-200" />
              <span>Practice Quiz</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Actual Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Quizzes Attempted"
          value={stats?.quizzes_attempted ?? 0}
          subtext={stats?.average_quiz_score ? `Avg Score: ${stats.average_quiz_score}%` : 'No attempts yet'}
          icon={BrainCircuit}
          color="bg-indigo-600"
        />
        <StatCard
          label="Questions Asked"
          value={stats?.questions_asked ?? 0}
          subtext="Saved Q&A conversations"
          icon={BotMessageSquare}
          color="bg-violet-600"
        />
        <StatCard
          label="Documents Processed"
          value={stats?.documents_processed ?? 0}
          subtext="PDF syllabi & lecture notes"
          icon={FileText}
          color="bg-blue-600"
        />
        <StatCard
          label="Study Items Saved"
          value={stats?.study_items_saved ?? 0}
          subtext="Available in Study History"
          icon={Layers}
          color="bg-emerald-600"
        />
      </div>

      {/* Quick Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Quick Actions
          </h3>
          <span className="text-xs text-slate-500 font-medium">Select a tool to begin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <QuickActionCard
            title="Ask AI Assistant"
            description="Get structured academic explanations and answers with mark distribution."
            to="/assistant"
            icon={BotMessageSquare}
            badge="Tutor"
            gradient="from-indigo-500 to-indigo-700"
          />
          <QuickActionCard
            title="Upload Notes"
            description="Extract text from syllabus PDFs and generate targeted exam prep."
            to="/pdf-analyzer"
            icon={FileText}
            badge="PDF"
            gradient="from-blue-500 to-cyan-600"
          />
          <QuickActionCard
            title="Summarize Content"
            description="Create bullet revision notes, formula sheets, or 5-minute recaps."
            to="/summarizer"
            icon={FileCheck2}
            badge="Summary"
            gradient="from-violet-500 to-purple-700"
          />
          <QuickActionCard
            title="Generate Quiz"
            description="Test your conceptual retention with AI-generated multiple choice questions."
            to="/quiz-generator"
            icon={BrainCircuit}
            badge="MCQ"
            gradient="from-emerald-500 to-teal-700"
          />
          <QuickActionCard
            title="Prepare for Exams"
            description="Generate 2-mark, 5-mark, and 10-mark model answers for semester exams."
            to="/questions"
            icon={HelpCircle}
            badge="Exams"
            gradient="from-amber-500 to-orange-600"
          />
        </div>
      </div>

      {/* Analytics Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Progression Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Quiz Score Progression
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your performance score across recent test attempts
              </p>
            </div>
            {stats?.average_quiz_score ? (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {stats.average_quiz_score}% Average
              </span>
            ) : null}
          </div>

          <ProgressChart data={stats?.score_trend || []} />
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h3>
              <Link
                to="/history"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all
              </Link>
            </div>

            <RecentActivityList activities={stats?.recent_activities || []} />
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/mock-tests"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Simulate Timed University Mock Test</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

