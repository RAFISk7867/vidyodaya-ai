import React from 'react';
import { RecentActivityItem } from '../../types';
import { Award, FileText, Bookmark, Calendar } from 'lucide-react';

interface RecentActivityListProps {
  activities: RecentActivityItem[];
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        No recent study items yet. Ask a question or summarize notes to get started!
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return Award;
      case 'document':
        return FileText;
      default:
        return Bookmark;
    }
  };

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {activities.map((act) => {
        const Icon = getIcon(act.type);
        const formattedDate = new Date(act.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div key={`${act.type}-${act.id}`} className="py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {act.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {act.subtitle}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              {act.badge && (
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-1">
                  {act.badge}
                </span>
              )}
              <p className="text-[10px] text-slate-400 font-mono">
                {formattedDate}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

