import React from 'react';
import { 
  Sparkles, 
  Target, 
  DollarSign, 
  CheckSquare, 
  Compass, 
  ArrowRight, 
  Play, 
  Check, 
  MessageSquare,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Target,
      title: 'Enfoques & Metas Dinámicas',
      description: 'Define plazos exactos, elige iconos y colores únicos, y registra tu avance semanal de forma adaptada a tus necesidades.',
      color: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      icon: DollarSign,
      title: 'Control Financiero 360',
      description: 'Presupuestos mensuales, egresos fijos y variables. Visualiza gráficos de tendencias e ingresos proyectados a fin de mes.',
      color: 'text-blue-400 bg-blue-500/10'
    },
    {
      icon: Zap,
      title: 'CRM Kanban de Proyectos',
      description: 'Mapea tus clientes potenciales en un tablero Kanban. Calcula el valor propuesto acumulado y el porcentaje de conversión comercial.',
      color: 'text-purple-400 bg-purple-500/10'
    },
    {
      icon: CheckSquare,
      title: 'Hábitos Diarios y Rachas',
      description: 'Consolida tu autodisciplina con un rastreador de hábitos diario. Visualiza tus rachas consecutivas y tu porcentaje de éxito histórico.',
      color: 'text-rose-400 bg-rose-500/10'
    },
    {
      icon: Compass,
      title: 'Organizador de Fin de Semana',
      description: 'Equilibra el descanso familiar, el deporte y el avance de tus proyectos con planes y reflexiones de autoevaluación semanales.',
      color: 'text-amber-400 bg-amber-500/10'
    },
    {
      icon: Shield,
      title: 'Seguridad y Privacidad Local',
      description: 'Tus datos son 100% tuyos. Toda la información se guarda localmente en tu navegador sin servidores intermedios.',
      color: 'text-teal-400 bg-teal-500/10'
    }
  ];

  const plans = [
    {
      name: 'Plan Gratuito',
      price: '$0',
      period: 'por siempre',
      desc: 'Para personas que quieren ordenar sus metas básicas del día a día.',
      features: [
        'Hasta 2 Enfoques / Metas activos',
        'Registro de hábitos esenciales',
        'Control financiero básico (gastos diarios)',
        'Guardado local e importación/exportación'
      ],
      cta: 'Comenzar Gratis',
      popular: false,
      view: 'register' as const
    },
    {
      name: 'Plan Pro',
      price: '$9.99',
      period: 'al mes',
      desc: 'El plan ideal para profesionales independientes y optimizadores de vida.',
      features: [
        'Enfoques / Metas ilimitadas',
        'CRM de Proyectos & Tablero Kanban completo',
        'Presupuestos financieros avanzados y proyecciones',
        'Reflexiones semanales y organizador de fines de semana',
        'Soporte prioritario por email'
      ],
      cta: 'Probar Plan Pro',
      popular: true,
      view: 'register' as const
    },
    {
      name: 'Plan Premium',
      price: '$19.99',
      period: 'al mes',
      desc: 'Para usuarios avanzados que buscan acelerar su crecimiento financiero y productividad.',
      features: [
        'Todo lo del Plan Pro',
        'Gráficos estadísticos avanzados e históricos',
        'Consultoría quincenal de objetivos (simulada)',
        'Personalización estética extendida (todos los temas y avatares)',
        'Soporte VIP 24/7'
      ],
      cta: 'Obtener Premium',
      popular: false,
      view: 'register' as const
    }
  ];

  const testimonials = [
    {
      name: 'Kari Florez',
      role: 'Directora de Analítica',
      quote: 'Plan 360 cambió por completo cómo organizo mi semana. Logré cumplir mi meta de inglés, optimizar mi rutina de gimnasio y cerrar 3 contratos nuevos en el CRM.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'
    },
    {
      name: 'Alejandro Gómez',
      role: 'Consultor de Power BI',
      quote: 'La integración entre el control de gastos de proyectos y el embudo Kanban de prospectos en una sola interfaz local es oro puro. No dependo de software costoso.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop'
    },
    {
      name: 'Sofía Restrepo',
      role: 'Emprendedora Digital',
      quote: 'Me encanta que no requiere crear cuentas en servidores extraños. Toda mi información financiera y mis hábitos de meditación quedan guardados de forma segura en mi máquina.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop'
    }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-0 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-xl text-slate-900 shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-white tracking-wider">PLAN 360</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Características</a>
            <a href="#pricing" className="hover:text-white transition-colors">Precios</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonios</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="px-4.5 py-2 bg-gradient-to-tr from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-900 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all cursor-pointer"
            >
              Probar Gratis
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 max-w-7xl mx-auto px-6 text-center space-y-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse-soft" />
          <span>Lanza tu potencial hoy</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
          Toma el <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">Control 360</span> de tus Metas, Finanzas y Negocios
        </h1>

        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          La plataforma definitiva para gestionar de forma integral tus planes semanales, hábitos diarios, presupuestos financieros y embudos CRM de clientes en un solo entorno premium y local.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => onNavigate('register')}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-tr from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Comenzar gratis ahora</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current text-slate-400" />
            <span>Ver Características</span>
          </a>
        </div>

        {/* Mockup Dashboard Preview */}
        <div className="relative pt-12 max-w-5xl mx-auto animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
          <div className="relative p-2 bg-slate-900/60 border border-slate-800/80 rounded-3xl shadow-2xl backdrop-blur-sm overflow-hidden">
            {/* Window control bar */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/60 bg-slate-950/20">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[9px] text-slate-500 font-bold ml-4 uppercase tracking-widest">PLAN360 - Dashboard Demo</span>
            </div>
            
            {/* Fake layout representation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950/40 text-left">
              {/* Fake card 1 */}
              <div className="p-4 bg-slate-900 border border-slate-800/60 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                  <span>Disponible Actual</span>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-black text-white">$ 3.420.000 COP</h3>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[65%]" />
                </div>
              </div>
              {/* Fake card 2 */}
              <div className="p-4 bg-slate-900 border border-slate-800/60 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                  <span>Mis Enfoques</span>
                  <Target className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <h3 className="text-lg font-black text-white">4 / 5 Horas de Inglés</h3>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full w-[80%]" />
                </div>
              </div>
              {/* Fake card 3 */}
              <div className="p-4 bg-slate-900 border border-slate-800/60 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                  <span>Cumplimiento Hábitos</span>
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <h3 className="text-lg font-black text-white">Racha: 7 Días 🔥</h3>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-400 h-full w-[90%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-slate-900 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">Todo lo que necesitas en una sola plataforma</h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Hemos integrado las herramientas de productividad y finanzas más potentes del mercado en un entorno minimalista y veloz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-900/40 border border-slate-850 p-6 rounded-3xl hover:border-slate-800 transition-all space-y-4 text-left group"
              >
                <div className={`p-3.5 rounded-2xl w-fit ${f.color} group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Plans & Pricing */}
      <section id="pricing" className="py-24 border-t border-slate-900 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">Planes Simples y Transparentes</h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto">
            Elige el plan que mejor se adapte a tus requerimientos. Puedes comenzar de forma gratuita hoy mismo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <div 
              key={idx}
              className={`p-8 rounded-3xl border flex flex-col justify-between space-y-8 text-left transition-all ${
                p.popular 
                  ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/5 relative lg:-translate-y-2' 
                  : 'bg-slate-900/50 border-slate-850 hover:border-slate-800'
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase rounded-full tracking-wider shadow-md">
                  Más Popular
                </span>
              )}

              <div className="space-y-4">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">{p.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
                <div className="pt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white">{p.price}</span>
                  <span className="text-slate-500 text-xs font-semibold">/ {p.period}</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 pt-4 text-xs text-slate-350">
                {p.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigate(p.view)}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                  p.popular
                    ? 'bg-gradient-to-tr from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950'
                    : 'bg-slate-850 hover:bg-slate-800 text-white'
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 border-t border-slate-900 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">Probado y Aprobado por Profesionales</h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto">
            Descubre lo que dicen las personas que ya están tomando el control 360 de sus rutinas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/30 border border-slate-850 p-6 rounded-3xl text-left space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed italic">"{t.quote}"</p>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-850">
                <img 
                  src={t.avatarUrl} 
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700" 
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 border-t border-slate-900 bg-slate-900/10 text-center max-w-5xl mx-auto px-6 rounded-3xl mb-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[90px] pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">¿Listo para el cambio definitivo?</h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Consolida tu disciplina personal y empresarial hoy. Prueba PLAN 360 gratis en segundos.
          </p>
          <button 
            onClick={() => onNavigate('register')}
            className="px-8 py-3.5 bg-gradient-to-tr from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-emerald-500/10 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Crear cuenta gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 text-center text-[10px] text-slate-500 font-semibold uppercase tracking-wider space-y-3">
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-slate-350 transition-colors">Términos</a>
          <a href="#" className="hover:text-slate-350 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-slate-350 transition-colors">Soporte</a>
        </div>
        <p>© {new Date().getFullYear()} PLAN 360 SaaS. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};
