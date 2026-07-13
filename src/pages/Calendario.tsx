import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarEvent } from '../types';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  CheckSquare, 
  Square,
  Clock, 
  X, 
  Sparkles,
  CalendarDays,
  ListTodo
} from 'lucide-react';

export const Calendario: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useApp();
  
  // Navigation
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // Start at May 2026 (0-indexed 4 is May)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('08:00');
  const [formActivityType, setFormActivityType] = useState<CalendarEvent['activityType']>('inglés');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<CalendarEvent['status']>('pendiente');

  // Activity Colors Configuration
  const activityColors: Record<CalendarEvent['activityType'], { bg: string, text: string, border: string, dot: string }> = {
    'inglés': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
    'gym': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    'running': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    'proyecto $4m': { bg: 'bg-aqua-50', text: 'text-aqua-700', border: 'border-aqua-200', dot: 'bg-aqua-500' },
    'finanzas': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
    'descanso': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' },
    'familia': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', dot: 'bg-pink-500' },
    'plan personal': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
    'fin de semana': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    'pago': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', dot: 'bg-lime-500' },
    'recordatorio': { bg: 'bg-yellow-50 text-slate-800', text: 'text-yellow-800', border: 'border-yellow-200', dot: 'bg-yellow-500' }
  };

  // Helper date calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay(); // 0 is Sunday, 1 is Monday

  const totalDays = getDaysInMonth(year, month);
  let firstDayIndex = getFirstDayOfMonth(year, month);
  // Adjust so Monday is 0 and Sunday is 6
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Grid Days generation
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null); // blank cells before month starts
  }
  for (let i = 1; i <= totalDays; i++) {
    daysArray.push(i);
  }

  const navigateMonth = (direction: 'next' | 'prev') => {
    if (direction === 'prev') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      setCurrentDate(new Date(year, month + 1, 1));
    }
  };

  // Form handlers
  const openAddModal = (day?: number) => {
    setEditingEvent(null);
    setFormTitle('');
    const d = day ? day : new Date().getDate();
    const formattedDay = d < 10 ? `0${d}` : d;
    const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : (month + 1);
    setFormDate(`${year}-${formattedMonth}-${formattedDay}`);
    setFormTime('08:00');
    setFormActivityType('inglés');
    setFormDescription('');
    setFormStatus('pendiente');
    setIsModalOpen(true);
  };

  const openEditModal = (evt: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent grid cell triggers
    setEditingEvent(evt);
    setFormTitle(evt.title);
    setFormDate(evt.date);
    setFormTime(evt.time);
    setFormActivityType(evt.activityType);
    setFormDescription(evt.description);
    setFormStatus(evt.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const eventData = {
      title: formTitle.trim(),
      date: formDate,
      time: formTime,
      activityType: formActivityType,
      description: formDescription,
      status: formStatus
    };

    if (editingEvent) {
      updateEvent({ ...eventData, id: editingEvent.id });
    } else {
      addEvent(eventData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás segura de eliminar este evento del calendario?')) {
      deleteEvent(id);
      setIsModalOpen(false);
    }
  };

  const toggleEventStatus = (evt: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedStatus: CalendarEvent['status'] = evt.status === 'realizado' ? 'pendiente' : 'realizado';
    updateEvent({ ...evt, status: updatedStatus });
  };

  // Filter events matching active year-month
  const getEventsForDate = (dateStr: string) => {
    return events.filter(e => e.date === dateStr);
  };

  // Get active week events
  const getWeekEvents = () => {
    // Return events from next 7 days
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);
    return events.filter(e => {
      const eDate = new Date(e.date);
      return eDate >= today && eDate <= oneWeekLater;
    }).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  };

  return (
    <div className="space-y-8">
      {/* Calendar Header with navigation and tabs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-premium">
        {/* Month Selector */}
        <div className="flex items-center gap-4">
          <div className="p-2 bg-navy-50 rounded-xl text-navy-800">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateMonth('prev')}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-navy-800 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-navy-800 min-w-[120px] text-center">
              {monthNames[month]} {year}
            </h2>
            <button 
              onClick={() => navigateMonth('next')}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-navy-800 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex gap-2 bg-slate-100/60 border border-slate-200/50 p-1.5 rounded-2xl text-xs">
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              viewMode === 'month' ? 'bg-navy-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Vista Mes
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              viewMode === 'week' ? 'bg-navy-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Semana Entrante
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              viewMode === 'list' ? 'bg-navy-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Listado
          </button>
        </div>

        {/* Create Button */}
        <button
          onClick={() => openAddModal()}
          className="btn-primary text-xs shrink-0 px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Evento</span>
        </button>
      </div>

      {/* RENDER VIEW MODE */}
      {viewMode === 'month' && (
        <div className="glass-card p-6 bg-white">
          {/* Days labels */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div className="text-emerald-500">Sáb</div>
            <div className="text-emerald-500">Dom</div>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return (
                  <div 
                    key={`blank-${idx}`} 
                    className="min-h-[100px] bg-slate-50/50 border border-slate-100/50 rounded-2xl" 
                  />
                );
              }

              const formattedDay = day < 10 ? `0${day}` : day;
              const formattedMonth = (month + 1) < 10 ? `0${month + 1}` : (month + 1);
              const dateKey = `${year}-${formattedMonth}-${formattedDay}`;
              const dayEvents = getEventsForDate(dateKey);
              
              // Check if cell corresponds to today's date
              const today = new Date();
              const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => openAddModal(day)}
                  className={`min-h-[110px] p-2 border bg-white rounded-2xl flex flex-col justify-between hover:bg-slate-50/50 group cursor-pointer transition-all ${
                    isToday ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold ${
                      isToday ? 'bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-600'
                    }`}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Inner Cell Events List */}
                  <div className="flex-1 mt-2 space-y-1 overflow-hidden max-h-[75px]">
                    {dayEvents.slice(0, 3).map(evt => {
                      const colors = activityColors[evt.activityType];
                      return (
                        <div
                          key={evt.id}
                          onClick={(e) => openEditModal(evt, e)}
                          className={`px-1.5 py-0.5 rounded-lg border text-[9px] font-semibold truncate ${colors.bg} ${colors.text} ${colors.border} flex items-center gap-1 hover:brightness-95 transition-all`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot} ${
                            evt.status === 'realizado' ? 'ring-1 ring-white scale-[0.8]' : ''
                          }`} />
                          <span className={evt.status === 'realizado' ? 'line-through text-slate-600 font-normal' : ''}>
                            {evt.time} {evt.title}
                          </span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-[8px] font-bold text-slate-600 text-center">
                        + {dayEvents.length - 3} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {/* Loop over next 7 days starting today */}
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const formattedDate = date.toISOString().split('T')[0];
            const dayEvents = getEventsForDate(formattedDate);
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
            const dayNum = date.getDate();

            return (
              <div 
                key={`week-col-${i}`}
                className="bg-white border border-slate-100 p-4 rounded-2xl shadow-premium min-h-[300px] flex flex-col"
              >
                <div className="border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-600 uppercase">{dayName}</span>
                    <h4 className="text-lg font-black text-navy-800 mt-0.5">{dayNum}</h4>
                  </div>
                  <button 
                    onClick={() => {
                      setFormDate(formattedDate);
                      openAddModal(dayNum);
                    }}
                    className="p-1 text-slate-600 hover:text-navy-800 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto">
                  {dayEvents.length === 0 ? (
                    <p className="text-[10px] text-slate-600 text-center py-12">Sin tareas</p>
                  ) : (
                    dayEvents.map(evt => {
                      const colors = activityColors[evt.activityType];
                      return (
                        <div
                          key={evt.id}
                          onClick={(e) => openEditModal(evt, e)}
                          className={`p-2.5 rounded-xl border text-[11px] font-semibold space-y-1 cursor-pointer transition-all ${colors.bg} ${colors.text} ${colors.border} hover:shadow-sm`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold truncate max-w-[85px]">{evt.time}</span>
                            <button
                              onClick={(e) => toggleEventStatus(evt, e)}
                              className="text-slate-600 hover:text-navy-800"
                            >
                              {evt.status === 'realizado' ? (
                                <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-600" />
                              )}
                            </button>
                          </div>
                          <p className={`font-bold leading-tight ${evt.status === 'realizado' ? 'line-through text-slate-600 font-normal' : ''}`}>
                            {evt.title}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="glass-card p-6 bg-white space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ListTodo className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-navy-800">Todos los Eventos Registrados</h3>
          </div>
          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
            {events.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-12">No hay eventos guardados en el calendario.</p>
            ) : (
              [...events]
                .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
                .map(evt => {
                  const colors = activityColors[evt.activityType];
                  return (
                    <div 
                      key={evt.id}
                      onClick={(e) => openEditModal(evt, e)}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer hover:shadow-sm transition-all ${colors.bg} ${colors.border}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <button
                          onClick={(e) => toggleEventStatus(evt, e)}
                          className="shrink-0 text-slate-600 hover:text-navy-800"
                        >
                          {evt.status === 'realizado' ? (
                            <CheckSquare className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-600" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <h4 className={`text-xs font-bold text-slate-800 ${evt.status === 'realizado' ? 'line-through text-slate-600' : ''}`}>
                            {evt.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-600 font-medium">
                            <span className="font-bold text-slate-600 bg-slate-100/60 px-1.5 py-0.5 rounded-md">{evt.date}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{evt.time}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded-full uppercase text-[9px] font-bold ${colors.text} bg-white border border-slate-100`}>
                              {evt.activityType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => handleDelete(evt.id, e)}
                        className="p-1.5 text-slate-600 hover:text-rose-500 rounded-lg hover:bg-white/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* CRUD MODAL FOR EVENTS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">
                {editingEvent ? 'Editar Evento de Calendario' : 'Crear Evento en Calendario'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              <div>
                <label className="form-label">Título del Evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Estudiar inglés, Running 10k, Sesión Power BI..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="form-label">Hora (HH:MM)</label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Activity Type */}
                <div>
                  <label className="form-label">Tipo de Actividad</label>
                  <select
                    value={formActivityType}
                    onChange={(e) => setFormActivityType(e.target.value as CalendarEvent['activityType'])}
                    className="form-input"
                  >
                    <option value="inglés">Inglés</option>
                    <option value="gym">Gym</option>
                    <option value="running">Running</option>
                    <option value="proyecto $4m">Proyecto $4M</option>
                    <option value="finanzas">Finanzas</option>
                    <option value="descanso">Descanso</option>
                    <option value="familia">Familia</option>
                    <option value="plan personal">Plan Personal</option>
                    <option value="fin de semana">Fin de Semana</option>
                    <option value="pago">Pago</option>
                    <option value="recordatorio">Recordatorio</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="form-label">Estado</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as CalendarEvent['status'])}
                    className="form-input"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="realizado">Realizado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Descripción</label>
                <textarea
                  placeholder="Detalles sobre el evento..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="form-input h-20"
                />
              </div>

              <div className="pt-4 flex gap-3">
                {editingEvent && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(editingEvent.id, e)}
                    className="btn-danger text-xs px-4 py-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn-secondary text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
