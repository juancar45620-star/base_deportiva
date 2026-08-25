import React, { useState } from 'react';
import {
  Users,
  Search,
  UserCheck,
  BookOpen,
  AlertTriangle,
  Plus,
  Phone,
  Mail,
  Calendar,
  Clock,
  Briefcase,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import { Coach, CoachStatus } from '../types';
import { StorageService } from '../services/storageService';

interface CoachesViewProps {
  coaches: Coach[];
  onCoachesChange: (coaches: Coach[]) => void;
}

export const CoachesView: React.FC<CoachesViewProps> = ({ coaches, onCoachesChange }) => {
  const [filter, setFilter] = useState<'todos' | CoachStatus>('todos');
  const [search, setSearch] = useState('');
  
  // State for updating status modal
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [newStatus, setNewStatus] = useState<CoachStatus>('disponible');
  const [statusNotes, setStatusNotes] = useState('');

  // State for adding new coach modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [sport, setSport] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [schedule, setSchedule] = useState('');
  const [initialStatus, setInitialStatus] = useState<CoachStatus>('disponible');
  const [experienceYears, setExperienceYears] = useState(5);

  const filteredCoaches = coaches.filter(coach => {
    const matchesFilter = filter === 'todos' ? true : coach.status === filter;
    const matchesSearch =
      coach.name.toLowerCase().includes(search.toLowerCase()) ||
      coach.sport.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const availableCount = coaches.filter(c => c.status === 'disponible').length;
  const inClassCount = coaches.filter(c => c.status === 'en_clase').length;
  const disabledCount = coaches.filter(c => c.status === 'incapacitado').length;

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) return;
    const updated = StorageService.updateCoachStatus(selectedCoach.id, newStatus, statusNotes);
    onCoachesChange(updated);
    setSelectedCoach(null);
    setStatusNotes('');
  };

  const handleAddCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sport.trim()) return;

    const newCoach = StorageService.addCoach({
      name: name.trim(),
      sport: sport.trim(),
      status: initialStatus,
      phone: phone.trim() || '+57 300 000 0000',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@deportes.edu`,
      schedule: schedule.trim() || 'Lun - Vie: 08:00 - 14:00',
      currentActivity: initialStatus === 'disponible' ? 'Disponible para atención' : 'Sesión práctica',
      experienceYears: Number(experienceYears) || 3,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
    });

    onCoachesChange(StorageService.getCoaches());
    setIsAddModalOpen(false);
    // Reset
    setName('');
    setSport('');
    setPhone('');
    setEmail('');
    setSchedule('');
  };

  const getStatusBadge = (status: CoachStatus) => {
    switch (status) {
      case 'disponible':
        return {
          label: 'Disponible',
          icon: UserCheck,
          className: 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
        };
      case 'en_clase':
        return {
          label: 'En Clases / Entrenamiento',
          icon: BookOpen,
          className: 'bg-amber-950/90 text-amber-300 border-amber-800'
        };
      case 'incapacitado':
        return {
          label: 'Incapacitado / Licencia',
          icon: AlertTriangle,
          className: 'bg-rose-950/90 text-rose-300 border-rose-800'
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Search and Add Coach */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B192C] border border-blue-900/60 p-5 rounded-2xl text-white shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" />
            Directorio y Estado de Entrenadores
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Supervisa disponibilidad, sesiones de entrenamiento en curso y licencias médicas
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Registrar Entrenador
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#0B192C] border border-blue-900/60 rounded-xl">
          <button
            onClick={() => setFilter('todos')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'todos'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Todos ({coaches.length})
          </button>

          <button
            onClick={() => setFilter('disponible')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'disponible'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Disponibles ({availableCount})
          </button>

          <button
            onClick={() => setFilter('en_clase')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'en_clase'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-400 hover:bg-amber-950/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            En Clases ({inClassCount})
          </button>

          <button
            onClick={() => setFilter('incapacitado')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'incapacitado'
                ? 'bg-rose-600 text-white shadow'
                : 'text-rose-400 hover:bg-rose-950/40'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Incapacitados ({disabledCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o deporte..."
            className="w-full pl-10 pr-4 py-2 bg-[#0B192C] border border-blue-900/60 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCoaches.map((coach) => {
          const badge = getStatusBadge(coach.status);
          const Icon = badge.icon;

          return (
            <div
              key={coach.id}
              className="bg-[#0B192C] border border-blue-900/60 hover:border-blue-700 rounded-2xl p-5 text-white shadow-xl flex flex-col justify-between transition-all"
            >
              <div>
                {/* Top Coach Info */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={coach.photo}
                    alt={coach.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-700/60 shadow-md shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-white truncate">{coach.name}</h3>
                    <p className="text-xs font-semibold text-sky-400 truncate">{coach.sport}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {coach.experienceYears} años de experiencia
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${badge.className}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{badge.label}</span>
                  </div>
                </div>

                {/* Current Activity / Notes */}
                <div className="p-3 rounded-xl bg-black/40 border border-blue-950 text-xs space-y-1.5 mb-4">
                  <span className="text-slate-400 font-medium block">Actividad actual:</span>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {coach.currentActivity || 'Sin actividad reportada.'}
                  </p>
                  {coach.statusNotes && (
                    <p className="text-[11px] text-rose-300 italic pt-1 border-t border-blue-950/60">
                      Nota médica: {coach.statusNotes}
                    </p>
                  )}
                </div>

                {/* Schedule & Contact Details */}
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{coach.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{coach.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{coach.email}</span>
                  </div>
                </div>
              </div>

              {/* Action: Update status */}
              <div className="mt-5 pt-4 border-t border-blue-950 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCoach(coach);
                    setNewStatus(coach.status);
                    setStatusNotes(coach.statusNotes || '');
                  }}
                  className="w-full py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-sky-200 hover:text-white font-semibold text-xs transition-colors text-center"
                >
                  Cambiar Estado / Actividad
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCoaches.length === 0 && (
        <div className="text-center py-12 bg-[#0B192C] border border-blue-900/60 rounded-2xl p-8 text-slate-400">
          <Users className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="font-bold text-white text-base">No se encontraron entrenadores</p>
          <p className="text-xs text-slate-400 mt-1">Intenta con otro filtro de búsqueda o registra uno nuevo.</p>
        </div>
      )}

      {/* MODAL: Update Coach Status */}
      {selectedCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0B192C] border border-blue-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-900/80 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Actualizar Estado del Entrenador</h3>
                <p className="text-xs text-blue-200">{selectedCoach.name} ({selectedCoach.sport})</p>
              </div>
              <button
                onClick={() => setSelectedCoach(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-2">Seleccione Nuevo Estado:</label>
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      newStatus === 'disponible'
                        ? 'bg-emerald-950/60 border-emerald-500 text-white'
                        : 'bg-black/40 border-blue-950 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="coachStatus"
                      value="disponible"
                      checked={newStatus === 'disponible'}
                      onChange={() => setNewStatus('disponible')}
                      className="text-emerald-500"
                    />
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold block">Disponible</span>
                      <span className="text-[11px] text-slate-400">Listo para atención, prácticas o asignación</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      newStatus === 'en_clase'
                        ? 'bg-amber-950/60 border-amber-500 text-white'
                        : 'bg-black/40 border-blue-950 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="coachStatus"
                      value="en_clase"
                      checked={newStatus === 'en_clase'}
                      onChange={() => setNewStatus('en_clase')}
                      className="text-amber-500"
                    />
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="font-bold block">En Clases / Entrenamiento</span>
                      <span className="text-[11px] text-slate-400">Dirigiendo sesión práctica en cancha</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      newStatus === 'incapacitado'
                        ? 'bg-rose-950/60 border-rose-500 text-white'
                        : 'bg-black/40 border-blue-950 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="coachStatus"
                      value="incapacitado"
                      checked={newStatus === 'incapacitado'}
                      onChange={() => setNewStatus('incapacitado')}
                      className="text-rose-500"
                    />
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="font-bold block">Incapacitado / Fuera de servicio</span>
                      <span className="text-[11px] text-slate-400">Incapacidad médica o permiso laboral</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Detalle de la Actividad o Motivo:
                </label>
                <input
                  type="text"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="ej: Entrenamiento Selección Masculina Cancha 1 o Licencia médica por esguince"
                  className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setSelectedCoach(null)}
                  className="px-4 py-2 rounded-xl bg-black/50 text-slate-300 hover:text-white border border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Guardar Estado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add New Coach */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0B192C] border border-blue-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-900/80 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Registrar Nuevo Entrenador</h3>
                <p className="text-xs text-blue-200">Vinculación al cuerpo técnico institucional</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCoach} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ej: Prof. Gabriel Santana"
                  className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Disciplina / Deporte *</label>
                <input
                  type="text"
                  required
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  placeholder="ej: Fútbol 11, Baloncesto, Voleibol..."
                  className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Estado Inicial</label>
                  <select
                    value={initialStatus}
                    onChange={(e) => setInitialStatus(e.target.value as CoachStatus)}
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="en_clase">En Clases</option>
                    <option value="incapacitado">Incapacitado</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Años Experiencia</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Horario Asignado</label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="ej: Lun - Vie: 07:00 - 13:00"
                  className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 310 000 0000"
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@deportes.edu"
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-black/50 text-slate-300 hover:text-white border border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
