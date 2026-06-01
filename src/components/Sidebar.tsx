import React from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  Calendar, 
  CheckSquare, 
  Languages, 
  Dumbbell, 
  Target, 
  Briefcase,
  Map, 
  Compass, 
  Settings, 
  X,
  LogOut,
  Sparkles,
  Heart,
  Flower,
  Star,
  Smile,
  Shield,
  Crown,
  Zap,
  Trophy,
  User,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getThemeStyles } from '../utils/theme';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  isOpen, 
  setIsOpen,
  onLogout
}) => {
  const { settings } = useApp();
  const theme = settings.theme || 'femenino';
  const styles = getThemeStyles(theme);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'finanzas', name: 'Finanzas', icon: DollarSign },
    { id: 'calendario', name: 'Calendario', icon: Calendar },
    { id: 'habitos', name: 'Hábitos', icon: CheckSquare },
    { id: 'focus-plans', name: 'Mis Enfoques', icon: Target },
    { id: 'proyecto-4m', name: 'Proyectos & CRM', icon: Briefcase },
    { id: 'weekend', name: 'Fines de Semana', icon: Compass },
    { id: 'metas-6m', name: 'Metas 6 Meses', icon: Map },
    { id: 'configuracion', name: 'Configuración', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 ${styles.sidebarBg} border-r ${styles.sidebarBorder} transition-all duration-300 transform lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header/Logo */}
        <div className={`flex items-center justify-between px-6 py-6 border-b ${styles.sidebarHeaderBorder}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-xl text-navy-800 shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">PLAN 360</h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Plataforma Privada</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg lg:hidden focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User profile brief card */}
        <div className={`px-6 py-4 border-b ${styles.sidebarHeaderBorder} flex items-center gap-3 bg-white/5`}>
          {(() => {
            const className = "w-10 h-10 rounded-xl border border-white/20 shadow-sm shrink-0";
            const initials = settings.username ? settings.username.substring(0, 2).toUpperCase() : 'KA';
            const profilePic = settings.profilePic;

            if (profilePic && !profilePic.startsWith('icon:')) {
              return (
                <img 
                  src={profilePic} 
                  alt={settings.username} 
                  className={`${className} object-cover`}
                />
              );
            }

            const iconName = profilePic && profilePic.startsWith('icon:') ? profilePic.replace('icon:', '') : '';
            let IconComp = null;
            switch (iconName) {
              case 'Sparkles': IconComp = Sparkles; break;
              case 'Heart': IconComp = Heart; break;
              case 'Flower': IconComp = Flower; break;
              case 'Star': IconComp = Star; break;
              case 'Smile': IconComp = Smile; break;
              case 'Shield': IconComp = Shield; break;
              case 'Crown': IconComp = Crown; break;
              case 'Zap': IconComp = Zap; break;
              case 'Trophy': IconComp = Trophy; break;
              case 'Target': IconComp = Target; break;
              case 'User': IconComp = User; break;
              case 'UserCheck': IconComp = UserCheck; break;
            }

            if (IconComp) {
              return (
                <div className={`${className} flex items-center justify-center text-white ${styles.userInitialsBg}`}>
                  <IconComp className="w-5 h-5" />
                </div>
              );
            }

            return (
              <div className={`${className} flex items-center justify-center font-bold text-sm text-white ${styles.userInitialsBg}`}>
                {initials}
              </div>
            );
          })()}
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white leading-tight truncate">{settings.username || 'Kari'}</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`px-1.5 py-0.2 rounded-md text-[8px] font-black uppercase tracking-wider ${styles.sidebarBadge}`}>
                PLAN {settings.subscriptionPlan || 'Pro'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive 
                    ? styles.activeNavItem 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className={`p-4 mx-4 mb-3 rounded-2xl bg-white/5 border ${styles.sidebarHeaderBorder}`}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse-soft ${styles.sidebarBadgeDot}`} />
            <div>
              <p className="text-[10px] font-semibold text-white uppercase tracking-wider">Plan de 6 Meses</p>
              <p className="text-[9px] text-slate-400">Mayo - Noviembre 2026</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className={`px-4 py-2 border-t ${styles.sidebarHeaderBorder} mb-4`}>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
