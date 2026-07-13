import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction, Debt } from '../types';
import { calculateFinances } from '../utils/formulas';
import { getThemeStyles } from '../utils/theme';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  PieChart, 
  CheckCircle2, 
  Clock, 
  X,
  FileCheck,
  ChevronDown,
  UserCheck,
  DollarSign
} from 'lucide-react';

export const Finanzas: React.FC = () => {
  const { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    settings, 
    updateSettings,
    debts,
    addDebt,
    updateDebt,
    deleteDebt
  } = useApp();
  const theme = settings.theme || 'femenino';
  const styles = getThemeStyles(theme);
  
  // Navigation tabs: 'ledger' | 'projection' | 'debts'
  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'projection' | 'debts'>('ledger');
  
  // CRUD States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Filters State
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Projections local state (initialized from UserSettings or calculated fields)
  const [projIncome, setProjIncome] = useState<number>(6000000 + 4000000); // Salario + Extra Goal
  const [projFixed, setProjFixed] = useState<number>(2500000);
  const [projVar, setProjVar] = useState<number>(1000000);
  const [projSaveGoal, setProjSaveGoal] = useState<number>(1500000);

  // Form Fields State
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formType, setFormType] = useState<Transaction['type']>('gasto');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState('Tarjeta de débito');
  const [formStatus, setFormStatus] = useState<Transaction['status']>('pagado');
  const [formAccount, setFormAccount] = useState('General');
  const [formIsShared, setFormIsShared] = useState(false);
  const [formSharedPerson, setFormSharedPerson] = useState('');
  const [formSharedAmount, setFormSharedAmount] = useState('');
  const [formSharedPaid, setFormSharedPaid] = useState(false);

  // Standalone Debts CRUD States
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [debtType, setDebtType] = useState<'cobrar' | 'pagar'>('cobrar');
  const [debtPerson, setDebtPerson] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtDescription, setDebtDescription] = useState('');
  const [debtDueDate, setDebtDueDate] = useState('');
  const [debtStatus, setDebtStatus] = useState<'pendiente' | 'pagado'>('pendiente');

  // Calculations
  const finStats = calculateFinances(transactions, settings.monthlyBudget);

  // 1. Calculate Account Balances
  const customAccountsList = settings.customAccounts || ['Bancolombia', 'Nequi', 'Daviplata', 'Efectivo', 'Tarjeta de Crédito'];
  const accountBalances = customAccountsList.map(acc => {
    let balance = 0;
    transactions.forEach(tx => {
      if ((tx.account || 'General') === acc) {
        const amount = Number(tx.amount) || 0;
        if (tx.type === 'ingreso') {
          balance += amount;
        } else if (tx.type === 'egreso fijo' || tx.type === 'egreso variable' || tx.type === 'gasto' || tx.type === 'ahorro' || tx.type === 'inversion') {
          balance -= amount;
        }
      }
    });
    return { name: acc, balance };
  });

  // 2. Calculate Combined Outstanding Balances (money friends owe me)
  const sharedBalances: Record<string, number> = {};
  
  // Standalone debts to collect
  debts.forEach(d => {
    if (d.type === 'cobrar' && d.status === 'pendiente') {
      const person = d.person.trim();
      sharedBalances[person] = (sharedBalances[person] || 0) + d.amount;
    }
  });

  // Transaction-level shared portions
  transactions.forEach(tx => {
    if (tx.isShared && tx.sharedPerson && !tx.sharedPaid && tx.type !== 'ingreso') {
      const person = tx.sharedPerson.trim();
      const amount = Number(tx.sharedAmount) || 0;
      sharedBalances[person] = (sharedBalances[person] || 0) + amount;
    }
  });

  const totalReceivables = Object.values(sharedBalances).reduce((sum, val) => sum + val, 0);

  const openAddModal = () => {
    setEditingTx(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormType('gasto');
    setFormCategory(settings.customCategories[2] || 'Alimentación');
    setFormDescription('');
    setFormAmount('');
    setFormPaymentMethod('Tarjeta de débito');
    setFormStatus('pagado');
    setFormAccount(settings.customAccounts?.[0] || 'General');
    setFormIsShared(false);
    setFormSharedPerson('');
    setFormSharedAmount('');
    setFormSharedPaid(false);
    setIsModalOpen(true);
  };

  const openEditModal = (tx: Transaction) => {
    setEditingTx(tx);
    setFormDate(tx.date);
    setFormType(tx.type);
    setFormCategory(tx.category);
    setFormDescription(tx.description || '');
    setFormAmount(tx.amount.toString());
    setFormPaymentMethod(tx.paymentMethod);
    setFormStatus(tx.status);
    setFormAccount(tx.account || 'General');
    setFormIsShared(!!tx.isShared);
    setFormSharedPerson(tx.sharedPerson || '');
    setFormSharedAmount(tx.sharedAmount ? tx.sharedAmount.toString() : '');
    setFormSharedPaid(!!tx.sharedPaid);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || isNaN(Number(formAmount))) return;

    const txData = {
      date: formDate,
      type: formType,
      category: formCategory,
      description: formDescription,
      amount: Number(formAmount),
      paymentMethod: formPaymentMethod,
      status: formStatus,
      account: formAccount,
      isShared: formIsShared,
      sharedAmount: formIsShared ? (Number(formSharedAmount) || 0) : 0,
      sharedPerson: formIsShared ? formSharedPerson.trim() : '',
      sharedPaid: formIsShared ? formSharedPaid : false
    };

    if (editingTx) {
      updateTransaction({ ...txData, id: editingTx.id });
    } else {
      addTransaction(txData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás segura de que quieres eliminar este registro financiero?')) {
      deleteTransaction(id);
    }
  };

  // Standalone Debts CRUD Handlers
  const openAddDebtModal = (type: 'cobrar' | 'pagar') => {
    setEditingDebt(null);
    setDebtType(type);
    setDebtPerson('');
    setDebtAmount('');
    setDebtDescription('');
    setDebtDueDate(new Date().toISOString().split('T')[0]);
    setDebtStatus('pendiente');
    setIsDebtModalOpen(true);
  };

  const openEditDebtModal = (debt: Debt) => {
    setEditingDebt(debt);
    setDebtType(debt.type);
    setDebtPerson(debt.person);
    setDebtAmount(debt.amount.toString());
    setDebtDescription(debt.description);
    setDebtDueDate(debt.dueDate || '');
    setDebtStatus(debt.status);
    setIsDebtModalOpen(true);
  };

  const handleDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtAmount || isNaN(Number(debtAmount)) || !debtPerson.trim()) return;

    const debtData = {
      type: debtType,
      person: debtPerson.trim(),
      amount: Number(debtAmount),
      description: debtDescription.trim(),
      dueDate: debtDueDate || undefined,
      status: debtStatus,
      createdAt: editingDebt ? editingDebt.createdAt : new Date().toISOString().split('T')[0]
    };

    if (editingDebt) {
      updateDebt({ ...debtData, id: editingDebt.id });
    } else {
      addDebt(debtData);
    }
    setIsDebtModalOpen(false);
  };

  const handleSettleDebt = (debt: Debt) => {
    const updatedDebt: Debt = {
      ...debt,
      status: 'pagado'
    };
    updateDebt(updatedDebt);

    const actionLabel = debt.type === 'cobrar' ? 'un ingreso' : 'un egreso/gasto';
    if (confirm(`¿Deseas registrar este cobro/pago como ${actionLabel} en tu libro de movimientos diarios?`)) {
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        type: debt.type === 'cobrar' ? 'ingreso' : 'gasto',
        category: debt.type === 'cobrar' ? 'Ingreso extra' : (settings.customCategories[5] || 'Otros egresos'),
        description: `${debt.type === 'cobrar' ? 'Cobro de deuda' : 'Pago de deuda'} - ${debt.person} (${debt.description})`,
        amount: debt.amount,
        paymentMethod: 'Efectivo',
        status: 'pagado',
        account: settings.customAccounts?.[0] || 'General'
      });
    }
  };

  const handleDeleteDebt = (id: string) => {
    if (confirm('¿Estás segura de que quieres eliminar esta cuenta/deuda?')) {
      deleteDebt(id);
    }
  };

  const handleSettleTransactionDebt = (tx: Transaction) => {
    const updatedTx: Transaction = {
      ...tx,
      sharedPaid: true
    };
    updateTransaction(updatedTx);
    
    if (confirm(`¿Deseas registrar este cobro de ${tx.sharedPerson} por ${formatCOP(tx.sharedAmount || 0)} como un ingreso real en tu libro de movimientos?`)) {
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        type: 'ingreso',
        category: 'Ingreso extra',
        description: `Cobro compartido - ${tx.sharedPerson} (${tx.description})`,
        amount: tx.sharedAmount || 0,
        paymentMethod: 'Efectivo',
        status: 'pagado',
        account: settings.customAccounts?.[0] || 'General'
      });
    }
  };

  // Filter Logic
  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    const matchesSearch = 
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCategory && matchesStatus && matchesSearch;
  });

  const combinedReceivables = [
    // Standalone debts
    ...debts.filter(d => d.type === 'cobrar').map(d => ({
      id: d.id,
      isTransaction: false,
      person: d.person,
      description: d.description,
      amount: d.amount,
      dueDate: d.dueDate,
      status: d.status,
      createdAt: d.createdAt,
      original: d
    })),
    // Shared transactions (debts others owe me)
    ...transactions.filter(tx => tx.isShared && tx.type !== 'ingreso').map(tx => ({
      id: tx.id,
      isTransaction: true,
      person: tx.sharedPerson || 'Desconocido',
      description: `Gasto: ${tx.category} (${tx.description})`,
      amount: tx.sharedAmount || 0,
      dueDate: tx.date,
      status: tx.sharedPaid ? ('pagado' as const) : ('pendiente' as const),
      createdAt: tx.date,
      original: tx
    }))
  ];

  const formatCOP = (num: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Financial Semáforo Logic
  const getSemaforoStatus = () => {
    const totalSpent = finStats.totalExpenses;
    const projectedLimit = projFixed + projVar;
    
    if (totalSpent > settings.monthlyBudget || totalSpent > projectedLimit) {
      return {
        color: 'rose',
        label: 'ROJO: Presupuesto Excedido',
        desc: 'Has superado el límite de gastos establecido. Detén gastos variables de inmediato.',
        bg: 'bg-rose-50 border-rose-200 text-rose-800'
      };
    } else if (totalSpent > (settings.monthlyBudget * 0.8) || totalSpent > (projectedLimit * 0.8)) {
      return {
        color: 'amber',
        label: 'AMARILLO: Control de Gastos',
        desc: 'Has consumido más del 80% de tu presupuesto. Modera consumos opcionales.',
        bg: 'bg-amber-50 border-amber-200 text-amber-800'
      };
    } else {
      return {
        color: 'emerald',
        label: 'VERDE: Finanzas Saludables',
        desc: 'Los egresos están dentro de los rangos estimados. Vas por buen camino.',
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800'
      };
    }
  };

  const semaforo = getSemaforoStatus();

  return (
    <div className="space-y-8">
      {/* Sub navigation Tabs (High Contrast Pill Container) */}
      <div className="inline-flex gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs">
        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`px-5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'ledger'
              ? styles.cardPillActive
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-semibold'
          }`}
        >
          Movimientos y Libro Ledger
        </button>
        <button
          onClick={() => setActiveSubTab('projection')}
          className={`px-5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'projection'
              ? styles.cardPillActive
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-semibold'
          }`}
        >
          Proyección del Mes
        </button>
        <button
          onClick={() => setActiveSubTab('debts')}
          className={`px-5 py-2 rounded-xl font-bold transition-all ${
            activeSubTab === 'debts'
              ? styles.cardPillActive
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-semibold'
          }`}
        >
          Deudas y Cuentas
        </button>
      </div>

      {activeSubTab === 'ledger' && (
        <>
          {/* Alarms Bar if Triggered */}
          {finStats.alertTriggered && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 animate-pulse-soft">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold">¡Alerta Financiera!</span> Tus gastos reales ({formatCOP(finStats.totalExpenses)}) han superado el presupuesto mensual configurado ({formatCOP(settings.monthlyBudget)}).
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
              <p className="text-[10px] text-slate-600 font-bold uppercase">Total Ingresos</p>
              <h4 className="text-sm font-bold text-emerald-600 mt-1">{formatCOP(finStats.totalIncomes)}</h4>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
              <p className="text-[10px] text-slate-600 font-bold uppercase">Total Gastos</p>
              <h4 className="text-sm font-bold text-rose-500 mt-1">{formatCOP(finStats.totalExpenses)}</h4>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
              <p className="text-[10px] text-slate-600 font-bold uppercase">Egresos Fijos</p>
              <h4 className="text-sm font-bold text-slate-700 mt-1">{formatCOP(finStats.fixedExpenses)}</h4>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
              <p className="text-[10px] text-slate-600 font-bold uppercase">Egresos Variables</p>
              <h4 className="text-sm font-bold text-slate-700 mt-1">{formatCOP(finStats.variableExpenses)}</h4>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
              <p className="text-[10px] text-slate-600 font-bold uppercase">Disponible</p>
              <h4 className="text-sm font-bold text-navy-800 mt-1">{formatCOP(finStats.available)}</h4>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
              <p className="text-[10px] text-slate-600 font-bold uppercase">Tasa Ahorro</p>
              <h4 className="text-sm font-bold text-purple-600 mt-1">{finStats.savingsRate.toFixed(0)}%</h4>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center col-span-2 md:col-span-1">
              <p className="text-[10px] text-slate-600 font-bold uppercase">Mayor Gasto</p>
              <h4 className="text-xs font-bold text-amber-500 truncate mt-1" title={finStats.highestCategory.category}>
                {finStats.highestCategory.category}
              </h4>
            </div>
          </div>

          {/* Custom Accounts & Split Billing Balances Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Balances Card List */}
            <div className="lg:col-span-2 bg-white border border-slate-100 p-5 rounded-2xl shadow-premium space-y-3.5">
              <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                💰 Saldos por Cuentas
              </h5>
              <div className="flex flex-wrap gap-4">
                {accountBalances.map(acc => (
                  <div key={acc.name} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-center min-w-[130px]">
                    <span className="text-[10px] text-slate-650 font-bold uppercase truncate">{acc.name}</span>
                    <span className={`text-xs font-bold mt-1 ${acc.balance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {formatCOP(acc.balance)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Split Billing / Receivables Card */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-premium space-y-3.5 flex flex-col justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  👥 Cuentas Compartidas
                </h5>
                {totalReceivables > 0 ? (
                  <div className="mt-2 space-y-2 max-h-24 overflow-y-auto pr-1">
                    {Object.entries(sharedBalances).map(([person, amt]) => (
                      <div key={person} className="flex justify-between items-center text-xs">
                        <span className="text-slate-650 font-semibold">{person} te debe:</span>
                        <span className="font-bold text-emerald-600">{formatCOP(amt)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-600 italic mt-2">No tienes saldos pendientes por cobrar a otras personas.</p>
                )}
              </div>
              
              {totalReceivables > 0 && (
                <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">Total por Cobrar:</span>
                  <span className="text-emerald-600 text-sm font-black">{formatCOP(totalReceivables)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Table Operations Bar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-premium">
            <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] md:flex-none">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  placeholder="Buscar descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-800/10 focus:border-navy-800 text-xs"
                />
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-800/10"
              >
                <option value="all">Tipos (Todos)</option>
                <option value="ingreso">Ingreso</option>
                <option value="egreso fijo">Egreso Fijo</option>
                <option value="egreso variable">Egreso Variable</option>
                <option value="ahorro">Ahorro</option>
                <option value="inversion">Inversión</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-800/10"
              >
                <option value="all">Categorías (Todas)</option>
                {settings.customCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-800/10"
              >
                <option value="all">Estado (Todos)</option>
                <option value="pagado">Pagado</option>
                <option value="pendiente">Pendiente</option>
                <option value="proyectado">Proyectado</option>
              </select>
            </div>

            <button
              onClick={openAddModal}
              className="w-full md:w-auto btn-primary shrink-0 text-xs px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Movimiento</span>
            </button>
          </div>

          {/* Ledger Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-4 px-6">Fecha</th>
                    <th className="py-4 px-6">Tipo</th>
                    <th className="py-4 px-6">Categoría</th>
                    <th className="py-4 px-6">Descripción</th>
                    <th className="py-4 px-6">Medio</th>
                    <th className="py-4 px-6 text-center">Estado</th>
                    <th className="py-4 px-6 text-right">Monto</th>
                    <th className="py-4 px-6 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-600 font-medium bg-white">
                        Ningún movimiento coincide con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                        <td className="py-4 px-6 font-medium text-slate-500 whitespace-nowrap">{tx.date}</td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            tx.type === 'ingreso' ? 'bg-emerald-50 text-emerald-600' :
                            tx.type === 'egreso fijo' ? 'bg-navy-50 text-navy-800' :
                            tx.type === 'egreso variable' ? 'bg-amber-50 text-amber-700' :
                            tx.type === 'ahorro' ? 'bg-purple-50 text-purple-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-navy-800">{tx.category}</td>
                        <td className="py-4 px-6 max-w-xs">
                          <div className="font-semibold text-slate-800 truncate">{tx.description || 'Sin descripción'}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {/* Account Badge */}
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                              {tx.account || 'General'}
                            </span>
                            {/* Shared/Split Badge */}
                            {tx.isShared && (
                              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                                tx.sharedPaid
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-rose-50 text-rose-600 border border-rose-100'
                              }`}>
                                👥 {tx.sharedPerson}: {formatCOP(tx.sharedAmount || 0)} {tx.sharedPaid ? '(Saldado)' : '(Pendiente)'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-600 whitespace-nowrap">{tx.paymentMethod}</td>
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            tx.status === 'pagado' ? 'bg-emerald-50 text-emerald-700' :
                            tx.status === 'pendiente' ? 'bg-rose-50 text-rose-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {tx.status === 'pagado' && <CheckCircle2 className="w-2.5 h-2.5" />}
                            {tx.status === 'pendiente' && <Clock className="w-2.5 h-2.5" />}
                            {tx.status === 'proyectado' && <Activity className="w-2.5 h-2.5" />}
                            {tx.status}
                          </span>
                        </td>
                        <td className={`py-4 px-6 text-right font-bold text-sm whitespace-nowrap ${
                          tx.type === 'ingreso' ? 'text-emerald-600' : 'text-slate-800'
                        }`}>
                          <div>{tx.type === 'ingreso' ? '+' : '-'} {formatCOP(tx.amount)}</div>
                          {tx.isShared && tx.type !== 'ingreso' && (
                            <div className="text-[9px] text-slate-550 font-semibold mt-0.5">
                              Mi parte: - {formatCOP(Math.max(0, tx.amount - (tx.sharedAmount || 0)))}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(tx)}
                              className="p-1.5 text-slate-600 hover:text-navy-800 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="p-1.5 text-slate-600 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'projection' && (
        /* PROJECTION VIEW SUB TAB */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form to enter Projection Settings */}
          <div className="glass-card p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-navy-800">Parámetros Proyectados</h3>
              <p className="text-xs text-slate-600">Estima tus números esperados para este mes.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">Ingreso Mensual Esperado</label>
                <input
                  type="number"
                  value={projIncome}
                  onChange={(e) => setProjIncome(Number(e.target.value))}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Gastos Fijos Estimados</label>
                <input
                  type="number"
                  value={projFixed}
                  onChange={(e) => setProjFixed(Number(e.target.value))}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Gastos Variables Estimados</label>
                <input
                  type="number"
                  value={projVar}
                  onChange={(e) => setProjVar(Number(e.target.value))}
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Meta de Ahorro</label>
                <input
                  type="number"
                  value={projSaveGoal}
                  onChange={(e) => setProjSaveGoal(Number(e.target.value))}
                  className="form-input"
                />
              </div>
            </div>

            <button
              onClick={() => {
                alert('Parámetros de proyección guardados localmente para análisis de brecha.');
              }}
              className="w-full btn-primary text-xs"
            >
              <FileCheck className="w-4 h-4" />
              <span>Guardar Proyecciones</span>
            </button>
          </div>

          {/* Comparison Cards & Semáforo */}
          <div className="lg:col-span-2 space-y-6">
            {/* Semáforo Card */}
            <div className={`p-6 rounded-2xl border ${semaforo.bg} flex items-start gap-4 shadow-premium`}>
              <div className={`p-3 rounded-full text-white shrink-0 ${
                semaforo.color === 'rose' ? 'bg-rose-500 animate-pulse-soft' :
                semaforo.color === 'amber' ? 'bg-amber-500' :
                'bg-emerald-500'
              }`}>
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider">{semaforo.label}</h4>
                <p className="text-xs font-medium mt-1 leading-relaxed">{semaforo.desc}</p>
              </div>
            </div>

            {/* Calculations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Money Projected Card */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium">
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Flujo de Caja Real vs Proyectado</h4>
                <div className="mt-4 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Ingreso Real:</span>
                    <span className="text-sm font-bold text-emerald-600">{formatCOP(finStats.totalIncomes)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Ingreso Proyectado:</span>
                    <span className="text-sm font-bold text-slate-700">{formatCOP(projIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-xs">
                    <span className="text-slate-600 font-medium">Diferencia:</span>
                    <span className={`font-bold ${finStats.totalIncomes - projIncome >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {finStats.totalIncomes - projIncome >= 0 ? '+' : ''} {formatCOP(finStats.totalIncomes - projIncome)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expense comparison Card */}
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium">
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Egresos Reales vs Estimados</h4>
                <div className="mt-4 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Gasto Real:</span>
                    <span className="text-sm font-bold text-rose-500">{formatCOP(finStats.totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-medium">Gasto Estimado:</span>
                    <span className="text-sm font-bold text-slate-700">{formatCOP(projFixed + projVar)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-xs">
                    <span className="text-slate-600 font-medium">Diferencia (Presupuestal):</span>
                    <span className={`font-bold ${((projFixed + projVar) - finStats.totalExpenses) >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {((projFixed + projVar) - finStats.totalExpenses) >= 0 ? 'Ahorro' : 'Exceso'}: {formatCOP(Math.abs((projFixed + projVar) - finStats.totalExpenses))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Projected Available Summary */}
            <div className="p-6 rounded-2xl bg-navy-800 text-white shadow-premium relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_120%,#06b6d4,transparent_40%)]" />
              <div className="relative z-10">
                <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Proyección de Disponible Fin de Mes</h4>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">{formatCOP(finStats.projectionEndMonth)}</h2>
                    <p className="text-[10px] text-slate-600 mt-1">Calculado: ingresos actuales - todos los movimientos de salida del mes</p>
                  </div>
                  <div className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold border border-white/10">
                    Ahorro acumulado: {formatCOP(finStats.savings)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'debts' && (
        <div className="space-y-6">
          {/* Debts Summary Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total to collect */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-premium flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Cuentas por Cobrar (Pendiente)</p>
                <h4 className="text-lg font-black text-emerald-600 mt-1">
                  {formatCOP(combinedReceivables.filter(r => r.status === 'pendiente').reduce((sum, r) => sum + r.amount, 0))}
                </h4>
              </div>
            </div>

            {/* Total to pay */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-premium flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-50 rounded-xl">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Cuentas por Pagar (Pendiente)</p>
                <h4 className="text-lg font-black text-rose-50 mt-1">
                  {formatCOP(debts.filter(d => d.type === 'pagar' && d.status === 'pendiente').reduce((sum, d) => sum + d.amount, 0))}
                </h4>
              </div>
            </div>

            {/* Net balance */}
            {(() => {
              const toCollect = combinedReceivables.filter(r => r.status === 'pendiente').reduce((sum, r) => sum + r.amount, 0);
              const toPay = debts.filter(d => d.type === 'pagar' && d.status === 'pendiente').reduce((sum, d) => sum + d.amount, 0);
              const netBalance = toCollect - toPay;
              const isPositive = netBalance >= 0;
              return (
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-premium flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Balance de Deudas Neto</p>
                    <h4 className={`text-lg font-black mt-1 ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {isPositive ? '+' : ''} {formatCOP(netBalance)}
                    </h4>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            {/* 1. Accounts Receivable List */}
            <div className="glass-card p-6 bg-white space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">Cuentas por Cobrar (A mi favor)</h3>
                  <p className="text-[10px] text-slate-600">Dinero que has prestado, dividido o tienes pendiente de cobro.</p>
                </div>
                <button
                  onClick={() => openAddDebtModal('cobrar')}
                  className="btn-primary px-3 py-1.5 text-[10px] font-bold tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Cobro</span>
                </button>
              </div>

              {/* List */}
              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                {combinedReceivables.length === 0 ? (
                  <p className="text-xs text-slate-600 italic py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    No tienes cuentas por cobrar registradas.
                  </p>
                ) : (
                  combinedReceivables.map(item => (
                    <div
                      key={`${item.isTransaction ? 'tx' : 'debt'}-${item.id}`}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        item.status === 'pagado'
                          ? 'bg-slate-50/55 border-slate-200 opacity-70'
                          : 'bg-white border-slate-150 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-navy-800">{item.person}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                              item.status === 'pagado' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse-soft'
                            }`}>
                              {item.status}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-slate-105 text-slate-700">
                              {item.isTransaction ? 'Movimiento' : 'Deuda'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-650 mt-1 font-semibold">{item.description || 'Sin concepto'}</p>
                          {item.dueDate && (
                            <p className="text-[9px] text-slate-600 mt-0.5 flex items-center gap-1 font-bold">
                              <Clock className="w-3 h-3 text-slate-600" />
                              Fecha: {item.dueDate}
                              {item.status === 'pendiente' && new Date(item.dueDate) < new Date() && (
                                <span className="text-rose-600 font-extrabold text-[8px] uppercase bg-rose-50 border border-rose-200 px-1 py-0.2 rounded">Vencido</span>
                              )}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-black text-emerald-600">{formatCOP(item.amount)}</span>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                        <span className="text-[8px] font-bold text-slate-600">Creado: {item.createdAt}</span>
                        <div className="flex gap-2">
                          {item.status === 'pendiente' && (
                            <button
                              onClick={() => item.isTransaction ? handleSettleTransactionDebt(item.original as Transaction) : handleSettleDebt(item.original as Debt)}
                              className="p-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Marcar como cobrado y saldado"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Saldar</span>
                            </button>
                          )}
                          <button
                            onClick={() => item.isTransaction ? openEditModal(item.original as Transaction) : openEditDebtModal(item.original as Debt)}
                            className="p-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[9px] font-bold cursor-pointer transition-colors"
                            title="Editar concepto o monto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => item.isTransaction ? handleDelete(item.id) : handleDeleteDebt(item.id)}
                            className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-[9px] font-bold cursor-pointer transition-colors"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 2. Accounts Payable List */}
            <div className="glass-card p-6 bg-white space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">Cuentas por Pagar (Mis deudas)</h3>
                  <p className="text-[10px] text-slate-600">Dinero que debes a personas, bancos u otras entidades.</p>
                </div>
                <button
                  onClick={() => openAddDebtModal('pagar')}
                  className="btn-primary px-3 py-1.5 text-[10px] font-bold tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nueva Deuda</span>
                </button>
              </div>

              {/* List */}
              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                {debts.filter(d => d.type === 'pagar').length === 0 ? (
                  <p className="text-xs text-slate-600 italic py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    No tienes cuentas por pagar registradas.
                  </p>
                ) : (
                  debts.filter(d => d.type === 'pagar').map(debt => (
                    <div
                      key={debt.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        debt.status === 'pagado'
                          ? 'bg-slate-50/55 border-slate-200 opacity-70'
                          : 'bg-white border-slate-150 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-navy-800">{debt.person}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                              debt.status === 'pagado' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse-soft'
                            }`}>
                              {debt.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-650 mt-1 font-semibold">{debt.description || 'Sin concepto'}</p>
                          {debt.dueDate && (
                            <p className="text-[9px] text-slate-600 mt-0.5 flex items-center gap-1 font-bold">
                              <Clock className="w-3.5 h-3.5 text-slate-600" />
                              Vence: {debt.dueDate}
                              {debt.status === 'pendiente' && new Date(debt.dueDate) < new Date() && (
                                <span className="text-rose-600 font-extrabold text-[8px] uppercase bg-rose-50 border border-rose-200 px-1 py-0.2 rounded">Vencido</span>
                              )}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-black text-rose-500">{formatCOP(debt.amount)}</span>
                      </div>

                      <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                        <span className="text-[8px] font-bold text-slate-600">Creado: {debt.createdAt}</span>
                        <div className="flex gap-2">
                          {debt.status === 'pendiente' && (
                            <button
                              onClick={() => handleSettleDebt(debt)}
                              className="p-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Marcar como pagado y saldado"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Pagar</span>
                            </button>
                          )}
                          <button
                            onClick={() => openEditDebtModal(debt)}
                            className="p-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[9px] font-bold cursor-pointer transition-colors"
                            title="Editar concepto o monto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDebt(debt.id)}
                            className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-[9px] font-bold cursor-pointer transition-colors"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Debt Modal */}
      {isDebtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">
                {editingDebt ? 'Editar Cuenta/Deuda' : `Registrar Cuenta por ${debtType === 'cobrar' ? 'Cobrar' : 'Pagar'}`}
              </h3>
              <button 
                onClick={() => setIsDebtModalOpen(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-650 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDebtSubmit} className="p-6 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                {/* Debt Type */}
                <div>
                  <label className="form-label">Tipo de Cuenta</label>
                  <select
                    value={debtType}
                    onChange={(e) => setDebtType(e.target.value as 'cobrar' | 'pagar')}
                    className="form-input"
                    disabled={!!editingDebt}
                  >
                    <option value="cobrar">Por Cobrar (A mi favor)</option>
                    <option value="pagar">Por Pagar (Mi deuda)</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="form-label">Estado</label>
                  <select
                    value={debtStatus}
                    onChange={(e) => setDebtStatus(e.target.value as 'pendiente' | 'pagado')}
                    className="form-input"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado / Saldado</option>
                  </select>
                </div>
              </div>

              {/* Person */}
              <div>
                <label className="form-label">Persona / Entidad</label>
                <input
                  type="text"
                  required
                  placeholder={debtType === 'cobrar' ? "Quién te debe (ej. Juan)..." : "A quién le debes (ej. Banco)..."}
                  value={debtPerson}
                  onChange={(e) => setDebtPerson(e.target.value)}
                  className="form-input font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Amount */}
                <div>
                  <label className="form-label">Monto (COP)</label>
                  <input
                    type="number"
                    required
                    placeholder="Monto..."
                    value={debtAmount}
                    onChange={(e) => setDebtAmount(e.target.value)}
                    className="form-input font-black text-emerald-600"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="form-label">Fecha Límite (Opcional)</label>
                  <input
                    type="date"
                    value={debtDueDate}
                    onChange={(e) => setDebtDueDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Concepto / Descripción</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Préstamo para cena, Cuota mensual..."
                  value={debtDescription}
                  onChange={(e) => setDebtDescription(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDebtModalOpen(false)}
                  className="flex-1 btn-secondary text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs"
                >
                  {editingDebt ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD MODAL FOR TRANSACTIONS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-xl overflow-hidden animate-pulse-soft-[0.1s]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">
                {editingTx ? 'Editar Movimiento Financiero' : 'Registrar Nuevo Movimiento'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="form-label">Tipo de Movimiento</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as Transaction['type'])}
                    className="form-input"
                  >
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto">Gasto General</option>
                    <option value="egreso fijo">Egreso Fijo</option>
                    <option value="egreso variable">Egreso Variable</option>
                    <option value="ahorro">Ahorro</option>
                    <option value="inversion">Inversión</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="form-label">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="form-input"
                  >
                    {settings.customCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="form-label">Monto (COP)</label>
                  <input
                    type="number"
                    required
                    placeholder="Monto..."
                    value={formAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      const oldAmount = formAmount;
                      setFormAmount(val);
                      if (formIsShared && formSharedAmount === oldAmount) {
                        setFormSharedAmount(val);
                      }
                    }}
                    className="form-input font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Account */}
                <div>
                  <label className="form-label">Cuenta Relacionada</label>
                  <select
                    value={formAccount}
                    onChange={(e) => setFormAccount(e.target.value)}
                    className="form-input"
                  >
                    {(settings.customAccounts || ['Bancolombia', 'Nequi', 'Daviplata', 'Efectivo', 'Tarjeta de Crédito']).map(acc => (
                      <option key={acc} value={acc}>{acc}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="form-label">Medio de Pago</label>
                  <select
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value)}
                    className="form-input"
                  >
                    <option value="Transferencia bancaria">Transferencia bancaria</option>
                    <option value="Tarjeta de débito">Tarjeta de débito</option>
                    <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="PSE">PSE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="form-label">Estado de Transacción</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as Transaction['status'])}
                    className="form-input"
                  >
                    <option value="pagado">Pagado / Efectuado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="proyectado">Proyectado (Simulado)</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="form-label">Descripción</label>
                  <input
                    type="text"
                    required
                    placeholder="Detalle o nombre del gasto..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Shared expense fields */}
              {(formType !== 'ingreso') && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isShared"
                      checked={formIsShared}
                      onChange={(e) => {
                        setFormIsShared(e.target.checked);
                        if (!e.target.checked) {
                          setFormSharedAmount('');
                        } else {
                          // By default, set it to 50%
                          const half = Math.round((Number(formAmount) || 0) / 2);
                          setFormSharedAmount(half.toString());
                        }
                      }}
                      className="rounded text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <label htmlFor="isShared" className="text-xs font-bold text-slate-800 cursor-pointer select-none">
                      👥 ¿Es un gasto compartido o préstamo (por cobrar)?
                    </label>
                  </div>

                  {formIsShared && (
                    <div className="space-y-3 pt-1">
                      {/* Selection: Split vs Full Loan */}
                      <div className="flex gap-4 text-[10px] font-bold text-slate-700">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="sharedType"
                            checked={formSharedAmount !== formAmount || formAmount === ''}
                            onChange={() => {
                              const half = Math.round((Number(formAmount) || 0) / 2);
                              setFormSharedAmount(half.toString());
                            }}
                            className="text-emerald-500 focus:ring-emerald-500/20"
                          />
                          <span>Dividir cuenta (Gasto compartido)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="sharedType"
                            checked={formSharedAmount === formAmount && formAmount !== ''}
                            onChange={() => {
                              setFormSharedAmount(formAmount);
                            }}
                            className="text-emerald-500 focus:ring-emerald-500/20"
                          />
                          <span>Prestar dinero (100% por cobrar)</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-600 uppercase tracking-wide mb-1">Nombre</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: Juan"
                            value={formSharedPerson}
                            onChange={(e) => setFormSharedPerson(e.target.value)}
                            className="form-input py-1.5"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-600 uppercase tracking-wide mb-1">Cuota por Cobrar (COP)</label>
                          <input
                            type="number"
                            required
                            placeholder="Ej: 20000"
                            value={formSharedAmount}
                            onChange={(e) => setFormSharedAmount(e.target.value)}
                            className="form-input py-1.5 font-bold animate-pulse-soft-[0.1s]"
                          />
                        </div>
                        <div className="flex flex-col justify-end pb-2">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="checkbox"
                              id="sharedPaid"
                              checked={formSharedPaid}
                              onChange={(e) => setFormSharedPaid(e.target.checked)}
                              className="rounded text-emerald-500"
                            />
                            <label htmlFor="sharedPaid" className="text-[10px] font-bold text-slate-650 cursor-pointer select-none">
                              ¿Saldado / Pagado?
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn-secondary text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs"
                >
                  {editingTx ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
