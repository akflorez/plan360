import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Habit, CalendarEvent, FocusPlan, FocusPlanSession, Prospect, MonthlyRoadmap, WeekendPlan, UserSettings } from '../types';
import { 
  defaultSettings, 
  defaultTransactions, 
  defaultHabits, 
  defaultEvents, 
  defaultFocusPlans, 
  defaultFocusSessions, 
  defaultProspects, 
  defaultRoadmaps, 
  defaultWeekendPlans 
} from '../utils/mockData';

interface AppContextProps {
  // Auth state
  token: string | null;
  isAuthenticated: boolean;
  isLoadingData: boolean;
  loginUser: (username: string, pass: string) => Promise<any>;
  registerUser: (username: string, email: string, pass: string, settings: UserSettings) => Promise<any>;
  logoutUser: () => void;

  // Planner states
  settings: UserSettings;
  transactions: Transaction[];
  habits: Habit[];
  events: CalendarEvent[];
  focusPlans: FocusPlan[];
  focusSessions: FocusPlanSession[];
  prospects: Prospect[];
  roadmaps: MonthlyRoadmap[];
  weekendPlans: WeekendPlan[];
  
  // Modifiers
  updateSettings: (newSettings: UserSettings) => void;
  
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  
  toggleHabit: (id: string, date: string, comment?: string) => void;
  
  addEvent: (evt: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (evt: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  
  addFocusPlan: (plan: Omit<FocusPlan, 'id' | 'createdAt'>) => void;
  deleteFocusPlan: (id: string) => void;
  addFocusSession: (session: Omit<FocusPlanSession, 'id'>) => void;
  deleteFocusSession: (id: string) => void;
  
  addProspect: (prospect: Omit<Prospect, 'id'>) => void;
  updateProspect: (prospect: Prospect) => void;
  deleteProspect: (id: string) => void;
  
  updateRoadmapGoal: (monthId: number, goalId: string, done: boolean) => void;
  updateRoadmapText: (monthId: number, outcome: string, notes: string) => void;
  
  saveWeekendPlan: (plan: WeekendPlan) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Helper for making API calls with JWT header
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('plan_360_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error del servidor (código: ${response.status})`);
  }
  return response.json();
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('plan_360_token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('plan_360_auth') === 'true');
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // States initialized with LocalStorage or mocks
  const [settings, setSettings] = useState<UserSettings>(() => {
    const val = localStorage.getItem('kari_360_settings');
    return val ? JSON.parse(val) : defaultSettings;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const val = localStorage.getItem('kari_360_transactions');
    return val ? JSON.parse(val) : defaultTransactions;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const val = localStorage.getItem('kari_360_habits');
    return val ? JSON.parse(val) : defaultHabits;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const val = localStorage.getItem('kari_360_events');
    return val ? JSON.parse(val) : defaultEvents;
  });

  const [focusPlans, setFocusPlans] = useState<FocusPlan[]>(() => {
    const val = localStorage.getItem('kari_360_focusPlans');
    return val ? JSON.parse(val) : defaultFocusPlans;
  });

  const [focusSessions, setFocusSessions] = useState<FocusPlanSession[]>(() => {
    const val = localStorage.getItem('kari_360_focusSessions');
    return val ? JSON.parse(val) : defaultFocusSessions;
  });

  const [prospects, setProspects] = useState<Prospect[]>(() => {
    const val = localStorage.getItem('kari_360_prospects');
    return val ? JSON.parse(val) : defaultProspects;
  });

  const [roadmaps, setRoadmaps] = useState<MonthlyRoadmap[]>(() => {
    const val = localStorage.getItem('kari_360_roadmaps');
    return val ? JSON.parse(val) : defaultRoadmaps;
  });

  const [weekendPlans, setWeekendPlans] = useState<WeekendPlan[]>(() => {
    const val = localStorage.getItem('kari_360_weekendPlans');
    return val ? JSON.parse(val) : defaultWeekendPlans;
  });

  // Sync state changes with LocalStorage (offline fallback cache)
  useEffect(() => {
    localStorage.setItem('kari_360_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('kari_360_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kari_360_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('kari_360_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('kari_360_focusPlans', JSON.stringify(focusPlans));
  }, [focusPlans]);

  useEffect(() => {
    localStorage.setItem('kari_360_focusSessions', JSON.stringify(focusSessions));
  }, [focusSessions]);

  useEffect(() => {
    localStorage.setItem('kari_360_prospects', JSON.stringify(prospects));
  }, [prospects]);

  useEffect(() => {
    localStorage.setItem('kari_360_roadmaps', JSON.stringify(roadmaps));
  }, [roadmaps]);

  useEffect(() => {
    localStorage.setItem('kari_360_weekendPlans', JSON.stringify(weekendPlans));
  }, [weekendPlans]);

  // Load database data when token is set/changed
  useEffect(() => {
    if (!token) return;

    const loadAllData = async () => {
      setIsLoadingData(true);
      try {
        const [
          profileData,
          plansData,
          sessionsData,
          txsData,
          habitsData,
          evtsData,
          prospectsData,
          roadmapsData,
          weekendPlansData
        ] = await Promise.all([
          apiFetch('/api/auth/me').catch(() => null),
          apiFetch('/api/focus-plans').catch(() => null),
          apiFetch('/api/focus-sessions').catch(() => null),
          apiFetch('/api/transactions').catch(() => null),
          apiFetch('/api/habits').catch(() => null),
          apiFetch('/api/events').catch(() => null),
          apiFetch('/api/prospects').catch(() => null),
          apiFetch('/api/roadmaps').catch(() => null),
          apiFetch('/api/weekend-plans').catch(() => null)
        ]);

        if (profileData && profileData.settings) {
          setSettings(profileData.settings);
        }
        if (plansData) setFocusPlans(plansData);
        if (sessionsData) setFocusSessions(sessionsData);
        if (txsData) setTransactions(txsData);
        if (habitsData) setHabits(habitsData);
        if (evtsData) setEvents(evtsData);
        if (prospectsData) setProspects(prospectsData);
        if (roadmapsData && roadmapsData.length > 0) {
          setRoadmaps(roadmapsData);
        }
        if (weekendPlansData) setWeekendPlans(weekendPlansData);

      } catch (err) {
        console.error('Error loading user database data:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAllData();
  }, [token]);

  // --- AUTH ACTIONS ---

  const loginUser = async (username: string, pass: string) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password: pass })
    });
    localStorage.setItem('plan_360_token', data.token);
    localStorage.setItem('plan_360_auth', 'true');
    setToken(data.token);
    setIsAuthenticated(true);
    if (data.user.settings) {
      setSettings(data.user.settings);
    }
    return data;
  };

  const registerUser = async (username: string, email: string, pass: string, initialSettings: UserSettings) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password: pass, settings: initialSettings })
    });
    localStorage.setItem('plan_360_token', data.token);
    localStorage.setItem('plan_360_auth', 'true');
    setToken(data.token);
    setIsAuthenticated(true);
    if (data.user.settings) {
      setSettings(data.user.settings);
    }
    return data;
  };

  const logoutUser = () => {
    localStorage.removeItem('plan_360_token');
    localStorage.removeItem('plan_360_auth');
    setToken(null);
    setIsAuthenticated(false);
    // Reset back to defaults or clear
    setSettings(defaultSettings);
    setTransactions(defaultTransactions);
    setHabits(defaultHabits);
    setEvents(defaultEvents);
    setFocusPlans(defaultFocusPlans);
    setFocusSessions(defaultFocusSessions);
    setProspects(defaultProspects);
    setRoadmaps(defaultRoadmaps);
    setWeekendPlans(defaultWeekendPlans);
  };

  // --- DATA MODIFICATION ACTIONS ---

  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    if (token) {
      apiFetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify(newSettings)
      }).catch(err => console.error('Error saving settings to database:', err));
    }
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);
    if (token) {
      apiFetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(newTx)
      }).catch(err => console.error('Error saving transaction to database:', err));
    }
  };

  const updateTransaction = (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
    if (token) {
      apiFetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(updatedTx)
      }).catch(err => console.error('Error updating transaction in database:', err));
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (token) {
      apiFetch(`/api/transactions/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error('Error deleting transaction from database:', err));
    }
  };

  const toggleHabit = (habitId: string, date: string, comment?: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const newLogs = { ...habit.logs };
      if (newLogs[date]?.done) {
        delete newLogs[date];
      } else {
        newLogs[date] = { done: true, comment: comment || "" };
      }
      
      const updated = {
        ...habit,
        logs: newLogs
      };

      if (token) {
        apiFetch('/api/habits', {
          method: 'POST',
          body: JSON.stringify(updated)
        }).catch(err => console.error('Error saving toggled habit to database:', err));
      }
      
      return updated;
    }));
  };

  const addEvent = (evt: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = {
      ...evt,
      id: `ev-${Date.now()}`
    };
    setEvents(prev => [...prev, newEvt]);
    if (token) {
      apiFetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(newEvt)
      }).catch(err => console.error('Error saving event to database:', err));
    }
  };

  const updateEvent = (updatedEvt: CalendarEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvt.id ? updatedEvt : e));
    if (token) {
      apiFetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(updatedEvt)
      }).catch(err => console.error('Error updating event in database:', err));
    }
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    if (token) {
      apiFetch(`/api/events/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error('Error deleting event from database:', err));
    }
  };

  const addFocusPlan = (plan: Omit<FocusPlan, 'id' | 'createdAt'>) => {
    const newPlan: FocusPlan = {
      ...plan,
      id: `fp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFocusPlans(prev => [...prev, newPlan]);
    if (token) {
      apiFetch('/api/focus-plans', {
        method: 'POST',
        body: JSON.stringify(newPlan)
      }).catch(err => console.error('Error saving focus plan to database:', err));
    }
  };

  const deleteFocusPlan = (id: string) => {
    setFocusPlans(prev => prev.filter(p => p.id !== id));
    setFocusSessions(prev => prev.filter(s => s.planId !== id));
    if (token) {
      apiFetch(`/api/focus-plans/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error('Error deleting focus plan from database:', err));
    }
  };

  const addFocusSession = (session: Omit<FocusPlanSession, 'id'>) => {
    const newSession: FocusPlanSession = {
      ...session,
      id: `fs-${Date.now()}`
    };
    setFocusSessions(prev => [newSession, ...prev]);
    if (token) {
      apiFetch('/api/focus-sessions', {
        method: 'POST',
        body: JSON.stringify(newSession)
      }).catch(err => console.error('Error saving focus session to database:', err));
    }
  };

  const deleteFocusSession = (id: string) => {
    setFocusSessions(prev => prev.filter(s => s.id !== id));
    if (token) {
      apiFetch(`/api/focus-sessions/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error('Error deleting focus session from database:', err));
    }
  };

  const addProspect = (p: Omit<Prospect, 'id'>) => {
    const newProspect: Prospect = {
      ...p,
      id: `p-${Date.now()}`
    };
    setProspects(prev => [...prev, newProspect]);
    if (token) {
      apiFetch('/api/prospects', {
        method: 'POST',
        body: JSON.stringify(newProspect)
      }).catch(err => console.error('Error saving prospect to database:', err));
    }
  };

  const updateProspect = (updatedP: Prospect) => {
    setProspects(prev => prev.map(p => p.id === updatedP.id ? updatedP : p));
    if (token) {
      apiFetch('/api/prospects', {
        method: 'POST',
        body: JSON.stringify(updatedP)
      }).catch(err => console.error('Error updating prospect in database:', err));
    }
  };

  const deleteProspect = (id: string) => {
    setProspects(prev => prev.filter(p => p.id !== id));
    if (token) {
      apiFetch(`/api/prospects/${id}`, {
        method: 'DELETE'
      }).catch(err => console.error('Error deleting prospect from database:', err));
    }
  };

  const updateRoadmapGoal = (monthId: number, goalId: string, done: boolean) => {
    setRoadmaps(prev => prev.map(roadmap => {
      if (roadmap.id !== monthId) return roadmap;
      const updated = {
        ...roadmap,
        objectives: roadmap.objectives.map(obj => obj.id === goalId ? { ...obj, done } : obj)
      };
      if (token) {
        apiFetch('/api/roadmaps', {
          method: 'POST',
          body: JSON.stringify(updated)
        }).catch(err => console.error('Error updating roadmap goal in database:', err));
      }
      return updated;
    }));
  };

  const updateRoadmapText = (monthId: number, outcome: string, notes: string) => {
    setRoadmaps(prev => prev.map(roadmap => {
      if (roadmap.id !== monthId) return roadmap;
      const updated = {
        ...roadmap,
        outcome,
        notes
      };
      if (token) {
        apiFetch('/api/roadmaps', {
          method: 'POST',
          body: JSON.stringify(updated)
        }).catch(err => console.error('Error updating roadmap text in database:', err));
      }
      return updated;
    }));
  };

  const saveWeekendPlan = (plan: WeekendPlan) => {
    setWeekendPlans(prev => {
      const idx = prev.findIndex(p => p.id === plan.id);
      let updatedList = [...prev];
      if (idx >= 0) {
        updatedList[idx] = plan;
      } else {
        updatedList.push(plan);
      }
      if (token) {
        apiFetch('/api/weekend-plans', {
          method: 'POST',
          body: JSON.stringify(plan)
        }).catch(err => console.error('Error saving weekend plan to database:', err));
      }
      return updatedList;
    });
  };

  const resetAllData = () => {
    setSettings(defaultSettings);
    setTransactions(defaultTransactions);
    setHabits(defaultHabits);
    setEvents(defaultEvents);
    setFocusPlans(defaultFocusPlans);
    setFocusSessions(defaultFocusSessions);
    setProspects(defaultProspects);
    setRoadmaps(defaultRoadmaps);
    setWeekendPlans(defaultWeekendPlans);
    
    // Clear local storage
    localStorage.removeItem('kari_360_settings');
    localStorage.removeItem('kari_360_transactions');
    localStorage.removeItem('kari_360_habits');
    localStorage.removeItem('kari_360_events');
    localStorage.removeItem('kari_360_focusPlans');
    localStorage.removeItem('kari_360_focusSessions');
    localStorage.removeItem('kari_360_prospects');
    localStorage.removeItem('kari_360_roadmaps');
    localStorage.removeItem('kari_360_weekendPlans');

    // If authenticated, we could trigger a server reset or save default values
    if (token) {
      apiFetch('/api/settings', { method: 'POST', body: JSON.stringify(defaultSettings) }).catch(() => {});
      // Note: Full server reset is omitted for safety, but saving initial settings is executed.
    }
  };

  return (
    <AppContext.Provider value={{
      token,
      isAuthenticated,
      isLoadingData,
      loginUser,
      registerUser,
      logoutUser,

      settings,
      transactions,
      habits,
      events,
      focusPlans,
      focusSessions,
      prospects,
      roadmaps,
      weekendPlans,
      updateSettings,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      toggleHabit,
      addEvent,
      updateEvent,
      deleteEvent,
      addFocusPlan,
      deleteFocusPlan,
      addFocusSession,
      deleteFocusSession,
      addProspect,
      updateProspect,
      deleteProspect,
      updateRoadmapGoal,
      updateRoadmapText,
      saveWeekendPlan,
      resetAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
