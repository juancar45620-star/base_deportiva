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
  Lock,
  X,
  ArrowLeft,
  Home
} from 'lucide-react';
import { Match, MatchStatus, User } from '../types';
import { StorageService } from '../services/storageService';
import { ActiveTab } from '../components/Sidebar';
import confetti from 'canvas-confetti';

interface PendingMatchesViewProps {
  matches: Match[];
  onMatchesChange: (matches: Match[]) => void;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser?: User | null;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export const PendingMatchesView: React.FC<PendingMatchesViewProps> = ({
  matches,
  onMatchesChange,
  setActiveTab,
  currentUser,
  onGoBack,
  onGoHome
}) => {
  const [search, setSearch] = useState('');
  const [liveAlertMsg, setLiveAlertMsg] = useState<string | null>(null);

  // RBAC check: Only coaches and administrators can control matches and trigger notifications
  const canManageMatches = currentUser?.role === 'admin' || currentUser?.role === 'entrenador';

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
    if (!canManageMatches) return;
    const updated = StorageService.startMatch(matchId);
    if (updated) {
      onMatchesChange(StorageService.getMatches());
      setLiveAlertMsg('¡Partido iniciado en vivo! Se ha notificado a toda la comunidad estudiantil e institucional.');
      setTimeout(() => setLiveAlertMsg(null), 4000);
    }
  };

  const handleUpdateLiveScore = (match: Match, newHome: number, newAway: number) => {
    if (!canManageMatches) return;
    const homeValid = Math.max(0, newHome);
    const awayValid = Math.max(0, newAway);
    StorageService.updateLiveScore(match.id, homeValid, awayValid);
    onMatchesChange(StorageService.getMatches());
  };

  const handleBroadcastScoreAlert = (match: Match) => {
    if (!canManageMatches) return;
    StorageService.addNotification({
      title: `Gol / Marcador en Vivo: ${match.teamHome.shortName} ${match.scoreHome ?? 0} - ${match.scoreAway ?? 0} ${match.teamAway.shortName}`,
      message: `Actualización de marcador en directo en ${match.venue} (${match.sport}). El encuentro está EN VIVO.`,
      type: 'score_update',
      read: false,
      relatedId: match.id
    });
    setLiveAlertMsg(`Notificación de marcador enviada: ${match.teamHome.name} ${match.scoreHome ?? 0} - ${match.scoreAway ?? 0} ${match.teamAway.name}`);
    setTimeout(() => setLiveAlertMsg(null), 4000);
  };

  const handleOpenFinishModal = (match: Match) => {
    if (!canManageMatches) return;
    setFinishingMatch(match);
    setScoreHome(match.scoreHome ?? 0);
    setScoreAway(match.scoreAway ?? 0);
  };

  const handleConfirmFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finishingMatch || !canManageMatches) return;

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
    setLiveAlertMsg('Encuentro finalizado con éxito. Se guardó el acta arbitral y se notificó el resultado definitivo.');
    setTimeout(() => setLiveAlertMsg(null), 5000);
  };

  const handleSendReminderAlert = (match: Match) => {
    if (!canManageMatches) return;
    StorageService.addNotification({
      title: `Aviso Previo de Partido: ${match.sport}`,
      message: `Encuentro programado: ${match.teamHome.name} vs ${match.teamAway.name} se disputará el ${match.date} a las ${match.time} en ${match.venue}.`,
      type: 'match_start',
      read: false,
      relatedId: match.id
    });
    setLiveAlertMsg(`Aviso previo enviado a los usuarios para el partido de ${match.sport}.`);
    setTimeout(() => setLiveAlertMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb / Return buttons */}
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

      {/* Live Alert Banner */}
      {liveAlertMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{liveAlertMsg}</span>
          </div>
          <button
            onClick={() => setLiveAlertMsg(null)}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B192C] border border-blue-900/60 p-5 rounded-2xl text-white shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            Partidos Pendientes y Transmisión en Vivo
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Seguimiento de encuentros por jugar y control en tiempo real del marcador en vivo. Solo entrenadores y administradores activan notificaciones.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('partidos')}
          className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-sky-300 font-semibold text-xs transition-colors shrink-0 cursor-pointer"
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
                <div className="p-4 rounded-xl bg-black/45 border border-blue-950/80 mb-3">
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
                        <div className="px-3 py-1.5 rounded-xl bg-rose-600 font-black text-2xl text-white shadow-lg shadow-rose-600/40">
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

                {/* Live Match Real-Time Score Controls (Only coaches & admins) */}
                {isLive && canManageMatches && (
                  <div className="p-3 rounded-xl bg-black/60 border border-rose-800/80 mb-3 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-rose-300">
                      <span>Control de Marcador en Vivo:</span>
                      <button
                        onClick={() => handleBroadcastScoreAlert(match)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold flex items-center gap-1 shadow cursor-pointer"
                        title="Notificar anotación o cambio en el marcador a toda la comunidad"
                      >
                        <Bell className="w-3 h-3" />
                        <span>Notificar Marcador</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {/* Home Controls */}
                      <div className="flex items-center justify-between bg-blue-950/80 p-2 rounded-lg border border-blue-900">
                        <span className="font-bold text-sky-300 truncate max-w-[70px]">{match.teamHome.shortName}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateLiveScore(match, (match.scoreHome ?? 0) - 1, match.scoreAway ?? 0)}
                            disabled={(match.scoreHome ?? 0) <= 0}
                            className="w-6 h-6 rounded bg-black/50 hover:bg-rose-900 border border-slate-700 text-white font-black text-xs disabled:opacity-30 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-black text-sm text-white">{match.scoreHome ?? 0}</span>
                          <button
                            onClick={() => handleUpdateLiveScore(match, (match.scoreHome ?? 0) + 1, match.scoreAway ?? 0)}
                            className="w-6 h-6 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Away Controls */}
                      <div className="flex items-center justify-between bg-blue-950/80 p-2 rounded-lg border border-blue-900">
                        <span className="font-bold text-sky-300 truncate max-w-[70px]">{match.teamAway.shortName}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateLiveScore(match, match.scoreHome ?? 0, (match.scoreAway ?? 0) - 1)}
                            disabled={(match.scoreAway ?? 0) <= 0}
                            className="w-6 h-6 rounded bg-black/50 hover:bg-rose-900 border border-slate-700 text-white font-black text-xs disabled:opacity-30 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-black text-sm text-white">{match.scoreAway ?? 0}</span>
                          <button
                            onClick={() => handleUpdateLiveScore(match, match.scoreHome ?? 0, (match.scoreAway ?? 0) + 1)}
                            className="w-6 h-6 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isLive && !canManageMatches && (
                  <div className="p-2.5 rounded-xl bg-black/50 border border-rose-900/60 text-center text-xs text-rose-200 flex items-center justify-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span>Marcador transmitido en directo institucional. Control reservado a entrenadores y directores.</span>
                  </div>
                )}

                {/* Date, Time & Venue */}
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
                  canManageMatches ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStartMatch(match.id)}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Iniciar Partido (Notificar)
                      </button>

                      <button
                        onClick={() => handleSendReminderAlert(match)}
                        className="py-2.5 px-3 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800 text-sky-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Bell className="w-3.5 h-3.5 text-sky-400" />
                        Aviso Previo (Notificar)
                      </button>
                    </div>
                  ) : (
                    <div className="py-2.5 px-3 rounded-xl bg-black/40 border border-blue-950 text-slate-400 text-xs text-center flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Programado • Notificaciones y silbatazo inicial reservados a entrenadores y admin</span>
                    </div>
                  )
                ) : (
                  canManageMatches ? (
                    <button
                      onClick={() => handleOpenFinishModal(match)}
                      className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                    >
                      <StopCircle className="w-4 h-4" />
                      Finalizar Partido y Enviar Notificación de Término
                    </button>
                  ) : (
                    <div className="py-2.5 px-3 rounded-xl bg-black/40 border border-rose-950/60 text-rose-300 text-xs text-center flex items-center justify-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                      <span>Partido en desarrollo en directo • Siguiendo acciones arbitrales</span>
                    </div>
                  )
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
                      min={0}
                      max={99}
                      value={scoreHome}
                      onChange={(e) => setScoreHome(parseInt(e.target.value) || 0)}
                      className="w-16 p-2 text-center text-xl font-bold bg-blue-950 border border-blue-800 rounded-xl text-white focus:outline-none focus:border-sky-400"
                      required
                    />
                  </div>
                  <span className="text-xl font-bold text-slate-500 pt-4">-</span>
                  <div className="text-center">
                    <p className="font-bold text-xs text-white truncate max-w-[100px] mb-1">
                      {finishingMatch.teamAway.shortName}
                    </p>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={scoreAway}
                      onChange={(e) => setScoreAway(parseInt(e.target.value) || 0)}
                      className="w-16 p-2 text-center text-xl font-bold bg-blue-950 border border-blue-800 rounded-xl text-white focus:outline-none focus:border-sky-400"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Observaciones Arbitrales / Cierre de Acta
                </label>
                <textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-black/50 border border-blue-900 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  placeholder="Detalles de tarjetas, incidencias o prórroga..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFinishingMatch(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Finalizar Partido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
