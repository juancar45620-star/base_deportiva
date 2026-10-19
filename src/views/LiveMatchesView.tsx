import React, { useState, useEffect } from 'react';
import {
  Flame,
  Radio,
  Clock,
  MapPin,
  Trophy,
  Filter,
  Search,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Bell,
  Sparkles,
  Users,
  Shield,
  ArrowRight,
  Eye,
  RefreshCw,
  PlusCircle,
  X,
  Award,
  ChevronDown,
  Flag,
  Share2
} from 'lucide-react';
import { Match, MatchStatus, User } from '../types';
import { StorageService } from '../services/storageService';
import { audioNotification } from '../services/audioNotification';
import {
  INSTITUTION_NAME,
  INSTITUTION_LOCATION,
  SUPPORTED_SPORTS,
  INSTITUTIONAL_VENUES
} from '../data/initialData';
import confetti from 'canvas-confetti';

interface LiveMatchesViewProps {
  matches: Match[];
  onMatchesChange: (matches: Match[]) => void;
  currentUser: User | null;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export const LiveMatchesView: React.FC<LiveMatchesViewProps> = ({
  matches,
  onMatchesChange,
  currentUser,
  onGoBack,
  onGoHome
}) => {
  const [selectedSport, setSelectedSport] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<'todos' | 'en_vivo' | 'pendiente' | 'jugado'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotification, setActiveNotification] = useState<{
    id: string;
    title: string;
    message: string;
    badge: string;
    type: 'gol' | 'punto' | 'falta' | 'estado';
  } | null>(null);

  // Dynamic custom sports list with the required 8 default sports
  const [sportsList, setSportsList] = useState(SUPPORTED_SPORTS);
  const [isAddSportModalOpen, setIsAddSportModalOpen] = useState(false);
  const [newSportName, setNewSportName] = useState('');
  const [newSportIcon, setNewSportIcon] = useState('🏆');
  const [newSportCategory, setNewSportCategory] = useState('Deporte Institucional');

  // New Match Modal
  const [isNewMatchModalOpen, setIsNewMatchModalOpen] = useState(false);
  const [newMatchSport, setNewMatchSport] = useState('Fútbol');
  const [newMatchTournament, setNewMatchTournament] = useState('Torneo Interclases Perez y Aldana 2026');
  const [newMatchCategory, setNewMatchCategory] = useState('Secundaria - Juvenil');
  const [newMatchHomeTeam, setNewMatchHomeTeam] = useState('');
  const [newMatchAwayTeam, setNewMatchAwayTeam] = useState('');
  const [newMatchVenue, setNewMatchVenue] = useState(INSTITUTIONAL_VENUES[0]);
  const [newMatchDate, setNewMatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMatchTime, setNewMatchTime] = useState('14:30');
  const [newMatchStartImmediately, setNewMatchStartImmediately] = useState(true);

  // Live Match Event Modal (Gol, Punto, Tarjeta, etc.)
  const [eventModalMatch, setEventModalMatch] = useState<Match | null>(null);
  const [eventType, setEventType] = useState<'gol' | 'punto' | 'triple' | 'penal' | 'amarilla' | 'roja' | 'cambio_periodo'>('gol');
  const [eventTeamId, setEventTeamId] = useState<'home' | 'away'>('home');
  const [eventPlayerName, setEventPlayerName] = useState('');
  const [eventMinute, setEventMinute] = useState<number>(1);
  const [eventDescription, setEventDescription] = useState('');

  // Finish match modal
  const [finishModalMatch, setFinishModalMatch] = useState<Match | null>(null);
  const [finishScoreHome, setFinishScoreHome] = useState(0);
  const [finishScoreAway, setFinishScoreAway] = useState(0);
  const [finishObservations, setFinishObservations] = useState('Encuentro finalizado reglamentariamente.');

  // RBAC permissions: Esteban Argüello (admin), Diego Gómez (coach), Jorge Duarte (coach)
  const canManageLive = currentUser?.role === 'admin' || currentUser?.role === 'entrenador';

  // Live match simulation tick (increments elapsed minutes subtly)
  useEffect(() => {
    const timer = setInterval(() => {
      // Periodic check or visual pulse
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Filter matches
  const filteredMatches = matches.filter(match => {
    const matchesSport = selectedSport === 'todos' ? true : match.sport.toLowerCase().includes(selectedSport.toLowerCase());
    const matchesStatus = selectedStatus === 'todos' ? true : match.status === selectedStatus;
    const matchesQuery =
      searchQuery === '' ||
      match.teamHome.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.teamAway.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.tournament.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesStatus && matchesQuery;
  });

  const liveMatches = matches.filter(m => m.status === 'en_vivo');
  const pendingMatches = matches.filter(m => m.status === 'pendiente');
  const finishedMatches = matches.filter(m => m.status === 'jugado');

  const triggerLiveAlert = (title: string, message: string, badge: string, type: 'gol' | 'punto' | 'falta' | 'estado') => {
    setActiveNotification({ id: `alert-${Date.now()}`, title, message, badge, type });
    if (type === 'gol' || type === 'punto') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
    setTimeout(() => {
      setActiveNotification(null);
    }, 6000);
  };

  // Add new sport dynamically
  const handleAddNewSport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSportName.trim()) return;
    const newSportObj = {
      id: `sport-${Date.now()}`,
      name: newSportName.trim(),
      icon: newSportIcon.trim() || '🏆',
      category: newSportCategory.trim() || 'Institucional'
    };
    setSportsList(prev => [...prev, newSportObj]);
    setSelectedSport(newSportObj.name);
    setIsAddSportModalOpen(false);
    setNewSportName('');
    triggerLiveAlert(
      'Nueva Disciplina Agregada',
      `Se ha incorporado ${newSportObj.name} al catálogo de deportes de la I.E. Técnica Perez y Aldana.`,
      'Catálogo',
      'estado'
    );
  };

  // Create and optionally start match
  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatchHomeTeam.trim() || !newMatchAwayTeam.trim()) return;

    const newMatch = await StorageService.addMatch({
      sport: newMatchSport,
      category: newMatchCategory,
      tournament: newMatchTournament,
      teamHome: {
        id: `team-${Date.now()}-1`,
        name: newMatchHomeTeam.trim(),
        shortName: newMatchHomeTeam.substring(0, 4).toUpperCase(),
        category: newMatchCategory,
        logoColor: '#1e3a8a',
        textColor: '#ffffff',
        players: [
          { id: `p-${Date.now()}-1`, name: 'Capitán Local', number: 10, isCaptain: true },
          { id: `p-${Date.now()}-2`, name: 'Portero / Jugador Local', number: 1 }
        ]
      },
      teamAway: {
        id: `team-${Date.now()}-2`,
        name: newMatchAwayTeam.trim(),
        shortName: newMatchAwayTeam.substring(0, 4).toUpperCase(),
        category: newMatchCategory,
        logoColor: '#b91c1c',
        textColor: '#ffffff',
        players: [
          { id: `p-${Date.now()}-3`, name: 'Capitán Visitante', number: 9, isCaptain: true },
          { id: `p-${Date.now()}-4`, name: 'Portero / Jugador Visitante', number: 1 }
        ]
      },
      date: newMatchDate,
      time: newMatchTime,
      venue: newMatchVenue,
      status: newMatchStartImmediately ? 'en_vivo' : 'pendiente',
      scoreHome: 0,
      scoreAway: 0,
      currentPeriod: newMatchStartImmediately ? '1T (Primer Tiempo)' : undefined,
      elapsedMinutes: newMatchStartImmediately ? 1 : 0,
      liveStatusText: newMatchStartImmediately ? 'En juego • Recién Iniciado' : 'Por Disputar',
      startTime: newMatchStartImmediately ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : undefined,
      referees: [
        { role: 'Árbitro Principal', name: currentUser?.name || 'Cuerpo Arbitral Institucional' }
      ],
      infractions: [],
      scoreEvents: [],
      observations: `Partido organizado en ${INSTITUTION_NAME} (${INSTITUTION_LOCATION}).`
    });

    onMatchesChange(StorageService.getMatches());
    setIsNewMatchModalOpen(false);
    setNewMatchHomeTeam('');
    setNewMatchAwayTeam('');

    triggerLiveAlert(
      newMatchStartImmediately ? '🔴 ¡PARTIDO INICIADO EN VIVO!' : '📅 Nuevo Partido Programado',
      `${newMatch.teamHome.name} vs ${newMatch.teamAway.name} en ${newMatch.venue}.`,
      newMatch.sport,
      newMatchStartImmediately ? 'gol' : 'estado'
    );
  };

  // Quick Score Delta (+1, -1)
  const handleScoreDelta = async (match: Match, team: 'home' | 'away', delta: number) => {
    if (!canManageLive) return;
    const homeDelta = team === 'home' ? delta : 0;
    const awayDelta = team === 'away' ? delta : 0;
    const teamName = team === 'home' ? match.teamHome.name : match.teamAway.name;

    const updated = await StorageService.updateLiveScore(match.id, homeDelta, awayDelta, `${teamName} (+${delta})`);
    if (updated) {
      onMatchesChange(StorageService.getMatches());
      triggerLiveAlert(
        delta > 0 ? `⚽ ¡ANOTACIÓN EN VIVO! (${match.sport})` : `Ajuste de Marcador (${match.sport})`,
        `${teamName} suma punto/gol. Marcador actual: ${updated.teamHome.name} ${updated.scoreHome} - ${updated.scoreAway} ${updated.teamAway.name}.`,
        'En Vivo',
        'gol'
      );
    }
  };

  // Submit Detailed Live Event (Goal, Card, Period Change)
  const handleSubmitLiveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventModalMatch) return;

    const isHome = eventTeamId === 'home';
    const targetTeam = isHome ? eventModalMatch.teamHome : eventModalMatch.teamAway;
    const scoreDeltaHome = isHome && ['gol', 'punto', 'penal'].includes(eventType) ? 1 : isHome && eventType === 'triple' ? 3 : 0;
    const scoreDeltaAway = !isHome && ['gol', 'punto', 'penal'].includes(eventType) ? 1 : !isHome && eventType === 'triple' ? 3 : 0;

    const updated = await StorageService.recordMatchLiveEvent(eventModalMatch.id, {
      type: eventType,
      minute: eventMinute,
      playerName: eventPlayerName.trim() || targetTeam.name,
      teamId: targetTeam.id,
      teamName: targetTeam.name,
      scoreDeltaHome,
      scoreDeltaAway,
      description: eventDescription.trim() || undefined
    });

    if (updated) {
      onMatchesChange(StorageService.getMatches());
      triggerLiveAlert(
        eventType === 'gol' ? '⚽ ¡GOOOOL!' : eventType === 'triple' ? '🏀 ¡TRIPLE!' : eventType === 'punto' ? '🔥 ¡PUNTO!' : '⚠️ Incidencia Arbitral',
        `${eventPlayerName || targetTeam.name} (${targetTeam.name}) al minuto ${eventMinute}'. Marcador: ${updated.scoreHome} - ${updated.scoreAway}.`,
        eventModalMatch.sport,
        eventType === 'gol' || eventType === 'punto' || eventType === 'triple' ? 'gol' : 'falta'
      );
    }

    setEventModalMatch(null);
    setEventPlayerName('');
    setEventDescription('');
  };

  // Start a pending match into LIVE
  const handleStartMatchNow = async (matchId: string) => {
    if (!canManageLive) return;
    const updated = await StorageService.startMatch(matchId);
    if (updated) {
      onMatchesChange(StorageService.getMatches());
      triggerLiveAlert(
        '🔴 ¡SILBATO INICIAL: PARTIDO EN VIVO!',
        `El encuentro ${updated.teamHome.name} vs ${updated.teamAway.name} ha comenzado en ${updated.venue}.`,
        updated.sport,
        'estado'
      );
    }
  };

  // Finish match with official score
  const handleFinishMatchConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finishModalMatch) return;

    const updated = await StorageService.finishMatch(
      finishModalMatch.id,
      finishScoreHome,
      finishScoreAway,
      finishObservations
    );

    if (updated) {
      onMatchesChange(StorageService.getMatches());
      triggerLiveAlert(
        '🏁 PARTIDO FINALIZADO',
        `Marcador definitivo: ${updated.teamHome.name} ${updated.scoreHome} - ${updated.scoreAway} ${updated.teamAway.name}. Acta arbitral registrada.`,
        'Oficial',
        'estado'
      );
    }

    setFinishModalMatch(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Visual Dynamic Toast Notification (Drop-down banner) */}
      {activeNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full animate-in slide-in-from-top-4 duration-300">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0B192C] border-2 border-sky-400 shadow-2xl text-white backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-sky-400 animate-pulse"></div>
            <div className="flex items-start justify-between gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 shrink-0">
                {activeNotification.type === 'gol' ? (
                  <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
                ) : activeNotification.type === 'falta' ? (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                ) : (
                  <Radio className="w-5 h-5 text-sky-400 animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-sky-500 text-slate-950">
                    {activeNotification.badge}
                  </span>
                  <span className="text-[11px] text-blue-200 font-medium">Notificación en Vivo</span>
                </div>
                <h4 className="font-extrabold text-sm text-white mt-1 leading-snug">
                  {activeNotification.title}
                </h4>
                <p className="text-xs text-blue-100/90 mt-0.5 leading-relaxed">
                  {activeNotification.message}
                </p>
              </div>
              <button
                onClick={() => setActiveNotification(null)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Cerrar alerta"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B192C] via-[#122A4A] to-[#0B192C] border-2 border-blue-800/80 p-6 sm:p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-sky-300 text-xs font-bold tracking-wide">
                <Shield className="w-3.5 h-3.5" />
                {INSTITUTION_NAME}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                {INSTITUTION_LOCATION}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight flex items-center gap-3">
              <span>Partidos En Vivo & Tiempo Real</span>
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600"></span>
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 mt-2 leading-relaxed">
              Transmisión de marcadores en vivo, cronómetros, sets, cuartos y escenarios deportivos de los Juegos Interclases y Torneos Institucionales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {canManageLive && (
              <button
                id="btn-schedule-live-match"
                onClick={() => setIsNewMatchModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Programar / Iniciar Partido</span>
              </button>
            )}

            <button
              onClick={() => setIsAddSportModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-black/40 hover:bg-blue-900/60 border border-blue-400/40 text-sky-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-sky-400" />
              <span>+ Agregar Disciplina</span>
            </button>
          </div>
        </div>

        {/* Live Counters Ribbon */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-blue-900/80">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-rose-800/40">
            <div className="p-2 rounded-lg bg-rose-600/30 text-rose-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">En Vivo Ahora</p>
              <p className="text-lg font-black text-rose-400">{liveMatches.length} partidos</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-blue-800/40">
            <div className="p-2 rounded-lg bg-sky-600/30 text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Próximos</p>
              <p className="text-lg font-black text-sky-400">{pendingMatches.length} agendados</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-emerald-800/40">
            <div className="p-2 rounded-lg bg-emerald-600/30 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Finalizados</p>
              <p className="text-lg font-black text-emerald-400">{finishedMatches.length} actas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sports Categories Selector (Horizontal Bar with required 8 sports) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2">
            <span>Disciplinas Deportivas Soportadas</span>
            <span className="text-[10px] text-slate-400">({sportsList.length} disponibles)</span>
          </h3>
          <button
            onClick={() => setSelectedSport('todos')}
            className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
              selectedSport === 'todos' ? 'text-sky-300 underline' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ver Todas
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedSport('todos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              selectedSport === 'todos'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 border border-blue-400'
                : 'bg-[#0B192C] text-slate-300 hover:text-white hover:bg-blue-950 border border-blue-900/60'
            }`}
          >
            <span>🏆</span>
            <span>Todos los Deportes</span>
          </button>

          {sportsList.map((sport) => {
            const isSelected = selectedSport.toLowerCase() === sport.name.toLowerCase();
            const countForSport = matches.filter(m => m.sport.toLowerCase().includes(sport.name.toLowerCase())).length;

            return (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.name)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 border border-sky-300 scale-105'
                    : 'bg-[#0B192C] text-slate-300 hover:text-white hover:bg-blue-950 border border-blue-900/60'
                }`}
              >
                <span className="text-base">{sport.icon}</span>
                <span>{sport.name}</span>
                {countForSport > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isSelected ? 'bg-black text-sky-300' : 'bg-blue-900 text-blue-200'
                  }`}>
                    {countForSport}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter by Status & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0B192C] border border-blue-900/60">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['todos', 'en_vivo', 'pendiente', 'jugado'] as const).map((status) => {
            const labels = {
              todos: 'Todos',
              en_vivo: '🔴 En Vivo',
              pendiente: '⏳ Próximos',
              jugado: '🏁 Finalizados'
            };
            const counts = {
              todos: matches.length,
              en_vivo: liveMatches.length,
              pendiente: pendingMatches.length,
              jugado: finishedMatches.length
            };

            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white shadow border border-blue-400'
                    : 'bg-black/30 text-slate-300 hover:text-white hover:bg-blue-950 border border-transparent'
                }`}
              >
                {labels[status]} ({counts[status]})
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar equipo, curso o cancha..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-black/40 border border-blue-900/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0B192C] border border-blue-900/60 text-slate-400">
          <Trophy className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h4 className="text-base font-bold text-white">No se encontraron encuentros</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No hay partidos con los filtros seleccionados. Puedes cambiar la disciplina o registrar un nuevo encuentro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredMatches.map((match) => {
            const isLive = match.status === 'en_vivo';
            const isPending = match.status === 'pendiente';
            const isPlayed = match.status === 'jugado';

            return (
              <div
                key={match.id}
                className={`rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                  isLive
                    ? 'bg-gradient-to-b from-[#101F33] via-[#0B192C] to-[#071322] border-rose-500/80 shadow-xl shadow-rose-950/30 ring-1 ring-rose-500/40'
                    : isPending
                    ? 'bg-[#0B192C] border-blue-900/80 hover:border-blue-700/80 shadow-md'
                    : 'bg-[#091524] border-slate-800/80 text-slate-300'
                }`}
              >
                {/* Header of Match Card */}
                <div className={`px-4 py-3 border-b flex items-center justify-between gap-2 ${
                  isLive ? 'bg-rose-950/40 border-rose-900/50' : 'bg-black/30 border-blue-950'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">
                      {sportsList.find(s => s.name.toLowerCase() === match.sport.toLowerCase())?.icon || '🏆'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-white uppercase tracking-wider truncate">
                          {match.sport}
                        </span>
                        <span className="text-[10px] text-blue-300">•</span>
                        <span className="text-[11px] text-slate-300 truncate">
                          {match.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">
                        {match.tournament}
                      </p>
                    </div>
                  </div>

                  {/* Visual Status Indicator */}
                  <div>
                    {isLive && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-rose-600/40 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        <span>EN VIVO</span>
                      </div>
                    )}
                    {isPending && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-950 text-sky-300 border border-sky-800/60 text-[10px] font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3 text-sky-400" />
                        <span>Próximo</span>
                      </div>
                    )}
                    {isPlayed && (
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Finalizado</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Body: Scoreboard & Teams */}
                <div className="p-4 sm:p-5">
                  {/* Period & Time Elapsed Banner */}
                  {isLive && (
                    <div className="mb-3 px-3 py-1.5 rounded-xl bg-black/50 border border-rose-900/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-rose-300">
                        <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
                        <span>{match.currentPeriod || 'Período en Juego'}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono font-bold text-white">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{match.elapsedMinutes ? `${match.elapsedMinutes}' min` : 'En disputa'}</span>
                      </div>
                    </div>
                  )}

                  {/* Main Score Display */}
                  <div className="grid grid-cols-12 items-center gap-2 py-3">
                    {/* Home Team */}
                    <div className="col-span-5 text-center flex flex-col items-center">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-lg mb-2"
                        style={{ backgroundColor: match.teamHome.logoColor || '#1e3a8a', color: match.teamHome.textColor || '#fff' }}
                      >
                        {match.teamHome.shortName || match.teamHome.name.substring(0, 3)}
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                        {match.teamHome.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Local</p>
                    </div>

                    {/* Score Center */}
                    <div className="col-span-2 text-center">
                      {isLive || isPlayed ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-2xl sm:text-3xl font-black text-white px-2 py-1 rounded-xl bg-black/60 border border-blue-900/80 font-mono tracking-tighter">
                            <span>{match.scoreHome ?? 0}</span>
                            <span className="text-slate-500 mx-1">-</span>
                            <span>{match.scoreAway ?? 0}</span>
                          </div>
                          {match.periodScores && (
                            <span className="text-[9px] text-slate-400 font-mono mt-1">
                              {match.periodScores}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">VS</span>
                          <span className="text-xs text-slate-300 font-mono mt-1">{match.time}</span>
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="col-span-5 text-center flex flex-col items-center">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-lg mb-2"
                        style={{ backgroundColor: match.teamAway.logoColor || '#b91c1c', color: match.teamAway.textColor || '#fff' }}
                      >
                        {match.teamAway.shortName || match.teamAway.name.substring(0, 3)}
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                        {match.teamAway.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Visitante</p>
                    </div>
                  </div>

                  {/* Cancha / LUGAR: Mandatory specification */}
                  <div className="mt-2 pt-3 border-t border-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-blue-200">
                      <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="font-semibold text-white">{match.venue}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{match.date}</span>
                      <span>•</span>
                      <span>{match.time}</span>
                    </div>
                  </div>

                  {/* Recent Score Events / Timeline if any */}
                  {match.scoreEvents && match.scoreEvents.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-blue-950/60">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Acontecimientos del Encuentro:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {match.scoreEvents.map((ev) => (
                          <span
                            key={ev.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/40 text-[10px] text-slate-200 border border-blue-900/60"
                          >
                            <span>{ev.type === 'gol' ? '⚽' : ev.type === 'triple' ? '🏀' : '🔥'}</span>
                            <span className="font-bold">{ev.minute}'</span>
                            <span className="truncate max-w-[100px]">{ev.playerName}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls: Live Management (For Admins and Coaches) */}
                <div className="px-4 py-3 bg-black/40 border-t border-blue-950 flex flex-wrap items-center justify-between gap-2">
                  {isLive ? (
                    canManageLive ? (
                      <div className="w-full flex flex-wrap items-center justify-between gap-2">
                        {/* Quick Score Increments */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleScoreDelta(match, 'home', 1)}
                            title={`Anotación para ${match.teamHome.name}`}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                          >
                            <span>+1 {match.teamHome.shortName}</span>
                          </button>
                          <button
                            onClick={() => handleScoreDelta(match, 'away', 1)}
                            title={`Anotación para ${match.teamAway.name}`}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                          >
                            <span>+1 {match.teamAway.shortName}</span>
                          </button>
                        </div>

                        {/* Detailed Event & Finish Actions */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEventModalMatch(match);
                              setEventMinute(match.elapsedMinutes || 1);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Flag className="w-3 h-3" />
                            <span>Registrar Evento</span>
                          </button>

                          <button
                            onClick={() => {
                              setFinishModalMatch(match);
                              setFinishScoreHome(match.scoreHome ?? 0);
                              setFinishScoreAway(match.scoreAway ?? 0);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Finalizar</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full text-right text-[11px] text-sky-300 font-semibold flex items-center justify-end gap-1">
                        <Radio className="w-3 h-3 animate-pulse text-rose-400" />
                        <span>Transmisión Oficial en Directo • Purificación</span>
                      </div>
                    )
                  ) : isPending ? (
                    canManageLive ? (
                      <button
                        onClick={() => handleStartMatchNow(match.id)}
                        className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Iniciar Encuentro en Vivo Ahora</span>
                      </button>
                    ) : (
                      <p className="w-full text-center text-xs text-slate-400">
                        Esperando inicio oficial por el cuerpo arbitral y técnico
                      </p>
                    )
                  ) : (
                    <div className="w-full flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resultado Oficial Consolidado
                      </span>
                      <span className="text-[11px] text-slate-500">I.E. Perez y Aldana</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Agregar Nueva Disciplina Deportiva */}
      {isAddSportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B192C] border-2 border-sky-400/80 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <h3 className="font-extrabold text-base text-white">Agregar Nueva Disciplina</h3>
              </div>
              <button
                onClick={() => setIsAddSportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewSport} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Nombre de la Disciplina / Deporte <span className="text-sky-400">*</span>
                </label>
                <input
                  type="text"
                  value={newSportName}
                  onChange={(e) => setNewSportName(e.target.value)}
                  placeholder="ej: Ajedrez, Patinaje, Béisbol, Taekwondo..."
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-blue-900/80 text-white text-sm focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Ícono / Emoji
                  </label>
                  <input
                    type="text"
                    value={newSportIcon}
                    onChange={(e) => setNewSportIcon(e.target.value)}
                    placeholder="ej: ♟️, ⛸️, ⚾, 🥋"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-blue-900/80 text-white text-sm focus:outline-none focus:border-sky-400 text-center text-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={newSportCategory}
                    onChange={(e) => setNewSportCategory(e.target.value)}
                    placeholder="ej: Ciencia, Pista, Combate"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-blue-900/80 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setIsAddSportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-lg shadow-sky-500/25"
                >
                  Guardar Disciplina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Programar / Iniciar Nuevo Partido */}
      {isNewMatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B192C] border-2 border-sky-400/80 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
              <div>
                <h3 className="font-black text-lg text-white">Programar Encuentro Deportivo</h3>
                <p className="text-xs text-blue-300">{INSTITUTION_NAME} • {INSTITUTION_LOCATION}</p>
              </div>
              <button
                onClick={() => setIsNewMatchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMatch} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Disciplina Deportiva <span className="text-sky-400">*</span>
                </label>
                <select
                  value={newMatchSport}
                  onChange={(e) => setNewMatchSport(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-blue-900/80 text-white text-sm focus:outline-none focus:border-sky-400"
                >
                  {sportsList.map((s) => (
                    <option key={s.id} value={s.name} className="bg-[#0B192C]">
                      {s.icon} {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Equipo / Curso Local <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMatchHomeTeam}
                    onChange={(e) => setNewMatchHomeTeam(e.target.value)}
                    placeholder="ej: Grado 11-A, Docentes..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-blue-900/80 text-white text-sm focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Equipo / Curso Visitante <span className="text-sky-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newMatchAwayTeam}
                    onChange={(e) => setNewMatchAwayTeam(e.target.value)}
                    placeholder="ej: Grado 10-B, Selección B..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-blue-900/80 text-white text-sm focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Cancha / Escenario Deportivo (Purificación) <span className="text-sky-400">*</span>
                </label>
                <select
                  value={newMatchVenue}
                  onChange={(e) => setNewMatchVenue(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-blue-900/80 text-white text-sm focus:outline-none focus:border-sky-400"
                >
                  {INSTITUTIONAL_VENUES.map((v) => (
                    <option key={v} value={v} className="bg-[#0B192C]">
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={newMatchDate}
                    onChange={(e) => setNewMatchDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-blue-900/80 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newMatchTime}
                    onChange={(e) => setNewMatchTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-blue-900/80 text-white text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-blue-950 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">¿Iniciar Inmediatamente EN VIVO?</p>
                  <p className="text-[11px] text-blue-200">Transmitirá marcador y notificará a la comunidad ahora mismo</p>
                </div>
                <input
                  type="checkbox"
                  checked={newMatchStartImmediately}
                  onChange={(e) => setNewMatchStartImmediately(e.target.checked)}
                  className="w-5 h-5 rounded text-sky-500 focus:ring-sky-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setIsNewMatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-black/40 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-lg shadow-sky-500/25"
                >
                  {newMatchStartImmediately ? 'Iniciar Partido en Vivo' : 'Programar Encuentro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Registrar Evento en Vivo (Gol, Falta, Punto, Período) */}
      {eventModalMatch && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B192C] border-2 border-rose-500 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
              <div>
                <h3 className="font-extrabold text-base text-white">Registrar Evento en Vivo</h3>
                <p className="text-xs text-rose-300">{eventModalMatch.teamHome.name} vs {eventModalMatch.teamAway.name}</p>
              </div>
              <button
                onClick={() => setEventModalMatch(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLiveEvent} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Tipo de Evento
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEventType('gol')}
                    className={`p-2 rounded-xl border text-xs font-bold text-center ${
                      eventType === 'gol' ? 'bg-sky-500 text-slate-950 border-sky-300' : 'bg-black/40 border-blue-900/80 text-slate-200'
                    }`}
                  >
                    ⚽ Gol (+1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventType('punto')}
                    className={`p-2 rounded-xl border text-xs font-bold text-center ${
                      eventType === 'punto' ? 'bg-sky-500 text-slate-950 border-sky-300' : 'bg-black/40 border-blue-900/80 text-slate-200'
                    }`}
                  >
                    🔥 Punto (+1)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventType('triple')}
                    className={`p-2 rounded-xl border text-xs font-bold text-center ${
                      eventType === 'triple' ? 'bg-sky-500 text-slate-950 border-sky-300' : 'bg-black/40 border-blue-900/80 text-slate-200'
                    }`}
                  >
                    🏀 Triple (+3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventType('amarilla')}
                    className={`p-2 rounded-xl border text-xs font-bold text-center ${
                      eventType === 'amarilla' ? 'bg-amber-500 text-slate-950 border-amber-300' : 'bg-black/40 border-blue-900/80 text-slate-200'
                    }`}
                  >
                    🟨 Amarilla
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventType('roja')}
                    className={`p-2 rounded-xl border text-xs font-bold text-center ${
                      eventType === 'roja' ? 'bg-rose-600 text-white border-rose-400' : 'bg-black/40 border-blue-900/80 text-slate-200'
                    }`}
                  >
                    🟥 Roja
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventType('cambio_periodo')}
                    className={`p-2 rounded-xl border text-xs font-bold text-center ${
                      eventType === 'cambio_periodo' ? 'bg-blue-600 text-white border-blue-400' : 'bg-black/40 border-blue-900/80 text-slate-200'
                    }`}
                  >
                    ⏱️ Período
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Equipo Asignado
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEventTeamId('home')}
                    className={`p-2 rounded-xl border text-xs font-bold ${
                      eventTeamId === 'home' ? 'bg-blue-600 text-white border-blue-400' : 'bg-black/40 border-blue-900 text-slate-300'
                    }`}
                  >
                    {eventModalMatch.teamHome.name} (Local)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEventTeamId('away')}
                    className={`p-2 rounded-xl border text-xs font-bold ${
                      eventTeamId === 'away' ? 'bg-rose-600 text-white border-rose-400' : 'bg-black/40 border-blue-900 text-slate-300'
                    }`}
                  >
                    {eventModalMatch.teamAway.name} (Visitante)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Nombre del Jugador / Anotador
                  </label>
                  <input
                    type="text"
                    value={eventPlayerName}
                    onChange={(e) => setEventPlayerName(e.target.value)}
                    placeholder="ej: Santiago Bernal"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-blue-900/80 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Minuto
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={eventMinute}
                    onChange={(e) => setEventMinute(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-blue-900/80 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Detalles u Observación
                </label>
                <input
                  type="text"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="ej: Golazo de media distancia / Falta táctica"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-blue-900/80 text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setEventModalMatch(null)}
                  className="px-4 py-2 rounded-xl bg-black/40 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
                >
                  Registrar y Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Finalizar Encuentro con Acta */}
      {finishModalMatch && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B192C] border-2 border-emerald-500 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
              <div>
                <h3 className="font-extrabold text-base text-white">Finalizar Encuentro y Consolidar Acta</h3>
                <p className="text-xs text-emerald-300">{finishModalMatch.teamHome.name} vs {finishModalMatch.teamAway.name}</p>
              </div>
              <button
                onClick={() => setFinishModalMatch(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFinishMatchConfirm} className="space-y-4 mt-4">
              <div className="p-3 rounded-xl bg-black/40 border border-emerald-800/50 text-center">
                <p className="text-xs text-slate-300 mb-2 font-semibold">Marcador Final Oficial:</p>
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <p className="text-[11px] text-blue-300 truncate max-w-[100px]">{finishModalMatch.teamHome.name}</p>
                    <input
                      type="number"
                      min="0"
                      value={finishScoreHome}
                      onChange={(e) => setFinishScoreHome(Number(e.target.value))}
                      className="w-16 py-1.5 text-center text-xl font-black rounded-lg bg-black border border-blue-800 text-white"
                    />
                  </div>
                  <span className="text-xl font-bold text-slate-500">-</span>
                  <div>
                    <p className="text-[11px] text-rose-300 truncate max-w-[100px]">{finishModalMatch.teamAway.name}</p>
                    <input
                      type="number"
                      min="0"
                      value={finishScoreAway}
                      onChange={(e) => setFinishScoreAway(Number(e.target.value))}
                      className="w-16 py-1.5 text-center text-xl font-black rounded-lg bg-black border border-blue-800 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Observaciones Arbitrales para el Acta
                </label>
                <textarea
                  rows={3}
                  value={finishObservations}
                  onChange={(e) => setFinishObservations(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-blue-900/80 text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-950">
                <button
                  type="button"
                  onClick={() => setFinishModalMatch(null)}
                  className="px-4 py-2 rounded-xl bg-black/40 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
                >
                  Confirmar Fin de Partido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
