import { Transaction, Habit, EnglishSession, WorkoutSession, RunningSession, Prospect } from '../types';

// Finance Calculations
export interface FinanceSummary {
  totalIncomes: number;
  totalExpenses: number;
  fixedExpenses: number;
  variableExpenses: number;
  savings: number;
  available: number;
  savingsRate: number;
  highestCategory: { category: string; amount: number };
  projectionEndMonth: number;
  alertTriggered: boolean;
}

export const calculateFinances = (
  transactions: Transaction[],
  monthlyBudget: number,
  projections?: { expectedIncome: number; expectedFixed: number; expectedVariable: number }
): FinanceSummary => {
  let totalIncomes = 0;
  let fixedExpenses = 0;
  let variableExpenses = 0;
  let savings = 0; // type === 'ahorro' or 'inversion'

  const categoryTotals: Record<string, number> = {};

  transactions.forEach(tx => {
    // Only calculate for the current month/year or general totals (we assume all loaded transactions are for the active month or filtered context)
    const amount = Number(tx.amount) || 0;
    if (tx.type === 'ingreso') {
      totalIncomes += amount;
    } else if (tx.type === 'egreso fijo') {
      fixedExpenses += amount;
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amount;
    } else if (tx.type === 'egreso variable' || tx.type === 'gasto') {
      variableExpenses += amount;
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amount;
    } else if (tx.type === 'ahorro' || tx.type === 'inversion') {
      savings += amount;
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amount;
    }
  });

  const totalExpenses = fixedExpenses + variableExpenses;
  const available = totalIncomes - totalExpenses;
  const savingsRate = totalIncomes > 0 ? (savings / totalIncomes) * 100 : 0;

  // Find category with highest spending
  let maxCat = "Ninguna";
  let maxAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > maxAmount && cat !== 'Salario' && cat !== 'Ingreso extra') {
      maxAmount = amt;
      maxCat = cat;
    }
  });

  // Calculate Projection End of Month
  // Actual paid + Projected transactions
  const projectedIncome = transactions
    .filter(tx => tx.type === 'ingreso')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const projectedExpense = transactions
    .filter(tx => tx.type === 'egreso fijo' || tx.type === 'egreso variable' || tx.type === 'gasto')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  
  const projectionEndMonth = projectedIncome - projectedExpense;

  const alertTriggered = totalExpenses > monthlyBudget;

  return {
    totalIncomes,
    totalExpenses,
    fixedExpenses,
    variableExpenses,
    savings,
    available,
    savingsRate,
    highestCategory: { category: maxCat, amount: maxAmount },
    projectionEndMonth,
    alertTriggered
  };
};

// Habit Calculations
export const calculateHabitStats = (habits: Habit[]) => {
  if (habits.length === 0) return { 
    overallCompliance: 0, 
    streaks: {} as Record<string, number>, 
    complianceRates: {} as Record<string, number>, 
    mostCompleted: "Ninguno", 
    leastCompleted: "Ninguno" 
  };

  const streaks: Record<string, number> = {};
  const complianceRates: Record<string, number> = {};

  habits.forEach(habit => {
    const logs = habit.logs || {};
    const logEntries = Object.entries(logs);
    if (logEntries.length === 0) {
      streaks[habit.id] = 0;
      complianceRates[habit.id] = 0;
      return;
    }

    // Sort logs by date descending to calculate current streak
    const sortedDates = Object.keys(logs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Calculate current streak
    let currentStreak = 0;
    for (const date of sortedDates) {
      if (logs[date]?.done) {
        currentStreak++;
      } else {
        break; // Streak broken
      }
    }
    streaks[habit.id] = currentStreak;

    // Compliance rate
    const doneCount = logEntries.filter(([_, log]) => log.done).length;
    complianceRates[habit.id] = (doneCount / logEntries.length) * 100;
  });

  const overallCompliance = Object.values(complianceRates).reduce((sum, rate) => sum + rate, 0) / habits.length;

  // Find most and least completed habits
  let mostCompleted = "Ninguno";
  let leastCompleted = "Ninguno";
  let maxRate = -1;
  let minRate = 101;

  habits.forEach(habit => {
    const rate = complianceRates[habit.id] || 0;
    if (rate > maxRate) {
      maxRate = rate;
      mostCompleted = habit.name;
    }
    if (rate < minRate) {
      minRate = rate;
      leastCompleted = habit.name;
    }
  });

  return {
    overallCompliance,
    streaks,
    complianceRates,
    mostCompleted,
    leastCompleted
  };
};

// English Study Calculations
export const calculateEnglishStats = (sessions: EnglishSession[], dailyGoalHours: number) => {
  const totalMinutes = sessions.reduce((sum, s) => sum + Number(s.minutes || 0), 0);
  const totalHours = totalMinutes / 60;
  
  // Weekly hours (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyMinutes = sessions
    .filter(s => new Date(s.date) >= oneWeekAgo)
    .reduce((sum, s) => sum + Number(s.minutes || 0), 0);
  const weeklyHours = weeklyMinutes / 60;

  // Monthly hours (current month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const monthlyMinutes = sessions
    .filter(s => new Date(s.date) >= startOfMonth)
    .reduce((sum, s) => sum + Number(s.minutes || 0), 0);
  const monthlyHours = monthlyMinutes / 60;

  // Calculate compliance rate (assuming target is dailyGoalHours * days in current month so far)
  const currentDay = new Date().getDate();
  const targetMonthlyHours = currentDay * dailyGoalHours;
  const compliancePercent = targetMonthlyHours > 0 ? Math.min((monthlyHours / targetMonthlyHours) * 100, 100) : 0;

  // Streak: consecutive study days up to today
  let streak = 0;
  const uniqueDates = new Set(sessions.map(s => s.date));
  const checkDate = new Date();
  
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (uniqueDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Allow streak to continue if we haven't studied today yet, but studied yesterday
      const todayStr = new Date().toISOString().split('T')[0];
      if (streak === 0 && dateStr === todayStr) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return {
    totalHours,
    weeklyHours,
    monthlyHours,
    compliancePercent,
    streak,
    goalMonthlyHours: 30 * dailyGoalHours // Standard month target
  };
};

// Sports Calculations
export const calculateSportsStats = (
  workouts: WorkoutSession[],
  runs: RunningSession[],
  settings: { weeklyGymGoal: number; weeklyRunningGoal: number }
) => {
  // WORKOUTS
  const currentWeekWorkouts = workouts.filter(w => {
    const wDate = new Date(w.date);
    const diffTime = Math.abs(new Date().getTime() - wDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });
  const gymSessionsThisWeek = currentWeekWorkouts.length;
  const gymCompliancePercent = settings.weeklyGymGoal > 0 
    ? Math.min((gymSessionsThisWeek / settings.weeklyGymGoal) * 100, 100) 
    : 0;

  // RUNNING
  const currentWeekRuns = runs.filter(r => {
    const rDate = new Date(r.date);
    const diffTime = Math.abs(new Date().getTime() - rDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });
  const kmRunThisWeek = currentWeekRuns.reduce((sum, r) => sum + Number(r.distance || 0), 0);
  const runningCompliancePercent = settings.weeklyRunningGoal > 0
    ? Math.min((kmRunThisWeek / settings.weeklyRunningGoal) * 100, 100)
    : 0;

  const currentMonthRuns = runs.filter(r => {
    const rDate = new Date(r.date);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    return rDate >= startOfMonth;
  });
  const kmRunThisMonth = currentMonthRuns.reduce((sum, r) => sum + Number(r.distance || 0), 0);

  // Average Pace Calculation (convert MM:SS or HH:MM:SS to total seconds first)
  let totalSeconds = 0;
  let totalDistance = 0;
  runs.forEach(r => {
    if (!r.time || !r.distance) return;
    const parts = r.time.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    }
    totalSeconds += seconds;
    totalDistance += Number(r.distance);
  });

  let avgPaceStr = "--:--";
  if (totalDistance > 0) {
    const avgSecondsPerKm = totalSeconds / totalDistance;
    const min = Math.floor(avgSecondsPerKm / 60);
    const sec = Math.floor(avgSecondsPerKm % 60);
    avgPaceStr = `${min}:${sec < 10 ? '0' : ''}${sec} min/km`;
  }

  const lastWorkout = workouts.length > 0 
    ? [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  return {
    gymSessionsThisWeek,
    gymCompliancePercent,
    kmRunThisWeek,
    kmRunThisMonth,
    runningCompliancePercent,
    averagePace: avgPaceStr,
    lastWorkout
  };
};

// CRM and Project $4M Calculations
export const calculateCRMStats = (prospects: Prospect[], transactions: Transaction[], monthlyGoal: number) => {
  const numProspects = prospects.length;
  const numContacted = prospects.filter(p => p.status !== 'prospecto').length;
  const numWon = prospects.filter(p => p.status === 'ganado').length;
  const numProposals = prospects.filter(p => p.status === 'propuesta' || p.status === 'negociacion' || p.status === 'ganado').length;

  const conversionRate = numContacted > 0 ? (numWon / numContacted) * 100 : 0;

  // Extra income real = sum of transactions in current month of type 'ingreso' and category 'Ingreso extra'
  const extraIncomeReal = transactions
    .filter(tx => tx.type === 'ingreso' && tx.category === 'Ingreso extra')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  // Extra income projected = sum of proposed values of leads in status: 'ganado', 'negociacion' (e.g. 50% probability), 'propuesta' (e.g. 30% probability)
  const wonProposedValue = prospects
    .filter(p => p.status === 'ganado')
    .reduce((sum, p) => sum + (p.valueProposed || 0), 0);
  const negProposedValue = prospects
    .filter(p => p.status === 'negociacion')
    .reduce((sum, p) => sum + (p.valueProposed || 0), 0) * 0.5;
  const propProposedValue = prospects
    .filter(p => p.status === 'propuesta')
    .reduce((sum, p) => sum + (p.valueProposed || 0), 0) * 0.3;

  const extraIncomeProjected = extraIncomeReal + negProposedValue + propProposedValue;

  const conversionValueSum = prospects.filter(p => p.status === 'ganado').reduce((sum, p) => sum + (p.valueProposed || 0), 0);
  const averageValuePerClient = numWon > 0 ? conversionValueSum / numWon : 0;

  const gapToGoal = Math.max(monthlyGoal - extraIncomeReal, 0);
  const goalProgressPercent = Math.min((extraIncomeReal / monthlyGoal) * 100, 100);

  // Motivational Messages based on progress
  let motivationalMessage = "Estás construyendo la base.";
  if (goalProgressPercent > 100) {
    motivationalMessage = "¡Meta cumplida!";
  } else if (goalProgressPercent >= 76) {
    motivationalMessage = "Estás cerca de cumplir la meta.";
  } else if (goalProgressPercent >= 51) {
    motivationalMessage = "Vas muy bien, enfócate en cerrar.";
  } else if (goalProgressPercent >= 26) {
    motivationalMessage = "Ya hay movimiento, sigue contactando.";
  }

  return {
    numProspects,
    numContacted,
    numWon,
    numProposals,
    conversionRate,
    extraIncomeReal,
    extraIncomeProjected,
    averageValuePerClient,
    gapToGoal,
    goalProgressPercent,
    motivationalMessage
  };
};
