import { Transaction, Habit, Prospect } from '../types';

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
