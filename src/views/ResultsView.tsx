import React, { useState } from 'react';
import {
  FileCheck2,
  Calendar,
  Clock,
  Shield,
  Users,
  AlertTriangle,
  Flame,
  Award,
  Search,
  Printer,
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Plus,
  X,
  ArrowLeft,
  Home
} from 'lucide-react';
import { Match, Infraction, ScoreEvent, User } from '../types';
import { StorageService } from '../services/storageService';

interface ResultsViewProps {
  matches: Match[];
  onMatchesChange: (matches: Match[]) => void;
  currentUser?: User | null;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  matches,
  onMatchesChange,
  currentUser,
  onGoBack,
  onGoHome
}) => {
  const [search, setSearch] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('todos');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // Modal for registering a completed match directly into results
  const [isRegisterResultOpen, setIsRegisterResultOpen] = useState(false);
  const [targetMatchId, setTargetMatchId] = useState('');
  const [scoreHome, setScoreHome] = useState(0);
  const [scoreAway, setScoreAway] = useState(0);
  const [startTimeInput, setStartTimeInput] = useState('14:00');
  const [endTimeInput, setEndTimeInput] = useState('15:45');
  const [refereeName, setRefereeName] = useState('Mateo Vargas');
  const [refereeAsst1, setRefereeAsst1] = useState('Raúl Montenegro');
  const [refereeAsst2, setRefereeAsst2] = useState('Sebastián Mora');
  const [observations, setObservations] = useState('Encuentro finalizado sin novedades disciplinarias graves.');

  // Filter only played matches and sort by date descending
  const playedMatches = matches
    .filter(m => m.status === 'jugado')
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  const sportsList = Array.from(new Set(playedMatches.map(m => m.sport)));

  const filteredMatches = playedMatches.filter(match => {
    const matchesSport = selectedSport === 'todos' ? true : match.sport === selectedSport;
    const matchesSearch =
      match.teamHome.name.toLowerCase().includes(search.toLowerCase()) ||
      match.teamAway.name.toLowerCase().includes(search.toLowerCase()) ||
      match.referees.some(r => r.name.toLowerCase().includes(search.toLowerCase())) ||
      match.date.includes(search) ||
      match.venue.toLowerCase().includes(search.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedMatchId(prev => (prev === id ? null : id));
  };

  const handlePrintSheet = (match: Match) => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumbs / Return navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="px-3 py-1.5 rounded-xl bg-[#0B192C] hover:bg-blue-900 border border-blue-900/80 text-sky-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
              <span>Volver a lo anterior</span>
            </button>
          )}
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-blue-900 border border-blue-900/80 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow"
            >
              <Home className="w-3.5 h-3.5 text-sky-400" />
              <span>Inicio</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">Tu Rol:</span>
          <span className="px-2.5 py-1 rounded-full bg-blue-950 border border-blue-800 text-sky-300 font-bold uppercase text-[10px] tracking-wider">
            {currentUser ? currentUser.role : 'Invitado'}
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B192C] border border-blue-900/60 p-5 rounded-2xl text-white shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-sky-400" />
            Historial de Resultados y Actas Arbitrales
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Registro exhaustivo: horas de inicio y fin, fecha exacta, cuerpo arbitral, números de jugadores e infracciones
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
            {playedMatches.length} Partidos Oficiales Jugados
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-300 font-semibold">Filtrar deporte:</span>
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="px-3 py-2 bg-[#0B192C] border border-blue-900/60 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
          >
            <option value="todos">Todos los deportes</option>
            {sportsList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="relative min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por equipo, árbitro o fecha..."
            className="w-full pl-9 pr-3 py-2 bg-[#0B192C] border border-blue-900/60 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      {/* Matches Results Sheets */}
      <div className="space-y-4">
        {filteredMatches.map((match) => {
          const isExpanded = expandedMatchId === match.id || filteredMatches.length === 1;
          const hasInfractions = match.infractions && match.infractions.length > 0;
          const yellowCards = match.infractions.filter(i => i.type === 'amarilla');
          const redCards = match.infractions.filter(i => i.type === 'roja');

          return (
            <div
              key={match.id}
              className="bg-[#0B192C] border border-blue-900/80 rounded-2xl overflow-hidden shadow-xl text-white transition-all"
            >
              {/* Main Summary Header */}
              <div
                onClick={() => toggleExpand(match.id)}
                className="p-5 cursor-pointer hover:bg-black/30 transition-colors border-b border-blue-950"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Tournament and Sport */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-700/60 flex items-center justify-center text-sky-400 font-extrabold text-lg shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-sky-300 font-bold text-[10px] uppercase border border-blue-800">
                          {match.sport}
                        </span>
                        <span className="text-xs text-slate-300 font-medium">
                          {match.category}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-white mt-1">
                        {match.tournament}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        {match.venue}
                      </p>
                    </div>
                  </div>

                  {/* Center: Score Board */}
                  <div className="flex items-center justify-center gap-4 py-2 px-4 bg-black/50 rounded-xl border border-blue-950">
                    <div className="text-right min-w-[120px]">
                      <h4 className="font-bold text-sm text-white truncate">{match.teamHome.name}</h4>
                      <span className="text-[10px] text-slate-400">Local</span>
                    </div>

                    <div className="px-4 py-1.5 rounded-lg bg-blue-600 font-black text-xl text-white tracking-widest shadow">
                      {match.scoreHome ?? 0} - {match.scoreAway ?? 0}
                    </div>

                    <div className="text-left min-w-[120px]">
                      <h4 className="font-bold text-sm text-white truncate">{match.teamAway.name}</h4>
                      <span className="text-[10px] text-slate-400">Visitante</span>
                    </div>
                  </div>

                  {/* Right: Date, Hours & Disciplinary Summary */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 text-xs">
                    <div className="space-y-1 lg:text-right">
                      <div className="flex items-center lg:justify-end gap-1.5 font-bold text-sky-300">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Fecha: {match.date}</span>
                      </div>
                      <div className="flex items-center lg:justify-end gap-1.5 text-slate-300 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        <span>
                          {match.startTime || match.time} — {match.endTime || 'Fin reglamentario'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {hasInfractions ? (
                          <span className="text-amber-400 font-bold">
                            ⚠️ {yellowCards.length} Amarilla(s) • {redCards.length} Roja(s)
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium">✓ Sin infracciones graves</span>
                        )}
                      </div>
                    </div>

                    <button
                      className="p-2 rounded-xl bg-blue-950 border border-blue-800 text-sky-300 hover:text-white"
                      aria-label="Expandir acta"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Detailed Match Sheet (Acta Arbitral) */}
              {isExpanded && (
                <div className="p-5 bg-[#071220] border-t border-blue-950 space-y-6 animate-in fade-in duration-200">
                  {/* Detailed Times & Referees Bar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Horarios Exactos */}
                    <div className="p-4 rounded-xl bg-[#0B192C] border border-blue-900/60 space-y-2 text-xs">
                      <h4 className="font-bold text-sky-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-2 border-b border-blue-950">
                        <Clock className="w-4 h-4 text-sky-400" />
                        Control Oficial de Tiempos
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-200">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Fecha Exacta:</span>
                          <span className="font-bold text-white text-sm">{match.date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Sede del Partido:</span>
                          <span className="font-bold text-white truncate block">{match.venue}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Hora de Inicio Oficial:</span>
                          <span className="font-bold text-emerald-400 text-sm">
                            {match.startTime || `${match.time} (Programada)`}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Hora de Finalización Oficial:</span>
                          <span className="font-bold text-amber-400 text-sm">
                            {match.endTime || '12:40 PM'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cuerpo Arbitral */}
                    <div className="p-4 rounded-xl bg-[#0B192C] border border-blue-900/60 space-y-2 text-xs">
                      <h4 className="font-bold text-sky-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-2 border-b border-blue-950">
                        <Shield className="w-4 h-4 text-sky-400" />
                        Cuerpo Arbitral Asignado
                      </h4>
                      <div className="space-y-1.5">
                        {match.referees && match.referees.length > 0 ? (
                          match.referees.map((ref, i) => (
                            <div key={i} className="flex items-center justify-between text-slate-200">
                              <span className="text-slate-400 font-medium">{ref.role}:</span>
                              <span className="font-bold text-white flex items-center gap-1.5">
                                {ref.name}
                                {ref.licenseNumber && (
                                  <span className="text-[10px] text-blue-300 font-normal bg-blue-950 px-1.5 py-0.2 rounded border border-blue-800">
                                    {ref.licenseNumber}
                                  </span>
                                )}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 italic">Cuerpo arbitral institucional certificado.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Team Rosters (Jugadores con sus números) */}
                  <div>
                    <h4 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      Alineaciones de Jugadores y Números de Camiseta
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Local Team */}
                      <div className="p-4 rounded-xl bg-[#0B192C] border border-blue-900/60 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-blue-950 pb-2">
                          <h5 className="font-bold text-xs text-sky-300 flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: match.teamHome.logoColor }}
                            />
                            {match.teamHome.name} (Local)
                          </h5>
                          <span className="text-[11px] text-slate-400">
                            {match.teamHome.players.length} jugadores en nómina
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {match.teamHome.players.map((p) => (
                            <div
                              key={p.id}
                              className="p-2 rounded-lg bg-black/40 border border-blue-950 flex items-center gap-2"
                            >
                              <span className="w-6 h-6 rounded-md bg-blue-900 text-sky-200 font-black text-xs flex items-center justify-center shrink-0 border border-blue-700">
                                #{p.number}
                              </span>
                              <div className="min-w-0">
                                <p className="font-semibold text-white truncate text-[11px] leading-tight">
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-slate-400 capitalize">
                                  {p.position || 'Jugador'} {p.isCaptain ? '⭐ (Capitán)' : ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Away Team */}
                      <div className="p-4 rounded-xl bg-[#0B192C] border border-blue-900/60 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-blue-950 pb-2">
                          <h5 className="font-bold text-xs text-sky-300 flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: match.teamAway.logoColor }}
                            />
                            {match.teamAway.name} (Visitante)
                          </h5>
                          <span className="text-[11px] text-slate-400">
                            {match.teamAway.players.length} jugadores en nómina
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {match.teamAway.players.map((p) => (
                            <div
                              key={p.id}
                              className="p-2 rounded-lg bg-black/40 border border-blue-950 flex items-center gap-2"
                            >
                              <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-200 font-black text-xs flex items-center justify-center shrink-0 border border-slate-700">
                                #{p.number}
                              </span>
                              <div className="min-w-0">
                                <p className="font-semibold text-white truncate text-[11px] leading-tight">
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-slate-400 capitalize">
                                  {p.position || 'Jugador'} {p.isCaptain ? '⭐ (Capitán)' : ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Disciplinary Infractions Table (Infracciones: Amarillas, Rojas, Faltas) */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Reporte Disciplinario e Infracciones Arbitrales
                      </h4>
                      <span className="text-xs font-semibold text-slate-300">
                        {hasInfractions
                          ? `Total Infracciones: ${match.infractions.length}`
                          : 'Partido limpio (0 sanciones)'}
                      </span>
                    </div>

                    {hasInfractions ? (
                      <div className="overflow-x-auto rounded-xl border border-blue-900/60 bg-[#0B192C]">
                        <table className="w-full text-left text-xs text-slate-200">
                          <thead className="bg-black/50 text-slate-400 uppercase text-[10px] border-b border-blue-950 font-bold tracking-wider">
                            <tr>
                              <th className="p-3">Tipo Sanción</th>
                              <th className="p-3">Minuto</th>
                              <th className="p-3">Jugador / Dorsal</th>
                              <th className="p-3">Equipo</th>
                              <th className="p-3">Motivo / Descripción Arbitral</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-blue-950/60">
                            {match.infractions.map((inf) => (
                              <tr key={inf.id} className="hover:bg-black/20">
                                <td className="p-3">
                                  {inf.type === 'amarilla' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                                      🟨 Tarjeta Amarilla
                                    </span>
                                  ) : inf.type === 'roja' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] bg-rose-950 text-rose-300 border border-rose-800">
                                      🟥 Tarjeta Roja (Expulsión)
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] bg-blue-950 text-sky-300 border border-blue-800">
                                      ⚠️ Falta Grave
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 font-bold text-white">{inf.minute}'</td>
                                <td className="p-3 font-semibold text-white">
                                  {inf.playerName} <span className="text-sky-300 font-bold">(#{inf.playerNumber})</span>
                                </td>
                                <td className="p-3 text-slate-300 font-medium">
                                  {inf.teamId === match.teamHome.id ? match.teamHome.name : match.teamAway.name}
                                </td>
                                <td className="p-3 text-slate-300 italic">{inf.reason}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-black/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          En este encuentro no se registraron infracciones ni amonestaciones disciplinarias.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Scorers & Goal events if any */}
                  {match.scoreEvents && match.scoreEvents.length > 0 && (
                    <div className="p-4 rounded-xl bg-[#0B192C] border border-blue-900/60">
                      <h4 className="font-bold text-xs text-sky-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-amber-400" />
                        Cronología de Goles y Anotaciones
                      </h4>
                      <div className="flex flex-wrap gap-3 text-xs">
                        {match.scoreEvents.map((sc) => (
                          <div
                            key={sc.id}
                            className="px-3 py-1.5 rounded-lg bg-black/40 border border-blue-950 flex items-center gap-2"
                          >
                            <span className="font-black text-amber-400">{sc.minute}'</span>
                            <span className="font-bold text-white">{sc.playerName} (#{sc.playerNumber})</span>
                            <span className="text-[10px] text-sky-300 uppercase bg-blue-950 px-1 rounded">
                              {sc.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Observations & Print Action */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-blue-950 text-xs">
                    <div className="text-slate-300 italic">
                      <span className="font-bold not-italic text-slate-400">Observaciones del acta: </span>
                      {match.observations || 'Sin observaciones reglamentarias adicionales.'}
                    </div>

                    <button
                      onClick={() => handlePrintSheet(match)}
                      className="px-3.5 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-sky-200 hover:text-white border border-blue-700 font-semibold flex items-center gap-2 transition-colors shrink-0"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Imprimir / Exportar Acta
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-12 bg-[#0B192C] border border-blue-900/60 rounded-2xl p-8 text-slate-400">
          <FileCheck2 className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="font-bold text-white text-base">No hay resultados que coincidan</p>
          <p className="text-xs text-slate-400 mt-1">Los partidos finalizados registrarán sus actas detalladas aquí.</p>
        </div>
      )}
    </div>
  );
};
