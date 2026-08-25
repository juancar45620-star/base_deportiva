import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  MapPin,
  Flame,
  CheckCircle2,
  Bell,
  Sparkles,
  Users,
  Play,
  StopCircle,
  Plus,
  Search,
  Shield,
  X
} from 'lucide-react';
import { Match, MatchStatus } from '../types';
import { StorageService } from '../services/storageService';
import { ActiveTab } from '../components/Sidebar';
import confetti from 'canvas-confetti';

interface PendingMatchesViewProps {
  matches: Match[];
  onMatchesChange: (matches: Match[]) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const PendingMatchesView: React.FC<PendingMatchesViewProps> = ({
  matches,
  onMatchesChange,
  setActiveTab
}) => {
  const [search, setSearch] = useState('');

  // Finish match modal state
  const [finishingMatch, setFinishingMatch] = useState<Match | null>(null);
  const [scoreHome, setScoreHome] = useState(2);
  const [scoreAway, setScoreAway] = useState(1);
  const [observations, setObservations] = useState('Partido finalizado reglamentariamente.');

  // Pending and Live matches
  const pendingMatches = matches.filter(m => m.status === 'pendiente' || m.status === 'en_vivo');

  const filteredMatches = pendingMatches.filter(match => {
    const matchesSearch =
      match.teamHome.name.toLowerCase().includes(search.toLowerCase()) ||
      match.teamAway.name.toLowerCase().includes(search.toLowerCase()) ||
      match.sport.toLowerCase().includes(search.toLowerCase()) ||
      match.venue.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleStartMatch = (matchId: string) => {
    const updated = StorageService.startMatch(matchId);
    if (updated) {
      onMatchesChange(StorageService.getMatches());
    }
  };

  const handleOpenFinishModal = (match: Match) => {
    setFinishingMatch(match);
    setScoreHome(match.scoreHome ?? Math.floor(Math.random() * 3));
    setScoreAway(match.scoreAway ?? Math.floor(Math.random() * 3));
  };

  const handleConfirmFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finishingMatch) return;

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if confetti fails
    }

    StorageService.finishMatch(
      finishingMatch.id,
      Number(scoreHome),
      Number(scoreAway),
      observations
    );

    onMatchesChange(StorageService.getMatches());
    setFinishingMatch(null);
  };

  const handleSendReminderAlert = (match: Match) => {
    StorageService.addNotification({
      title: `Recordatorio de Partido Institucional: ${match.sport}`,
      message: `El encuentro entre ${match.teamHome.name} vs ${match.teamAway.name} se jugará el ${match.date} a las ${match.time} en ${match.venue}.`,
      type: 'match_start',
      read: false,
      relatedId: match.id
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B192C] border border-blue-900/60 p-5 rounded-2xl text-white shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            Partidos Pendientes y Sistema de Notificaciones
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Fechas, horarios, sedes y envío de alertas automáticas al iniciar y finalizar los partidos
          </p>
        </div>

        <button
          onClick={() => setActiveTab('partidos')}
          className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-sky-300 font-semibold text-xs transition-colors shrink-0"
        >
          Ver Programación General
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por equipo, deporte o lugar..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0B192C] border border-blue-900/60 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-sky-400"
          />
        </div>

        <span className="text-xs text-blue-200 font-medium">
          {filteredMatches.length} encuentro(s) pendiente(s)
        </span>
      </div>

      {/* Pending Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMatches.map((match) => {
          const isLive = match.status === 'en_vivo';

          return (
            <div
              key={match.id}
              className={`rounded-2xl p-5 text-white shadow-xl transition-all border flex flex-col justify-between ${
                isLive
                  ? 'bg-gradient-to-b from-rose-950/90 to-[#0B192C] border-rose-600/80 shadow-rose-600/20'
                  : 'bg-[#0B192C] border-blue-900/70 hover:border-sky-500/50'
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-blue-950 text-xs">
                  <span className="font-bold text-sky-300 bg-blue-950 px-2.5 py-0.5 rounded-md border border-blue-800 text-[11px] uppercase">
                    {match.sport}
                  </span>

                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      EN VIVO (INICIADO)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800">
                      FALTA POR JUGAR
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-300 mb-2 truncate">
                  {match.tournament} • {match.category}
                </h3>

                {/* Teams Showcase Box */}
                <div className="p-4 rounded-xl bg-black/45 border border-blue-950/80 mb-4">
                  <div className="flex items-center justify-between gap-3">
                    {/* Team Home */}
                    <div className="flex-1 text-center min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl mx-auto mb-1.5 flex items-center justify-center font-black text-xs text-white shadow-md border border-white/20"
                        style={{ backgroundColor: match.teamHome.logoColor }}
                      >
                        {match.teamHome.shortName}
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                        {match.teamHome.name}
                      </h4>
                      <span className="text-[10px] text-blue-300 block">Equipo Local</span>
                    </div>

                    {/* Score or VS */}
                    <div className="px-3 shrink-0 text-center">
                      {isLive ? (
                        <div className="px-3 py-1 rounded-lg bg-rose-600 font-black text-xl text-white">
                          {match.scoreHome ?? 0} - {match.scoreAway ?? 0}
                        </div>
                      ) : (
                        <span className="px-3 py-1 text-xs font-black text-slate-300 bg-black/70 rounded-lg border border-slate-700">
                          VS
                        </span>
                      )}
                    </div>

                    {/* Team Away */}
                    <div className="flex-1 text-center min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl mx-auto mb-1.5 flex items-center justify-center font-black text-xs text-white shadow-md border border-white/20"
                        style={{ backgroundColor: match.teamAway.logoColor }}
                      >
                        {match.teamAway.shortName}
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                        {match.teamAway.name}
                      </h4>
                      <span className="text-[10px] text-blue-300 block">Equipo Visitante</span>
                    </div>
                  </div>
                </div>

                {/* Date, Time & Venue (Lugar, fechas y horas) */}
                <div className="p-3.5 rounded-xl bg-black/30 border border-blue-950 space-y-2 text-xs text-slate-200 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <Calendar className="w-4 h-4 text-sky-400" />
                      Fecha Programada:
                    </span>
                    <span className="font-bold text-white text-sm">{match.date}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <Clock className="w-4 h-4 text-sky-400" />
                      Hora del Encuentro:
                    </span>
                    <span className="font-bold text-sky-300 text-sm">
                      {match.time} {match.startTime ? `(Inició: ${match.startTime})` : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-blue-950/60">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      Lugar / Cancha:
                    </span>
                    <span className="font-bold text-slate-100 truncate max-w-[200px] text-right">
                      {match.venue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notification & Match Control Actions */}
              <div className="space-y-2 pt-2 border-t border-blue-950">
                {!isLive ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStartMatch(match.id)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Iniciar Partido (Notificar)
                    </button>

                    <button
                      onClick={() => handleSendReminderAlert(match)}
                      className="py-2.5 px-3 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-sky-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Bell className="w-3.5 h-3.5 text-sky-400" />
                      Aviso Previo
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenFinishModal(match)}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all animate-bounce"
                  >
                    <StopCircle className="w-4 h-4" />
                    Finalizar Partido y Enviar Notificación de Término
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-12 bg-[#0B192C] border border-blue-900/60 rounded-2xl p-8 text-slate-400">
          <Clock className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="font-bold text-white text-base">No hay partidos pendientes por jugar</p>
          <p className="text-xs text-slate-400 mt-1">Todos los partidos han sido jugados o puedes programar nuevos en el módulo de Partidos.</p>
        </div>
      )}

      {/* MODAL: Finalizar Partido & Consolidar Acta */}
      {finishingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0B192C] border border-blue-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-900/80 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Finalizar Encuentro y Consolidar</h3>
                <p className="text-xs text-blue-200">
                  {finishingMatch.teamHome.name} vs {finishingMatch.teamAway.name}
                </p>
              </div>
              <button
                onClick={() => setFinishingMatch(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmFinish} className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-black/50 border border-blue-900 text-center">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-3">
                  Marcador Final
                </span>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="font-bold text-xs text-white truncate max-w-[100px] mb-1">
                      {finishingMatch.teamHome.shortName}
                    </p>
                    <input
                      type="number"
                      min="0"
                      max="150"
                      value={scoreHome}
                      onChange={(e) => setScoreHome(Number(e.target.value))}
                      className="w-16 h-12 text-center text-2xl font-black bg-[#0B192C] border border-blue-700 rounded-xl text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <span className="text-xl font-bold text-slate-500 mt-4">-</span>

                  <div className="text-center">
                    <p className="font-bold text-xs text-white truncate max-w-[100px] mb-1">
                      {finishingMatch.teamAway.shortName}
                    </p>
                    <input
                      type="number"
                      min="0"
                      max="150"
                      value={scoreAway}
                      onChange={(e) => setScoreAway(Number(e.target.value))}
                      className="w-16 h-12 text-center text-2xl font-black bg-[#0B192C] border border-blue-700 rounded-xl text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Observaciones Finales:</label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400 resize-none"
                  placeholder="Detalles reglamentarios, tiempo extra..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setFinishingMatch(null)}
                  className="px-4 py-2 rounded-xl bg-black/50 text-slate-300 hover:text-white border border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar Término y Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
