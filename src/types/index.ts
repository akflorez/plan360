export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'ingreso' | 'gasto' | 'egreso fijo' | 'egreso variable' | 'ahorro' | 'inversion';
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: 'pagado' | 'pendiente' | 'proyectado';
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'diario' | 'semanal' | 'personalizado';
  target: number;
  unit: string;
  logs: Record<string, { done: boolean; comment?: string }>; // Record key: YYYY-MM-DD
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  activityType: 'inglés' | 'gym' | 'running' | 'proyecto $4m' | 'finanzas' | 'descanso' | 'familia' | 'plan personal' | 'fin de semana' | 'pago' | 'recordatorio';
  description: string;
  status: 'pendiente' | 'realizado' | 'cancelado';
}

export interface EnglishSession {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  practiceType: 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Grammar' | 'Vocabulary' | 'Business English';
  topic: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  notes: string;
}

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'Pierna' | 'Brazos' | 'Hombros' | 'Espalda' | 'Pecho' | 'Core' | 'Full body';
  duration: number; // minutes
  intensity: 'Baja' | 'Media' | 'Alta';
  exercises: string;
  notes: string;
  energyLevel: number; // 1-5
}

export interface RunningSession {
  id: string;
  date: string; // YYYY-MM-DD
  distance: number; // km
  time: string; // HH:MM:SS or MM:SS
  pace: string; // min/km
  type: 'Suave' | 'Fondo' | 'Series' | 'Tempo' | 'Recuperación';
  sensations: string;
  notes: string;
}

export interface Prospect {
  id: string;
  name: string;
  company: string;
  contact: string;
  phone: string;
  email: string;
  need: string;
  serviceOffered: string;
  valueProposed: number;
  status: 'prospecto' | 'contactado' | 'reunion' | 'propuesta' | 'negociacion' | 'ganado' | 'perdido';
  nextStep: string;
  followUpDate: string; // YYYY-MM-DD
  notes: string;
}

export interface MonthlyRoadmap {
  id: number; // 1 to 6
  name: string; // "Mes 1", "Mes 2", etc.
  objectives: {
    id: string;
    text: string;
    done: boolean;
  }[];
  outcome: string;
  notes: string;
}

export interface WeekendPlan {
  id: string; // YYYY-[weekNo] (e.g. 2026-22)
  saturday: { id: string; text: string; done: boolean }[];
  sunday: { id: string; text: string; done: boolean }[];
  reflection: {
    good: string;
    improve: string;
    expenseControl: string;
    englishAdv: string;
    projectAdv: string;
    nextWeekOrg: string;
  };
}

export interface UserSettings {
  username: string;
  currency: string;
  extraIncomeGoal: number;
  dailyEnglishGoal: number; // in hours (e.g. 1)
  weeklyGymGoal: number; // in sessions (e.g. 3)
  weeklyRunningGoal: number; // in km (e.g. 15)
  monthlyBudget: number;
  customCategories: string[];
  theme: 'femenino' | 'femenino-rosa' | 'masculino' | 'masculino-oscuro';
  profilePic?: string; // Base64 data URI string or predefined URL
  subscriptionPlan: 'Gratuito' | 'Pro' | 'Premium';
  subscriptionRenewal: string; // YYYY-MM-DD
  subscriptionStatus: 'Activa' | 'Vencida';
}
