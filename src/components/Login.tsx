import React, { useState, useEffect } from 'react';
import { Sparkles, Lock, User, Mail, Globe, Tag, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LoginProps {
  initialMode?: 'login' | 'register';
  onBackToLanding: () => void;
}

const quotes = [
  { text: "La disciplina es el puente entre tus metas y tus logros más grandes.", author: "Jim Rohn" },
  { text: "El orden financiero te da libertad de elegir cómo y cuándo trabajar.", author: "Anónimo" },
  { text: "Tus objetivos semanales no fallan por falta de talento, sino por falta de consistencia.", author: "James Clear" }
];

export const Login: React.FC<LoginProps> = ({ initialMode = 'login', onBackToLanding }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { loginUser: apiLoginUser, registerUser: apiRegisterUser } = useApp();
  
  // Login fields
  const [loginUser, setLoginUser] = useState('Kari');
  const [loginPass, setLoginPass] = useState('');

  // Register fields
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regCurrency, setRegCurrency] = useState('COP');
  const [regPlan, setRegPlan] = useState<'Gratuito' | 'Pro' | 'Premium'>('Pro');

  const [errorMsg, setErrorMsg] = useState('');

  // Quotes rotation
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIdx(prev => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginUser.trim()) {
      setErrorMsg('Por favor ingresa tu nombre de usuario.');
      return;
    }

    try {
      await apiLoginUser(loginUser.trim(), loginPass);
    } catch (err: any) {
      setErrorMsg(err.message || 'Contraseña incorrecta o error de conexión. (Prueba con la contraseña demo "123")');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regUser.trim() || !regEmail.trim() || !regPass.trim()) {
      setErrorMsg('Por favor, rellena todos los campos del registro.');
      return;
    }

    // Seed default settings for the registered user
    const userSettings = {
      username: regUser.trim(),
      currency: regCurrency,
      extraIncomeGoal: regCurrency === 'USD' ? 1500 : 4000000,
      dailyEnglishGoal: 1,
      weeklyGymGoal: 4,
      weeklyRunningGoal: 20,
      monthlyBudget: regCurrency === 'USD' ? 1000 : 3500000,
      customCategories: [
        "Salario", "Ingreso extra", "Alimentación", "Transporte", "Vivienda", 
        "Servicios", "Salud", "Gym", "Running", "Ropa", "Ocio", "Familia", 
        "Deudas", "Ahorro", "Educación", "Proyecto digital", "Otros"
      ],
      theme: 'femenino' as const,
      profilePic: '',
      subscriptionPlan: regPlan,
      subscriptionRenewal: '2026-12-31',
      subscriptionStatus: 'Activa' as const
    };

    try {
      await apiRegisterUser(regUser.trim(), regEmail.trim(), regPass, userSettings);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al crear la cuenta. Comprueba los campos.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-slate-950 font-sans text-slate-100 overflow-y-auto">
      {/* LEFT SIDE: Visual Marketing & Quotes Panel (40% width) */}
      <div className="relative w-full md:w-[40%] bg-slate-900 flex flex-col justify-between p-8 md:p-12 border-r border-slate-900/60 overflow-hidden shrink-0">
        {/* Glow circles */}
        <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-[110px] pointer-events-none" />

        {/* Back navigation */}
        <button 
          onClick={onBackToLanding}
          className="relative z-10 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al inicio</span>
        </button>

        {/* Quotes Carousels (Motivators) */}
        <div className="relative z-10 my-12 text-left space-y-6">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit">
            <Sparkles className="w-6 h-6 animate-pulse-soft" />
          </div>
          <div className="min-h-[120px] flex flex-col justify-center">
            <p className="text-lg md:text-xl font-bold leading-relaxed text-white transition-all duration-500">
              "{quotes[activeQuoteIdx].text}"
            </p>
            <p className="text-xs text-slate-500 font-bold mt-3 uppercase tracking-wider">
              — {quotes[activeQuoteIdx].author}
            </p>
          </div>

          <div className="flex gap-1.5 pt-4">
            {quotes.map((_, idx) => (
              <span 
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeQuoteIdx ? 'bg-emerald-400 w-5' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product highlights bullet points */}
        <div className="relative z-10 space-y-3.5 text-left border-t border-slate-800/80 pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Control de Enfoques 360</h5>
              <p className="text-[10px] text-slate-400">Metas, plazos y métricas a tu medida.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Finanzas y Kanban CRM</h5>
              <p className="text-[10px] text-slate-400">Consolida tu economía y embudo de clientes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Forms Panel (60% width) */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 relative overflow-hidden bg-slate-950">
        <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />

        <div className="w-full max-w-md space-y-6 animate-fade-in">
          {/* Form Header */}
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-black tracking-tight text-white uppercase">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crea tu Cuenta'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {mode === 'login' 
                ? 'Ingresa tus credenciales para acceder a tu planner privado.' 
                : 'Empieza a planificar tu vida y finanzas de forma profesional.'
              }
            </p>
          </div>

          {/* Error alerts */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-xs text-left">
              <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Toggle form selectors */}
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-900 text-xs font-bold">
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'login' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ya tengo cuenta
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'register' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Registrarme gratis
            </button>
          </div>

          {/* DUAL FORMS */}
          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    placeholder="Nombre de usuario"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-850 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-850 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer pt-3"
              >
                Ingresar a la Plataforma
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Usuario</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={regUser}
                      onChange={(e) => setRegUser(e.target.value)}
                      placeholder="Ej. Ana"
                      className="w-full pl-9.5 pr-3 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-650"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full pl-9.5 pr-3 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-650"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="Elige una contraseña robusta"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Currency */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Moneda Principal</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <select
                      value={regCurrency}
                      onChange={(e) => setRegCurrency(e.target.value)}
                      className="w-full pl-9.5 pr-3 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    >
                      <option value="COP">COP ($)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="MXN">MXN ($)</option>
                    </select>
                  </div>
                </div>

                {/* Plan */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan de Suscripción</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <select
                      value={regPlan}
                      onChange={(e) => setRegPlan(e.target.value as any)}
                      className="w-full pl-9.5 pr-3 py-2.5 bg-slate-900 border border-slate-850 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                    >
                      <option value="Gratuito">Plan Gratuito ($0)</option>
                      <option value="Pro">Plan Pro ($9.99/mes)</option>
                      <option value="Premium">Plan Premium ($19.99/mes)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer mt-2"
              >
                Crear Cuenta & Comenzar
              </button>
            </form>
          )}

          {/* Quick login guidelines */}
          <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-[10px] text-slate-400 text-left space-y-1">
            <p className="font-bold text-slate-350 flex items-center gap-1">
              <span>💡 Credenciales Demo:</span>
            </p>
            <p>• Usuario: <span className="text-emerald-400 font-bold">Kari</span> (Contraseña: <span className="text-emerald-400 font-bold">123</span>)</p>
            <p>• O introduce cualquier usuario nuevo con contraseña <span className="text-emerald-400 font-bold">123</span>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
