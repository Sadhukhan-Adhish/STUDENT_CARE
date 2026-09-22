import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  subtext?: string;
  accentColor?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple' | 'copper' | 'teal';
}

const accentGradients = {
  copper: 'from-[#D89B5B]/15 to-transparent border-[#D89B5B]/25 text-[#D89B5B]',
  teal: 'from-[#67C5B8]/15 to-transparent border-[#67C5B8]/25 text-[#67C5B8]',
  indigo: 'from-[#D89B5B]/15 to-transparent border-[#D89B5B]/25 text-[#D89B5B]',
  cyan: 'from-[#67C5B8]/15 to-transparent border-[#67C5B8]/25 text-[#67C5B8]',
  emerald: 'from-emerald-500/15 to-transparent border-emerald-500/25 text-emerald-400',
  amber: 'from-[#D89B5B]/15 to-transparent border-[#D89B5B]/25 text-[#D89B5B]',
  rose: 'from-rose-500/15 to-transparent border-rose-500/25 text-rose-400',
  purple: 'from-[#67C5B8]/15 to-transparent border-[#67C5B8]/25 text-[#67C5B8]',
};

const iconBackgrounds = {
  copper: 'bg-[#D89B5B]/12 border-[#D89B5B]/30 text-[#D89B5B]',
  teal: 'bg-[#67C5B8]/12 border-[#67C5B8]/30 text-[#67C5B8]',
  indigo: 'bg-[#D89B5B]/12 border-[#D89B5B]/30 text-[#D89B5B]',
  cyan: 'bg-[#67C5B8]/12 border-[#67C5B8]/30 text-[#67C5B8]',
  emerald: 'bg-emerald-500/12 border-emerald-500/30 text-emerald-400',
  amber: 'bg-[#D89B5B]/12 border-[#D89B5B]/30 text-[#D89B5B]',
  rose: 'bg-rose-500/12 border-rose-500/30 text-rose-400',
  purple: 'bg-[#67C5B8]/12 border-[#67C5B8]/30 text-[#67C5B8]',
};

const StatCardComponent: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  subtext,
  accentColor = 'copper',
}) => {
  const chosenAccent = accentColor === 'indigo' ? 'copper' : accentColor;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-[#121922] hover:bg-[#16202B] border border-[#1E2A38] hover:border-[#2C3D52] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${accentGradients[chosenAccent] || accentGradients.copper} pointer-events-none rounded-bl-full opacity-40 transition-opacity duration-150`} />
      
      {/* 2-column flex layout with stable icon area that never shrinks or clips */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        {/* Content Area: guaranteed min-w-0 flex-1 so text wraps naturally and never forces card or icon outside */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#9AA5B1] uppercase tracking-wider group-hover:text-[#F3F0E8] transition-colors duration-150 truncate" title={title}>
            {title}
          </p>
          <h3
            className={`font-bold text-[#F3F0E8] font-mono tracking-tight mt-1 leading-tight break-words ${
              typeof value === 'string' && value.length > 11 ? 'text-lg sm:text-xl' : 'text-2xl'
            }`}
          >
            {value}
          </h3>
          {change && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${
                  changeType === 'positive'
                    ? 'bg-[#67C5B8]/12 text-[#7CD4C8] border border-[#67C5B8]/30'
                    : changeType === 'negative'
                    ? 'bg-rose-500/12 text-rose-300 border border-rose-500/30'
                    : 'bg-[#1E2938] text-[#9AA5B1] border border-[#2B3B4E]'
                }`}
              >
                {change}
              </span>
              {subtext && (
                <span className="text-xs text-[#9AA5B1] truncate max-w-full inline-block" title={subtext}>
                  {subtext}
                </span>
              )}
            </div>
          )}
          {!change && subtext && (
            <p className="text-xs text-[#9AA5B1] mt-2 truncate max-w-full" title={subtext}>
              {subtext}
            </p>
          )}
        </div>

        {/* Icon Area: guaranteed flex-shrink-0 with fixed dimensions, completely visible */}
        <div className={`flex-shrink-0 p-2.5 rounded-lg border ${iconBackgrounds[chosenAccent] || iconBackgrounds.copper} transition-colors duration-150 flex items-center justify-center`}>
          <Icon className="w-5 h-5 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export const StatCard = React.memo(StatCardComponent);


export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
}> = ({ title, subtitle, badge, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1C2633] mb-8">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-bold text-[#F3F0E8] tracking-tight">{title}</h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#D89B5B]/12 text-[#E8B47E] border border-[#D89B5B]/25">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-sm text-[#9AA5B1] mt-1 max-w-2xl">{subtitle}</p>}
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
}> = ({ value, progress, max = 100, color = 'bg-[#D89B5B]', showLabel = false, size = 'md' }) => {
  const actualVal = value !== undefined ? value : (progress !== undefined ? progress : 0);
  const percentage = Math.min(100, Math.max(0, Math.round((actualVal / max) * 100)));
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  let colorClass = color;
  if (color === 'indigo') colorClass = 'bg-[#D89B5B]';
  else if (color === 'copper') colorClass = 'bg-[#D89B5B]';
  else if (color === 'teal') colorClass = 'bg-[#67C5B8]';
  else if (color === 'emerald') colorClass = 'bg-emerald-500';
  else if (color === 'rose') colorClass = 'bg-rose-500';
  else if (color === 'amber') colorClass = 'bg-[#D89B5B]';
  else if (color === 'purple') colorClass = 'bg-[#67C5B8]';
  else if (color === 'cyan') colorClass = 'bg-[#67C5B8]';

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-[#9AA5B1] mb-1">
          <span>Progress</span>
          <span className="font-mono text-[#F3F0E8]">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-[#18222E] rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
