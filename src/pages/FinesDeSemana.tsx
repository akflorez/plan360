import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WeekendPlan } from '../types';
import { 
  Compass, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square, 
  Save, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Smile,
  BookOpen
} from 'lucide-react';

export const FinesDeSemana: React.FC = () => {
  const { weekendPlans, saveWeekendPlan } = useApp();
  
  // Week Selector state (corresponds to active plan ID)
  // Let's use the current week or W22 (since May 25, 2026 is week 22)
  const [activeWeekId, setActiveWeekId] = useState('2026-W22');
  
  // Local plan state
  const [plan, setPlan] = useState<WeekendPlan>({
    id: activeWeekId,
    saturday: [
      { id: 'sat-1', text: 'Actividad de enfoque personal', done: false },
      { id: 'sat-2', text: 'Tiempo libre / Recreación', done: false },
      { id: 'sat-3', text: 'Salida o cena familiar', done: false }
    ],
    sunday: [
      { id: 'sun-1', text: 'Planificar finanzas y revisar presupuestos', done: false },
      { id: 'sun-2', text: 'Organizar agenda de la semana entrante', done: false },
      { id: 'sun-3', text: 'Descanso libre / Lectura', done: false }
    ],
    reflection: {
      good: '',
      improve: '',
      expenseControl: '',
      englishAdv: '',
      projectAdv: '',
      nextWeekOrg: ''
    }
  });

  // Task inputs
  const [newSatTask, setNewSatTask] = useState('');
  const [newSunTask, setNewSunTask] = useState('');

  // Load from AppContext when activeWeekId changes
  useEffect(() => {
    const existing = weekendPlans.find(p => p.id === activeWeekId);
    if (existing) {
      setPlan(existing);
    } else {
      setPlan({
        id: activeWeekId,
        saturday: [
          { id: `sat-${Date.now()}-1`, text: 'Actividad de enfoque personal', done: false },
          { id: `sat-${Date.now()}-2`, text: 'Tiempo libre o familiar', done: false }
        ],
        sunday: [
          { id: `sun-${Date.now()}-1`, text: 'Revisión financiera semanal', done: false },
          { id: `sun-${Date.now()}-2`, text: 'Planificación de semana', done: false }
        ],
        reflection: {
          good: '',
          improve: '',
          expenseControl: '',
          englishAdv: '',
          projectAdv: '',
          nextWeekOrg: ''
        }
      });
    }
  }, [activeWeekId, weekendPlans]);

  const toggleTask = (day: 'saturday' | 'sunday', taskId: string) => {
    const list = plan[day];
    const updatedList = list.map(item => item.id === taskId ? { ...item, done: !item.done } : item);
    const updatedPlan = { ...plan, [day]: updatedList };
    setPlan(updatedPlan);
    saveWeekendPlan(updatedPlan);
  };

  const addTask = (day: 'saturday' | 'sunday', text: string) => {
    if (!text.trim()) return;
    const list = plan[day];
    const updatedList = [...list, { id: `${day.substring(0, 3)}-${Date.now()}`, text: text.trim(), done: false }];
    const updatedPlan = { ...plan, [day]: updatedList };
    setPlan(updatedPlan);
    saveWeekendPlan(updatedPlan);
    
    if (day === 'saturday') setNewSatTask('');
    else setNewSunTask('');
  };

  const deleteTask = (day: 'saturday' | 'sunday', taskId: string) => {
    const list = plan[day];
    const updatedList = list.filter(item => item.id !== taskId);
    const updatedPlan = { ...plan, [day]: updatedList };
    setPlan(updatedPlan);
    saveWeekendPlan(updatedPlan);
  };

  const handleReflectionChange = (field: keyof WeekendPlan['reflection'], value: string) => {
    const updatedPlan = {
      ...plan,
      reflection: {
        ...plan.reflection,
        [field]: value
      }
    };
    setPlan(updatedPlan);
  };

  const handleSaveReflection = () => {
    saveWeekendPlan(plan);
    alert('Reflexión semanal guardada con éxito.');
  };

  const handleWeekChange = (direction: 'next' | 'prev') => {
    const currentWeekNum = parseInt(activeWeekId.split('W')[1]);
    let nextWeekNum = currentWeekNum;
    if (direction === 'prev') nextWeekNum = currentWeekNum - 1;
    else nextWeekNum = currentWeekNum + 1;

    setActiveWeekId(`2026-W${nextWeekNum}`);
  };

  return (
    <div className="space-y-8">
      {/* Title & Week Selector header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-premium">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-navy-50 text-navy-800 rounded-xl">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-bold text-navy-800">Organizador del Fin de Semana</h2>
            <p className="text-xs text-slate-400">Planifica tus sábados y domingos para equilibrar descanso, deporte y proyecto.</p>
          </div>
        </div>

        {/* Week Switcher */}
        <div className="flex items-center gap-2 bg-slate-100/60 p-1.5 rounded-2xl border border-slate-200/50 text-xs">
          <button
            onClick={() => handleWeekChange('prev')}
            className="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-navy-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-navy-800 px-2 uppercase tracking-wide">Semana {activeWeekId.split('W')[1]} - 2026</span>
          <button
            onClick={() => handleWeekChange('next')}
            className="p-1 hover:bg-white rounded-lg text-slate-500 hover:text-navy-800 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sábado / Domingo Planner columns */}
        <div className="space-y-6">
          {/* Saturday Card */}
          <div className="glass-card p-6 bg-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">Plan del Sábado</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Deporte & Foco</span>
            </div>

            {/* Quick Add Task */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSatTask}
                onChange={(e) => setNewSatTask(e.target.value)}
                placeholder="Añadir actividad al sábado..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800/10 text-xs"
              />
              <button
                onClick={() => addTask('saturday', newSatTask)}
                className="p-2 bg-navy-800 text-white rounded-xl hover:bg-navy-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              {plan.saturday.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No hay actividades registradas.</p>
              ) : (
                plan.saturday.map(task => (
                  <div 
                    key={task.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      task.done ? 'bg-slate-50/70 border-slate-100/50 text-slate-400 line-through' : 'bg-white border-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <div 
                      onClick={() => toggleTask('saturday', task.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      {task.done ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4 text-slate-300" />}
                      <span className="text-xs">{task.text}</span>
                    </div>
                    <button 
                      onClick={() => deleteTask('saturday', task.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sunday Card */}
          <div className="glass-card p-6 bg-white space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">Plan del Domingo</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Orden & Relax</span>
            </div>

            {/* Quick Add Task */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSunTask}
                onChange={(e) => setNewSunTask(e.target.value)}
                placeholder="Añadir actividad al domingo..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800/10 text-xs"
              />
              <button
                onClick={() => addTask('sunday', newSunTask)}
                className="p-2 bg-navy-800 text-white rounded-xl hover:bg-navy-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              {plan.sunday.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No hay actividades registradas.</p>
              ) : (
                plan.sunday.map(task => (
                  <div 
                    key={task.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      task.done ? 'bg-slate-50/70 border-slate-100/50 text-slate-400 line-through' : 'bg-white border-slate-100 text-slate-700 font-medium'
                    }`}
                  >
                    <div 
                      onClick={() => toggleTask('sunday', task.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      {task.done ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4 text-slate-300" />}
                      <span className="text-xs">{task.text}</span>
                    </div>
                    <button 
                      onClick={() => deleteTask('sunday', task.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Questionnaire Reflection column */}
        <div className="glass-card p-6 bg-white space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider flex items-center gap-2">
              <Smile className="w-4 h-4 text-emerald-500" />
              Reflexión Semanal
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Autoevaluación</span>
          </div>

          <div className="space-y-4 text-left">
            <div>
              <label className="form-label flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-emerald-500" /> ¿Qué hice bien esta semana?</label>
              <textarea
                value={plan.reflection.good}
                onChange={(e) => handleReflectionChange('good', e.target.value)}
                placeholder="Enumera tus victorias semanales..."
                className="form-input h-16 text-xs"
              />
            </div>
            <div>
              <label className="form-label flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-amber-500" /> ¿Qué debo mejorar?</label>
              <textarea
                value={plan.reflection.improve}
                onChange={(e) => handleReflectionChange('improve', e.target.value)}
                placeholder="Qué hábitos descuidaste o desvíos tuviste..."
                className="form-input h-16 text-xs"
              />
            </div>
            <div>
              <label className="form-label flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-rose-500" /> ¿Qué gasto debo controlar?</label>
              <textarea
                value={plan.reflection.expenseControl}
                onChange={(e) => handleReflectionChange('expenseControl', e.target.value)}
                placeholder="Fugas financieras o compras innecesarias..."
                className="form-input h-16 text-xs"
              />
            </div>
            <div>
              <label className="form-label flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-purple-500" /> ¿Qué avance tuve en mis enfoques y metas?</label>
              <textarea
                value={plan.reflection.englishAdv}
                onChange={(e) => handleReflectionChange('englishAdv', e.target.value)}
                placeholder="Sesiones completadas, horas estudiadas, páginas leídas..."
                className="form-input h-16 text-xs"
              />
            </div>
            <div>
              <label className="form-label flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-teal-500" /> ¿Qué avance tuve en mis proyectos y CRM?</label>
              <textarea
                value={plan.reflection.projectAdv}
                onChange={(e) => handleReflectionChange('projectAdv', e.target.value)}
                placeholder="Clientes contactados, hitos del mes, propuestas enviadas..."
                className="form-input h-16 text-xs"
              />
            </div>
            <div>
              <label className="form-label flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /> ¿Qué necesito organizar para la próxima semana?</label>
              <textarea
                value={plan.reflection.nextWeekOrg}
                onChange={(e) => handleReflectionChange('nextWeekOrg', e.target.value)}
                placeholder="Bloques de estudio, rutinas de gym, llamadas..."
                className="form-input h-16 text-xs"
              />
            </div>
          </div>

          <button
            onClick={handleSaveReflection}
            className="w-full btn-primary text-xs flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Reflexión del Fin de Semana</span>
          </button>
        </div>
      </div>
    </div>
  );
};
