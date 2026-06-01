import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProgressBar } from '../components/ProgressBar';
import { 
  Map, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  Square, 
  BookOpen, 
  Clipboard, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export const Metas6Meses: React.FC = () => {
  const { roadmaps, updateRoadmapGoal, updateRoadmapText } = useApp();
  
  // Expanded month state (default Month 1 is open)
  const [expandedMonth, setExpandedMonth] = useState<number | null>(1);

  // Edit local fields state to hold temporary inputs before saving
  const [editingNotes, setEditingNotes] = useState<Record<number, string>>({});
  const [editingOutcome, setEditingOutcome] = useState<Record<number, string>>({});

  const toggleExpand = (id: number) => {
    setExpandedMonth(expandedMonth === id ? null : id);
  };

  const handleGoalToggle = (monthId: number, goalId: string, currentDone: boolean) => {
    updateRoadmapGoal(monthId, goalId, !currentDone);
  };

  const handleSaveText = (monthId: number) => {
    const outcomeVal = editingOutcome[monthId] !== undefined 
      ? editingOutcome[monthId] 
      : (roadmaps.find(r => r.id === monthId)?.outcome || "");
    const notesVal = editingNotes[monthId] !== undefined 
      ? editingNotes[monthId] 
      : (roadmaps.find(r => r.id === monthId)?.notes || "");

    updateRoadmapText(monthId, outcomeVal, notesVal);
    alert(`Notas del Mes ${monthId} actualizadas con éxito.`);
  };

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-premium">
        <div className="p-2.5 bg-navy-50 text-navy-800 rounded-xl">
          <Map className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h2 className="text-base font-bold text-navy-800">Hoja de Ruta a 6 Meses</h2>
          <p className="text-xs text-slate-400">Progreso estructurado mes a mes para cumplir tus metas de inglés, deporte y finanzas.</p>
        </div>
      </div>

      {/* Accordion Roadmap Timeline */}
      <div className="space-y-4">
        {roadmaps.map((month) => {
          const isExpanded = expandedMonth === month.id;
          
          // Calculations
          const totalGoals = month.objectives.length;
          const completedGoals = month.objectives.filter(o => o.done).length;
          const progressPercent = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

          return (
            <div 
              key={month.id}
              className={`bg-white border rounded-2xl transition-all overflow-hidden ${
                isExpanded ? 'border-navy-800 shadow-premiumHover' : 'border-slate-100 shadow-premium hover:border-slate-200'
              }`}
            >
              {/* Month Summary Bar (clickable) */}
              <div 
                onClick={() => toggleExpand(month.id)}
                className="px-6 py-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/50 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    progressPercent === 100 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-navy-800 text-white'
                  }`}>
                    {month.id}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-sm font-bold text-navy-800 truncate">{month.name}</h3>
                    <div className="hidden sm:block mt-1">
                      <ProgressBar percent={progressPercent} height="sm" color={progressPercent === 100 ? "emerald" : "navy"} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status indicators */}
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    progressPercent === 100 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : progressPercent > 0 
                      ? 'bg-navy-50 text-navy-800' 
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {progressPercent === 100 ? 'Completado' : progressPercent > 0 ? 'En curso' : 'Pendiente'}
                  </span>
                  
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Month Details (when expanded) */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-100 space-y-6 text-left animate-pulse-soft-[0.1s]">
                  {/* Objectives Checkbox checklist */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Objetivos del Mes
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {month.objectives.map((goal) => (
                        <div 
                          key={goal.id}
                          onClick={() => handleGoalToggle(month.id, goal.id, goal.done)}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            goal.done 
                              ? 'bg-emerald-50/50 border-emerald-100 text-slate-400 line-through' 
                              : 'bg-white border-slate-100 hover:border-slate-200 text-slate-700 font-medium'
                          }`}
                        >
                          <span className={`shrink-0 ${goal.done ? 'text-emerald-500' : 'text-slate-300'}`}>
                            {goal.done ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          </span>
                          <span className="text-xs">{goal.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Outcome and Notes input */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100/60">
                    {/* Outcome / Reflections */}
                    <div className="space-y-2">
                      <label className="form-label flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        Resultados Obtenidos / Reflexión del Mes
                      </label>
                      <textarea
                        value={
                          editingOutcome[month.id] !== undefined 
                            ? editingOutcome[month.id] 
                            : (month.outcome || "")
                        }
                        onChange={(e) => setEditingOutcome(prev => ({ ...prev, [month.id]: e.target.value }))}
                        placeholder="Escribe el resultado final de este mes..."
                        className="form-input h-20 text-xs"
                      />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <label className="form-label flex items-center gap-1">
                        <Clipboard className="w-3.5 h-3.5" />
                        Notas Generales / Desvíos
                      </label>
                      <textarea
                        value={
                          editingNotes[month.id] !== undefined 
                            ? editingNotes[month.id] 
                            : (month.notes || "")
                        }
                        onChange={(e) => setEditingNotes(prev => ({ ...prev, [month.id]: e.target.value }))}
                        placeholder="Anotaciones extras o lecciones aprendidas..."
                        className="form-input h-20 text-xs"
                      />
                    </div>
                  </div>

                  {/* Action button inside details */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleSaveText(month.id)}
                      className="btn-primary text-xs py-2 px-5"
                    >
                      Guardar Avance del Mes {month.id}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
