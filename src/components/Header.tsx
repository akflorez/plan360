import React from 'react';
import { 
  Menu, 
  Calendar as CalendarIcon,
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
  UserCheck,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getThemeStyles } from '../utils/theme';

interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { settings } = useApp();
  const theme = settings.theme || 'femenino';
  const styles = getThemeStyles(theme);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const dateStr = new Date().toLocaleDateString('es-ES', options);
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Mobile Menu button & Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-500 rounded-xl hover:bg-slate-100 hover:text-slate-800 lg:hidden focus:outline-none focus:ring-2 focus:ring-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {getGreeting()}, {settings.username || 'Kari'}! ✨
          </h2>
          <p className="hidden sm:block text-xs text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
            Tu enfoque crea tu realidad • Plan de 6 meses
          </p>
        </div>
      </div>

      {/* Date & User Info */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/60 border border-slate-200/50 text-slate-600 text-xs font-medium">
          <CalendarIcon className={`w-4 h-4 ${styles.accentText}`} />
          <span>{getFormattedDate()}</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 bg-slate-50 border border-slate-150 rounded-xl">
          {(() => {
            const className = "w-7 h-7 rounded-lg border border-slate-200/80 shadow-sm shrink-0";
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
                  <IconComp className="w-3.5 h-3.5" />
                </div>
              );
            }

            return (
              <div className={`${className} flex items-center justify-center font-bold text-xs text-white ${styles.userInitialsBg}`}>
                {initials}
              </div>
            );
          })()}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[80px]">{settings.username || 'Kari'}</p>
            <p className={`text-[8px] font-black uppercase leading-tight tracking-wider ${styles.accentText}`}>
              {settings.subscriptionPlan || 'Pro'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
