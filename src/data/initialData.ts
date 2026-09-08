import { Coach, Match, InstitutionalEvent, AppNotification, User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Juan Carlos (Administrador)',
    email: 'juancar45620@gmail.com',
    role: 'admin',
    phone: '+57 300 123 4567',
    institutionId: 'DIR-ADM-01',
    createdAt: '2026-01-01',
    password: '1234'
  },
  {
    id: 'usr-1',
    name: 'Lic. Roberto Morales',
    email: 'director@deportes.edu',
    role: 'entrenador',
    phone: '+57 310 987 6543',
    institutionId: 'DIR-2026-01',
    createdAt: '2026-01-10',
    password: 'coach'
  },
  {
    id: 'usr-2',
    name: 'Prof. Carlos Mendoza',
    email: 'carlos.mendoza@deportes.edu',
    role: 'entrenador',
    phone: '+57 315 444 8899',
    institutionId: 'ENT-2026-04',
    createdAt: '2026-02-01',
    password: 'coach'
  },
  {
    id: 'usr-3',
    name: 'Árbitro Mateo Vargas',
    email: 'mateo.arbitro@deportes.edu',
    role: 'arbitro',
    phone: '+57 320 112 3344',
    institutionId: 'ARB-2026-12',
    createdAt: '2026-02-15',
    password: 'arbitro'
  },
  {
    id: 'usr-4',
    name: 'Sofía Restrepo',
    email: 'sofia.atleta@deportes.edu',
    role: 'estudiante',
    phone: '+57 301 223 9988',
    institutionId: 'EST-2026-88',
    createdAt: '2026-03-01',
    password: 'atleta'
  }
];

export const INITIAL_COACHES: Coach[] = [
  {
    id: 'coach-1',
    name: 'Prof. Carlos Mendoza',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    sport: 'Fútbol 11 & Fútsal',
    status: 'en_clase',
    phone: '+57 315 444 8899',
    email: 'carlos.mendoza@deportes.edu',
    schedule: 'Lun - Vie: 07:00 - 12:00 / 14:00 - 18:00',
    currentActivity: 'Entrenamiento Selección Masculina Juvenil (Cancha 1)',
    experienceYears: 12,
  },
  {
    id: 'coach-2',
    name: 'Lic. Mariana Gómez',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    sport: 'Baloncesto',
    status: 'disponible',
    phone: '+57 311 234 5678',
    email: 'mariana.gomez@deportes.edu',
    schedule: 'Mar - Sáb: 08:00 - 13:00 / 15:00 - 19:00',
    currentActivity: 'Atención a estudiantes en cubículo de entrenadores',
    experienceYears: 8,
  },
  {
    id: 'coach-3',
    name: 'Prof. Andrés Rivas',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    sport: 'Voleibol',
    status: 'incapacitado',
    phone: '+57 318 765 4321',
    email: 'andres.rivas@deportes.edu',
    schedule: 'Lun - Jue: 09:00 - 13:00 / 14:00 - 17:00',
    currentActivity: 'Licencia médica por esguince de tobillo (Hasta 28 de Agosto)',
    statusNotes: 'Incapacidad médica certificada por Dpto. de Salud',
    experienceYears: 15,
  },
  {
    id: 'coach-4',
    name: 'Dra. Valentina Ortiz',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    sport: 'Atletismo & Acondicionamiento',
    status: 'disponible',
    phone: '+57 300 912 3456',
    email: 'valentina.ortiz@deportes.edu',
    schedule: 'Lun - Sáb: 06:00 - 11:00',
    currentActivity: 'Evaluaciones biomecánicas en pista atlética',
    experienceYears: 10,
  },
  {
    id: 'coach-5',
    name: 'Prof. Jorge Eliécer Torres',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    sport: 'Natación y Polo Acuático',
    status: 'en_clase',
    phone: '+57 312 888 1234',
    email: 'jorge.torres@deportes.edu',
    schedule: 'Mar - Dom: 06:00 - 13:00',
    currentActivity: 'Clase de natación estilo libre Grupo C (Piscina Olímpica)',
    experienceYears: 14,
  },
  {
    id: 'coach-6',
    name: 'Prof. Laura Benítez',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    sport: 'Tenis de Campo & Mesa',
    status: 'disponible',
    phone: '+57 319 333 7711',
    email: 'laura.benitez@deportes.edu',
    schedule: 'Mié - Dom: 14:00 - 20:00',
    currentActivity: 'Revisión técnica de canchas de tenis',
    experienceYears: 7,
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match-1',
    sport: 'Fútbol 11',
    category: 'Torneo Interfacultades - Semifinal',
    tournament: 'Copa Institucional Los Andes 2026',
    teamHome: {
      id: 'team-ing',
      name: 'Facultad de Ingeniería',
      shortName: 'ING',
      category: 'Universitario',
      logoColor: '#1e3a8a',
      textColor: '#ffffff',
      players: [
        { id: 'p-1', name: 'Diego Salazar', number: 1, position: 'Portero' },
        { id: 'p-2', name: 'Mateo Osorio', number: 4, position: 'Defensa' },
        { id: 'p-3', name: 'Felipe Herrera', number: 6, position: 'Defensa' },
        { id: 'p-4', name: 'Camilo Peña', number: 8, position: 'Mediocampista' },
        { id: 'p-5', name: 'Santiago Bernal', number: 10, position: 'Delantero', isCaptain: true },
        { id: 'p-6', name: 'Julián Castro', number: 9, position: 'Delantero' },
        { id: 'p-7', name: 'Juan Manuel Ruiz', number: 7, position: 'Extremo' }
      ]
    },
    teamAway: {
      id: 'team-med',
      name: 'Facultad de Medicina',
      shortName: 'MED',
      category: 'Universitario',
      logoColor: '#0f766e',
      textColor: '#ffffff',
      players: [
        { id: 'p-8', name: 'Alejandro Prado', number: 1, position: 'Portero' },
        { id: 'p-9', name: 'Esteban Vega', number: 3, position: 'Defensa' },
        { id: 'p-10', name: 'Lucas Valencia', number: 5, position: 'Mediocampista' },
        { id: 'p-11', name: 'Andrés Gil', number: 11, position: 'Delantero', isCaptain: true },
        { id: 'p-12', name: 'Daniel Lozano', number: 14, position: 'Mediocampista' },
        { id: 'p-13', name: 'Nicolás Pardo', number: 21, position: 'Defensa' }
      ]
    },
    date: '2026-08-20',
    time: '14:00',
    venue: 'Cancha de Fútbol Principal N° 1',
    status: 'jugado',
    scoreHome: 3,
    scoreAway: 1,
    startTime: '02:05 PM',
    endTime: '03:55 PM',
    referees: [
      { role: 'Árbitro Principal', name: 'Mateo Vargas', licenseNumber: 'FED-8841' },
      { role: 'Árbitro Asistente 1', name: 'Raúl Montenegro', licenseNumber: 'FED-3109' },
      { role: 'Árbitro Asistente 2', name: 'Sebastián Mora', licenseNumber: 'FED-4491' },
      { role: 'Cuarto Árbitro / Mesa', name: 'Diana Quintana', licenseNumber: 'ARB-1092' }
    ],
    infractions: [
      {
        id: 'inf-1',
        type: 'amarilla',
        minute: 24,
        playerName: 'Esteban Vega',
        playerNumber: 3,
        teamId: 'team-med',
        reason: 'Entrada a destiempo por detrás cortando avance prometedor'
      },
      {
        id: 'inf-2',
        type: 'amarilla',
        minute: 58,
        playerName: 'Camilo Peña',
        playerNumber: 8,
        teamId: 'team-ing',
        reason: 'Reiteración de faltas tácticas en zona media'
      },
      {
        id: 'inf-3',
        type: 'roja',
        minute: 82,
        playerName: 'Nicolás Pardo',
        playerNumber: 21,
        teamId: 'team-med',
        reason: 'Conducta violenta y reclamo desmedido al cuerpo arbitral'
      }
    ],
    scoreEvents: [
      { id: 'sc-1', minute: 14, playerName: 'Santiago Bernal', playerNumber: 10, teamId: 'team-ing', type: 'gol' },
      { id: 'sc-2', minute: 39, playerName: 'Andrés Gil', playerNumber: 11, teamId: 'team-med', type: 'penal' },
      { id: 'sc-3', minute: 67, playerName: 'Julián Castro', playerNumber: 9, teamId: 'team-ing', type: 'gol' },
      { id: 'sc-4', minute: 88, playerName: 'Santiago Bernal', playerNumber: 10, teamId: 'team-ing', type: 'gol' }
    ],
    observations: 'Partido intenso y con alta afluencia estudiantil. Se adicionaron 4 minutos en el 1T y 6 minutos en el 2T debido a la expulsión.',
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-2',
    sport: 'Baloncesto',
    category: 'Liga Intercolegiada Superior',
    tournament: 'Torneo Relámpago Baloncesto 2026',
    teamHome: {
      id: 'team-aguilas',
      name: 'Águilas del Norte',
      shortName: 'AGU',
      category: 'Juvenil',
      logoColor: '#b91c1c',
      textColor: '#ffffff',
      players: [
        { id: 'pb-1', name: 'Gabriel Rojas', number: 7, position: 'Base', isCaptain: true },
        { id: 'pb-2', name: 'Martín Cuéllar', number: 12, position: 'Escolta' },
        { id: 'pb-3', name: 'Samuel Díaz', number: 23, position: 'Alero' },
        { id: 'pb-4', name: 'David Henao', number: 34, position: 'Ala-Pívot' },
        { id: 'pb-5', name: 'Tomás Arango', number: 50, position: 'Pívot' }
      ]
    },
    teamAway: {
      id: 'team-halcones',
      name: 'Halcones del Sur',
      shortName: 'HAL',
      category: 'Juvenil',
      logoColor: '#0284c7',
      textColor: '#ffffff',
      players: [
        { id: 'pb-6', name: 'Kevin Morales', number: 3, position: 'Base' },
        { id: 'pb-7', name: 'Brayan Serna', number: 9, position: 'Escolta', isCaptain: true },
        { id: 'pb-8', name: 'Leonardo Prada', number: 15, position: 'Alero' },
        { id: 'pb-9', name: 'Emilio Varela', number: 22, position: 'Ala-Pívot' },
        { id: 'pb-10', name: 'Christian Ortiz', number: 44, position: 'Pívot' }
      ]
    },
    date: '2026-08-21',
    time: '11:00',
    venue: 'Coliseo Deportivo Cubierto - Cancha A',
    status: 'jugado',
    scoreHome: 78,
    scoreAway: 72,
    startTime: '11:00 AM',
    endTime: '12:40 PM',
    referees: [
      { role: 'Árbitro Principal', name: 'Héctor Fabio Franco', licenseNumber: 'FIBA-209' },
      { role: 'Árbitro Secundario', name: 'Clara Domínguez', licenseNumber: 'FIBA-511' },
      { role: 'Oficial de Mesa / Cronómetro', name: 'Ricardo Albarracín', licenseNumber: 'MES-08' }
    ],
    infractions: [
      {
        id: 'inf-b1',
        type: 'amarilla',
        minute: 18,
        playerName: 'Christian Ortiz',
        playerNumber: 44,
        teamId: 'team-halcones',
        reason: 'Falta antideportiva sobre atacante en transición rápida'
      },
      {
        id: 'inf-b2',
        type: 'falta_grave',
        minute: 34,
        playerName: 'David Henao',
        playerNumber: 34,
        teamId: 'team-aguilas',
        reason: 'Falta técnica por reclamos verbales a la mesa de control'
      }
    ],
    scoreEvents: [
      { id: 'scb-1', minute: 10, playerName: 'Samuel Díaz', playerNumber: 23, teamId: 'team-aguilas', type: 'triple' },
      { id: 'scb-2', minute: 25, playerName: 'Gabriel Rojas', playerNumber: 7, teamId: 'team-aguilas', type: 'punto' },
      { id: 'scb-3', minute: 38, playerName: 'Brayan Serna', playerNumber: 9, teamId: 'team-halcones', type: 'triple' }
    ],
    observations: 'Partido decidido en los últimos 45 segundos por efectividad en tiros libres de Águilas.',
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-3',
    sport: 'Voleibol Femenino',
    category: 'Liga Departamental Universitaria',
    tournament: 'Circuito Nacional Universitario',
    teamHome: {
      id: 'team-vulcanas',
      name: 'Selección Halcones Voleibol',
      shortName: 'SHV',
      category: 'Femenino Libre',
      logoColor: '#d97706',
      textColor: '#ffffff',
      players: [
        { id: 'pv-1', name: 'Valeria Cárdenas', number: 1, position: 'Líbero' },
        { id: 'pv-2', name: 'Manuela Bustamante', number: 5, position: 'Colocadora', isCaptain: true },
        { id: 'pv-3', name: 'Laura Restrepo', number: 8, position: 'Central' },
        { id: 'pv-4', name: 'Camila Echeverry', number: 10, position: 'Opuesta' },
        { id: 'pv-5', name: 'Daniela Salazar', number: 12, position: 'Receptora' }
      ]
    },
    teamAway: {
      id: 'team-olimpicas',
      name: 'Club Deportivo Olímpico',
      shortName: 'CDO',
      category: 'Femenino Libre',
      logoColor: '#4338ca',
      textColor: '#ffffff',
      players: [
        { id: 'pv-6', name: 'Mariana Duarte', number: 2, position: 'Líbero' },
        { id: 'pv-7', name: 'Isabela Marín', number: 4, position: 'Colocadora' },
        { id: 'pv-8', name: 'Natalia Quintero', number: 7, position: 'Central', isCaptain: true },
        { id: 'pv-9', name: 'Paula Jiménez', number: 11, position: 'Opuesta' },
        { id: 'pv-10', name: 'Catalina Gómez', number: 16, position: 'Receptora' }
      ]
    },
    date: '2026-08-22',
    time: '09:00',
    venue: 'Coliseo Deportivo Cubierto - Cancha B',
    status: 'pendiente',
    referees: [
      { role: 'Primer Árbitro', name: 'Carlos Mario López', licenseNumber: 'VOL-991' },
      { role: 'Segundo Árbitro', name: 'Andrea Monroy', licenseNumber: 'VOL-772' },
      { role: 'Anotador de Mesa', name: 'Viviana Pardo', licenseNumber: 'VOL-M1' }
    ],
    infractions: [],
    scoreEvents: [],
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-4',
    sport: 'Fútbol 11',
    category: 'Gran Final Copa Institucional',
    tournament: 'Copa Institucional Los Andes 2026',
    teamHome: {
      id: 'team-ing',
      name: 'Facultad de Ingeniería',
      shortName: 'ING',
      category: 'Universitario',
      logoColor: '#1e3a8a',
      textColor: '#ffffff',
      players: [
        { id: 'p-1', name: 'Diego Salazar', number: 1, position: 'Portero' },
        { id: 'p-2', name: 'Mateo Osorio', number: 4, position: 'Defensa' },
        { id: 'p-4', name: 'Camilo Peña', number: 8, position: 'Mediocampista' },
        { id: 'p-5', name: 'Santiago Bernal', number: 10, position: 'Delantero', isCaptain: true },
        { id: 'p-6', name: 'Julián Castro', number: 9, position: 'Delantero' }
      ]
    },
    teamAway: {
      id: 'team-der',
      name: 'Facultad de Derecho y Ciencias',
      shortName: 'DER',
      category: 'Universitario',
      logoColor: '#7c2d12',
      textColor: '#ffffff',
      players: [
        { id: 'pd-1', name: 'Guillermo Arboleda', number: 1, position: 'Portero' },
        { id: 'pd-2', name: 'Fabián Cardona', number: 2, position: 'Defensa' },
        { id: 'pd-3', name: 'Rodrigo Santamaría', number: 5, position: 'Defensa', isCaptain: true },
        { id: 'pd-4', name: 'Mauricio Blandón', number: 8, position: 'Mediocampista' },
        { id: 'pd-5', name: 'Ignacio Vivas', number: 11, position: 'Delantero' }
      ]
    },
    date: '2026-08-23',
    time: '16:00',
    venue: 'Estadio Olímpico Institucional',
    status: 'pendiente',
    referees: [
      { role: 'Árbitro Principal', name: 'Mateo Vargas', licenseNumber: 'FED-8841' },
      { role: 'Árbitro Asistente 1', name: 'Javier Soler', licenseNumber: 'FED-2201' },
      { role: 'Árbitro Asistente 2', name: 'Oscar Villalba', licenseNumber: 'FED-1194' },
      { role: 'Cuarto Árbitro', name: 'Diana Quintana', licenseNumber: 'ARB-1092' }
    ],
    infractions: [],
    scoreEvents: [],
    notifyOnStart: true,
    notifyOnEnd: true
  },
  {
    id: 'match-5',
    sport: 'Fútsal Masculino',
    category: 'Cuartos de Final',
    tournament: 'Torneo Intercolegiado Nocturno',
    teamHome: {
      id: 'team-c1',
      name: 'Colegio Mayor San José',
      shortName: 'CMSJ',
      category: 'Juvenil',
      logoColor: '#15803d',
      textColor: '#ffffff',
      players: [
        { id: 'pf-1', name: 'Pablo Restrepo', number: 1, position: 'Portero' },
        { id: 'pf-2', name: 'Samuel Agudelo', number: 7, position: 'Cierre', isCaptain: true },
        { id: 'pf-3', name: 'Esteban Cuervo', number: 9, position: 'Ala' },
        { id: 'pf-4', name: 'Alejo Barrientos', number: 10, position: 'Pívot' }
      ]
    },
    teamAway: {
      id: 'team-c2',
      name: 'Instituto Técnico Caldas',
      shortName: 'ITC',
      category: 'Juvenil',
      logoColor: '#854d0e',
      textColor: '#ffffff',
      players: [
        { id: 'pf-5', name: 'Manuel Beltrán', number: 12, position: 'Portero' },
        { id: 'pf-6', name: 'Sergio Cano', number: 5, position: 'Cierre' },
        { id: 'pf-7', name: 'Felipe Ospina', number: 8, position: 'Ala', isCaptain: true },
        { id: 'pf-8', name: 'Simón Naranjo', number: 11, position: 'Pívot' }
      ]
    },
    date: '2026-08-24',
    time: '19:30',
    venue: 'Cancha Sintética de Fútsal Techada',
    status: 'pendiente',
    referees: [
      { role: 'Árbitro 1', name: 'Nelson Galeano', licenseNumber: 'FUT-401' },
      { role: 'Árbitro 2', name: 'Albeiro Patiño', licenseNumber: 'FUT-402' },
      { role: 'Cronometrador', name: 'Mónica Serrano', licenseNumber: 'CRO-10' }
    ],
    infractions: [],
    scoreEvents: [],
    notifyOnStart: true,
    notifyOnEnd: true
  }
];

export const INITIAL_EVENTS: InstitutionalEvent[] = [
  {
    id: 'evt-1',
    title: 'Ceremonia de Inauguración de los Juegos Interfacultades 2026',
    description: 'Desfile oficial de delegaciones deportivas, juramento de atletas y encendido de la llama olímpica institucional.',
    date: '2026-08-22',
    startTime: '08:00',
    endTime: '11:30',
    venue: 'Estadio Olímpico Institucional',
    category: 'inauguracion',
    organizer: 'Dirección de Bienestar y Deportes',
    expectedAttendees: 1500,
    status: 'proximo'
  },
  {
    id: 'evt-2',
    title: 'Clínica Técnica y Arbitral: Actualización de Reglas FIFA & FIBA',
    description: 'Capacitación intensiva para jueces, árbitros y entrenadores institucionales dictada por colegiados federados.',
    date: '2026-08-23',
    startTime: '09:00',
    endTime: '13:00',
    venue: 'Auditorio Mayor Edificio Deportivo',
    category: 'capacitacion' as any,
    organizer: 'Colegio de Árbitros Institucional',
    expectedAttendees: 80,
    status: 'proximo'
  },
  {
    id: 'evt-3',
    title: 'Gran Jornada de Pruebas Físicas y Biométricas para Atletas',
    description: 'Evaluación de capacidad aeróbica, VO2 máx, composición corporal y test de velocidad para selecciones representativas.',
    date: '2026-08-25',
    startTime: '07:00',
    endTime: '15:00',
    venue: 'Laboratorio de Alto Rendimiento y Pista Atlética',
    category: 'entrenamiento',
    organizer: 'Dpto. de Medicina Deportiva',
    expectedAttendees: 220,
    status: 'proximo'
  },
  {
    id: 'evt-4',
    title: 'Torneo Relámpago de Tenis de Mesa Interdocentes',
    description: 'Competencia abierta para profesores y personal administrativo en modalidades individual y dobles.',
    date: '2026-08-26',
    startTime: '16:00',
    endTime: '20:00',
    venue: 'Salón Múltiple de Raqueta',
    category: 'torneo',
    organizer: 'Comité de Deportes del Profesorado',
    expectedAttendees: 64,
    status: 'proximo'
  },
  {
    id: 'evt-5',
    title: 'Gala de Premiación y Reconocimiento al Mérito Deportivo 2026',
    description: 'Entrega de trofeos a campeones de disciplinas de conjunto, medallas de oro al mejor deportista del año y reconocimientos honoríficos.',
    date: '2026-08-30',
    startTime: '18:00',
    endTime: '22:00',
    venue: 'Centro de Convenciones y Eventos Institucional',
    category: 'premiacion',
    organizer: 'Rectoría y Dirección de Deportes',
    expectedAttendees: 600,
    status: 'proximo'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '¡Partido Finalizado!',
    message: 'Fútbol 11: Facultad de Ingeniería 3 - 1 Facultad de Medicina. Acta arbitral registrada exitosamente.',
    timestamp: '2026-08-20 15:55',
    type: 'match_end',
    read: false,
    relatedId: 'match-1'
  },
  {
    id: 'notif-2',
    title: 'Próximo Evento Institucional',
    message: 'La Ceremonia de Inauguración se llevará a cabo mañana a las 08:00 AM en el Estadio Olímpico.',
    timestamp: '2026-08-21 18:00',
    type: 'event_alert',
    read: false,
    relatedId: 'evt-1'
  },
  {
    id: 'notif-3',
    title: 'Actualización de Entrenadores',
    message: 'Prof. Carlos Mendoza ha iniciado sesión de clase en Cancha 1.',
    timestamp: '2026-08-21 07:00',
    type: 'coach_status',
    read: true,
    relatedId: 'coach-1'
  }
];
