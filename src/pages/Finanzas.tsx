import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
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
  ChevronDown
} from 'lucide-react';

export const Finanzas: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, settings, updateSettings } = useApp();
  const theme = settings.theme || 'femenino';
  const styles = getThemeStyles(theme);
  
  // Navigation tabs: 'ledger' | 'projection'
  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'projection'>('ledger');
  
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

  // Calculations
  const finStats = calculateFinances(transactions, settings.monthlyBudget);

  const openAddModal = () => {
    setEditingTx(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormType('gasto');
    setFormCategory(settings.customCategories[2] || 'Alimentación');
    setFormDescription('');
    setFormAmount('');
    setFormPaymentMethod('Tarjeta de débito');
    setFormStatus('pagado');
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
      status: formStatus
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
      </div>

      {activeSubTab === 'ledger' ? (
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
                        <td className="py-4 px-6 max-w-xs truncate">{tx.description || 'Sin descripción'}</td>
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
                          {tx.type === 'ingreso' ? '+' : '-'} {formatCOP(tx.amount)}
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
      ) : (
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
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="form-input font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
