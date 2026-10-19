import React from 'react';
import {
  Trophy,
  Users,
  Calendar,
  Clock,
  UserCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ArrowRight,
  Shield,
  MapPin,
  Activity,
  PlusCircle,
  Bell
} from 'lucide-react';
import { Coach, Match, InstitutionalEvent, User } from '../types';
import { ActiveTab } from '../components/Sidebar';

interface HomeViewProps {
  coaches: Coach[];
  matches: Match[];
  events: InstitutionalEvent[];
  currentUser: User | null;
  setActiveTab: (tab: ActiveTab) => void;
  onStartMatch: (matchId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  coaches,
  matches,
  events,
  currentUser,
  setActiveTab,
  onStartMatch
}) => {
  const pendingMatches = matches.filter(m => m.status === 'pendiente');
  const liveMatches = matches.filter(m => m.status === 'en_vivo');
  const playedMatches = matches.filter(m => m.status === 'jugado');

  const availableCoaches = coaches.filter(c => c.status === 'disponible');
  const inClassCoaches = coaches.filter(c => c.status === 'en_clase');
  const disabledCoaches = coaches.filter(c => c.status === 'incapacitado');

  // Sorted upcoming events
  const sortedEvents = [...events].sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] border-2 border-blue-800/80 p-6 sm:p-8 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-sky-300 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              INSTITUCIÓN EDUCATIVA TÉCNICA PEREZ Y ALDANA
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
              <MapPin className="w-3 h-3" />
              Purificación - Tolima
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Bienvenido, {currentUser ? currentUser.name : 'Comunidad Educativa'}
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 mt-2 leading-relaxed">
            Portal oficial de los Juegos Interclases y Torneos Institucionales. Seguimiento de partidos en vivo, marcadores en tiempo real, actas arbitrales y cuerpo técnico oficial.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <button
              onClick={() => setActiveTab('en_vivo')}
              id="home-btn-live-matches"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
              <span>Partidos En Vivo ({liveMatches.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('partidos_pendientes')}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all"
            >
              <Clock className="w-4 h-4" />
              Próximos Encuentros ({pendingMatches.length})
            </button>
            <button
              onClick={() => setActiveTab('resultados')}
              className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-white border border-blue-400/30 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Historial de Resultados ({playedMatches.length})
            </button>
          </div>
        </div>

        {/* Decorative background grid */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
          <Trophy className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Partidos Pendientes */}
        <div
          onClick={() => setActiveTab('partidos_pendientes')}
          className="cursor-pointer group p-4 sm:p-5 rounded-2xl bg-[#0B192C] border border-blue-900/60 hover:border-sky-500/60 transition-all text-white shadow-md hover:shadow-sky-500/10"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-950 border border-blue-800 text-sky-400 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">Por Jugar</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{pendingMatches.length}</div>
            <p className="text-xs text-slate-300 mt-0.5">Partidos pendientes con sede</p>
          </div>
        </div>

        {/* Card 2: Resultados Registrados */}
        <div
          onClick={() => setActiveTab('resultados')}
          className="cursor-pointer group p-4 sm:p-5 rounded-2xl bg-[#0B192C] border border-blue-900/60 hover:border-emerald-500/60 transition-all text-white shadow-md hover:shadow-emerald-500/10"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-950 border border-blue-800 text-emerald-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Jugados</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{playedMatches.length}</div>
            <p className="text-xs text-slate-300 mt-0.5">Actas con árbitros y faltas</p>
          </div>
        </div>

        {/* Card 3: Entrenadores */}
        <div
          onClick={() => setActiveTab('entrenadores')}
          className="cursor-pointer group p-4 sm:p-5 rounded-2xl bg-[#0B192C] border border-blue-900/60 hover:border-blue-500/60 transition-all text-white shadow-md hover:shadow-blue-500/10"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-950 border border-blue-800 text-blue-300 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">Staff</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{coaches.length}</div>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
              <span className="text-emerald-400 font-semibold">{availableCoaches.length} disp.</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{inClassCoaches.length} en clase</span>
            </div>
          </div>
        </div>

        {/* Card 4: Eventos Institucionales */}
        <div
          onClick={() => setActiveTab('eventos')}
          className="cursor-pointer group p-4 sm:p-5 rounded-2xl bg-[#0B192C] border border-blue-900/60 hover:border-purple-500/60 transition-all text-white shadow-md hover:shadow-purple-500/10"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-950 border border-blue-800 text-purple-300 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">Agenda</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{events.length}</div>
            <p className="text-xs text-slate-300 mt-0.5">Eventos programados</p>
          </div>
        </div>
      </div>

      {/* Live matches highlight if any */}
      {liveMatches.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950 via-[#0B192C] to-[#0B192C] border border-rose-700/60 text-white shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <h3 className="font-bold text-base text-rose-300 uppercase tracking-wider">
                Partidos en Vivo Ahora Mismo
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('en_vivo')}
              className="text-xs text-rose-200 hover:text-white font-bold flex items-center gap-1 underline underline-offset-4 cursor-pointer"
            >
              Ver Panel en Vivo ({liveMatches.length}) →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.map((match) => (
              <div
                key={match.id}
                className="p-4 rounded-xl bg-black/60 border border-rose-800/40 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span className="font-semibold text-rose-400">{match.sport} • {match.tournament}</span>
                  <span className="font-mono text-amber-300">{match.currentPeriod || 'En juego'}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 text-left font-bold text-sm text-white">
                    {match.teamHome.name}
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-rose-600 font-extrabold text-base text-white mx-3">
                    {match.scoreHome ?? 0} - {match.scoreAway ?? 0}
                  </div>
                  <div className="flex-1 text-right font-bold text-sm text-white">
                    {match.teamAway.name}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-rose-950">
                  <span className="flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate">{match.venue}</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('en_vivo')}
                    className="text-sky-300 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Seguir en vivo</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two columns: Next Pending Matches & Coaches Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Próximos Partidos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                Próximos Partidos por Jugar
              </h3>
              <p className="text-xs text-slate-300">Con fecha, hora, sede y equipos confirmados</p>
            </div>
            <button
              onClick={() => setActiveTab('partidos_pendientes')}
              className="text-xs text-sky-300 hover:text-white font-semibold flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingMatches.slice(0, 3).map((match) => (
              <div
                key={match.id}
                className="p-4 rounded-xl bg-[#0B192C] border border-blue-900/60 hover:border-blue-700/60 transition-all text-white shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-blue-950 text-xs">
                  <span className="font-bold text-sky-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                    {match.sport}
                  </span>
                  <span className="text-slate-300 font-medium">
                    📅 {match.date} • ⏰ {match.time}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 my-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: match.teamHome.logoColor }}
                    />
                    <span className="font-bold text-sm text-white truncate">
                      {match.teamHome.name}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 text-xs font-black text-slate-400 bg-black/40 rounded border border-slate-800">
                    VS
                  </span>

                  <div className="flex items-center justify-end gap-2 flex-1 min-w-0 text-right">
                    <span className="font-bold text-sm text-white truncate">
                      {match.teamAway.name}
                    </span>
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: match.teamAway.logoColor }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 pt-2 border-t border-blue-950">
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    {match.venue}
                  </span>
                  <button
                    onClick={() => onStartMatch(match.id)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    Iniciar Partido
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Estado de Entrenadores */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-300" />
                Cuerpo Técnico
              </h3>
              <p className="text-xs text-slate-300">Disponibilidad en tiempo real</p>
            </div>
            <button
              onClick={() => setActiveTab('entrenadores')}
              className="text-xs text-sky-300 hover:text-white font-semibold flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {coaches.slice(0, 4).map((coach) => {
              const statusConfig = {
                disponible: {
                  label: 'Disponible',
                  bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                },
                en_clase: {
                  label: 'En Clase',
                  bg: 'bg-amber-950/80 text-amber-300 border-amber-800'
                },
                incapacitado: {
                  label: 'Incapacitado',
                  bg: 'bg-rose-950/80 text-rose-300 border-rose-800'
                }
              }[coach.status];

              return (
                <div
                  key={coach.id}
                  className="p-3 rounded-xl bg-[#0B192C] border border-blue-900/60 flex items-center justify-between gap-3 text-white shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={coach.photo}
                      alt={coach.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-cover border border-white/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-white truncate">{coach.name}</h4>
                      <p className="text-[11px] text-blue-300 truncate">{coach.sport}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider shrink-0 ${statusConfig.bg}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Incapacitados alert if any */}
          {disabledCoaches.length > 0 && (
            <div className="p-3 rounded-xl bg-black/40 border border-rose-900/50 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">{disabledCoaches.length} entrenador(es) incapacitado(s):</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {disabledCoaches.map(c => c.name).join(', ')} con licencia médica activa.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Institutional Events Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Próximos Eventos Institucionales
            </h3>
            <p className="text-xs text-slate-300">Cronología oficial organizada por fecha y hora</p>
          </div>
          <button
            onClick={() => setActiveTab('eventos')}
            className="text-xs text-purple-300 hover:text-white font-semibold flex items-center gap-1"
          >
            Ver calendario completo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-xl bg-[#0B192C] border border-blue-900/60 flex flex-col justify-between text-white shadow-md hover:border-purple-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-purple-300 mb-2">
                  <span className="font-bold bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800 uppercase tracking-wider text-[10px]">
                    {event.category}
                  </span>
                  <span className="text-slate-300 font-semibold">{event.date}</span>
                </div>
                <h4 className="font-bold text-sm text-white line-clamp-2">{event.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-950 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-200">⏰ {event.startTime} - {event.endTime}</span>
                <span className="truncate max-w-[120px] text-purple-200">📍 {event.venue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
