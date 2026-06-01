import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank, 
  Target, 
  CheckCircle,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FocusPlan } from '../types';
import { StatCard } from '../components/StatCard';
import { ProgressBar } from '../components/ProgressBar';
import { getThemeStyles } from '../utils/theme';
import { 
  calculateFinances, 
  calculateCRMStats 
} from '../utils/formulas';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { 
    transactions, 
    habits, 
    focusPlans, 
    focusSessions, 
    prospects, 
    roadmaps, 
    settings 
  } = useApp();

  const theme = settings.theme || 'femenino';
  const styles = getThemeStyles(theme);

  // Custom daily focus state (saved in LocalStorage or initial defaults)
  const [focusTasks, setFocusTasks] = useState<{ id: string; text: string; done: boolean }[]>(() => {
    const stored = localStorage.getItem('kari_360_daily_focus');
    return stored ? JSON.parse(stored) : [
      { id: 'f-1', text: 'Practicar inglés oral 15 minutos', done: false },
      { id: 'f-2', text: 'Avanzar actividades del enfoque de la semana', done: false },
      { id: 'f-3', text: 'Registrar los gastos acumulados del día', done: false }
    ];
  });
  
  const [newTaskText, setNewTaskText] = useState('');

  const saveFocusTasks = (tasks: typeof focusTasks) => {
    setFocusTasks(tasks);
    localStorage.setItem('kari_360_daily_focus', JSON.stringify(tasks));
  };

  const toggleTask = (id: string) => {
    const updated = focusTasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveFocusTasks(updated);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const updated = [...focusTasks, { id: `f-${Date.now()}`, text: newTaskText.trim(), done: false }];
    saveFocusTasks(updated);
    setNewTaskText('');
  };

  const deleteTask = (id: string) => {
    const updated = focusTasks.filter(t => t.id !== id);
    saveFocusTasks(updated);
  };

  // Helper to render lucide icons dynamically
  const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
    const IconComp = (Icons as any)[name];
    if (IconComp) {
      return <IconComp className={className} />;
    }
    return <Icons.Target className={className} />;
  };

  // Helpers to compute current week value for focus plans
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

    if (plan.timeframeType === 'months') {
      const months = parseInt(plan.timeframeValue) || 1;
      totalDays = months * 30;
      daysLeft = Math.max(0, totalDays - daysElapsed);
      progressPercent = totalDays > 0 ? Math.min((daysElapsed / totalDays) * 100, 100) : 0;
    } else {
      const targetDate = new Date(plan.timeframeValue);
      const totalTime = targetDate.getTime() - createdDate.getTime();
      totalDays = Math.max(1, Math.ceil(totalTime / (1000 * 60 * 60 * 24)));
      
      const timeLeft = targetDate.getTime() - today.getTime();
      daysLeft = Math.max(0, Math.ceil(timeLeft / (1000 * 60 * 60 * 24)));
      
      progressPercent = totalDays > 0 ? Math.min(((totalDays - daysLeft) / totalDays) * 100, 100) : 0;
    }

    return { daysElapsed, totalDays, daysLeft, progressPercent };
  };

  const focusColors = {
    emerald: { iconBg: 'bg-emerald-50 text-emerald-600', bar: 'bg-emerald-500' },
    indigo: { iconBg: 'bg-indigo-50 text-indigo-600', bar: 'bg-indigo-500' },
    purple: { iconBg: 'bg-purple-50 text-purple-600', bar: 'bg-purple-500' },
    rose: { iconBg: 'bg-rose-50 text-rose-600', bar: 'bg-rose-500' },
    amber: { iconBg: 'bg-amber-50 text-amber-600', bar: 'bg-amber-500' },
    blue: { iconBg: 'bg-blue-50 text-blue-600', bar: 'bg-blue-500' },
    aqua: { iconBg: 'bg-teal-50 text-teal-650', bar: 'bg-teal-500' }
  };

  // Perform Calculations
  const finStats = calculateFinances(transactions, settings.monthlyBudget);
  const crmStats = calculateCRMStats(prospects, transactions, settings.extraIncomeGoal);

  // Roadmap project compliance
  const totalRoadmapGoals = roadmaps.reduce((sum, r) => sum + r.objectives.length, 0);
  const doneRoadmapGoals = roadmaps.reduce((sum, r) => sum + r.objectives.filter(o => o.done).length, 0);
  const projectCompliance = totalRoadmapGoals > 0 ? (doneRoadmapGoals / totalRoadmapGoals) * 100 : 0;

  // Formatting Currency Helper
  const formatCOP = (num: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Chart Data preparation
  const financeChartData = [
    { name: 'Semana 1', Ingresos: finStats.totalIncomes * 0.4, Gastos: finStats.totalExpenses * 0.35 },
    { name: 'Semana 2', Ingresos: finStats.totalIncomes * 0.4, Gastos: finStats.totalExpenses * 0.25 },
    { name: 'Semana 3', Ingresos: finStats.totalIncomes * 0.7, Gastos: finStats.totalExpenses * 0.5 },
    { name: 'Semana 4 (Hoy)', Ingresos: finStats.totalIncomes, Gastos: finStats.totalExpenses }
  ];

  // Expenses by category
  const expenseCategoriesMap: Record<string, number> = {};
  transactions
    .filter(tx => tx.type === 'egreso fijo' || tx.type === 'egreso variable' || tx.type === 'gasto')
    .forEach(tx => {
      expenseCategoriesMap[tx.category] = (expenseCategoriesMap[tx.category] || 0) + tx.amount;
    });
  
  const categoryChartData = Object.entries(expenseCategoriesMap).map(([name, value]) => ({
    name,
    value
  }));

  // Habits compliance data
  const habitsChartData = habits.map(h => {
    const logs = Object.values(h.logs || {});
    const done = logs.filter(l => l.done).length;
    const rate = logs.length > 0 ? (done / logs.length) * 100 : 0;
    return {
      name: h.name,
      Cumplimiento: Math.round(rate)
    };
  });

  // Theme-specific banner styles
  const bannerBg = theme === 'masculino'
    ? "bg-slate-900 bg-[radial-gradient(circle_at_70%_-20%,#2563eb,transparent_45%),radial-gradient(circle_at_10%_120%,#d97706,transparent_40%)]"
    : "bg-navy-800 bg-[radial-gradient(circle_at_70%_-20%,#10b981,transparent_45%),radial-gradient(circle_at_10%_120%,#8b5cf6,transparent_40%)]";

  const bannerBorder = theme === 'masculino' ? "border-slate-800" : "border-navy-700/50";
  const accentProgressColor = theme === 'masculino' ? 'amber' : 'emerald';
  const trackerProgressColor = theme === 'masculino' ? 'purple' : 'purple';

  return (
    <div className="space-y-8">
      {/* Welcome & Motivational Banner */}
      <div className={`relative p-6 md:p-8 rounded-3xl overflow-hidden text-white shadow-xl ${bannerBg}`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-slate-100 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Planes de Transformación a 6 Meses</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">PLAN 360</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Estás en el camino hacia la libertad financiera, el bilingüismo y tu máximo rendimiento deportivo. Mantén la disciplina diaria y evalúa tus progresos.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avance Meta $4M COP</p>
              <h4 className="text-xl font-black text-white mt-0.5">{crmStats.goalProgressPercent.toFixed(0)}%</h4>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-white/15 border-t-white flex items-center justify-center font-bold text-sm text-white">
              {crmStats.goalProgressPercent.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos del Mes"
          value={formatCOP(finStats.totalIncomes)}
          icon={TrendingUp}
          subtext="Total sumado en cuentas"
          color="emerald"
        />
        <StatCard
          title="Gastos del Mes"
          value={formatCOP(finStats.totalExpenses)}
          icon={TrendingDown}
          subtext={`${formatCOP(finStats.fixedExpenses)} fijos • ${formatCOP(finStats.variableExpenses)} var.`}
          color={finStats.alertTriggered ? "rose" : "navy"}
          trend={finStats.alertTriggered ? { value: "Alerta Presupuesto", type: 'negative' } : undefined}
        />
        <StatCard
          title="Disponible Actual"
          value={formatCOP(finStats.available)}
          icon={DollarSign}
          subtext="Dinero libre para ahorro/inversión"
          color="aqua"
        />
        <StatCard
          title="Ahorro Mensual"
          value={formatCOP(finStats.savings)}
          icon={PiggyBank}
          subtext={`${finStats.savingsRate.toFixed(1)}% del total recibido`}
          color="purple"
        />
      </div>

      {/* Compliance Mini Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {focusPlans.slice(0, 2).map((plan) => {
          const styles = focusColors[plan.color || 'emerald'];
          const curVal = getWeeklyValue(plan.id);
          const compPercent = Math.min((curVal / plan.target) * 100, 100);
          const timeStats = getTimeframeStats(plan);

          return (
            <div key={plan.id} className="glass-card p-6 flex items-center gap-4 bg-white">
              <div className={`p-3 rounded-2xl shrink-0 ${styles.iconBg}`}>
                <IconRenderer name={plan.icon} className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">{plan.name}</p>
                <h4 className="text-base font-bold text-slate-800 mt-0.5">
                  {curVal} / {plan.target} <span className="text-xs font-normal text-slate-400">{plan.unit}</span>
                </h4>
                <div className="mt-2 flex justify-between text-[9px] text-slate-450 font-bold uppercase tracking-wide">
                  <span>Faltan {timeStats.daysLeft} días</span>
                  <span>{compPercent.toFixed(0)}%</span>
                </div>
                <div className="mt-1">
                  <ProgressBar percent={compPercent} height="sm" color={plan.color} label="" />
                </div>
              </div>
            </div>
          );
        })}

        {focusPlans.length < 2 && (
          <div className="glass-card p-6 flex items-center gap-4 bg-white border-dashed border-slate-200">
            <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl shrink-0">
              <Icons.HelpCircle className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nuevo Enfoque</p>
              <h4 className="text-xs font-bold text-slate-750 mt-1">Configura más metas</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Sigue tu progreso de forma ágil desde el panel principal.</p>
            </div>
          </div>
        )}

        {/* Project 6M Card */}
        <div className="glass-card p-6 flex items-center gap-4 bg-white">
          <div className={`p-3 rounded-2xl shrink-0 ${theme === 'masculino' ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-500'}`}>
            <Target className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Plan de 6 Meses</p>
            <h4 className="text-base font-bold text-slate-800 mt-0.5">{doneRoadmapGoals} de {totalRoadmapGoals} hitos</h4>
            <div className="mt-2.5">
              <ProgressBar percent={projectCompliance} height="sm" color={theme === 'masculino' ? 'purple' : 'amber'} label="Progreso general" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts & Daily Focus Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incomes vs Expenses Chart */}
        <div className="glass-card p-6 lg:col-span-2 space-y-4 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800">Evolución de Finanzas</h3>
              <p className="text-xs text-slate-400">Ingresos vs Gastos acumulados</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={styles.chartColors[1]} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={styles.chartColors[1]} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip formatter={(value) => formatCOP(Number(value))} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Area type="monotone" dataKey="Ingresos" stroke={styles.chartColors[1]} strokeWidth={2} fillOpacity={1} fill="url(#colorIngresos)" />
                <Area type="monotone" dataKey="Gastos" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorGastos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Focus - Hoy debo enfocarme en */}
        <div className="glass-card p-6 flex flex-col justify-between space-y-4 bg-white">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-800">Hoy debo enfocarme en</h3>
                <p className="text-xs text-slate-400">Tus 3 prioridades del día</p>
              </div>
              <CheckCircle className={`w-5 h-5 ${styles.accentText} animate-pulse-soft`} />
            </div>

            {/* Form to add task */}
            <form onSubmit={addTask} className="mt-4 flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Nueva prioridad..."
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-350 text-xs"
              />
              <button 
                type="submit"
                className={`p-2 text-white rounded-lg transition-colors cursor-pointer ${styles.userInitialsBg}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Focus checklist */}
            <div className="mt-4 space-y-2.5">
              {focusTasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">¡No hay prioridades para hoy! Agrega una arriba.</p>
              ) : (
                focusTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                      task.done 
                        ? 'bg-slate-50/70 border-slate-100/50 line-through text-slate-400' 
                        : 'bg-white border-slate-100 text-slate-700 shadow-sm hover:border-slate-200'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                        className={`rounded border-slate-300 w-4 h-4 cursor-pointer shrink-0 ${
                          theme === 'masculino' ? 'text-blue-600 focus:ring-blue-500' : 'text-emerald-600 focus:ring-emerald-500'
                        }`}
                      />
                      <span className="text-xs font-semibold leading-relaxed truncate">{task.text}</span>
                    </label>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-350 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Completadas</span>
            <span className="font-bold text-slate-800">
              {focusTasks.filter(t => t.done).length} de {focusTasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category Donut Chart */}
        <div className="glass-card p-6 space-y-4 bg-white">
          <div>
            <h3 className="text-base font-bold text-slate-800">Gastos por Categoría</h3>
            <p className="text-xs text-slate-400">Distribución de egresos mensuales</p>
          </div>
          <div className="h-64 flex flex-col md:flex-row items-center justify-center gap-4">
            {categoryChartData.length === 0 ? (
              <p className="text-xs text-slate-400 py-12">No hay gastos registrados este mes.</p>
            ) : (
              <>
                <div className="w-full md:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={styles.chartColors[index % styles.chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCOP(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 overflow-y-auto max-h-56 space-y-2">
                  {categoryChartData.map((item, idx) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: styles.chartColors[idx % styles.chartColors.length] }} 
                        />
                        <span className="text-slate-600 truncate max-w-[120px]">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">{formatCOP(item.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Habits compliance chart */}
        <div className="glass-card p-6 space-y-4 bg-white">
          <div>
            <h3 className="text-base font-bold text-slate-800">Cumplimiento de Hábitos</h3>
            <p className="text-xs text-slate-400">Porcentaje de éxito histórico</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitsChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip formatter={(value) => [`${value}%`, 'Cumplimiento']} />
                <Bar dataKey="Cumplimiento" fill={styles.chartColors[1]} radius={[8, 8, 0, 0]}>
                  {habitsChartData.map((entry, index) => {
                    const customColors = theme === 'masculino' 
                      ? ['#EF4444', '#D97706', '#2563EB'] 
                      : ['#EF4444', '#8B5CF6', '#10B981'];
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.Cumplimiento > 70 ? customColors[2] : entry.Cumplimiento > 40 ? customColors[1] : customColors[0]} 
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
