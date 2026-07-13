export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'ingreso' | 'gasto' | 'egreso fijo' | 'egreso variable' | 'ahorro' | 'inversion';
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: 'pagado' | 'pendiente' | 'proyectado';
  account?: string; // e.g. 'Bancolombia', 'Nequi', 'Efectivo'
  isShared?: boolean;
  sharedPerson?: string; // e.g. 'Juan'
  sharedAmount?: number; // the portion belonging to the other person (debt/receivable)
  sharedPaid?: boolean; // whether the other person paid their share back
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

export interface FocusPlan {
  id: string;
  name: string;
  icon: string; // e.g. 'Dumbbell', 'Book', 'Languages', 'Target', 'Heart', 'Zap', 'BookOpen', 'Globe'
  color: 'emerald' | 'indigo' | 'purple' | 'rose' | 'amber' | 'blue' | 'aqua';
  target: number; // e.g. 5, 4, 20
  unit: string; // e.g. 'horas', 'sesiones', 'km', 'páginas', 'minutos'
  timeframeType: 'months' | 'date';
  timeframeValue: string; // e.g. "3" (for 3 months) or "2026-12-31" (target date)
  createdAt: string; // YYYY-MM-DD
}

export interface FocusPlanSession {
  id: string;
  planId: string;
  date: string; // YYYY-MM-DD
  value: number; // e.g. 1.5, 1, 15
  details: string; // topic, type, details
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
  customAccounts?: string[]; // e.g. ['Bancolombia', 'Nequi', 'Efectivo']
  theme: 'femenino' | 'femenino-rosa' | 'masculino' | 'masculino-oscuro';
  profilePic?: string; // Base64 data URI string or predefined URL
  subscriptionPlan: 'Gratuito' | 'Pro' | 'Premium';
  subscriptionRenewal: string; // YYYY-MM-DD
  subscriptionStatus: 'Activa' | 'Vencida';
}

export interface Debt {
  id: string;
  type: 'cobrar' | 'pagar'; // 'cobrar' (receivable), 'pagar' (payable)
  person: string; // who owes me or who I owe
  amount: number;
  description: string;
  dueDate?: string; // YYYY-MM-DD
  status: 'pendiente' | 'pagado';
  createdAt: string; // YYYY-MM-DD
}
