import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  trend?: {
    value: string | number;
    type: 'positive' | 'negative' | 'neutral';
  };
  color?: 'navy' | 'emerald' | 'purple' | 'aqua' | 'rose' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtext,
  trend,
  color = 'navy'
}) => {
  const colorStyles = {
    navy: {
      bg: 'bg-navy-800 text-white',
      iconContainer: 'bg-white/10 text-emerald-300',
      textMuted: 'text-slate-600',
      border: 'border-navy-700'
    },
    emerald: {
      bg: 'bg-white text-slate-800',
      iconContainer: 'bg-emerald-50 text-emerald-600',
      textMuted: 'text-slate-600',
      border: 'border-slate-100'
    },
    purple: {
      bg: 'bg-white text-slate-800',
      iconContainer: 'bg-purple-50 text-purple-600',
      textMuted: 'text-slate-600',
      border: 'border-slate-100'
    },
    aqua: {
      bg: 'bg-white text-slate-800',
      iconContainer: 'bg-aqua-50 text-aqua-600',
      textMuted: 'text-slate-600',
      border: 'border-slate-100'
    },
    rose: {
      bg: 'bg-white text-slate-800',
      iconContainer: 'bg-rose-50 text-rose-600',
      textMuted: 'text-slate-600',
      border: 'border-slate-100'
    },
    amber: {
      bg: 'bg-white text-slate-800',
      iconContainer: 'bg-amber-50 text-amber-500',
      textMuted: 'text-slate-600',
      border: 'border-slate-100'
    }
  };

  const selectedColor = colorStyles[color];

  return (
    <div className={`flex flex-col justify-between p-6 rounded-2xl border ${selectedColor.bg} ${selectedColor.border} shadow-premium hover:shadow-premiumHover hover:border-slate-200/50 transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${selectedColor.textMuted}`}>{title}</p>
          <h3 className="text-2xl font-bold mt-2 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${selectedColor.iconContainer}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {(subtext || trend) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span className={`font-bold px-1.5 py-0.5 rounded ${
              trend.type === 'positive' ? 'bg-emerald-50 text-emerald-600' :
              trend.type === 'negative' ? 'bg-rose-50 text-rose-500' :
              'bg-slate-100 text-slate-500'
            }`}>
              {trend.value}
            </span>
          )}
          {subtext && <span className={selectedColor.textMuted}>{subtext}</span>}
        </div>
      )}
    </div>
  );
};
