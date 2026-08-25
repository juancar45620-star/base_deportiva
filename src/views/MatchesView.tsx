import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Users,
  Flame,
  Search,
  Eye,
  X
} from 'lucide-react';
import { Match, MatchStatus } from '../types';
import { StorageService } from '../services/storageService';
import { ActiveTab } from '../components/Sidebar';

interface MatchesViewProps {
  matches: Match[];
  onMatchesChange: (matches: Match[]) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onStartMatch: (matchId: string) => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  matches,
  onMatchesChange,
  setActiveTab,
  onStartMatch
}) => {
  const [tabFilter, setTabFilter] = useState<'todos' | 'pendiente' | 'jugado' | 'en_vivo'>('todos');
  const [search, setSearch] = useState('');
  const [sportFilter, setSportFilter] = useState<string>('todos');

  // Modal for adding new match
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [sport, setSport] = useState('Fútbol 11');
  const [category, setCategory] = useState('Torneo Interfacultades');
  const [tournament, setTournament] = useState('Copa Institucional 2026');
  const [teamHomeName, setTeamHomeName] = useState('');
  const [teamAwayName, setTeamAwayName] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [matchTime, setMatchTime] = useState('15:00');
  const [venue, setVenue] = useState('Cancha Principal N° 1');

  const sportsList = Array.from(new Set(matches.map(m => m.sport)));

  const filteredMatches = matches.filter(match => {
    const matchesTab = tabFilter === 'todos' ? true : match.status === tabFilter;
    const matchesSport = sportFilter === 'todos' ? true : match.sport === sportFilter;
    const matchesSearch =
      match.teamHome.name.toLowerCase().includes(search.toLowerCase()) ||
      match.teamAway.name.toLowerCase().includes(search.toLowerCase()) ||
      match.tournament.toLowerCase().includes(search.toLowerCase()) ||
      match.venue.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSport && matchesSearch;
  });

  const pendingCount = matches.filter(m => m.status === 'pendiente').length;
  const playedCount = matches.filter(m => m.status === 'jugado').length;
  const liveCount = matches.filter(m => m.status === 'en_vivo').length;

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamHomeName.trim() || !teamAwayName.trim() || !matchDate) return;

    StorageService.addMatch({
      sport,
      category,
      tournament,
      teamHome: {
        id: `team-${Date.now()}-1`,
        name: teamHomeName.trim(),
        shortName: teamHomeName.substring(0, 3).toUpperCase(),
        category: 'Institucional',
        logoColor: '#1e3a8a',
        textColor: '#ffffff',
        players: [
          { id: `p-${Date.now()}-1`, name: 'Capitán Local', number: 10, position: 'Delantero', isCaptain: true },
          { id: `p-${Date.now()}-2`, name: 'Portero Local', number: 1, position: 'Portero' }
        ]
      },
      teamAway: {
        id: `team-${Date.now()}-2`,
        name: teamAwayName.trim(),
        shortName: teamAwayName.substring(0, 3).toUpperCase(),
        category: 'Institucional',
        logoColor: '#b91c1c',
        textColor: '#ffffff',
        players: [
          { id: `p-${Date.now()}-3`, name: 'Capitán Visitante', number: 9, position: 'Delantero', isCaptain: true },
          { id: `p-${Date.now()}-4`, name: 'Portero Visitante', number: 1, position: 'Portero' }
        ]
      },
      date: matchDate,
      time: matchTime,
      venue,
      status: 'pendiente',
      referees: [
        { role: 'Árbitro Principal', name: 'Designación Institucional', licenseNumber: 'FED-PEND' }
      ],
      infractions: [],
      scoreEvents: [],
      notifyOnStart: true,
      notifyOnEnd: true
    });

    onMatchesChange(StorageService.getMatches());
    setIsAddOpen(false);
    setTeamHomeName('');
    setTeamAwayName('');
    setMatchDate('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B192C] border border-blue-900/60 p-5 rounded-2xl text-white shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-sky-400" />
            Programación e Historial de Partidos
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Registro cronológico de encuentros que faltan por jugar y partidos ya disputados
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Programar Nuevo Partido
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 p-1.5 bg-[#0B192C] border border-blue-900/60 rounded-xl">
            <button
              onClick={() => setTabFilter('todos')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                tabFilter === 'todos'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Todos ({matches.length})
            </button>

            <button
              onClick={() => setTabFilter('pendiente')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                tabFilter === 'pendiente'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-sky-300 hover:bg-sky-950/40'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Por Jugar / Pendientes ({pendingCount})
            </button>

            <button
              onClick={() => setTabFilter('jugado')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                tabFilter === 'jugado'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-emerald-300 hover:bg-emerald-950/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ya Jugados ({playedCount})
            </button>

            {liveCount > 0 && (
              <button
                onClick={() => setTabFilter('en_vivo')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  tabFilter === 'en_vivo'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-rose-400 hover:bg-rose-950/40 animate-pulse'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                En Vivo ({liveCount})
              </button>
            )}
          </div>

          {/* Search & Sport Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="px-3 py-2 bg-[#0B192C] border border-blue-900/60 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
            >
              <option value="todos">Todos los deportes</option>
              {sportsList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div className="relative min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por equipo o torneo..."
                className="w-full pl-9 pr-3 py-2 bg-[#0B192C] border border-blue-900/60 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Matches Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map((match) => {
          const isPlayed = match.status === 'jugado';
          const isLive = match.status === 'en_vivo';
          const isPending = match.status === 'pendiente';

          return (
            <div
              key={match.id}
              className={`rounded-2xl p-5 text-white shadow-xl transition-all border flex flex-col justify-between ${
                isLive
                  ? 'bg-gradient-to-b from-rose-950/90 to-[#0B192C] border-rose-600/70 shadow-rose-600/10'
                  : isPlayed
                  ? 'bg-[#0B192C] border-blue-900/80 hover:border-emerald-700/60'
                  : 'bg-[#0B192C] border-blue-900/80 hover:border-sky-500/60'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-blue-950 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sky-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800 text-[11px]">
                      {match.sport}
                    </span>
                    <span className="text-slate-300 text-[11px] truncate max-w-[150px]">
                      {match.tournament}
                    </span>
                  </div>

                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      EN VIVO
                    </span>
                  ) : isPlayed ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      FINALIZADO
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
                      POR JUGAR
                    </span>
                  )}
                </div>

                {/* Teams & Score / VS */}
                <div className="py-3 px-2 bg-black/40 rounded-xl border border-blue-950/60 flex items-center justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0 text-center">
                    <div
                      className="w-4 h-4 rounded-full mx-auto mb-1 border border-white/20"
                      style={{ backgroundColor: match.teamHome.logoColor }}
                    />
                    <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                      {match.teamHome.name}
                    </h4>
                  </div>

                  <div className="px-3 shrink-0 text-center">
                    {isPlayed || isLive ? (
                      <div className="text-lg sm:text-2xl font-black text-white tracking-wider">
                        {match.scoreHome ?? 0} - {match.scoreAway ?? 0}
                      </div>
                    ) : (
                      <span className="px-2.5 py-1 text-xs font-black text-slate-400 bg-black/60 rounded-md border border-slate-800">
                        VS
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {isPlayed ? 'Resultado Final' : isLive ? 'Minuto a Minuto' : 'Programado'}
                    </p>
                  </div>

                  <div className="flex-1 min-w-0 text-center">
                    <div
                      className="w-4 h-4 rounded-full mx-auto mb-1 border border-white/20"
                      style={{ backgroundColor: match.teamAway.logoColor }}
                    />
                    <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                      {match.teamAway.name}
                    </h4>
                  </div>
                </div>

                {/* Date & Time details (Fecha exacta y hora del momento) */}
                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      Fecha de Partido:
                    </span>
                    <span className="font-bold text-white">{match.date}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      Hora Programada:
                    </span>
                    <span className="font-bold text-slate-200">{match.time}</span>
                  </div>

                  {match.startTime && (
                    <div className="flex items-center justify-between text-[11px] text-blue-300">
                      <span>Inicio exacto: {match.startTime}</span>
                      {match.endTime && <span>Fin exacto: {match.endTime}</span>}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-slate-300 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{match.venue}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-blue-950 flex items-center justify-between gap-2">
                {isPending && (
                  <button
                    onClick={() => onStartMatch(match.id)}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    Iniciar Partido Ahora
                  </button>
                )}

                {isLive && (
                  <button
                    onClick={() => setActiveTab('partidos_pendientes')}
                    className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow animate-bounce"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Finalizar y Registrar Marcador
                  </button>
                )}

                {isPlayed && (
                  <button
                    onClick={() => setActiveTab('resultados')}
                    className="w-full py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-sky-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ver Ficha y Acta Arbitral
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-12 bg-[#0B192C] border border-blue-900/60 rounded-2xl p-8 text-slate-400">
          <Trophy className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="font-bold text-white text-base">No se encontraron partidos</p>
          <p className="text-xs text-slate-400 mt-1">Programa un nuevo partido o cambia los filtros de búsqueda.</p>
        </div>
      )}

      {/* MODAL: Programar Nuevo Partido */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0B192C] border border-blue-800 rounded-2xl w-full max-w-lg p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-900/80 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Programar Nuevo Partido</h3>
                <p className="text-xs text-blue-200">Asigna fecha, hora, sede y equipos rivales</p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMatch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Deporte / Disciplina *</label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  >
                    <option value="Fútbol 11">Fútbol 11</option>
                    <option value="Baloncesto">Baloncesto</option>
                    <option value="Voleibol">Voleibol</option>
                    <option value="Fútsal Masculino">Fútsal Masculino</option>
                    <option value="Fútsal Femenino">Fútsal Femenino</option>
                    <option value="Tenis de Mesa">Tenis de Mesa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Torneo / Campeonato</label>
                  <input
                    type="text"
                    value={tournament}
                    onChange={(e) => setTournament(e.target.value)}
                    placeholder="ej: Copa Los Andes 2026"
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Equipo Local *</label>
                  <input
                    type="text"
                    required
                    value={teamHomeName}
                    onChange={(e) => setTeamHomeName(e.target.value)}
                    placeholder="ej: Facultad de Ingeniería"
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Equipo Visitante *</label>
                  <input
                    type="text"
                    required
                    value={teamAwayName}
                    onChange={(e) => setTeamAwayName(e.target.value)}
                    placeholder="ej: Facultad de Medicina"
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Fecha del Partido *</label>
                  <input
                    type="date"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-200 mb-1">Hora Programada *</label>
                  <input
                    type="time"
                    required
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Sede / Cancha / Estadio *</label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="ej: Cancha Principal N° 1 o Coliseo Cubierto"
                  className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                />
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
                  Programar Partido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
