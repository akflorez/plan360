import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getThemeStyles } from '../utils/theme';
import { 
  Settings, 
  Save, 
  Trash2, 
  Plus, 
  Download, 
  Upload, 
  RefreshCw,
  Info,
  X,
  CreditCard,
  Check,
  User,
  ShieldCheck,
  Camera,
  Palette,
  Sparkles,
  Heart,
  Shield,
  Crown,
  Flower,
  Star,
  Smile,
  Zap,
  Trophy,
  Target,
  UserCheck
} from 'lucide-react';

export const Configuracion: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useApp();
  const theme = settings.theme || 'femenino';
  const styles = getThemeStyles(theme);

  // Configuration Tabs: 'profile' | 'subscription' | 'data'
  const [activeConfigTab, setActiveConfigTab] = useState<'profile' | 'subscription' | 'data'>('profile');
  
  // Local Settings form state
  const [username, setUsername] = useState(settings.username);
  const [currency, setCurrency] = useState(settings.currency);
  const [extraIncomeGoal, setExtraIncomeGoal] = useState(settings.extraIncomeGoal.toString());
  const [dailyEnglishGoal, setDailyEnglishGoal] = useState(settings.dailyEnglishGoal.toString());
  const [weeklyGymGoal, setWeeklyGymGoal] = useState(settings.weeklyGymGoal.toString());
  const [weeklyRunningGoal, setWeeklyRunningGoal] = useState(settings.weeklyRunningGoal.toString());
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthlyBudget.toString());
  
  // Theme state
  const [selectedTheme, setSelectedTheme] = useState<'femenino' | 'femenino-rosa' | 'masculino' | 'masculino-oscuro'>(settings.theme || 'femenino');

  const handleSelectTheme = (newTheme: 'femenino' | 'femenino-rosa' | 'masculino' | 'masculino-oscuro') => {
    setSelectedTheme(newTheme);
    updateSettings({
      ...settings,
      theme: newTheme
    });
  };
  
  // Avatar upload local state
  const [profilePic, setProfilePic] = useState<string>(settings.profilePic || '');
  const [isUploading, setIsUploading] = useState(false);

  // Category operations local state
  const [categories, setCategories] = useState<string[]>(settings.customCategories || []);
  const [newCategory, setNewCategory] = useState('');

  // Account operations local state
  const [accounts, setAccounts] = useState<string[]>(settings.customAccounts || ['Bancolombia', 'Nequi', 'Daviplata', 'Efectivo', 'Tarjeta de Crédito']);
  const [newAccount, setNewAccount] = useState('');

  // Handle avatar upload converting file to Base64 and compressing via Canvas
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onerror = () => {
      alert('Error al leer el archivo. Inténtalo de nuevo con otra imagen.');
      setIsUploading(false);
    };
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        alert('Error al cargar la imagen. Asegúrate de que es un formato de imagen válido (PNG, JPG, WebP).');
        setIsUploading(false);
      };
      img.onload = () => {
        try {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          
          // Define maximum avatar dimensions (400x400 px for a crisp look, while keeping compressed size ~30KB)
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          // Resize calculation maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            
            // Export as compressed JPEG (75% quality) which shrinks files from 10MB to ~30KB
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
            setProfilePic(compressedBase64);
          }
        } catch (err) {
          console.error(err);
          alert('Hubo un inconveniente al optimizar la imagen.');
        } finally {
          setIsUploading(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePic = () => {
    setProfilePic('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    updateSettings({
      username: username.trim(),
      currency,
      extraIncomeGoal: Number(extraIncomeGoal) || 4000000,
      dailyEnglishGoal: Number(dailyEnglishGoal) || 1,
      weeklyGymGoal: Number(weeklyGymGoal) || 4,
      weeklyRunningGoal: Number(weeklyRunningGoal) || 20,
      monthlyBudget: Number(monthlyBudget) || 3500000,
      customCategories: categories,
      customAccounts: accounts,
      theme: selectedTheme,
      profilePic: profilePic,
      subscriptionPlan: settings.subscriptionPlan || 'Pro',
      subscriptionRenewal: settings.subscriptionRenewal || '2026-11-30',
      subscriptionStatus: settings.subscriptionStatus || 'Activa'
    });

    alert('Configuraciones y perfil guardados correctamente. Los cambios visuales se aplicarán de inmediato.');
  };

  // Category addition
  const handleAddCategory = () => {
    if (!newCategory.trim() || categories.includes(newCategory.trim())) return;
    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    setNewCategory('');
  };

  const handleRemoveCategory = (catToRemove: string) => {
    if (categories.length <= 3) {
      alert('Debes mantener al menos 3 categorías para el correcto funcionamiento de los formularios.');
      return;
    }
    const updated = categories.filter(c => c !== catToRemove);
    setCategories(updated);
  };

  // Account addition
  const handleAddAccount = () => {
    if (!newAccount.trim() || accounts.includes(newAccount.trim())) return;
    const updated = [...accounts, newAccount.trim()];
    setAccounts(updated);
    setNewAccount('');
  };

  const handleRemoveAccount = (accToRemove: string) => {
    if (accounts.length <= 1) {
      alert('Debes mantener al menos 1 cuenta financiera.');
      return;
    }
    const updated = accounts.filter(a => a !== accToRemove);
    setAccounts(updated);
  };

  // Mock Subscription activation
  const handleActivatePlan = (plan: 'Gratuito' | 'Pro' | 'Premium') => {
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1); // 1 month renewal
    const formattedRenewal = renewalDate.toISOString().split('T')[0];

    updateSettings({
      ...settings,
      subscriptionPlan: plan,
      subscriptionRenewal: plan === 'Gratuito' ? 'Ilimitado' : formattedRenewal,
      subscriptionStatus: 'Activa'
    });

    alert(`¡Suscripción actualizada correctamente al plan ${plan.toUpperCase()}!`);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const data: Record<string, string | null> = {};
    const keys = [
      'kari_360_settings', 'kari_360_transactions', 'kari_360_habits', 
      'kari_360_events', 'kari_360_focusPlans', 'kari_360_focusSessions', 
      'kari_360_prospects', 'kari_360_roadmaps', 
      'kari_360_weekendPlans'
    ];
    keys.forEach(k => {
      data[k] = localStorage.getItem(k);
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Plan_360_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        Object.entries(parsed).forEach(([key, val]) => {
          if (val) localStorage.setItem(key, val as string);
        });
        alert('Copia de seguridad restaurada correctamente. Recargando la aplicación...');
        window.location.reload();
      } catch (err) {
        alert('Error al leer el archivo de copia de seguridad.');
      }
    };
    fileReader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('¿Estás COMPLETAMENTE segura de restablecer todos tus datos? Perderás todo el historial registrado.')) {
      resetAllData();
      alert('Datos restablecidos a valores de fábrica.');
      window.location.reload();
    }
  };

  // High contrast active tab class helper
  const getTabClass = (tabId: typeof activeConfigTab) => {
    if (activeConfigTab === tabId) {
      return "bg-slate-800 text-white font-bold px-5 py-2 rounded-xl shadow-sm";
    }
    return "text-slate-650 hover:text-slate-900 font-semibold px-5 py-2 rounded-xl transition-all";
  };

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-premium">
        <div className="p-2.5 bg-navy-50 text-navy-800 rounded-xl">
          <Settings className={`w-5 h-5 ${styles.accentText}`} />
        </div>
        <div className="text-left">
          <h2 className="text-base font-bold text-navy-800">Panel de Configuración</h2>
          <p className="text-xs text-slate-600">Ajusta tus perfiles, selecciona plantillas de diseño y administra tu suscripción.</p>
        </div>
      </div>

      {/* Internal Navigation Tabs (High Contrast Pill Container) */}
      <div className="inline-flex gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 text-xs">
        <button
          onClick={() => setActiveConfigTab('profile')}
          className={getTabClass('profile')}
        >
          Mi Perfil y Plantillas
        </button>
        <button
          onClick={() => setActiveConfigTab('subscription')}
          className={getTabClass('subscription')}
        >
          Mi Suscripción (SaaS)
        </button>
        <button
          onClick={() => setActiveConfigTab('data')}
          className={getTabClass('data')}
        >
          Categorías y Copias
        </button>
      </div>

      {/* TAB RENDERING */}
      {activeConfigTab === 'profile' && (
        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          <div className="lg:col-span-2 glass-card p-6 bg-white space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-slate-800" />
              Ajustes del Perfil
            </h3>

            {/* Profile Avatar Upload block */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="relative">
                {(() => {
                  const sizeClass = "w-20 h-20 rounded-2xl border-2 border-white shadow-md flex items-center justify-center text-white";
                  if (profilePic && !profilePic.startsWith('icon:')) {
                    return (
                      <img 
                        src={profilePic} 
                        alt="Perfil" 
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
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
                    case 'User': IconComp = User; break;
                    case 'UserCheck': IconComp = UserCheck; break;
                  }

                  if (IconComp) {
                    return (
                      <div className={`${sizeClass} ${styles.userInitialsBg}`}>
                        <IconComp className="w-10 h-10" />
                      </div>
                    );
                  }

                  return (
                    <div className={`${sizeClass} ${styles.userInitialsBg} font-black text-xl`}>
                      {username ? username.substring(0, 2).toUpperCase() : 'KA'}
                    </div>
                  );
                })()}
                {/* Upload trigger */}
                <label className="absolute bottom-[-6px] right-[-6px] p-1.5 bg-slate-800 hover:bg-slate-900 rounded-full text-white border border-slate-700 cursor-pointer shadow-sm">
                  {isUploading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Camera className="w-3.5 h-3.5" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    disabled={isUploading}
                  />
                </label>
              </div>
              <div className="space-y-1.5 text-center sm:text-left">
                <h4 className="text-xs font-bold text-slate-800">Foto de Perfil o Avatar</h4>
                <p className="text-[10px] text-slate-600">Puedes subir imágenes de <b>cualquier tamaño</b> (incluso fotos pesadas de cámaras de 10MB o más). Se optimizarán y comprimirán localmente en tu navegador de forma instantánea.</p>
                {profilePic && (
                  <button
                    type="button"
                    onClick={handleRemovePic}
                    className="px-2.5 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold border border-rose-200 mt-2 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Quitar Foto / Avatar
                  </button>
                )}
              </div>
            </div>

            {/* Preset Icons Selection Grid */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800">¿Prefieres un ícono en vez de una foto?</h4>
                <p className="text-[10px] text-slate-600">Selecciona uno de los siguientes avatares diseñados para tu línea visual:</p>
              </div>
              
              <div className="space-y-3">
                {/* Feminine Icons */}
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-pink-600 uppercase tracking-wider">Avatares Femeninos</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Sparkles', icon: Sparkles, label: 'Brillo' },
                      { name: 'Heart', icon: Heart, label: 'Corazón' },
                      { name: 'Flower', icon: Flower, label: 'Flor' },
                      { name: 'Star', icon: Star, label: 'Estrella' },
                      { name: 'Smile', icon: Smile, label: 'Sonrisa' },
                      { name: 'User', icon: User, label: 'Perfil' }
                    ].map(item => {
                      const Icon = item.icon;
                      const isSelected = profilePic === `icon:${item.name}`;
                      return (
                        <button
                          type="button"
                          key={item.name}
                          onClick={() => setProfilePic(`icon:${item.name}`)}
                          className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
                            isSelected 
                              ? 'border-pink-500 bg-pink-100/50 text-pink-700 shadow-sm' 
                              : 'border-slate-200 bg-white hover:border-slate-350 text-slate-500 hover:text-slate-750'
                          }`}
                          title={item.label}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[8px] font-bold uppercase">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Masculine Icons */}
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Avatares Masculinos</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Shield', icon: Shield, label: 'Escudo' },
                      { name: 'Crown', icon: Crown, label: 'Corona' },
                      { name: 'Zap', icon: Zap, label: 'Poder' },
                      { name: 'Trophy', icon: Trophy, label: 'Trofeo' },
                      { name: 'Target', icon: Target, label: 'Foco' },
                      { name: 'UserCheck', icon: UserCheck, label: 'Perfil' }
                    ].map(item => {
                      const Icon = item.icon;
                      const isSelected = profilePic === `icon:${item.name}`;
                      return (
                        <button
                          type="button"
                          key={item.name}
                          onClick={() => setProfilePic(`icon:${item.name}`)}
                          className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-100/40 text-blue-700 shadow-sm' 
                              : 'border-slate-200 bg-white hover:border-slate-350 text-slate-500 hover:text-slate-750'
                          }`}
                          title={item.label}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[8px] font-bold uppercase">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* General Information Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nombre de Usuario</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Moneda Principal</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="form-input"
                >
                  <option value="COP">COP ($ Pesos Colombianos)</option>
                  <option value="USD">USD ($ Dólares)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Presupuesto Mensual de Egresos</label>
                <input
                  type="number"
                  required
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="form-input font-bold"
                />
              </div>
              <div>
                <label className="form-label">Meta Mensual Ingresos Extra</label>
                <input
                  type="number"
                  required
                  value={extraIncomeGoal}
                  onChange={(e) => setExtraIncomeGoal(e.target.value)}
                  className="form-input font-bold text-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100/60 pt-4">
              <div>
                <label className="form-label">Inglés Diario (Horas)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={dailyEnglishGoal}
                  onChange={(e) => setDailyEnglishGoal(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Gym Semanal (Sesiones)</label>
                <input
                  type="number"
                  required
                  value={weeklyGymGoal}
                  onChange={(e) => setWeeklyGymGoal(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Running Semanal (Km)</label>
                <input
                  type="number"
                  required
                  value={weeklyRunningGoal}
                  onChange={(e) => setWeeklyRunningGoal(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Theme Selector with swatches, names and icons */}
          <div className="glass-card p-6 bg-white space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
                <Palette className="w-4.5 h-4.5 text-slate-800 animate-pulse-soft" />
                Línea Visual y Colores
              </h3>
              <p className="text-xs text-slate-600">Escoge una de las plantillas con su paleta de colores e íconos representativos.</p>

              <div className="space-y-3.5">
                {/* 1. Femenina Esmeralda */}
                <div 
                  onClick={() => handleSelectTheme('femenino')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2.5 ${
                    selectedTheme === 'femenino' 
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-sm' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-navy-800 text-white rounded-lg">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs font-bold text-navy-800">Femenina Esmeralda</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedTheme === 'femenino' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-350'
                    }`}>
                      {selectedTheme === 'femenino' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-600 font-medium">Azul marino, esmeralda y lavanda.</p>
                    <div className="flex gap-1 shrink-0">
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#0B1B3D]" />
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#10B981]" />
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#8B5CF6]" />
                    </div>
                  </div>
                </div>

                {/* 2. Femenina Rosa & Aqua */}
                <div 
                  onClick={() => handleSelectTheme('femenino-rosa')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2.5 ${
                    selectedTheme === 'femenino-rosa' 
                      ? 'border-pink-500 bg-pink-50/20 shadow-sm' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-rose-900 text-white rounded-lg">
                        <Heart className="w-3.5 h-3.5 text-pink-200 fill-pink-200" />
                      </div>
                      <p className="text-xs font-bold text-rose-900">Femenina Rosa & Aqua</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedTheme === 'femenino-rosa' ? 'border-pink-500 bg-pink-500 text-white' : 'border-slate-350'
                    }`}>
                      {selectedTheme === 'femenino-rosa' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-600 font-medium">Frambuesa profundo, rosa y cian.</p>
                    <div className="flex gap-1 shrink-0">
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#4C0519]" />
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#EC4899]" />
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#06B6D4]" />
                    </div>
                  </div>
                </div>

                {/* 3. Masculina Cobalto */}
                <div 
                  onClick={() => handleSelectTheme('masculino')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2.5 ${
                    selectedTheme === 'masculino' 
                      ? 'border-blue-600 bg-blue-50/15 shadow-sm' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-800 text-white rounded-lg">
                        <Shield className="w-3.5 h-3.5 text-blue-300" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">Masculina Cobalto</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedTheme === 'masculino' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-350'
                    }`}>
                      {selectedTheme === 'masculino' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-600 font-medium">Gris pizarra, azul cobalto y ámbar.</p>
                    <div className="flex gap-1 shrink-0">
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#1E293B]" />
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#2563EB]" />
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#D97706]" />
                    </div>
                  </div>
                </div>

                {/* 4. Masculina Obsidian & Oro */}
                <div 
                  onClick={() => handleSelectTheme('masculino-oscuro')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-2.5 ${
                    selectedTheme === 'masculino-oscuro' 
                      ? 'border-amber-500 bg-amber-50/10 shadow-sm' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-950 text-white rounded-lg">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <p className="text-xs font-bold text-slate-900">Masculina Obsidian & Oro</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedTheme === 'masculino-oscuro' ? 'border-amber-500 bg-amber-500 text-black' : 'border-slate-350'
                    }`}>
                      {selectedTheme === 'masculino-oscuro' && <Check className="w-2.5 h-2.5 stroke-[3] text-black" />}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-600 font-medium">Negro obsidiana, oro y esmeralda.</p>
                    <div className="flex gap-1 shrink-0">
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#090D16]" />
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#EAB308]" />
                      <span className="w-3 h-3 rounded-full border border-white shadow-sm bg-[#10B981]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full btn-primary text-xs flex items-center justify-center gap-2 mt-4">
              <Save className="w-4 h-4" />
              <span>Guardar Perfil y Plantilla</span>
            </button>
          </div>
        </form>
      )}

      {activeConfigTab === 'subscription' && (
        <div className="space-y-8 text-left">
          {/* Current Subscription Status */}
          <div className="glass-card p-6 bg-white flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Estado de Suscripción</p>
                <h4 className="text-lg font-black text-slate-800 flex items-center gap-2 mt-0.5">
                  Plan {settings.subscriptionPlan || 'Pro'}
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {settings.subscriptionStatus || 'Activa'}
                  </span>
                </h4>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Próxima fecha de renovación: <span className="font-semibold text-slate-600">{settings.subscriptionRenewal || '2026-11-30'}</span>
                </p>
              </div>
            </div>
            <div className="text-xs bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 font-medium max-w-xs leading-normal">
              💳 Tarjeta terminada en 4589 • $29.900 COP / mes
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-navy-800">Suscripciones PLAN 360</h3>
              <p className="text-xs text-slate-600">Escoge el plan idóneo para organizar tus próximos 6 meses.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gratuito */}
              <div className={`p-6 rounded-3xl border-2 bg-white flex flex-col justify-between space-y-6 ${
                settings.subscriptionPlan === 'Gratuito' ? 'border-emerald-500 shadow-premiumHover' : 'border-slate-200'
              }`}>
                <div className="space-y-3">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">PLAN FREE</span>
                  <h3 className="text-lg font-bold text-slate-800">Básico Gratuito</h3>
                  <div className="text-3xl font-black text-slate-800">$0 <span className="text-xs text-slate-600 font-normal">COP/mes</span></div>
                  <p className="text-[10px] text-slate-600">Acceso básico a bitácoras de hábitos y finanzas personales.</p>
                  
                  <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4 font-medium">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Registro de Finanzas</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Seguimiento de Hábitos</li>
                    <li className="flex items-center gap-1.5 text-slate-350"><X className="w-3.5 h-3.5" /> Gráficas e Indicadores Recharts</li>
                    <li className="flex items-center gap-1.5 text-slate-350"><X className="w-3.5 h-3.5" /> CRM de Clientes e Inglés</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleActivatePlan('Gratuito')}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.subscriptionPlan === 'Gratuito' 
                      ? 'bg-emerald-50 text-emerald-700 font-black border border-emerald-200' 
                      : 'btn-secondary'
                  }`}
                >
                  {settings.subscriptionPlan === 'Gratuito' ? 'Activo Actualmente' : 'Activar Básico'}
                </button>
              </div>

              {/* Pro (Recommended) */}
              <div className={`p-6 rounded-3xl border-2 bg-white relative flex flex-col justify-between space-y-6 ${
                settings.subscriptionPlan === 'Pro' ? 'border-emerald-500 shadow-premiumHover' : 'border-slate-200 shadow-premium'
              }`}>
                <div className="absolute top-[-10px] right-6 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm shadow-emerald-500/10">
                  RECOMENDADO
                </div>
                
                <div className="space-y-3">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">PLAN PRO</span>
                  <h3 className="text-lg font-bold text-slate-800">Control Pro</h3>
                  <div className="text-3xl font-black text-slate-800">$29.900 <span className="text-xs text-slate-600 font-normal">COP/mes</span></div>
                  <p className="text-[10px] text-slate-600">Completo para llevar registro de tu vida personal y profesional.</p>
                  
                  <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4 font-medium">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Registro de Finanzas y Hábitos</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> CRM Proyecto $4M completo</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Bitácora de Inglés y Deporte</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Gráficas interactivas Recharts</li>
                  </ul>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleActivatePlan('Pro')}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.subscriptionPlan === 'Pro' 
                      ? 'bg-emerald-50 text-emerald-700 font-black border border-emerald-200' 
                      : 'btn-primary'
                  }`}
                >
                  {settings.subscriptionPlan === 'Pro' ? 'Activo Actualmente' : 'Actualizar a Pro'}
                </button>
              </div>

              {/* Premium Elite */}
              <div className={`p-6 rounded-3xl border-2 bg-white flex flex-col justify-between space-y-6 ${
                settings.subscriptionPlan === 'Premium' ? 'border-emerald-500 shadow-premiumHover' : 'border-slate-200'
              }`}>
                <div className="space-y-3">
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full">PLAN ELITE</span>
                  <h3 className="text-lg font-bold text-slate-800">Elite 360</h3>
                  <div className="text-3xl font-black text-slate-800">$49.900 <span className="text-xs text-slate-600 font-normal">COP/mes</span></div>
                  <p className="text-[10px] text-slate-600">Soporte prioritize, multi-usuario y backups en la nube automatizados.</p>
                  
                  <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-100 pt-4 font-medium">
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Todo lo incluido en el Plan Pro</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Respaldos Cloud en Tiempo Real</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Soporte personalizado 24/7</li>
                    <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Consultoría mensual de dashboards</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleActivatePlan('Premium')}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.subscriptionPlan === 'Premium' 
                      ? 'bg-emerald-50 text-emerald-700 font-black border border-emerald-200' 
                      : 'btn-secondary'
                  }`}
                >
                  {settings.subscriptionPlan === 'Premium' ? 'Activo Actualmente' : 'Actualizar a Elite'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeConfigTab === 'data' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Custom Categories and Accounts stack */}
          <div className="lg:col-span-2 space-y-6">
            {/* Custom Categories Card */}
            <div className="glass-card p-6 bg-white space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">Categorías de Finanzas</h3>
              </div>

              {/* Add Category Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva categoría..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-350 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className={`p-2 text-white rounded-xl hover:brightness-95 transition-colors cursor-pointer ${styles.userInitialsBg}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Categories pills container */}
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                {categories.map(cat => (
                  <div 
                    key={cat}
                    className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-255 text-[10px] font-bold text-slate-650 flex items-center gap-1.5"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      className="text-slate-650 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Accounts Card */}
            <div className="glass-card p-6 bg-white space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">Cuentas Financieras (Bancos, Nequi, etc.)</h3>
              </div>

              {/* Add Account Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva cuenta (ej: Nequi, Daviplata)..."
                  value={newAccount}
                  onChange={(e) => setNewAccount(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-350 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddAccount}
                  className={`p-2 text-white rounded-xl hover:brightness-95 transition-colors cursor-pointer ${styles.userInitialsBg}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Accounts pills container */}
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                {accounts.map(acc => (
                  <div 
                    key={acc}
                    className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-255 text-[10px] font-bold text-slate-650 flex items-center gap-1.5"
                  >
                    <span>{acc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAccount(acc)}
                      className="text-slate-650 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button for Categories and Accounts */}
            <button
              type="button"
              onClick={() => {
                updateSettings({
                  ...settings,
                  customCategories: categories,
                  customAccounts: accounts
                });
                alert('Categorías y cuentas financieras guardadas con éxito.');
              }}
              className="w-full btn-primary text-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Categorías y Cuentas</span>
            </button>
          </div>

          {/* Backup Restore Card */}
          <div className="glass-card p-6 bg-white space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">Copia de Seguridad</h3>
              </div>
              
              <p className="text-[10px] text-slate-600 leading-normal flex items-start gap-1">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Los datos se guardan en el navegador. Si borras el historial o cambias de dispositivo, exporta tu copia de seguridad.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* Export backup */}
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="btn-secondary text-[10px] font-bold py-2 px-3 justify-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <Download className="w-4.5 h-4.5 text-slate-700" />
                  <span>Exportar JSON</span>
                </button>

                {/* Import backup */}
                <label
                  className="btn-secondary text-[10px] font-bold py-2 px-3 justify-center gap-1.5 cursor-pointer hover:bg-slate-50 border border-slate-200"
                >
                  <Upload className="w-4.5 h-4.5 text-slate-700" />
                  <span>Importar JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Restablecer Todo */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                className="w-full btn-danger text-[10px] font-bold py-2 px-3 justify-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 cursor-pointer"
              >
                <RefreshCw className="w-4.5 h-4.5" />
                <span>Restablecer Todo de Fábrica</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
