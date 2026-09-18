import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  subtext?: string;
  accentColor?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
}

const accentGradients = {
  indigo: 'from-indigo-500/20 to-transparent border-indigo-500/30 text-indigo-400',
  cyan: 'from-cyan-500/20 to-transparent border-cyan-500/30 text-cyan-400',
  emerald: 'from-emerald-500/20 to-transparent border-emerald-500/30 text-emerald-400',
  amber: 'from-amber-500/20 to-transparent border-amber-500/30 text-amber-400',
  rose: 'from-rose-500/20 to-transparent border-rose-500/30 text-rose-400',
  purple: 'from-purple-500/20 to-transparent border-purple-500/30 text-purple-400',
};

const iconBackgrounds = {
  indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  subtext,
  accentColor = 'indigo',
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0E121B] border border-[#1E2536] p-5 shadow-lg hover:border-[#2D374E] transition-all duration-200">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${accentGradients[accentColor]} pointer-events-none rounded-bl-full opacity-60`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1 font-mono tracking-tight">{value}</h3>
          {change && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                  changeType === 'positive'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : changeType === 'negative'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-slate-700/30 text-slate-300 border border-slate-700/50'
                }`}
              >
                {change}
              </span>
              {subtext && <span className="text-xs text-slate-400">{subtext}</span>}
            </div>
          )}
          {!change && subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
        </div>
        <div className={`p-2.5 rounded-lg border ${iconBackgrounds[accentColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
}> = ({ title, subtitle, badge, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1A202E] mb-8">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-slate-400 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export const ProgressBar: React.FC<{
  value?: number;
  progress?: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ value, progress, max = 100, color = 'bg-indigo-500', showLabel = false, size = 'md' }) => {
  const actualVal = value !== undefined ? value : (progress !== undefined ? progress : 0);
  const percentage = Math.min(100, Math.max(0, Math.round((actualVal / max) * 100)));
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  let colorClass = color;
  if (color === 'indigo') colorClass = 'bg-indigo-500';
  else if (color === 'emerald') colorClass = 'bg-emerald-500';
  else if (color === 'rose') colorClass = 'bg-rose-500';
  else if (color === 'amber') colorClass = 'bg-amber-500';
  else if (color === 'purple') colorClass = 'bg-purple-500';
  else if (color === 'cyan') colorClass = 'bg-cyan-500';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
          <span>Progress</span>
          <span className="font-mono text-slate-200">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-[#1A202E] rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
