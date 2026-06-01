import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateEnglishStats } from '../utils/formulas';
import { 
  Languages, 
  Plus, 
  Copy, 
  Check, 
  Award, 
  TrendingUp, 
  Clock, 
  Map, 
  CheckCircle2, 
  Compass, 
  PlayCircle
} from 'lucide-react';

export const Ingles: React.FC = () => {
  const { englishSessions, addEnglishSession, settings } = useApp();
  
  // Local Form state
  const [minutes, setMinutes] = useState('60');
  const [practiceType, setPracticeType] = useState<'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Grammar' | 'Vocabulary' | 'Business English'>('Business English');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Medio' | 'Difícil'>('Medio');
  const [notes, setNotes] = useState('');
  
  // Clipboard animation state
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Calculations
  const stats = calculateEnglishStats(englishSessions, settings.dailyEnglishGoal);

  const handleLogSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minutes || isNaN(Number(minutes)) || !topic.trim()) return;

    addEnglishSession({
      date: new Date().toISOString().split('T')[0],
      minutes: Number(minutes),
      practiceType,
      topic: topic.trim(),
      difficulty,
      notes: notes.trim()
    });

    // Reset Form fields
    setTopic('');
    setNotes('');
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const usefulPhrases = [
    { en: "I work as a Data Analytics Director.", es: "Trabajo como Directora de Analítica de Datos." },
    { en: "I create dashboards in Power BI.", es: "Creo tableros de control en Power BI." },
    { en: "I analyze business indicators.", es: "Analizo indicadores de negocio (KPIs)." },
    { en: "Could you please send me the information?", es: "¿Podrías por favor enviarme la información?" },
    { en: "I help companies organize their data.", es: "Ayudo a las empresas a organizar sus datos." },
    { en: "I would like to schedule a meeting.", es: "Me gustaría programar una reunión." }
  ];

  const suggestedPlan = [
    { month: 1, title: "Mes 1: Bases y Vocabulario Laboral", desc: "Mapeo de términos de analítica, glosario técnico y verbos comunes en tecnología." },
    { month: 2, title: "Mes 2: Inglés para Reuniones y Correos", desc: "Fórmulas de saludo, solicitudes de información y redacción de minutas de reunión." },
    { month: 3, title: "Mes 3: Conversación Básica", desc: "Simulación de videollamadas cortas, presentaciones breves sobre mí y mi experiencia." },
    { month: 4, title: "Mes 4: Inglés Aplicado a Ventas", desc: "Cómo presentar el valor de un dashboard, negociar tarifas y responder a objeciones." },
    { month: 5, title: "Mes 5: Inglés Profesional Avanzado", desc: "Presentación técnica de arquitectura de datos y modelamiento en inglés." },
    { month: 6, title: "Mes 6: Portafolio y Pitch Bilingüe", desc: "Grabación de pitch de servicios de Power BI y perfil de LinkedIn 100% bilingüe." }
  ];

  return (
    <div className="space-y-8">
      {/* Top dashboard summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Hours Studied Weekly */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Horas esta Semana</p>
          <h4 className="text-lg font-bold text-navy-800 mt-1">{stats.weeklyHours.toFixed(1)} h</h4>
          <span className="text-[9px] text-slate-400 font-semibold uppercase">Meta diaria: 1h</span>
        </div>

        {/* Hours Studied Monthly */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Horas este Mes</p>
          <h4 className="text-lg font-bold text-purple-600 mt-1">{stats.monthlyHours.toFixed(1)} h</h4>
          <span className="text-[9px] text-slate-400 font-semibold uppercase">De {stats.goalMonthlyHours} h planeadas</span>
        </div>

        {/* Streak */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Racha Actual</p>
          <h4 className="text-lg font-black text-amber-500 mt-1">{stats.streak} Días 🔥</h4>
          <span className="text-[9px] text-slate-400 font-semibold uppercase">Días continuos</span>
        </div>

        {/* Compliance percentage */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cumplimiento Mes</p>
          <h4 className="text-lg font-bold text-emerald-600 mt-1">{stats.compliancePercent.toFixed(0)}%</h4>
          <span className="text-[9px] text-slate-400 font-semibold uppercase">Ratio del plan diario</span>
        </div>

        {/* 6 Month Progression indicator */}
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center col-span-2 sm:col-span-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Plan 6 Meses</p>
          <h4 className="text-lg font-bold text-navy-800 mt-1">Hito 1/6</h4>
          <span className="text-[9px] text-emerald-600 font-bold uppercase">Mes 1 en curso</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Register study and logs ledger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Study Form Card */}
          <div className="glass-card p-6 bg-white space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-800">Registrar Sesión de Inglés</h3>
                <p className="text-xs text-slate-400">Registra tus minutos de estudio para sumar a tus objetivos.</p>
              </div>
            </div>

            <form onSubmit={handleLogSession} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Minutes */}
                <div>
                  <label className="form-label">Tiempo (Minutos)</label>
                  <input
                    type="number"
                    required
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Practice Type */}
                <div>
                  <label className="form-label">Práctica</label>
                  <select
                    value={practiceType}
                    onChange={(e) => setPracticeType(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="Listening">Listening</option>
                    <option value="Speaking">Speaking</option>
                    <option value="Reading">Reading</option>
                    <option value="Writing">Writing</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Vocabulary">Vocabulary</option>
                    <option value="Business English">Business English</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="form-label">Dificultad</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="form-input"
                  >
                    <option value="Fácil">Fácil</option>
                    <option value="Medio">Medio</option>
                    <option value="Difícil">Difícil</option>
                  </select>
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="form-label">Tema Estudiado</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Vocabulario de finanzas, Práctica de pitch, Lectura DAX..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="form-label">Notas Personales</label>
                <textarea
                  placeholder="Vocabulario nuevo, dificultades encontradas o aprendizajes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-input h-16"
                />
              </div>

              <button type="submit" className="w-full btn-primary text-xs">
                <Plus className="w-4 h-4" />
                <span>Registrar Estudio</span>
              </button>
            </form>
          </div>

          {/* Ledger of English Sessions */}
          <div className="glass-card p-6 bg-white space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Clock className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-navy-800">Bitácora de Sesiones</h3>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {englishSessions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No has registrado sesiones de estudio aún.</p>
              ) : (
                englishSessions.map((session) => (
                  <div key={session.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-purple-100 text-purple-700">
                          {session.practiceType}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          session.difficulty === 'Fácil' ? 'bg-emerald-50 text-emerald-600' :
                          session.difficulty === 'Medio' ? 'bg-amber-50 text-amber-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {session.difficulty}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{session.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-navy-800 mt-1.5">{session.topic}</h4>
                      {session.notes && <p className="text-[10px] text-slate-400 mt-1 italic">"{session.notes}"</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-800">{session.minutes} minutos</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Curriculum Timeline & Phrases */}
        <div className="space-y-6">
          {/* Phrases to Copy Card */}
          <div className="glass-card p-6 bg-white space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-navy-800">Frases Útiles: Pitch de BI</h3>
            </div>
            <p className="text-xs text-slate-400">Úsalas en tu comunicación diaria con posibles clientes internacionales.</p>

            <div className="space-y-3">
              {usefulPhrases.map((phrase, idx) => (
                <div key={`phrase-${idx}`} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 group relative">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-navy-800">{phrase.en}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{phrase.es}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(phrase.en, idx)}
                    className="p-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200/50 text-slate-400 hover:text-navy-800 transition-colors shrink-0"
                    title="Copiar frase al portapapeles"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Plan */}
          <div className="glass-card p-6 bg-white space-y-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-bold text-navy-800">Plan de 6 Meses de Inglés</h3>
            </div>

            <div className="space-y-3.5">
              {suggestedPlan.map((plan) => (
                <div key={`curriculum-${plan.month}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[9px] font-black shrink-0">
                      {plan.month}
                    </div>
                    {plan.month < 6 && <div className="w-0.5 flex-1 bg-slate-100 mt-1" />}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-navy-800">{plan.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{plan.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
