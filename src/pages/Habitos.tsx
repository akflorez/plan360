import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Habit } from '../types';
import { calculateHabitStats } from '../utils/formulas';
import { 
  Flame, 
  CheckCircle2, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp, 
  AlertCircle,
  MessageSquare,
  Bookmark,
  Check
} from 'lucide-react';

export const Habitos: React.FC = () => {
  const { habits, toggleHabit } = useApp();
  
  // Date selector for logging habits
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  const [comments, setComments] = useState<Record<string, string>>({});

  // Calculations
  const stats = calculateHabitStats(habits);

  const adjustDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleCommentChange = (habitId: string, val: string) => {
    setComments(prev => ({ ...prev, [habitId]: val }));
  };

  const handleToggle = (habitId: string) => {
    toggleHabit(habitId, selectedDate, comments[habitId] || "");
    // Clear comment input after logging
    setComments(prev => ({ ...prev, [habitId]: "" }));
  };

  // Generate date keys for the last 15 days to display in the grid
  const getLastDaysKeys = (numDays: number) => {
    const arr = [];
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(d.toISOString().split('T')[0]);
    }
    return arr;
  };

  const last15Days = getLastDaysKeys(15);

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <div className="space-y-8">
      {/* Habits Header Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall compliance */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Cumplimiento General</p>
            <h4 className="text-xl font-black text-navy-800 mt-1">{stats.overallCompliance.toFixed(0)}%</h4>
            <p className="text-[10px] text-slate-600 mt-0.5">Promedio de todos tus hábitos</p>
          </div>
        </div>

        {/* Most Completed Habit */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Hábito Líder</p>
            <h4 className="text-sm font-bold text-navy-800 truncate mt-1" title={stats.mostCompleted}>
              {stats.mostCompleted}
            </h4>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">El más constante</p>
          </div>
        </div>

        {/* Least Completed Habit */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Hábito Descuidado</p>
            <h4 className="text-sm font-bold text-navy-800 truncate mt-1" title={stats.leastCompleted}>
              {stats.leastCompleted}
            </h4>
            <p className="text-[10px] text-rose-500 font-bold mt-0.5">Necesita más enfoque</p>
          </div>
        </div>

        {/* Streaks Card */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Racha Inglés</p>
            <h4 className="text-xl font-black text-navy-800 mt-1">{stats.streaks['h-1'] || 0} Días</h4>
            <p className="text-[10px] text-slate-600 mt-0.5">¡No rompas la cadena de estudio!</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Date Selector & Logging Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Checklist Column */}
        <div className="glass-card p-6 lg:col-span-2 space-y-6 bg-white">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-navy-800">Control de Hábitos Diarios</h3>
              <p className="text-xs text-slate-600">Marca los objetivos cumplidos para el día seleccionado.</p>
            </div>
            {/* Date Switcher */}
            <div className="flex items-center gap-2.5 bg-slate-100/60 p-1.5 rounded-xl border border-slate-200/50">
              <button 
                onClick={() => adjustDate(-1)}
                className="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-navy-800 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-navy-800 min-w-[80px] text-center flex items-center gap-1.5 justify-center">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                {formatShortDate(selectedDate)}
              </span>
              <button 
                onClick={() => adjustDate(1)}
                className="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-navy-800 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List of Habits */}
          <div className="space-y-4">
            {habits.map((habit) => {
              const isDone = habit.logs[selectedDate]?.done || false;
              const comment = habit.logs[selectedDate]?.comment || "";

              return (
                <div 
                  key={habit.id}
                  className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isDone 
                      ? 'bg-emerald-50/50 border-emerald-100' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      onClick={() => handleToggle(habit.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        isDone 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20' 
                          : 'border-slate-300 text-transparent hover:border-emerald-500'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{habit.name}</h4>
                      <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider mt-0.5">
                        Meta: {habit.target} {habit.unit} • {habit.frequency}
                      </p>
                      {comment && (
                        <p className="mt-1 text-[10px] text-slate-500 italic flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-slate-600" />
                          "{comment}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Comment Input & Save action */}
                  {!isDone && (
                    <div className="flex gap-2 w-full md:w-auto md:max-w-xs shrink-0">
                      <input
                        type="text"
                        placeholder="Nota opcional..."
                        value={comments[habit.id] || ""}
                        onChange={(e) => handleCommentChange(habit.id, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800/10 focus:border-navy-800 text-[10px]"
                      />
                      <button
                        onClick={() => handleToggle(habit.id)}
                        className="px-3 py-1.5 bg-navy-800 text-white text-[10px] font-semibold rounded-xl hover:bg-navy-900 transition-colors whitespace-nowrap"
                      >
                        Registrar
                      </button>
                    </div>
                  )}

                  {isDone && (
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completado
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Matrix Visualization Column */}
        <div className="glass-card p-6 bg-white space-y-6">
          <div>
            <h3 className="text-base font-bold text-navy-800">Matriz de Cumplimiento</h3>
            <p className="text-xs text-slate-600">Historial visual de los últimos 15 días.</p>
          </div>

          <div className="space-y-6 overflow-x-auto">
            {habits.map((habit) => {
              return (
                <div key={`matrix-row-${habit.id}`} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-navy-800">
                    <span>{habit.name}</span>
                    <span className="text-emerald-500 font-black">
                      {((Object.values(habit.logs).filter(l => l.done).length / (Object.keys(habit.logs).length || 1)) * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Grid cells */}
                  <div className="flex items-center gap-1">
                    {last15Days.map(dateKey => {
                      const done = habit.logs[dateKey]?.done || false;
                      const isSelected = dateKey === selectedDate;
                      return (
                        <div
                          key={`cell-${habit.id}-${dateKey}`}
                          title={`${habit.name} (${formatShortDate(dateKey)}): ${done ? 'Completado' : 'Sin registrar'}`}
                          onClick={() => setSelectedDate(dateKey)}
                          className={`w-6 h-6 rounded-md cursor-pointer transition-all border flex items-center justify-center text-[8px] font-bold ${
                            done 
                              ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm' 
                              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                          } ${
                            isSelected ? 'ring-2 ring-navy-800 border-navy-800 scale-105' : ''
                          }`}
                        >
                          {done && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200" /> Sin registrar</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-600" /> Completado</span>
          </div>
        </div>
      </div>
    </div>
  );
};
