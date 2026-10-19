import { Coach, Match, InstitutionalEvent, AppNotification, User } from '../types';

export const INSTITUTION_NAME = 'INSTITUCIÓN EDUCATIVA TÉCNICA PEREZ Y ALDANA';
export const INSTITUTION_SHORT = 'I.E. TÉCNICA PEREZ Y ALDANA';
export const INSTITUTION_LOCATION = 'Purificación - Tolima';

export const SUPPORTED_SPORTS = [
  { id: 'futbol', name: 'Fútbol', icon: '⚽', category: 'Conjunto' },
  { id: 'voleibol', name: 'Voleibol', icon: '🏐', category: 'Conjunto' },
  { id: 'baloncesto', name: 'Baloncesto', icon: '🏀', category: 'Conjunto' },
  { id: 'microfutbol', name: 'Microfútbol / Fútbol de Salón', icon: '⚽', category: 'Conjunto' },
  { id: 'balonmano', name: 'Balonmano', icon: '🤾', category: 'Conjunto' },
  { id: 'atletismo', name: 'Atletismo', icon: '🏃', category: 'Individual / Pista' },
  { id: 'tenis_mesa', name: 'Tenis de Mesa', icon: '🏓', category: 'Raqueta / Mesa' },
  { id: 'natacion', name: 'Natación', icon: '🏊', category: 'Acuático' }
];

export const INSTITUTIONAL_VENUES = [
  'Cancha Principal de Fútbol I.E. Perez y Aldana',
  'Coliseo Cubierto Perez y Aldana - Cancha Múltiple',
  'Cancha de Microfútbol Sintética Perez y Aldana',
  'Pista de Atletismo Municipal de Purificación',
  'Piscina Municipal de Purificación',
  'Salón Múltiple de Tenis de Mesa Perez y Aldana',
  'Polideportivo Central de Purificación - Tolima'
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Esteban Argüello',
    email: 'juancar45620@gmail.com',
    role: 'admin',
    phone: '+57 300 123 4567',
    institutionId: 'DIR-ADM-01',
    createdAt: '2026-01-01',
    password: '1234'
  },
  {
    id: 'usr-diego',
    name: 'DIEGO GÓMEZ',
    email: 'diego.gomez@perezyaldana.edu.co',
    role: 'entrenador',
    phone: '+57 312 456 7890',
    institutionId: 'ENT-2026-01',
    createdAt: '2026-01-15',
    password: 'coach'
  },
  {
    id: 'usr-jorge',
    name: 'JORGE DUARTE',
    email: 'jorge.duarte@perezyaldana.edu.co',
    role: 'entrenador',
    phone: '+57 314 987 6543',
    institutionId: 'ENT-2026-02',
    createdAt: '2026-01-20',
    password: 'coach'
  },
  {
    id: 'usr-arbitro',
    name: 'Árbitro Mateo Vargas',
    email: 'mateo.arbitro@perezyaldana.edu.co',
    role: 'arbitro',
    phone: '+57 320 112 3344',
    institutionId: 'ARB-2026-10',
    createdAt: '2026-02-15',
    password: 'arbitro'
  },
  {
    id: 'usr-estudiante',
    name: 'Sofía Restrepo',
    email: 'sofia.estudiante@perezyaldana.edu.co',
    role: 'estudiante',
    phone: '+57 301 223 9988',
    institutionId: 'EST-2026-88',
    createdAt: '2026-03-01',
    password: 'atleta'
  }
];

// ÚNICAMENTE DIEGO GÓMEZ y JORGE DUARTE según requerimiento institucional
export const INITIAL_COACHES: Coach[] = [
  {
    id: 'coach-diego-gomez',
    name: 'DIEGO GÓMEZ',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    sport: 'Fútbol, Microfútbol y Balonmano',
    status: 'disponible',
    phone: '+57 312 456 7890',
    email: 'diego.gomez@perezyaldana.edu.co',
    schedule: 'Lun - Vie: 07:00 - 12:30 / 14:00 - 18:00',
    currentActivity: 'Entrenamientos Interclases • Cancha Principal I.E. Perez y Aldana',
    experienceYears: 10
  },
  {
    id: 'coach-jorge-duarte',
    name: 'JORGE DUARTE',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    sport: 'Voleibol, Baloncesto, Atletismo, Tenis de Mesa y Natación',
    status: 'en_clase',
    phone: '+57 314 987 6543',
    email: 'jorge.duarte@perezyaldana.edu.co',
    schedule: 'Lun - Sáb: 06:30 - 12:00 / 14:30 - 18:00',
    currentActivity: 'Clase Práctica de Baloncesto y Voleibol • Coliseo Cubierto',
    experienceYears: 12
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match-live-1',
    sport: 'Fútbol',
    category: 'Juegos Interclases - Categoría Superior',
    tournament: 'Torneo Interclases Perez y Aldana 2026',
    teamHome: {
      id: 'team-11a',
      name: 'Grado 11-A',
      shortName: '11-A',
      category: 'Secundaria',
      logoColor: '#1e3a8a',
      textColor: '#ffffff',
      players: [
        { id: 'p1-1', name: 'Carlos Morales', number: 1, position: 'Portero' },
        { id: 'p1-2', name: 'Andrés Castro', number: 10, position: 'Delantero', isCaptain: true },
        { id: 'p1-3', name: 'Felipe Mendoza', number: 7, position: 'Extremo' }
      ]
    },
    teamAway: {
      id: 'team-10b',
      name: 'Grado 10-B',
      shortName: '10-B',
      category: 'Secundaria',
      logoColor: '#b91c1c',
      textColor: '#ffffff',
      players: [
        { id: 'p2-1', name: 'David Guzmán', number: 1, position: 'Portero' },
        { id: 'p2-2', name: 'Mateo Osorio', number: 9, position: 'Delantero', isCaptain: true }
      ]
    },
    date: '2026-10-18',
    time: '14:30',
    venue: 'Cancha Principal de Fútbol I.E. Perez y Aldana',
    status: 'en_vivo',
    scoreHome: 2,
    scoreAway: 1,
    currentPeriod: '2T (Segundo Tiempo)',
    elapsedMinutes: 67,
    liveStatusText: 'En disputa • Gran ritmo',
    startTime: '02:30 PM',
    referees: [
      { role: 'Árbitro Principal', name: 'Árbitro Mateo Vargas', licenseNumber: 'FED-TOL-11' },
      { role: 'Asistente 1', name: 'Prof. JORGE DUARTE', licenseNumber: 'COL-04' }
    ],
    infractions: [
      {
        id: 'inf-live-1',
        type: 'amarilla',
        minute: 34,
        playerName: 'David Guzmán',
        playerNumber: 1,
        teamId: 'team-10b',
        reason: 'Demora deliberada en el saque de meta'
      }
    ],
    scoreEvents: [
      { id: 'sc-1', minute: 18, playerName: 'Andrés Castro', playerNumber: 10, teamId: 'team-11a', type: 'gol' },
      { id: 'sc-2', minute: 41, playerName: 'Mateo Osorio', playerNumber: 9, teamId: 'team-10b', type: 'gol' },
      { id: 'sc-3', minute: 58, playerName: 'Felipe Mendoza', playerNumber: 7, teamId: 'team-11a', type: 'gol' }
    ],
    observations: 'Partido en vivo por semifinal interclases en Purificación. Gran asistencia de estudiantes y docentes.',
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-live-2',
    sport: 'Baloncesto',
    category: 'Juegos Interclases - Rama Masculina',
    tournament: 'Copa Institucional Perez y Aldana 2026',
    teamHome: {
      id: 'team-9a',
      name: 'Grado 9-A',
      shortName: '9-A',
      category: 'Secundaria',
      logoColor: '#d97706',
      textColor: '#ffffff',
      players: [
        { id: 'p3-1', name: 'Santiago Bernal', number: 7, position: 'Base', isCaptain: true },
        { id: 'p3-2', name: 'Nicolás Peña', number: 23, position: 'Alero' }
      ]
    },
    teamAway: {
      id: 'team-9b',
      name: 'Grado 9-B',
      shortName: '9-B',
      category: 'Secundaria',
      logoColor: '#0f766e',
      textColor: '#ffffff',
      players: [
        { id: 'p4-1', name: 'Samuel Agudelo', number: 11, position: 'Pívot', isCaptain: true }
      ]
    },
    date: '2026-10-18',
    time: '15:00',
    venue: 'Coliseo Cubierto Perez y Aldana - Cancha Múltiple',
    status: 'en_vivo',
    scoreHome: 46,
    scoreAway: 42,
    currentPeriod: '3er Cuarto',
    elapsedMinutes: 26,
    periodScores: '1Q: 14-12 | 2Q: 16-15 | 3Q: 16-15',
    liveStatusText: '3er Cuarto en juego',
    startTime: '03:00 PM',
    referees: [
      { role: 'Árbitro Principal', name: 'Lic. Camilo Arango', licenseNumber: 'FIBA-PUR-01' }
    ],
    infractions: [],
    scoreEvents: [
      { id: 'sc-bb-1', minute: 8, playerName: 'Santiago Bernal', playerNumber: 7, teamId: 'team-9a', type: 'triple' },
      { id: 'sc-bb-2', minute: 22, playerName: 'Nicolás Peña', playerNumber: 23, teamId: 'team-9a', type: 'triple' }
    ],
    observations: 'Encuentro muy reñido en el coliseo institucional.',
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-live-3',
    sport: 'Voleibol',
    category: 'Torneo Mixto Interclases',
    tournament: 'Juegos Deportivos Perez y Aldana',
    teamHome: {
      id: 'team-docentes',
      name: 'Equipo Docentes',
      shortName: 'DOC',
      category: 'Docentes',
      logoColor: '#4338ca',
      textColor: '#ffffff',
      players: [
        { id: 'p5-1', name: 'Prof. JORGE DUARTE', number: 1, position: 'Capitán / Colocador', isCaptain: true }
      ]
    },
    teamAway: {
      id: 'team-11b',
      name: 'Grado 11-B',
      shortName: '11-B',
      category: 'Secundaria',
      logoColor: '#059669',
      textColor: '#ffffff',
      players: [
        { id: 'p6-1', name: 'Laura Restrepo', number: 10, position: 'Rematadora', isCaptain: true }
      ]
    },
    date: '2026-10-18',
    time: '15:45',
    venue: 'Coliseo Cubierto Perez y Aldana - Cancha Múltiple',
    status: 'en_vivo',
    scoreHome: 1,
    scoreAway: 1,
    currentPeriod: 'Set 3 (Desempate 15 pts)',
    elapsedMinutes: 44,
    periodScores: 'Set 1: 25-22 | Set 2: 21-25 | Set 3: 12-10',
    liveStatusText: 'Set 3 decisivo en marcha',
    startTime: '03:45 PM',
    referees: [
      { role: 'Juez Principal', name: 'DIEGO GÓMEZ', licenseNumber: 'VOL-PEREZ-01' }
    ],
    infractions: [],
    scoreEvents: [
      { id: 'sc-v-1', minute: 15, playerName: 'JORGE DUARTE', playerNumber: 1, teamId: 'team-docentes', type: 'punto' }
    ],
    observations: 'Partido en vivo con público lleno en el Coliseo Perez y Aldana.',
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-pen-1',
    sport: 'Microfútbol / Fútbol de Salón',
    category: 'Interclases Grado 8°',
    tournament: 'Torneo Relámpago Microfútbol 2026',
    teamHome: {
      id: 'team-8a',
      name: 'Grado 8-A',
      shortName: '8-A',
      category: 'Secundaria',
      logoColor: '#0284c7',
      textColor: '#ffffff',
      players: [{ id: 'p-8a', name: 'Sebastián Mora', number: 10, position: 'Pívot', isCaptain: true }]
    },
    teamAway: {
      id: 'team-8c',
      name: 'Grado 8-C',
      shortName: '8-C',
      category: 'Secundaria',
      logoColor: '#9333ea',
      textColor: '#ffffff',
      players: [{ id: 'p-8c', name: 'Camilo Peña', number: 7, position: 'Ala', isCaptain: true }]
    },
    date: '2026-10-19',
    time: '16:30',
    venue: 'Cancha de Microfútbol Sintética Perez y Aldana',
    status: 'pendiente',
    referees: [{ role: 'Árbitro', name: 'DIEGO GÓMEZ', licenseNumber: 'FUT-TOL-09' }],
    infractions: [],
    scoreEvents: [],
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-pen-2',
    sport: 'Balonmano',
    category: 'Femenino Juvenil',
    tournament: 'Interclases Perez y Aldana',
    teamHome: {
      id: 'team-bal-1',
      name: 'Selección Juvenil A',
      shortName: 'SEL-A',
      category: 'Juvenil',
      logoColor: '#ea580c',
      textColor: '#ffffff',
      players: [{ id: 'p-b1', name: 'Mariana Duarte', number: 8, position: 'Central', isCaptain: true }]
    },
    teamAway: {
      id: 'team-bal-2',
      name: 'Selección Juvenil B',
      shortName: 'SEL-B',
      category: 'Juvenil',
      logoColor: '#2563eb',
      textColor: '#ffffff',
      players: [{ id: 'p-b2', name: 'Valentina Soto', number: 5, position: 'Lateral', isCaptain: true }]
    },
    date: '2026-10-20',
    time: '15:15',
    venue: 'Coliseo Cubierto Perez y Aldana - Cancha Múltiple',
    status: 'pendiente',
    referees: [{ role: 'Árbitro', name: 'Prof. DIEGO GÓMEZ', licenseNumber: 'BM-COL-21' }],
    infractions: [],
    scoreEvents: [],
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-pen-3',
    sport: 'Atletismo',
    category: 'Pruebas de Velocidad 100m y 400m Relevos',
    tournament: 'Juegos Atléticos Perez y Aldana - Purificación',
    teamHome: {
      id: 'team-atl-dec',
      name: 'Delegación Décimo Grado',
      shortName: 'DEC',
      category: 'Secundaria',
      logoColor: '#ca8a04',
      textColor: '#ffffff',
      players: [{ id: 'pa-1', name: 'Juan Manuel Torres', number: 14, position: 'Velocista', isCaptain: true }]
    },
    teamAway: {
      id: 'team-atl-once',
      name: 'Delegación Once Grado',
      shortName: 'ONCE',
      category: 'Secundaria',
      logoColor: '#16a34a',
      textColor: '#ffffff',
      players: [{ id: 'pa-2', name: 'Daniel Lozano', number: 18, position: 'Velocista', isCaptain: true }]
    },
    date: '2026-10-21',
    time: '08:00',
    venue: 'Pista de Atletismo Municipal de Purificación',
    status: 'pendiente',
    referees: [{ role: 'Juez Cronometrador', name: 'Prof. JORGE DUARTE', licenseNumber: 'JUEZ-ATL-02' }],
    infractions: [],
    scoreEvents: [],
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-pen-4',
    sport: 'Tenis de Mesa',
    category: 'Individual Masculino y Femenino',
    tournament: 'Torneo Abierto de Raqueta Perez y Aldana',
    teamHome: {
      id: 'team-tm-1',
      name: 'Esteban Vega (10-1)',
      shortName: 'E.VEGA',
      category: 'Estudiante',
      logoColor: '#e11d48',
      textColor: '#ffffff',
      players: [{ id: 'ptm-1', name: 'Esteban Vega', number: 1, position: 'Tenista', isCaptain: true }]
    },
    teamAway: {
      id: 'team-tm-2',
      name: 'Lucas Valencia (11-2)',
      shortName: 'L.VAL',
      category: 'Estudiante',
      logoColor: '#0891b2',
      textColor: '#ffffff',
      players: [{ id: 'ptm-2', name: 'Lucas Valencia', number: 1, position: 'Tenista', isCaptain: true }]
    },
    date: '2026-10-22',
    time: '14:00',
    venue: 'Salón Múltiple de Tenis de Mesa Perez y Aldana',
    status: 'pendiente',
    referees: [{ role: 'Árbitro de Mesa', name: 'JORGE DUARTE', licenseNumber: 'TM-PUR-01' }],
    infractions: [],
    scoreEvents: [],
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-pen-5',
    sport: 'Natación',
    category: 'Prueba 50m Libre y 50m Pecho',
    tournament: 'Festival Acuático Purificación 2026',
    teamHome: {
      id: 'team-nat-azul',
      name: 'Equipo Azul Perez y Aldana',
      shortName: 'AZUL',
      category: 'Institucional',
      logoColor: '#0284c7',
      textColor: '#ffffff',
      players: [{ id: 'pn-1', name: 'Sofía Restrepo', number: 4, position: 'Nadadora', isCaptain: true }]
    },
    teamAway: {
      id: 'team-nat-verde',
      name: 'Equipo Verde Perez y Aldana',
      shortName: 'VERDE',
      category: 'Institucional',
      logoColor: '#16a34a',
      textColor: '#ffffff',
      players: [{ id: 'pn-2', name: 'Paula Jiménez', number: 5, position: 'Nadadora', isCaptain: true }]
    },
    date: '2026-10-23',
    time: '10:30',
    venue: 'Piscina Municipal de Purificación',
    status: 'pendiente',
    referees: [{ role: 'Juez de Salida', name: 'JORGE DUARTE', licenseNumber: 'NAT-03' }],
    infractions: [],
    scoreEvents: [],
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-jugado-1',
    sport: 'Fútbol',
    category: 'Juegos Interclases - Fase de Grupos',
    tournament: 'Torneo Interclases Perez y Aldana 2026',
    teamHome: {
      id: 'team-11c',
      name: 'Grado 11-C',
      shortName: '11-C',
      category: 'Secundaria',
      logoColor: '#1e3a8a',
      textColor: '#ffffff',
      players: [{ id: 'pj-1', name: 'Santiago Bernal', number: 10, position: 'Delantero', isCaptain: true }]
    },
    teamAway: {
      id: 'team-10a',
      name: 'Grado 10-A',
      shortName: '10-A',
      category: 'Secundaria',
      logoColor: '#0f766e',
      textColor: '#ffffff',
      players: [{ id: 'pj-2', name: 'Andrés Gil', number: 11, position: 'Delantero', isCaptain: true }]
    },
    date: '2026-10-15',
    time: '14:00',
    venue: 'Cancha Principal de Fútbol I.E. Perez y Aldana',
    status: 'jugado',
    scoreHome: 3,
    scoreAway: 2,
    startTime: '02:00 PM',
    endTime: '03:45 PM',
    referees: [
      { role: 'Árbitro Principal', name: 'Árbitro Mateo Vargas', licenseNumber: 'FED-TOL-11' },
      { role: 'Asistente 1', name: 'DIEGO GÓMEZ', licenseNumber: 'COL-01' }
    ],
    infractions: [
      {
        id: 'inf-j-1',
        type: 'amarilla',
        minute: 29,
        playerName: 'Santiago Bernal',
        playerNumber: 10,
        teamId: 'team-11c',
        reason: 'Falta en disputa de balón'
      }
    ],
    scoreEvents: [
      { id: 'sc-j-1', minute: 14, playerName: 'Santiago Bernal', playerNumber: 10, teamId: 'team-11c', type: 'gol' },
      { id: 'sc-j-2', minute: 35, playerName: 'Andrés Gil', playerNumber: 11, teamId: 'team-10a', type: 'gol' },
      { id: 'sc-j-3', minute: 62, playerName: 'Santiago Bernal', playerNumber: 10, teamId: 'team-11c', type: 'gol' },
      { id: 'sc-j-4', minute: 78, playerName: 'Andrés Gil', playerNumber: 11, teamId: 'team-10a', type: 'gol' },
      { id: 'sc-j-5', minute: 86, playerName: 'Santiago Bernal', playerNumber: 10, teamId: 'team-11c', type: 'gol' }
    ],
    observations: 'Partido emocionante definido en los últimos minutos. Acta firmada por capitanes y árbitros.',
    notifyOnStart: true,
    notifyOnEnd: true
  }
];

export const INITIAL_EVENTS: InstitutionalEvent[] = [
  {
    id: 'evt-1',
    title: 'Inauguración de los Juegos Interclases Perez y Aldana 2026',
    description: 'Desfile de bandas de marcha, juramento de deportistas por grados y encendido de la antorcha olímpica en Purificación - Tolima.',
    date: '2026-10-18',
    startTime: '08:00',
    endTime: '12:00',
    venue: 'Coliseo Cubierto Perez y Aldana - Cancha Múltiple',
    category: 'inauguracion',
    organizer: 'Rectoría y Dpto. de Educación Física y Deportes',
    expectedAttendees: 1200,
    status: 'en_curso'
  },
  {
    id: 'evt-2',
    title: 'Jornada de Atletismo y Pista Intercolegiada de Purificación',
    description: 'Competencias de 100m, 200m, 400m planos y salto largo con participación de todas las sedes institucionales.',
    date: '2026-10-21',
    startTime: '07:30',
    endTime: '13:00',
    venue: 'Pista de Atletismo Municipal de Purificación',
    category: 'torneo',
    organizer: 'Entrenador JORGE DUARTE y Comité de Deportes',
    expectedAttendees: 400,
    status: 'proximo'
  },
  {
    id: 'evt-3',
    title: 'Clínica de Fútsal y Reglamento Arbitral FIFA',
    description: 'Capacitación teórico-práctica para capitanes de cursos y árbitros estudiantiles de la institución.',
    date: '2026-10-22',
    startTime: '09:00',
    endTime: '12:30',
    venue: 'Cancha de Microfútbol Sintética Perez y Aldana',
    category: 'capacitacion' as any,
    organizer: 'Entrenador DIEGO GÓMEZ',
    expectedAttendees: 60,
    status: 'proximo'
  },
  {
    id: 'evt-4',
    title: 'Gran Gala de Premiación y Reconocimiento a Campeones Deportivos',
    description: 'Entrega de medallas, trofeos por disciplinas y reconocimientos al mérito deportivo institucional en Purificación.',
    date: '2026-10-30',
    startTime: '17:00',
    endTime: '20:30',
    venue: 'Coliseo Cubierto Perez y Aldana - Cancha Múltiple',
    category: 'premiacion',
    organizer: 'Esteban Argüello (Administrador) y Directivas',
    expectedAttendees: 800,
    status: 'proximo'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '⚽ ¡GOL EN VIVO! Grado 11-A 2 - 1 Grado 10-B',
    message: 'Anotación de Felipe Mendoza al minuto 58. El partido está EN VIVO en la Cancha Principal.',
    timestamp: '2026-10-18 15:28',
    type: 'score_update',
    read: false,
    relatedId: 'match-live-1'
  },
  {
    id: 'notif-2',
    title: '🏀 Baloncesto en Vivo: Grado 9-A vs Grado 9-B',
    message: 'Finalizando 3er Cuarto con marcador 46 - 42 a favor de 9-A en el Coliseo Perez y Aldana.',
    timestamp: '2026-10-18 15:26',
    type: 'score_update',
    read: false,
    relatedId: 'match-live-2'
  },
  {
    id: 'notif-3',
    title: '🏆 Inauguración Oficial Juegos Interclases 2026',
    message: 'Bienvenidos a la fiesta deportiva de la INSTITUCIÓN EDUCATIVA TÉCNICA PEREZ Y ALDANA en Purificación - Tolima.',
    timestamp: '2026-10-18 08:00',
    type: 'event_alert',
    read: true,
    relatedId: 'evt-1'
  }
];
