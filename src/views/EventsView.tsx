import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Plus,
  Bell,
  Sparkles,
  Calendar,
  Building,
  CheckCircle,
  Tag,
  Search,
  X
} from 'lucide-react';
import { InstitutionalEvent } from '../types';
import { StorageService } from '../services/storageService';

interface EventsViewProps {
  events: InstitutionalEvent[];
  onEventsChange: (events: InstitutionalEvent[]) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ events, onEventsChange }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [venue, setVenue] = useState('Estadio Olímpico Institucional');
  const [category, setCategory] = useState<InstitutionalEvent['category']>('torneo');
  const [organizer, setOrganizer] = useState('Dirección de Bienestar y Deportes');
  const [expectedAttendees, setExpectedAttendees] = useState(250);

  // Sort events chronologically by date and start time
  const sortedEvents = [...events].sort((a, b) =>
    `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
  );

  const filteredEvents = sortedEvents.filter(event => {
    const matchesCategory = categoryFilter === 'todos' ? true : event.category === categoryFilter;
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase()) ||
      event.venue.toLowerCase().includes(search.toLowerCase()) ||
      event.organizer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    StorageService.addEvent({
      title: title.trim(),
      description: description.trim() || 'Evento deportivo y formativo institucional.',
      date,
      startTime,
      endTime,
      venue: venue.trim() || 'Instalaciones Deportivas Institucionales',
      category,
      organizer: organizer.trim() || 'Dirección de Deportes',
      expectedAttendees: Number(expectedAttendees) || 100,
      status: 'proximo'
    });

    onEventsChange(StorageService.getEvents());
    setIsAddOpen(false);
    // Reset
    setTitle('');
    setDescription('');
    setDate('');
  };

  const handleTriggerAlert = (event: InstitutionalEvent) => {
    StorageService.triggerEventAlert(event);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'inauguracion':
        return { label: 'Inauguración Oficial', color: 'bg-amber-950 text-amber-300 border-amber-800' };
      case 'premiacion':
        return { label: 'Gala de Premiación', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
      case 'torneo':
        return { label: 'Torneo / Competencia', color: 'bg-blue-950 text-sky-300 border-blue-800' };
      case 'capacitacion':
      case 'conferencia':
        return { label: 'Clínica / Capacitación', color: 'bg-purple-950 text-purple-300 border-purple-800' };
      case 'entrenamiento':
        return { label: 'Pruebas / Rendimiento', color: 'bg-teal-950 text-teal-300 border-teal-800' };
      default:
        return { label: 'Evento Deportivo', color: 'bg-slate-900 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B192C] border border-blue-900/60 p-5 rounded-2xl text-white shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-sky-400" />
            Cronología de Eventos Institucionales
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Organización estructurada por fechas y horas exactas programadas por la institución
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Agendar Nuevo Evento
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#0B192C] border border-blue-900/60 rounded-xl">
          <button
            onClick={() => setCategoryFilter('todos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              categoryFilter === 'todos'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Todos ({events.length})
          </button>
          <button
            onClick={() => setCategoryFilter('inauguracion')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              categoryFilter === 'inauguracion'
                ? 'bg-amber-600 text-white shadow'
                : 'text-amber-300 hover:bg-amber-950/40'
            }`}
          >
            Inauguración
          </button>
          <button
            onClick={() => setCategoryFilter('torneo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              categoryFilter === 'torneo'
                ? 'bg-sky-600 text-white shadow'
                : 'text-sky-300 hover:bg-sky-950/40'
            }`}
          >
            Torneos
          </button>
          <button
            onClick={() => setCategoryFilter('premiacion')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              categoryFilter === 'premiacion'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-emerald-300 hover:bg-emerald-950/40'
            }`}
          >
            Premiaciones
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, lugar u organizador..."
            className="w-full pl-9 pr-3 py-2 bg-[#0B192C] border border-blue-900/60 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      {/* Chronological Timeline List */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => {
          const badge = getCategoryBadge(event.category);

          return (
            <div
              key={event.id}
              className="bg-[#0B192C] border border-blue-900/70 hover:border-sky-500/50 rounded-2xl p-5 text-white shadow-xl transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Date & Time Box */}
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-black/60 border border-blue-700/60 p-2 text-center shrink-0 shadow-inner">
                    <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-black text-white leading-none my-0.5">
                      {event.date.split('-')[2]}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {event.date.split('-')[0]}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-sky-300 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                        <Clock className="w-3 h-3" />
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-white leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Right: Venue, Organizer & Alert Button */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-blue-950 shrink-0">
                  <div className="text-xs text-slate-300 space-y-1 lg:text-right">
                    <div className="flex items-center lg:justify-end gap-1.5 text-slate-200 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center lg:justify-end gap-1.5 text-slate-400">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>Org: {event.organizer}</span>
                    </div>
                    <div className="flex items-center lg:justify-end gap-1.5 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Aforo est: ~{event.expectedAttendees} personas</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTriggerAlert(event)}
                    className="px-3 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-700 text-sky-200 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow"
                  >
                    <Bell className="w-3.5 h-3.5 text-sky-400" />
                    Enviar Notificación
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-[#0B192C] border border-blue-900/60 rounded-2xl p-8 text-slate-400">
          <CalendarDays className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="font-bold text-white text-base">No se encontraron eventos</p>
          <p className="text-xs text-slate-400 mt-1">Modifica tu búsqueda o agenda un nuevo evento institucional.</p>
        </div>
      )}

      {/* MODAL: Agendar Evento */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0B192C] border border-blue-800 rounded-2xl w-full max-w-lg p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-900/80 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Agendar Evento Institucional</h3>
                <p className="text-xs text-blue-200">Ingresa la fecha, hora y detalles organizativos</p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Título del Evento *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej: Gran Torneo Interfacultades 2026"
                  className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Descripción del Evento</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre actividades, público objetivo y requisitos..."
                  className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Hora Inicio *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Hora Fin *</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  >
                    <option value="torneo">Torneo / Competencia</option>
                    <option value="inauguracion">Inauguración</option>
                    <option value="premiacion">Gala de Premiación</option>
                    <option value="capacitacion">Clínica / Capacitación</option>
                    <option value="entrenamiento">Pruebas / Rendimiento</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Aforo Estimado</label>
                  <input
                    type="number"
                    value={expectedAttendees}
                    onChange={(e) => setExpectedAttendees(Number(e.target.value))}
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Lugar / Sede *</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="ej: Estadio Olímpico"
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Organizador</label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="ej: Dpto. de Deportes"
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-black/50 text-slate-300 hover:text-white border border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Agendar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
