import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './pages/Dashboard';
import { Finanzas } from './pages/Finanzas';
import { Calendario } from './pages/Calendario';
import { Habitos } from './pages/Habitos';
import { Ingles } from './pages/Ingles';
import { GymRunning } from './pages/GymRunning';
import { Proyecto4M } from './pages/Proyecto4M';
import { FinesDeSemana } from './pages/FinesDeSemana';
import { Metas6Meses } from './pages/Metas6Meses';
import { Configuracion } from './pages/Configuracion';

function AppContent() {
  const { settings } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Local authentication state backed by LocalStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('plan_360_auth') === 'true';
  });

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('plan_360_auth', 'true');
    // Set username configured in config page if needed, or default
    const storedSettings = localStorage.getItem('kari_360_settings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      parsed.username = username;
      localStorage.setItem('kari_360_settings', JSON.stringify(parsed));
    }
  };

  const handleLogout = () => {
    if (confirm('¿Estás segura de cerrar tu sesión actual?')) {
      setIsAuthenticated(false);
      localStorage.removeItem('plan_360_auth');
    }
  };

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'finanzas':
        return <Finanzas />;
      case 'calendario':
        return <Calendario />;
      case 'habitos':
        return <Habitos />;
      case 'ingles':
        return <Ingles />;
      case 'gym-running':
        return <GymRunning />;
      case 'proyecto-4m':
        return <Proyecto4M />;
      case 'weekend':
        return <FinesDeSemana />;
      case 'metas-6m':
        return <Metas6Meses />;
      case 'configuracion':
        return <Configuracion />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`theme-${settings.theme || 'femenino'}`}>
      <Layout currentTab={currentTab} setCurrentTab={setCurrentTab} onLogout={handleLogout}>
        {renderActiveTab()}
      </Layout>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
