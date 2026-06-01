import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Habit, CalendarEvent, EnglishSession, WorkoutSession, RunningSession, Prospect, MonthlyRoadmap, WeekendPlan, UserSettings } from '../types';
import { 
  defaultSettings, 
  defaultTransactions, 
  defaultHabits, 
  defaultEvents, 
  defaultEnglishSessions, 
  defaultWorkoutSessions, 
  defaultRunningSessions, 
  defaultProspects, 
  defaultRoadmaps, 
  defaultWeekendPlans 
} from '../utils/mockData';

interface AppContextProps {
  settings: UserSettings;
  transactions: Transaction[];
  habits: Habit[];
  events: CalendarEvent[];
  englishSessions: EnglishSession[];
  workoutSessions: WorkoutSession[];
  runningSessions: RunningSession[];
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
  
  addEnglishSession: (session: Omit<EnglishSession, 'id'>) => void;
  
  addWorkoutSession: (session: Omit<WorkoutSession, 'id'>) => void;
  addRunningSession: (session: Omit<RunningSession, 'id'>) => void;
  
  addProspect: (prospect: Omit<Prospect, 'id'>) => void;
  updateProspect: (prospect: Prospect) => void;
  deleteProspect: (id: string) => void;
  
  updateRoadmapGoal: (monthId: number, goalId: string, done: boolean) => void;
  updateRoadmapText: (monthId: number, outcome: string, notes: string) => void;
  
  saveWeekendPlan: (plan: WeekendPlan) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or default mocks
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

  const [englishSessions, setEnglishSessions] = useState<EnglishSession[]>(() => {
    const val = localStorage.getItem('kari_360_englishSessions');
    return val ? JSON.parse(val) : defaultEnglishSessions;
  });

  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>(() => {
    const val = localStorage.getItem('kari_360_workoutSessions');
    return val ? JSON.parse(val) : defaultWorkoutSessions;
  });

  const [runningSessions, setRunningSessions] = useState<RunningSession[]>(() => {
    const val = localStorage.getItem('kari_360_runningSessions');
    return val ? JSON.parse(val) : defaultRunningSessions;
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

  // Sync state changes with LocalStorage
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
    localStorage.setItem('kari_360_englishSessions', JSON.stringify(englishSessions));
  }, [englishSessions]);

  useEffect(() => {
    localStorage.setItem('kari_360_workoutSessions', JSON.stringify(workoutSessions));
  }, [workoutSessions]);

  useEffect(() => {
    localStorage.setItem('kari_360_runningSessions', JSON.stringify(runningSessions));
  }, [runningSessions]);

  useEffect(() => {
    localStorage.setItem('kari_360_prospects', JSON.stringify(prospects));
  }, [prospects]);

  useEffect(() => {
    localStorage.setItem('kari_360_roadmaps', JSON.stringify(roadmaps));
  }, [roadmaps]);

  useEffect(() => {
    localStorage.setItem('kari_360_weekendPlans', JSON.stringify(weekendPlans));
  }, [weekendPlans]);

  // Operations
  const updateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const updateTransaction = (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const toggleHabit = (habitId: string, date: string, comment?: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;
      
      const newLogs = { ...habit.logs };
      if (newLogs[date]?.done) {
        // If already checked, uncheck it
        delete newLogs[date];
      } else {
        // If not checked or doesn't exist, check it
        newLogs[date] = { done: true, comment: comment || "" };
      }
      
      return {
        ...habit,
        logs: newLogs
      };
    }));
  };

  const addEvent = (evt: Omit<CalendarEvent, 'id'>) => {
    const newEvt: CalendarEvent = {
      ...evt,
      id: `ev-${Date.now()}`
    };
    setEvents(prev => [...prev, newEvt]);
  };

  const updateEvent = (updatedEvt: CalendarEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvt.id ? updatedEvt : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addEnglishSession = (session: Omit<EnglishSession, 'id'>) => {
    const newSession: EnglishSession = {
      ...session,
      id: `en-${Date.now()}`
    };
    setEnglishSessions(prev => [newSession, ...prev]);
  };

  const addWorkoutSession = (session: Omit<WorkoutSession, 'id'>) => {
    const newSession: WorkoutSession = {
      ...session,
      id: `w-${Date.now()}`
    };
    setWorkoutSessions(prev => [newSession, ...prev]);
  };

  const addRunningSession = (session: Omit<RunningSession, 'id'>) => {
    const newSession: RunningSession = {
      ...session,
      id: `r-${Date.now()}`
    };
    setRunningSessions(prev => [newSession, ...prev]);
  };

  const addProspect = (p: Omit<Prospect, 'id'>) => {
    const newProspect: Prospect = {
      ...p,
      id: `p-${Date.now()}`
    };
    setProspects(prev => [...prev, newProspect]);
  };

  const updateProspect = (updatedP: Prospect) => {
    setProspects(prev => prev.map(p => p.id === updatedP.id ? updatedP : p));
  };

  const deleteProspect = (id: string) => {
    setProspects(prev => prev.filter(p => p.id !== id));
  };

  const updateRoadmapGoal = (monthId: number, goalId: string, done: boolean) => {
    setRoadmaps(prev => prev.map(roadmap => {
      if (roadmap.id !== monthId) return roadmap;
      return {
        ...roadmap,
        objectives: roadmap.objectives.map(obj => obj.id === goalId ? { ...obj, done } : obj)
      };
    }));
  };

  const updateRoadmapText = (monthId: number, outcome: string, notes: string) => {
    setRoadmaps(prev => prev.map(roadmap => {
      if (roadmap.id !== monthId) return roadmap;
      return {
        ...roadmap,
        outcome,
        notes
      };
    }));
  };

  const saveWeekendPlan = (plan: WeekendPlan) => {
    setWeekendPlans(prev => {
      const idx = prev.findIndex(p => p.id === plan.id);
      if (idx >= 0) {
        const newPlans = [...prev];
        newPlans[idx] = plan;
        return newPlans;
      } else {
        return [...prev, plan];
      }
    });
  };

  const resetAllData = () => {
    setSettings(defaultSettings);
    setTransactions(defaultTransactions);
    setHabits(defaultHabits);
    setEvents(defaultEvents);
    setEnglishSessions(defaultEnglishSessions);
    setWorkoutSessions(defaultWorkoutSessions);
    setRunningSessions(defaultRunningSessions);
    setProspects(defaultProspects);
    setRoadmaps(defaultRoadmaps);
    setWeekendPlans(defaultWeekendPlans);
    
    // Clear local storage
    localStorage.removeItem('kari_360_settings');
    localStorage.removeItem('kari_360_transactions');
    localStorage.removeItem('kari_360_habits');
    localStorage.removeItem('kari_360_events');
    localStorage.removeItem('kari_360_englishSessions');
    localStorage.removeItem('kari_360_workoutSessions');
    localStorage.removeItem('kari_360_runningSessions');
    localStorage.removeItem('kari_360_prospects');
    localStorage.removeItem('kari_360_roadmaps');
    localStorage.removeItem('kari_360_weekendPlans');
  };

  return (
    <AppContext.Provider value={{
      settings,
      transactions,
      habits,
      events,
      englishSessions,
      workoutSessions,
      runningSessions,
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
      addEnglishSession,
      addWorkoutSession,
      addRunningSession,
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
