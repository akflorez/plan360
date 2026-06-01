import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateSportsStats } from '../utils/formulas';
import { getThemeStyles } from '../utils/theme';
import { 
  Dumbbell, 
  Activity, 
  Plus, 
  Clock, 
  Heart, 
  Zap, 
  Compass, 
  Grid,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const GymRunning: React.FC = () => {
  const { workoutSessions, runningSessions, addWorkoutSession, addRunningSession, settings } = useApp();
  const theme = settings.theme || 'femenino';
  const styles = getThemeStyles(theme);
  
  // Navigation: 'gym' | 'running'
  const [activeSportTab, setActiveSportTab] = useState<'gym' | 'running'>('gym');

  // Gym Form fields
  const [gymDate, setGymDate] = useState(new Date().toISOString().split('T')[0]);
  const [gymType, setGymType] = useState<'Pierna' | 'Brazos' | 'Hombros' | 'Espalda' | 'Pecho' | 'Core' | 'Full body'>('Pierna');
  const [gymDuration, setGymDuration] = useState('60');
  const [gymIntensity, setGymIntensity] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [gymExercises, setGymExercises] = useState('');
  const [gymNotes, setGymNotes] = useState('');
  const [gymEnergy, setGymEnergy] = useState('4');

  // Running Form fields
  const [runDate, setRunDate] = useState(new Date().toISOString().split('T')[0]);
  const [runDistance, setRunDistance] = useState('');
  const [runTime, setRunTime] = useState(''); // e.g. "00:45:00"
  const [runPace, setRunPace] = useState(''); // e.g. "5:30"
  const [runType, setRunType] = useState<'Suave' | 'Fondo' | 'Series' | 'Tempo' | 'Recuperación'>('Suave');
  const [runSensations, setRunSensations] = useState('Buena energía');
  const [runNotes, setRunNotes] = useState('');

  // Calculations
  const stats = calculateSportsStats(workoutSessions, runningSessions, settings);

  const handleLogGym = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymExercises.trim()) return;

    addWorkoutSession({
      date: gymDate,
      type: gymType,
      duration: Number(gymDuration) || 60,
      intensity: gymIntensity,
      exercises: gymExercises.trim(),
      notes: gymNotes.trim(),
      energyLevel: Number(gymEnergy) || 4
    });

    // Reset fields
    setGymExercises('');
    setGymNotes('');
    setGymEnergy('4');
  };

  const handleLogRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!runDistance || !runTime) return;

    // Estimate pace if not entered
    let finalPace = runPace;
    if (!finalPace && Number(runDistance) > 0) {
      const parts = runTime.split(':').map(Number);
      let totalSeconds = 0;
      if (parts.length === 3) totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      else if (parts.length === 2) totalSeconds = parts[0] * 60 + parts[1];
      
      const secondsPerKm = totalSeconds / Number(runDistance);
      const min = Math.floor(secondsPerKm / 60);
      const sec = Math.floor(secondsPerKm % 60);
      finalPace = `${min}:${sec < 10 ? '0' : ''}${sec} min/km`;
    } else if (finalPace && !finalPace.includes('min/km')) {
      finalPace = `${finalPace} min/km`;
    }

    addRunningSession({
      date: runDate,
      distance: Number(runDistance),
      time: runTime,
      pace: finalPace || "5:30 min/km",
      type: runType,
      sensations: runSensations,
      notes: runNotes.trim()
    });

    // Reset
    setRunDistance('');
    setRunTime('');
    setRunPace('');
    setRunNotes('');
  };

  // Suggesting next training session based on history
  const getNextSuggestedSession = () => {
    if (activeSportTab === 'gym') {
      const lastType = stats.lastWorkout?.type;
      if (lastType === 'Pierna') return 'Tren Superior (Brazos / Pecho)';
      if (lastType === 'Brazos' || lastType === 'Pecho') return 'Espalda y Hombros';
      return 'Piernas y Glúteos';
    } else {
      const lastRun = [...runningSessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      if (lastRun?.type === 'Fondo') return 'Rodaje Regenerativo Suave (4-6 km)';
      if (lastRun?.type === 'Suave') return 'Intervalos o Tempo en Pista (6-8 km)';
      return 'Fondo Largo del Fin de Semana (12-16 km)';
    }
  };

  return (
    <div className="space-y-8">
      {/* Sport Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-premium">
        <div className="text-center md:text-left space-y-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Plan Deportivo Semanal</p>
          <h3 className="text-base font-bold text-navy-800">Rendimiento Físico</h3>
          <p className="text-[11px] text-slate-400">Gym target: {settings.weeklyGymGoal} sesiones • Running: {settings.weeklyRunningGoal} km</p>
        </div>

        {/* Weekly Gym compliance */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>Sesiones de Gym</span>
            <span>{stats.gymSessionsThisWeek} / {settings.weeklyGymGoal}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${stats.gymCompliancePercent}%` }} />
          </div>
        </div>

        {/* Weekly Running compliance */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>Km Corridos</span>
            <span>{stats.kmRunThisWeek.toFixed(1)} / {settings.weeklyRunningGoal} km</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full transition-all" style={{ width: `${stats.runningCompliancePercent}%` }} />
          </div>
        </div>

        {/* Average pace & suggestions */}
        <div className="flex items-center gap-3 bg-navy-50/50 p-3 rounded-xl border border-navy-100/50 shrink-0">
          <div className="p-2 bg-navy-800 text-white rounded-lg">
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Próximo Sugerido</p>
            <p className="text-[11px] font-bold text-navy-800 mt-0.5 truncate max-w-[150px]">{getNextSuggestedSession()}</p>
          </div>
        </div>
      </div>

      {/* Tabs Selector (High Contrast Pill Container) */}
      <div className="inline-flex gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs">
        <button
          onClick={() => setActiveSportTab('gym')}
          className={`px-5 py-2 rounded-xl font-bold transition-all ${
            activeSportTab === 'gym'
              ? styles.cardPillActive
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-semibold'
          }`}
        >
          Entrenamiento Gimnasio (Gym)
        </button>
        <button
          onClick={() => setActiveSportTab('running')}
          className={`px-5 py-2 rounded-xl font-bold transition-all ${
            activeSportTab === 'running'
              ? styles.cardPillActive
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-semibold'
          }`}
        >
          Entrenamiento Running (Correr)
        </button>
      </div>

      {/* Sport tab rendering */}
      {activeSportTab === 'gym' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form to log Gym */}
          <div className="glass-card p-6 bg-white space-y-6">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-emerald-500 animate-pulse-soft" />
              <h3 className="text-base font-bold text-navy-800">Registrar Rutina de Gym</h3>
            </div>

            <form onSubmit={handleLogGym} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    required
                    value={gymDate}
                    onChange={(e) => setGymDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Training Type */}
                <div>
                  <label className="form-label">Tipo de Tren</label>
                  <select
                    value={gymType}
                    onChange={(e) => setGymType(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="Pierna">Pierna</option>
                    <option value="Brazos">Brazos</option>
                    <option value="Hombros">Hombros</option>
                    <option value="Espalda">Espalda</option>
                    <option value="Pecho">Pecho</option>
                    <option value="Core">Core</option>
                    <option value="Full body">Full body</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Duration */}
                <div>
                  <label className="form-label">Duración (Min)</label>
                  <input
                    type="number"
                    value={gymDuration}
                    onChange={(e) => setGymDuration(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Intensity */}
                <div>
                  <label className="form-label">Intensidad</label>
                  <select
                    value={gymIntensity}
                    onChange={(e) => setGymIntensity(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>

                {/* Energy */}
                <div>
                  <label className="form-label">Energía (1-5)</label>
                  <select
                    value={gymEnergy}
                    onChange={(e) => setGymEnergy(e.target.value)}
                    className="form-input font-bold"
                  >
                    <option value="5">5 - Excelente</option>
                    <option value="4">4 - Buena</option>
                    <option value="3">3 - Normal</option>
                    <option value="2">2 - Cansada</option>
                    <option value="1">1 - Agotada</option>
                  </select>
                </div>
              </div>

              {/* Exercises */}
              <div>
                <label className="form-label">Ejercicios Realizados</label>
                <textarea
                  required
                  placeholder="Ej. Sentadillas 4x10 (60kg), Prensa 4x12..."
                  value={gymExercises}
                  onChange={(e) => setGymExercises(e.target.value)}
                  className="form-input h-24"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="form-label">Observaciones</label>
                <input
                  type="text"
                  placeholder="Sensación de fatiga, descansos..."
                  value={gymNotes}
                  onChange={(e) => setGymNotes(e.target.value)}
                  className="form-input"
                />
              </div>

              <button type="submit" className="w-full btn-primary text-xs">
                <Plus className="w-4 h-4" />
                <span>Guardar Sesión de Gym</span>
              </button>
            </form>
          </div>

          {/* Right Columns: Gym History Ledger */}
          <div className="lg:col-span-2 glass-card p-6 bg-white space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-bold text-navy-800">Historial de Gimnasio</h3>
            </div>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
              {workoutSessions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-12">No hay sesiones de gimnasio registradas.</p>
              ) : (
                workoutSessions.map((workout) => (
                  <div key={workout.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
                          {workout.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{workout.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{workout.duration} Min</span>
                        <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500" />Intensidad {workout.intensity}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" />Energía: {workout.energyLevel}/5</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line pt-1">
                      {workout.exercises}
                    </div>

                    {workout.notes && (
                      <p className="text-[10px] text-slate-400 italic mt-2 border-t border-slate-100/50 pt-1.5">
                        Obs: "{workout.notes}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* RUNNING VIEW SUB TAB */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form to log running */}
          <div className="glass-card p-6 bg-white space-y-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500 animate-pulse-soft" />
              <h3 className="text-base font-bold text-navy-800">Registrar Rodaje de Running</h3>
            </div>

            <form onSubmit={handleLogRun} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    required
                    value={runDate}
                    onChange={(e) => setRunDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Run Type */}
                <div>
                  <label className="form-label">Tipo de Sesión</label>
                  <select
                    value={runType}
                    onChange={(e) => setRunType(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="Suave">Suave (Recuperación)</option>
                    <option value="Fondo">Fondo (Tirada larga)</option>
                    <option value="Series">Series (Velocidad)</option>
                    <option value="Tempo">Tempo (Ritmo constante)</option>
                    <option value="Recuperación">Recuperación</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Distance */}
                <div>
                  <label className="form-label">Distancia (km)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="km..."
                    value={runDistance}
                    onChange={(e) => setRunDistance(e.target.value)}
                    className="form-input font-bold"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="form-label">Tiempo total</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 00:45:00"
                    value={runTime}
                    onChange={(e) => setRunTime(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Pace */}
                <div>
                  <label className="form-label">Ritmo (min/km)</label>
                  <input
                    type="text"
                    placeholder="e.g. 5:30 (Opc)"
                    value={runPace}
                    onChange={(e) => setRunPace(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Sensations */}
              <div>
                <label className="form-label">Sensaciones Físicas</label>
                <select
                  value={runSensations}
                  onChange={(e) => setRunSensations(e.target.value)}
                  className="form-input"
                >
                  <option value="Frescura total, mucha energía">Frescura total, mucha energía</option>
                  <option value="Buena energía, ritmo constante">Buena energía, ritmo constante</option>
                  <option value="Normal, fatiga ligera al final">Normal, fatiga ligera al final</option>
                  <option value="Cansancio pesado, piernas cargadas">Cansancio pesado, piernas cargadas</option>
                  <option value="Dolor o molestia en articulación">Dolor o molestia en articulación</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="form-label">Ruta / Clima / Notas</label>
                <textarea
                  placeholder="Ej. Parque Virrey, clima templado, hidratación óptima..."
                  value={runNotes}
                  onChange={(e) => setRunNotes(e.target.value)}
                  className="form-input h-20"
                />
              </div>

              <button type="submit" className="w-full btn-primary text-xs">
                <Plus className="w-4 h-4" />
                <span>Guardar Rodaje</span>
              </button>
            </form>
          </div>

          {/* Right Columns: Running History Ledger */}
          <div className="lg:col-span-2 glass-card p-6 bg-white space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Compass className="w-5 h-5 text-blue-500" />
              <h3 className="text-base font-bold text-navy-800">Bitácora de Running</h3>
            </div>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
              {runningSessions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-12">No hay sesiones de running registradas.</p>
              ) : (
                runningSessions.map((run) => (
                  <div key={run.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                          {run.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{run.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-navy-800">Sensación: {run.sensations}</h4>
                      {run.notes && (
                        <p className="text-[10px] text-slate-400 leading-normal italic">
                          "{run.notes}"
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 md:flex md:flex-col md:items-end justify-between gap-2 md:gap-1 shrink-0 text-right">
                      <div>
                        <span className="text-xs text-slate-400 font-bold block md:inline md:mr-1">Distancia:</span>
                        <span className="text-sm font-black text-blue-600">{run.distance} km</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-bold block md:inline md:mr-1">Tiempo:</span>
                        <span className="text-xs font-black text-slate-800">{run.time}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-bold block md:inline md:mr-1">Ritmo:</span>
                        <span className="text-xs font-black text-emerald-600">{run.pace}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
