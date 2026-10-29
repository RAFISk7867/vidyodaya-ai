import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Award } from 'lucide-react';

interface ProgressChartProps {
  data: {
    attempt: string;
    score: number;
    percentage: number;
    total: number;
  }[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800">
        <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          No Quiz Records Yet
        </h4>
        <p className="text-xs text-slate-500 max-w-xs">
          Take your first interactive quiz or mock test to view real-time score progression and retention trends.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stop-color="#4F46E5" stopOpacity={0.4} />
              <stop offset="95%" stop-color="#4F46E5" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
          <XAxis
            dataKey="attempt"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            domain={[0, 100]}
            tickFormatter={(val) => `${val}%`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-800">
                    <p className="font-bold mb-1">{item.attempt}</p>
                    <p className="text-indigo-300">Score: {item.score} / {item.total} ({item.percentage}%)</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="percentage"
            stroke="#4F46E5"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

