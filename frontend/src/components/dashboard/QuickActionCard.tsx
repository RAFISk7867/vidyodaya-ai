import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  gradient: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  to,
  icon: Icon,
  badge,
  gradient,
}) => {
  return (
    <Link to={to} className="block group">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="h-full p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white shadow-sm`}>
              <Icon className="w-5 h-5" />
            </div>
            {badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {badge}
              </span>
            )}
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
          <span>Open Tool</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
};

