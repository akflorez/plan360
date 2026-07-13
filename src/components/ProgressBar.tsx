import React from 'react';

interface ProgressBarProps {
  label?: string;
  percent: number; // 0 to 100
  detailText?: string;
  color?: 'emerald' | 'navy' | 'purple' | 'aqua' | 'rose' | 'amber' | 'indigo' | 'blue';
  height?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  percent,
  detailText,
  color = 'emerald',
  height = 'md'
}) => {
  const cleanPercent = Math.max(0, Math.min(100, Number(percent) || 0));

  const colorClasses = {
    emerald: 'bg-emerald-500 shadow-sm shadow-emerald-500/20',
    navy: 'bg-navy-800 shadow-sm shadow-navy-800/20',
    purple: 'bg-purple-500 shadow-sm shadow-purple-500/20',
    aqua: 'bg-aqua-500 shadow-sm shadow-aqua-500/20',
    rose: 'bg-rose-500 shadow-sm shadow-rose-500/20',
    amber: 'bg-amber-500 shadow-sm shadow-amber-500/20',
    indigo: 'bg-indigo-500 shadow-sm shadow-indigo-500/20',
    blue: 'bg-blue-500 shadow-sm shadow-blue-500/20'
  };

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {(label || detailText) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
          {label && <span className="text-slate-600">{label}</span>}
          <div className="flex items-center gap-1.5 text-slate-700">
            {detailText && <span className="text-slate-600 font-normal">{detailText}</span>}
            <span className="font-bold">{cleanPercent.toFixed(0)}%</span>
          </div>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${cleanPercent}%` }}
        />
      </div>
    </div>
  );
};
