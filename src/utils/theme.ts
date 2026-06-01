// Theme mappings for PLAN 360 (Femenino vs Masculino variants)
export type ThemeType = 'femenino' | 'femenino-rosa' | 'masculino' | 'masculino-oscuro';

export interface ThemeStyles {
  sidebarBg: string;
  sidebarBorder: string;
  sidebarHeaderBorder: string;
  sidebarBadge: string;
  sidebarBadgeDot: string;
  activeNavItem: string;
  primaryBtn: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  secondaryText: string;
  secondaryBg: string;
  cardPill: string;
  cardPillActive: string;
  userInitialsBg: string;
  progressColor: 'emerald' | 'purple' | 'aqua' | 'rose' | 'amber' | 'navy';
  progressColorSecondary: 'emerald' | 'purple' | 'aqua' | 'rose' | 'amber' | 'navy';
  chartColors: string[];
}

export const getThemeStyles = (theme: ThemeType): ThemeStyles => {
  switch (theme) {
    case 'femenino-rosa':
      return {
        sidebarBg: 'bg-rose-950 border-rose-900 text-rose-100',
        sidebarBorder: 'border-rose-900',
        sidebarHeaderBorder: 'border-rose-800/40',
        sidebarBadge: 'bg-pink-500/10 text-pink-300 border border-pink-500/20',
        sidebarBadgeDot: 'bg-pink-400',
        activeNavItem: 'bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-500/10 font-semibold',
        primaryBtn: 'bg-rose-900 hover:bg-rose-950 text-white focus:ring-rose-900/20 active:scale-[0.98] shadow-sm',
        accentText: 'text-pink-600',
        accentBg: 'bg-pink-50',
        accentBorder: 'border-pink-100',
        secondaryText: 'text-cyan-600',
        secondaryBg: 'bg-cyan-50',
        cardPill: 'bg-slate-100 text-slate-600 hover:bg-slate-200/50',
        cardPillActive: 'bg-rose-900 text-white shadow-sm',
        userInitialsBg: 'bg-rose-900',
        progressColor: 'rose',
        progressColorSecondary: 'aqua',
        chartColors: ['#4c0519', '#EC4899', '#06B6D4', '#F43F5E', '#10B981', '#8B5CF6', '#64748B']
      };
      
    case 'masculino':
      return {
        sidebarBg: 'bg-slate-900 border-slate-950 text-slate-300',
        sidebarBorder: 'border-slate-800',
        sidebarHeaderBorder: 'border-slate-800/80',
        sidebarBadge: 'bg-blue-900/30 text-blue-400 border border-blue-800/30',
        sidebarBadgeDot: 'bg-blue-500',
        activeNavItem: 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg shadow-blue-500/10 font-semibold',
        primaryBtn: 'bg-slate-800 hover:bg-slate-900 text-white border-slate-700/80 focus:ring-slate-800/20 active:scale-[0.98] shadow-sm',
        accentText: 'text-blue-500',
        accentBg: 'bg-blue-50',
        accentBorder: 'border-blue-100',
        secondaryText: 'text-amber-600',
        secondaryBg: 'bg-amber-50',
        cardPill: 'bg-slate-100 text-slate-600 hover:bg-slate-200/50',
        cardPillActive: 'bg-slate-800 text-white shadow-sm',
        userInitialsBg: 'bg-slate-800',
        progressColor: 'navy',
        progressColorSecondary: 'amber',
        chartColors: ['#1e293b', '#2563EB', '#D97706', '#0EA5E9', '#10B981', '#EF4444', '#64748B']
      };

    case 'masculino-oscuro':
      return {
        sidebarBg: 'bg-slate-950 border-slate-950 text-slate-400',
        sidebarBorder: 'border-slate-900',
        sidebarHeaderBorder: 'border-slate-900/60',
        sidebarBadge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        sidebarBadgeDot: 'bg-amber-400',
        activeNavItem: 'bg-gradient-to-r from-amber-600 to-amber-500 text-black shadow-lg shadow-amber-500/10 font-bold',
        primaryBtn: 'bg-amber-500 hover:bg-amber-600 text-black focus:ring-amber-500/20 active:scale-[0.98] shadow-sm',
        accentText: 'text-amber-500',
        accentBg: 'bg-amber-500/5',
        accentBorder: 'border-amber-500/20',
        secondaryText: 'text-emerald-500',
        secondaryBg: 'bg-emerald-500/5',
        cardPill: 'bg-slate-800/40 text-slate-350 hover:bg-slate-800/80 border border-slate-700/20',
        cardPillActive: 'bg-amber-500 text-black font-bold shadow-sm',
        userInitialsBg: 'bg-amber-500 text-black',
        progressColor: 'amber',
        progressColorSecondary: 'emerald',
        chartColors: ['#090d16', '#EAB308', '#10B981', '#94A3B8', '#EF4444', '#06B6D4', '#8B5CF6']
      };

    case 'femenino':
    default:
      return {
        sidebarBg: 'bg-navy-800 border-navy-900 text-slate-300',
        sidebarBorder: 'border-navy-900',
        sidebarHeaderBorder: 'border-navy-700/50',
        sidebarBadge: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
        sidebarBadgeDot: 'bg-emerald-400',
        activeNavItem: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/15 font-semibold',
        primaryBtn: 'bg-navy-800 hover:bg-navy-900 text-white focus:ring-navy-800/20 active:scale-[0.98] shadow-sm',
        accentText: 'text-emerald-600',
        accentBg: 'bg-emerald-50',
        accentBorder: 'border-emerald-100',
        secondaryText: 'text-purple-650',
        secondaryBg: 'bg-purple-50',
        cardPill: 'bg-slate-100 text-slate-600 hover:bg-slate-200/50',
        cardPillActive: 'bg-navy-800 text-white shadow-sm',
        userInitialsBg: 'bg-navy-800',
        progressColor: 'emerald',
        progressColorSecondary: 'purple',
        chartColors: ['#0B1B3D', '#10B981', '#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#EC4899', '#64748B']
      };
  }
};
