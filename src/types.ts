export type UserRole = 'admin' | 'entrenador' | 'arbitro' | 'estudiante' | 'espectador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  institutionId?: string;
  createdAt: string;
  password?: string;
}

export type CoachStatus = 'disponible' | 'en_clase' | 'incapacitado';

export interface Coach {
  id: string;
  name: string;
  photo: string;
  sport: string;
  status: CoachStatus;
  phone: string;
  email: string;
  schedule: string;
  currentActivity?: string;
  statusNotes?: string;
  experienceYears: number;
}

export type MatchStatus = 'pendiente' | 'en_vivo' | 'jugado' | 'cancelado';

export interface Player {
  id: string;
  name: string;
  number: number;
  position?: string;
  isCaptain?: boolean;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  category: string;
  logoColor: string;
  textColor: string;
  players: Player[];
}

export interface Infraction {
  id: string;
  type: 'amarilla' | 'roja' | 'falta_grave';
  minute: number;
  playerName: string;
  playerNumber: number;
  teamId: string;
  reason: string;
}

export interface ScoreEvent {
  id: string;
  minute: number;
  playerName: string;
  playerNumber: number;
  teamId: string;
  type: 'gol' | 'punto' | 'penal' | 'triple';
}

export interface MatchReferee {
  role: string; // 'Árbitro Principal', 'Asistente 1', 'Asistente 2', 'Cuarto Árbitro / Mesa'
  name: string;
  licenseNumber?: string;
}

export interface Match {
  id: string;
  sport: string;
  category: string;
  tournament: string;
  teamHome: Team;
  teamAway: Team;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  venue: string; // Sede / Cancha
  status: MatchStatus;
  scoreHome?: number;
  scoreAway?: number;
  startTime?: string; // Hora exacta de inicio (ej: 10:05 AM)
  endTime?: string;   // Hora exacta de finalización (ej: 11:52 AM)
  referees: MatchReferee[];
  infractions: Infraction[];
  scoreEvents: ScoreEvent[];
  observations?: string;
  notifyOnStart?: boolean;
  notifyOnEnd?: boolean;
}

export interface InstitutionalEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  venue: string;
  category: 'torneo' | 'inauguracion' | 'premiacion' | 'clinica' | 'conferencia' | 'entrenamiento';
  organizer: string;
  expectedAttendees: number;
  status: 'proximo' | 'en_curso' | 'finalizado';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'match_start' | 'match_end' | 'score_update' | 'event_alert' | 'system' | 'coach_status';
  read: boolean;
  relatedId?: string;
}
