import React, { useState } from 'react';
import { Sparkles, Lock, User, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [usernameInput, setUsernameInput] = useState('Kari');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!usernameInput.trim()) {
      setErrorMsg('Por favor ingresa tu nombre de usuario.');
      return;
    }

    // Default credential validation
    if (usernameInput.trim().toLowerCase() === 'kari' && passwordInput === '123') {
      onLogin(usernameInput.trim());
    } else if (passwordInput === '123') {
      // Allow other custom usernames as long as the password is correct
      onLogin(usernameInput.trim());
    } else {
      setErrorMsg('Contraseña incorrecta. (Prueba con "123")');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 overflow-hidden font-sans">
      {/* Premium Background Blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px]" />
      <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] rounded-full bg-aqua-500/5 blur-[90px]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md mx-4 p-8 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl text-center space-y-6">
        
        {/* Logo/Icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3.5 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl text-navy-800 shadow-lg shadow-emerald-500/20 animate-pulse-soft">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">PLAN 360</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Plataforma Privada • Control Personal</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed px-4">
          Ingresa tus credenciales para acceder a tus finanzas, hábitos, estudio y proyecciones de los próximos 6 meses.
        </p>

        {/* Error Message */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Usuario</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Nombre de usuario"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresa contraseña"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/40 border border-slate-800 rounded-xl text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition-all cursor-pointer mt-2"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Credentials hints */}
        <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-slate-400 text-left space-y-1">
          <p className="font-bold text-slate-300">💡 Credenciales de demostración:</p>
          <p>• Usuario: <span className="text-emerald-400 font-bold">Kari</span></p>
          <p>• Contraseña: <span className="text-emerald-400 font-bold">123</span></p>
        </div>
      </div>
    </div>
  );
};
