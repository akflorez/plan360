import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Prospect } from '../types';
import { calculateCRMStats } from '../utils/formulas';
import { 
  Target, 
  Plus, 
  Users, 
  FileText, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  X, 
  ArrowRight,
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  CalendarDays,
  Sparkles
} from 'lucide-react';

export const Proyecto4M: React.FC = () => {
  const { prospects, addProspect, updateProspect, deleteProspect, transactions, settings } = useApp();
  
  // UI Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formNeed, setFormNeed] = useState('');
  const [formService, setFormService] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formStatus, setFormStatus] = useState<Prospect['status']>('prospecto');
  const [formNextStep, setFormNextStep] = useState('');
  const [formFollowUpDate, setFormFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');

  // Calculations
  const stats = calculateCRMStats(prospects, transactions, settings.extraIncomeGoal);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: settings.currency || 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const columns: { id: Prospect['status']; name: string; color: string }[] = [
    { id: 'prospecto', name: 'Prospecto', color: 'bg-slate-100 text-slate-700' },
    { id: 'contactado', name: 'Contactado', color: 'bg-indigo-50 text-indigo-700' },
    { id: 'reunion', name: 'Reunión Agendada', color: 'bg-purple-50 text-purple-700' },
    { id: 'propuesta', name: 'Propuesta Enviada', color: 'bg-blue-50 text-blue-700' },
    { id: 'negociacion', name: 'Negociación', color: 'bg-amber-50 text-amber-800' },
    { id: 'ganado', name: 'Cliente Ganado', color: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
    { id: 'perdido', name: 'Cliente Perdido', color: 'bg-rose-50 text-rose-700' },
  ];

  // Stage shifting helpers
  const handleShiftStage = (p: Prospect, direction: 'next' | 'prev') => {
    const currentIndex = columns.findIndex(col => col.id === p.status);
    let nextIndex = currentIndex;
    
    if (direction === 'next' && currentIndex < columns.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }
    
    if (nextIndex !== currentIndex) {
      updateProspect({
        ...p,
        status: columns[nextIndex].id
      });
    }
  };

  const openAddModal = () => {
    setEditingProspect(null);
    setFormName('');
    setFormCompany('');
    setFormEmail('');
    setFormPhone('');
    setFormNeed('');
    setFormService('Dashboard de Power BI Comercial');
    setFormValue('1500000');
    setFormStatus('prospecto');
    setFormNextStep('Enviar correo introductorio con portafolio');
    setFormFollowUpDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Prospect) => {
    setEditingProspect(p);
    setFormName(p.name);
    setFormCompany(p.company);
    setFormEmail(p.email || '');
    setFormPhone(p.phone || '');
    setFormNeed(p.need || '');
    setFormService(p.serviceOffered);
    setFormValue(p.valueProposed.toString());
    setFormStatus(p.status);
    setFormNextStep(p.nextStep || '');
    setFormFollowUpDate(p.followUpDate || new Date().toISOString().split('T')[0]);
    setFormNotes(p.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formValue || isNaN(Number(formValue))) return;

    const data = {
      name: formName.trim(),
      company: formCompany.trim(),
      contact: formName.trim(), // simple duplication
      phone: formPhone.trim(),
      email: formEmail.trim(),
      need: formNeed.trim(),
      serviceOffered: formService.trim(),
      valueProposed: Number(formValue),
      status: formStatus,
      nextStep: formNextStep.trim(),
      followUpDate: formFollowUpDate,
      notes: formNotes.trim()
    };

    if (editingProspect) {
      updateProspect({ ...data, id: editingProspect.id });
    } else {
      addProspect(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás segura de eliminar este prospecto del CRM?')) {
      deleteProspect(id);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Target Progress Panel */}
      <div className="relative p-6 md:p-8 rounded-3xl overflow-hidden bg-navy-800 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-30%,#10b981,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_120%,#06b6d4,transparent_40%)]" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-pulse-soft" />
                <span>Meta Proyecto & CRM</span>
              </div>
              <h2 className="text-2xl font-black mt-1">Generar {formatCurrency(settings.extraIncomeGoal)} adicionales al mes</h2>
            </div>
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm text-right shrink-0">
              <span className="text-[10px] text-slate-400 font-bold block">BRECHA PARA LA META</span>
              <span className="text-lg font-black text-emerald-300">{formatCurrency(stats.gapToGoal)}</span>
            </div>
          </div>

          {/* Progress bar container */}
          <div className="space-y-3 bg-white/5 p-5 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Ingreso Extra Real Recibido</span>
                <span className="text-emerald-400">{formatCurrency(stats.extraIncomeReal)} / {formatCurrency(settings.extraIncomeGoal)}</span>
              </div>
            
            {/* Progress Bar Component */}
            <div className="w-full bg-navy-950/60 h-3.5 rounded-full overflow-hidden border border-white/5 p-[2px]">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${stats.goalProgressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400">
              <span>Mensaje del proceso: <span className="text-white">"{stats.motivationalMessage}"</span></span>
              <span>Progreso: {stats.goalProgressPercent.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* CRM Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Total Leads</p>
          <h4 className="text-lg font-black text-navy-800 mt-1">{stats.numProspects}</h4>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Contactados</p>
          <h4 className="text-lg font-bold text-slate-700 mt-1">{stats.numContacted}</h4>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Propuestas</p>
          <h4 className="text-lg font-bold text-slate-700 mt-1">{stats.numProposals}</h4>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Ganados</p>
          <h4 className="text-lg font-bold text-emerald-600 mt-1">{stats.numWon}</h4>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Conversión</p>
          <h4 className="text-lg font-bold text-purple-600 mt-1">{stats.conversionRate.toFixed(0)}%</h4>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-premium text-center col-span-2 md:col-span-1">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Ticket Promedio</p>
          <h4 className="text-xs font-bold text-slate-800 mt-1.5 truncate" title={formatCurrency(stats.averageValuePerClient)}>
            {formatCurrency(stats.averageValuePerClient)}
          </h4>
        </div>
      </div>

      {/* CRM Heading operations */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-navy-800">Tablero Kanban CRM</h3>
          <p className="text-xs text-slate-400">Controla el avance de embudo de ventas y prospectos de Dashboards.</p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary text-xs px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 select-none max-h-[600px]">
        {columns.map((col) => {
          const colProspects = prospects.filter(p => p.status === col.id);
          
          return (
            <div 
              key={col.id} 
              className="bg-slate-100/60 border border-slate-200/50 p-4 rounded-2xl w-72 shrink-0 flex flex-col space-y-4 min-h-[350px]"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${col.color}`}>
                  {col.name}
                </span>
                <span className="text-xs text-slate-400 font-bold bg-slate-200/60 px-1.5 py-0.5 rounded-md">
                  {colProspects.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colProspects.length === 0 ? (
                  <p className="text-[10px] text-slate-400 text-center py-16">Sin contactos</p>
                ) : (
                  colProspects.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => openEditModal(p)}
                      className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-premium hover:shadow-premiumHover hover:border-slate-200/60 cursor-pointer transition-all space-y-2 text-left"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-navy-800">{p.name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{p.company}</p>
                      </div>

                      <div className="text-[10px] text-slate-500 font-medium">
                        <p className="font-bold text-slate-600">Servicio:</p>
                        <p className="truncate">{p.serviceOffered}</p>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-bold border-t border-slate-50 pt-2">
                        <span className="text-emerald-600">{formatCurrency(p.valueProposed)}</span>
                        
                        {/* Shifting Actions */}
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShiftStage(p, 'prev');
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-navy-800"
                            title="Retroceder etapa"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShiftStage(p, 'next');
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-navy-800"
                            title="Avanzar etapa"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CRM MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-800 uppercase tracking-wider">
                {editingProspect ? 'Editar Cliente Potencial' : 'Registrar Nuevo Prospecto'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                {/* Client Name */}
                <div>
                  <label className="form-label">Nombre del Contacto</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Andrea Restrepo"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="form-label">Empresa</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Logística Express"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    placeholder="correo@empresa.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+57 300 000 0000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Service Offered */}
                <div>
                  <label className="form-label">Servicio Ofrecido</label>
                  <input
                    type="text"
                    required
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Value proposed */}
                <div>
                  <label className="form-label">Valor Propuesto (COP)</label>
                  <input
                    type="number"
                    required
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="form-input font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status selection */}
                <div>
                  <label className="form-label">Etapa CRM</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as Prospect['status'])}
                    className="form-input"
                  >
                    <option value="prospecto">Prospecto</option>
                    <option value="contactado">Contactado</option>
                    <option value="reunion">Reunión Agendada</option>
                    <option value="propuesta">Propuesta Enviada</option>
                    <option value="negociacion">Negociación</option>
                    <option value="ganado">Ganado (Cerrado)</option>
                    <option value="perdido">Perdido (Cerrado)</option>
                  </select>
                </div>

                {/* Follow up date */}
                <div>
                  <label className="form-label">Fecha Seguimiento</label>
                  <input
                    type="date"
                    required
                    value={formFollowUpDate}
                    onChange={(e) => setFormFollowUpDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Need */}
              <div>
                <label className="form-label">Necesidad o Dolor del Cliente</label>
                <input
                  type="text"
                  placeholder="Ej. Conciliar ventas de múltiples sedes, automatizar excel..."
                  value={formNeed}
                  onChange={(e) => setFormNeed(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Next Step */}
              <div>
                <label className="form-label">Próximo Paso</label>
                <input
                  type="text"
                  placeholder="Ej. Llamar para agendar demo, enviar cotización..."
                  value={formNextStep}
                  onChange={(e) => setFormNextStep(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="form-label">Notas Adicionales</label>
                <textarea
                  placeholder="Comentarios sobre la negociación..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="form-input h-16"
                />
              </div>

              <div className="pt-4 flex gap-3">
                {editingProspect && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingProspect.id)}
                    className="btn-danger text-xs px-4 py-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                )}
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
