import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FocusPlan } from '../types';
import * as Icons from 'lucide-react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Award, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const IconComp = (Icons as any)[name];
  if (IconComp) {
    return <IconComp className={className} />;
  }
  return <Icons.Target className={className} />;
};

const availableIcons = [
  'Dumbbell', 'BookOpen', 'Languages', 'Target', 'Heart', 
  'Zap', 'Globe', 'Coffee', 'MessageCircle', 'Briefcase', 
  'Camera', 'Palette', 'Smile', 'Award', 'TrendingUp'
];

const availableColors: ('emerald' | 'indigo' | 'purple' | 'rose' | 'amber' | 'blue' | 'aqua')[] = [
  'emerald', 'indigo', 'purple', 'rose', 'amber', 'blue', 'aqua'
];

const colorStyles = {
  emerald: {
    bg: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    bar: 'bg-emerald-500',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    badge: 'bg-emerald-100 text-emerald-800',
    accentText: 'text-emerald-600',
    iconBg: 'bg-emerald-100 text-emerald-600'
  },
  indigo: {
    bg: 'bg-indigo-50 border-indigo-100 text-indigo-800',
    bar: 'bg-indigo-500',
    btn: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    badge: 'bg-indigo-100 text-indigo-800',
    accentText: 'text-indigo-600',
    iconBg: 'bg-indigo-100 text-indigo-600'
  },
  purple: {
    bg: 'bg-purple-50 border-purple-100 text-purple-800',
    bar: 'bg-purple-500',
    btn: 'bg-purple-600 hover:bg-purple-700 text-white',
    badge: 'bg-purple-100 text-purple-800',
    accentText: 'text-purple-600',
    iconBg: 'bg-purple-100 text-purple-600'
  },
  rose: {
    bg: 'bg-rose-50 border-rose-100 text-rose-800',
    bar: 'bg-rose-500',
    btn: 'bg-rose-600 hover:bg-rose-700 text-white',
    badge: 'bg-rose-100 text-rose-800',
    accentText: 'text-rose-600',
    iconBg: 'bg-rose-100 text-rose-600'
  },
  amber: {
    bg: 'bg-amber-50 border-amber-100 text-amber-800',
    bar: 'bg-amber-500',
    btn: 'bg-amber-600 hover:bg-amber-700 text-white',
    badge: 'bg-amber-100 text-amber-850',
    accentText: 'text-amber-650',
    iconBg: 'bg-amber-100 text-amber-600'
  },
  blue: {
    bg: 'bg-blue-50 border-blue-100 text-blue-800',
    bar: 'bg-blue-500',
    btn: 'bg-blue-600 hover:bg-blue-700 text-white',
    badge: 'bg-blue-100 text-blue-800',
    accentText: 'text-blue-600',
    iconBg: 'bg-blue-100 text-blue-600'
  },
  aqua: {
    bg: 'bg-teal-50 border-teal-100 text-teal-800',
    bar: 'bg-teal-500',
    btn: 'bg-teal-600 hover:bg-teal-700 text-white',
    badge: 'bg-teal-100 text-teal-800',
    accentText: 'text-teal-600',
    iconBg: 'bg-teal-100 text-teal-600'
  }
};

const presets = [
  {
    name: 'Estudio de Inglés',
    icon: 'Languages',
    color: 'purple' as const,
    target: 5,
    unit: 'horas',
    timeframeType: 'months' as const,
    timeframeValue: '6',
    description: 'Estudio enfocado en fluidez y preparación profesional.'
  },
  {
    name: 'Gimnasio & Fitness',
    icon: 'Dumbbell',
    color: 'emerald' as const,
    target: 4,
    unit: 'sesiones',
    timeframeType: 'months' as const,
    timeframeValue: '6',
    description: 'Entrenamientos semanales de fuerza y salud integral.'
  },
  {
    name: 'Correr (Running)',
    icon: 'Zap',
    color: 'blue' as const,
    target: 20,
    unit: 'km',
    timeframeType: 'months' as const,
    timeframeValue: '3',
    description: 'Rodajes de fondo y series semanales de running.'
  },
  {
    name: 'Hábito de Lectura',
    icon: 'BookOpen',
    color: 'rose' as const,
    target: 50,
    unit: 'páginas',
    timeframeType: 'months' as const,
    timeframeValue: '2',
    description: 'Lectura diaria para alimentar conocimientos.'
  },
  {
    name: 'Meditación & Foco',
    icon: 'Heart',
    color: 'indigo' as const,
    target: 60,
    unit: 'minutos',
    timeframeType: 'months' as const,
    timeframeValue: '1',
    description: 'Mindfulness para paz mental y reducción del estrés.'
  }
];

export const FocusPlans: React.FC = () => {
  const { focusPlans, focusSessions, addFocusPlan, deleteFocusPlan, addFocusSession, deleteFocusSession } = useApp();

  // Form states for custom plan
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Target');
  const [color, setColor] = useState<'emerald' | 'indigo' | 'purple' | 'rose' | 'amber' | 'blue' | 'aqua'>('emerald');
  const [target, setTarget] = useState('4');
  const [unit, setUnit] = useState('sesiones');
  const [timeframeType, setTimeframeType] = useState<'months' | 'date'>('months');
  const [timeframeValue, setTimeframeValue] = useState('3');

  // Logging progress state (indexed by planId)
  const [loggingVal, setLoggingVal] = useState<Record<string, string>>({});
  const [loggingDetails, setLoggingDetails] = useState<Record<string, string>>({});
  const [loggingNotes, setLoggingNotes] = useState<Record<string, string>>({});

  // Helpers to compute current week value
  const getWeeklyValue = (planId: string) => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    return focusSessions
      .filter(s => s.planId === planId && new Date(s.date) >= monday)
      .reduce((sum, s) => sum + Number(s.value || 0), 0);
  };

  // Helper to compute timeframe / countdown stats
  const getTimeframeStats = (plan: FocusPlan) => {
    const createdDate = new Date(plan.createdAt);
    const today = new Date();
    const diffTime = today.getTime() - createdDate.getTime();
    const daysElapsed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    let totalDays = 0;
    let daysLeft = 0;
    let progressPercent = 0;
    let deadlineStr = "";

    if (plan.timeframeType === 'months') {
      const months = parseInt(plan.timeframeValue) || 1;
      totalDays = months * 30;
      daysLeft = Math.max(0, totalDays - daysElapsed);
      progressPercent = totalDays > 0 ? Math.min((daysElapsed / totalDays) * 100, 100) : 0;
      
      const deadlineDate = new Date(createdDate);
      deadlineDate.setDate(deadlineDate.getDate() + totalDays);
      deadlineStr = deadlineDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } else {
      const targetDate = new Date(plan.timeframeValue);
      const totalTime = targetDate.getTime() - createdDate.getTime();
      totalDays = Math.max(1, Math.ceil(totalTime / (1000 * 60 * 60 * 24)));
      
      const timeLeft = targetDate.getTime() - today.getTime();
      daysLeft = Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));
      
      progressPercent = totalDays > 0 ? Math.min(((totalDays - daysLeft) / totalDays) * 100, 100) : 0;
      deadlineStr = targetDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    return { daysElapsed, totalDays, daysLeft, progressPercent, deadlineStr };
  };

  const handleCreateCustomPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !target || isNaN(Number(target)) || !unit.trim()) return;

    addFocusPlan({
      name: name.trim(),
      icon,
      color,
      target: Number(target),
      unit: unit.trim().toLowerCase(),
      timeframeType,
      timeframeValue
    });

    // Reset Form
    setName('');
    setIcon('Target');
    setColor('emerald');
    setTarget('4');
    setUnit('sesiones');
    setShowCreateForm(false);
  };

  const handleAddPreset = (p: typeof presets[0]) => {
    addFocusPlan({
      name: p.name,
      icon: p.icon,
      color: p.color,
      target: p.target,
      unit: p.unit,
      timeframeType: p.timeframeType,
      timeframeValue: p.timeframeValue
    });
  };

  const handleLogProgress = (planId: string, e: React.FormEvent) => {
    e.preventDefault();
    const val = loggingVal[planId];
    const details = loggingDetails[planId] || '';
    const notes = loggingNotes[planId] || '';

    if (!val || isNaN(Number(val))) return;

    addFocusSession({
      planId,
      date: new Date().toISOString().split('T')[0],
      value: Number(val),
      details: details.trim(),
      notes: notes.trim()
    });

    // Reset logging state for this plan
    setLoggingVal(prev => ({ ...prev, [planId]: '' }));
    setLoggingDetails(prev => ({ ...prev, [planId]: '' }));
    setLoggingNotes(prev => ({ ...prev, [planId]: '' }));
  };

  return (
    <div className="space-y-8">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800">Mis Enfoques y Metas</h2>
          <p className="text-xs text-slate-600">Diseña planes personalizados y registra tus avances de forma dinámica.</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary text-xs flex items-center gap-1.5 self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showCreateForm ? "Cerrar Creador" : "Crear Enfoque"}</span>
        </button>
      </div>

      {/* Preset and Creation Forms Section */}
      {showCreateForm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl animate-fade-in">
          {/* Quick Presets Gallery */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plantillas Rápidas</h4>
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {presets.map((p, idx) => {
                const styles = colorStyles[p.color];
                return (
                  <div 
                    key={idx} 
                    className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${styles.iconBg}`}>
                        <IconRenderer name={p.icon} className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h5 className="text-xs font-bold text-slate-850">{p.name}</h5>
                        <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">{p.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddPreset(p)}
                      className={`p-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${styles.btn}`}
                    >
                      Usar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Creation Form */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Metas Personalizadas</h4>
            <form onSubmit={handleCreateCustomPlan} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plan Name */}
                <div>
                  <label className="form-label">Nombre del Enfoque</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Preparar IELTS, Aprender React..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Target & Unit */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="form-label">Meta Semanal</label>
                    <input
                      type="number"
                      required
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Unidad</label>
                    <input
                      type="text"
                      required
                      placeholder="horas, km, etc"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plazo / Timeframe */}
                <div>
                  <label className="form-label">Plazo de Logro</label>
                  <div className="flex gap-2">
                    <select
                      value={timeframeType}
                      onChange={(e) => setTimeframeType(e.target.value as any)}
                      className="form-input w-2/5"
                    >
                      <option value="months">Meses</option>
                      <option value="date">Hasta Fecha</option>
                    </select>
                    {timeframeType === 'months' ? (
                      <select
                        value={timeframeValue}
                        onChange={(e) => setTimeframeValue(e.target.value)}
                        className="form-input flex-1"
                      >
                        <option value="1">1 Mes</option>
                        <option value="2">2 Meses</option>
                        <option value="3">3 Meses</option>
                        <option value="6">6 Meses</option>
                        <option value="12">12 Meses</option>
                      </select>
                    ) : (
                      <input
                        type="date"
                        required
                        value={timeframeValue}
                        onChange={(e) => setTimeframeValue(e.target.value)}
                        className="form-input flex-1"
                      />
                    )}
                  </div>
                </div>

                {/* Color Theme Selector */}
                <div>
                  <label className="form-label">Color de Tarjeta</label>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {availableColors.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setColor(col)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          color === col ? 'scale-110 border-slate-700 shadow-md' : 'border-transparent'
                        } ${colorStyles[col].bar}`}
                        title={col}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="form-label">Icono Representativo</label>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-2">
                  {availableIcons.map((icName) => (
                    <button
                      key={icName}
                      type="button"
                      onClick={() => setIcon(icName)}
                      className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                        icon === icName 
                          ? 'border-slate-800 bg-slate-900 text-white shadow-sm' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <IconRenderer name={icName} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full btn-primary text-xs">
                <Plus className="w-4 h-4" />
                <span>Agregar Enfoque Personalizado</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Focus Plans Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {focusPlans.length === 0 ? (
          <div className="xl:col-span-2 p-12 bg-white border border-slate-100 rounded-3xl text-center shadow-sm space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-350 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No tienes enfoques activos</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Comienza abriendo el panel de arriba para instanciar plantillas o configurar tus propias metas personales.
            </p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-gradient-to-tr from-emerald-500 to-emerald-400 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
            >
              Crear mi primer enfoque
            </button>
          </div>
        ) : (
          focusPlans.map((plan) => {
            const styles = colorStyles[plan.color || 'emerald'];
            const curVal = getWeeklyValue(plan.id);
            const compPercent = Math.min((curVal / plan.target) * 100, 100);
            const timeStats = getTimeframeStats(plan);

            return (
              <div 
                key={plan.id}
                className="bg-white border border-slate-100/80 rounded-3xl shadow-premium p-6 flex flex-col justify-between gap-6"
              >
                {/* Top Section: Icon, Name and Delete */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${styles.iconBg}`}>
                      <IconRenderer name={plan.icon} className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${styles.badge}`}>
                        Meta: {plan.target} {plan.unit} / sem
                      </span>
                      <h3 className="text-base font-black text-slate-850 mt-1">{plan.name}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`¿Estás segura de eliminar la meta "${plan.name}" y todo su historial de registros?`)) {
                        deleteFocusPlan(plan.id);
                      }
                    }}
                    className="p-2 text-slate-350 hover:text-rose-500 rounded-xl hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
                    title="Eliminar meta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bars Section */}
                <div className="space-y-4 text-left">
                  {/* Weekly Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      <span>Progreso de esta semana</span>
                      <span className={styles.accentText}>{curVal} / {plan.target} {plan.unit} ({compPercent.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
                        style={{ width: `${compPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Timeframe Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      <span>Plazo: Finaliza el {timeStats.deadlineStr}</span>
                      <span className="text-slate-500 font-bold">Faltan {timeStats.daysLeft} días</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-slate-400 rounded-full transition-all duration-500"
                        style={{ width: `${timeStats.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Forms: Register session and recent logs */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-4 border-t border-slate-100">
                  {/* Quick Logger Form (3 cols) */}
                  <form 
                    onSubmit={(e) => handleLogProgress(plan.id, e)}
                    className="md:col-span-3 space-y-3 text-left"
                  >
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className={`w-3.5 h-3.5 ${styles.accentText}`} />
                      <span>Registrar Avance</span>
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        step="any"
                        required
                        placeholder={plan.unit}
                        value={loggingVal[plan.id] || ''}
                        onChange={(e) => setLoggingVal(prev => ({ ...prev, [plan.id]: e.target.value }))}
                        className="col-span-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 text-xs text-center font-bold"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Detalle (Ej. Pierna, DAX...)"
                        value={loggingDetails[plan.id] || ''}
                        onChange={(e) => setLoggingDetails(prev => ({ ...prev, [plan.id]: e.target.value }))}
                        className="col-span-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 text-xs"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Notas adicionales opcionales..."
                      value={loggingNotes[plan.id] || ''}
                      onChange={(e) => setLoggingNotes(prev => ({ ...prev, [plan.id]: e.target.value }))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 text-xs"
                    />
                    <button 
                      type="submit"
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${styles.btn}`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Guardar Avance</span>
                    </button>
                  </form>

                  {/* Logs list ledger (2 cols) */}
                  <div className="md:col-span-2 space-y-2 text-left">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Log Reciente</span>
                    </h4>
                    <div className="space-y-2 overflow-y-auto max-h-[145px] pr-1">
                      {focusSessions.filter(s => s.planId === plan.id).length === 0 ? (
                        <p className="text-[10px] text-slate-600 text-center py-6 italic">Sin registros aún.</p>
                      ) : (
                        focusSessions
                          .filter(s => s.planId === plan.id)
                          .slice(0, 5) // Last 5 logs
                          .map((session) => (
                            <div 
                              key={session.id} 
                              className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] font-bold text-slate-700 truncate max-w-[80px]">{session.details}</span>
                                  <span className="text-[8px] text-slate-600">{session.date.split('-').slice(1).join('/')}</span>
                                </div>
                                {session.notes && <p className="text-[8px] text-slate-600 italic truncate max-w-[120px]">"{session.notes}"</p>}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className={`text-[10px] font-black ${styles.accentText}`}>+{session.value}</span>
                                <button
                                  onClick={() => deleteFocusSession(session.id)}
                                  className="text-slate-600 hover:text-rose-500 p-0.5 rounded transition-colors"
                                  title="Eliminar log"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
