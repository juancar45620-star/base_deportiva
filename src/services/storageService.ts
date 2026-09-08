import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  User,
  Coach,
  Match,
  InstitutionalEvent,
  AppNotification,
  CoachStatus,
  MatchStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_COACHES,
  INITIAL_MATCHES,
  INITIAL_EVENTS,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import { audioNotification } from './audioNotification';

const KEYS = {
  USERS: 'sports_app_users',
  CURRENT_USER: 'sports_app_current_user',
  COACHES: 'sports_app_coaches',
  MATCHES: 'sports_app_matches',
  EVENTS: 'sports_app_events',
  NOTIFICATIONS: 'sports_app_notifications',
};

export class StorageService {
  private static isInitialized = false;

  // Initialize and seed Firebase if collections are empty
  public static async initFirebase(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      // Check coaches collection
      const coachesSnap = await getDocs(collection(db, 'coaches'));
      if (coachesSnap.empty) {
        console.log('Seeding initial coaches to Firestore...');
        const batch = writeBatch(db);
        INITIAL_COACHES.forEach(coach => {
          batch.set(doc(db, 'coaches', coach.id), coach);
        });
        await batch.commit();
      }

      // Check matches collection
      const matchesSnap = await getDocs(collection(db, 'matches'));
      if (matchesSnap.empty) {
        console.log('Seeding initial matches to Firestore...');
        const batch = writeBatch(db);
        INITIAL_MATCHES.forEach(match => {
          batch.set(doc(db, 'matches', match.id), match);
        });
        await batch.commit();
      }

      // Check events collection
      const eventsSnap = await getDocs(collection(db, 'events'));
      if (eventsSnap.empty) {
        console.log('Seeding initial events to Firestore...');
        const batch = writeBatch(db);
        INITIAL_EVENTS.forEach(event => {
          batch.set(doc(db, 'events', event.id), event);
        });
        await batch.commit();
      }

      // Check users collection
      const usersSnap = await getDocs(collection(db, 'users'));
      if (usersSnap.empty) {
        console.log('Seeding initial users to Firestore...');
        const batch = writeBatch(db);
        INITIAL_USERS.forEach(user => {
          batch.set(doc(db, 'users', user.id), user);
        });
        await batch.commit();
      } else {
        // Enforce juancar45620@gmail.com as the unique admin in Firestore
        let hasAdminInFirestore = false;
        usersSnap.forEach((docSnap) => {
          const u = docSnap.data() as User;
          if (u.email && u.email.toLowerCase() === 'juancar45620@gmail.com') {
            hasAdminInFirestore = true;
            if (u.role !== 'admin' || u.password !== '1234') {
              setDoc(doc(db, 'users', docSnap.id), { ...u, role: 'admin', password: '1234' }, { merge: true });
            }
          } else if (u.role === 'admin') {
            // Any other previous admin is demoted so juancar45620@gmail.com is unique admin
            setDoc(doc(db, 'users', docSnap.id), { ...u, role: 'entrenador' }, { merge: true });
          }
        });

        if (!hasAdminInFirestore) {
          const adminUser = INITIAL_USERS[0];
          await setDoc(doc(db, 'users', adminUser.id), adminUser);
        }
      }

      // Check notifications collection
      const notifsSnap = await getDocs(collection(db, 'notifications'));
      if (notifsSnap.empty) {
        console.log('Seeding initial notifications to Firestore...');
        const batch = writeBatch(db);
        INITIAL_NOTIFICATIONS.forEach(notif => {
          batch.set(doc(db, 'notifications', notif.id), notif);
        });
        await batch.commit();
      }
    } catch (err) {
      console.warn('Firestore initial check/seed error (falling back to local cache):', err);
    }
  }

  // --- Real-Time Subscriptions ---
  public static subscribeToCoaches(callback: (coaches: Coach[]) => void): () => void {
    try {
      const q = collection(db, 'coaches');
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: Coach[] = [];
          snapshot.forEach(docSnap => list.push(docSnap.data() as Coach));
          localStorage.setItem(KEYS.COACHES, JSON.stringify(list));
          callback(list);
        } else {
          callback(this.getCoaches());
        }
      }, (error) => {
        console.warn('Firestore coaches listener error:', error);
        callback(this.getCoaches());
      });
    } catch {
      callback(this.getCoaches());
      return () => {};
    }
  }

  public static subscribeToMatches(callback: (matches: Match[]) => void): () => void {
    try {
      const q = collection(db, 'matches');
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: Match[] = [];
          snapshot.forEach(docSnap => list.push(docSnap.data() as Match));
          localStorage.setItem(KEYS.MATCHES, JSON.stringify(list));
          callback(list);
        } else {
          callback(this.getMatches());
        }
      }, (error) => {
        console.warn('Firestore matches listener error:', error);
        callback(this.getMatches());
      });
    } catch {
      callback(this.getMatches());
      return () => {};
    }
  }

  public static subscribeToEvents(callback: (events: InstitutionalEvent[]) => void): () => void {
    try {
      const q = collection(db, 'events');
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: InstitutionalEvent[] = [];
          snapshot.forEach(docSnap => list.push(docSnap.data() as InstitutionalEvent));
          localStorage.setItem(KEYS.EVENTS, JSON.stringify(list));
          callback(list);
        } else {
          callback(this.getEvents());
        }
      }, (error) => {
        console.warn('Firestore events listener error:', error);
        callback(this.getEvents());
      });
    } catch {
      callback(this.getEvents());
      return () => {};
    }
  }

  public static subscribeToNotifications(callback: (notifs: AppNotification[]) => void): () => void {
    try {
      const q = collection(db, 'notifications');
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const list: AppNotification[] = [];
          snapshot.forEach(docSnap => list.push(docSnap.data() as AppNotification));
          // Sort by timestamp or id desc
          list.sort((a, b) => b.id.localeCompare(a.id));
          localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
          callback(list);
        } else {
          callback(this.getNotifications());
        }
      }, (error) => {
        console.warn('Firestore notifications listener error:', error);
        callback(this.getNotifications());
      });
    } catch {
      callback(this.getNotifications());
      return () => {};
    }
  }

  // --- USERS ---
  public static getUsers(): User[] {
    const raw = localStorage.getItem(KEYS.USERS);
    let list: User[] = [];
    if (!raw) {
      list = [...INITIAL_USERS];
    } else {
      try {
        list = JSON.parse(raw);
      } catch {
        list = [...INITIAL_USERS];
      }
    }

    // Guarantee juancar45620@gmail.com is the UNIQUE administrator with password 1234
    let hasAdmin = false;
    let modified = false;

    list = list.map((user) => {
      if (user.email && user.email.toLowerCase() === 'juancar45620@gmail.com') {
        hasAdmin = true;
        if (user.role !== 'admin' || user.password !== '1234') {
          modified = true;
          return { ...user, role: 'admin', password: '1234' };
        }
        return user;
      }
      // Any other user cannot be admin
      if (user.role === 'admin') {
        modified = true;
        return { ...user, role: 'entrenador' };
      }
      return user;
    });

    if (!hasAdmin) {
      list.unshift(INITIAL_USERS[0]);
      modified = true;
    }

    if (modified || !raw) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(list));
    }
    return list;
  }

  public static getCurrentUser(): User | null {
    // Check session storage first (active browser session)
    const sessionRaw = sessionStorage.getItem(KEYS.CURRENT_USER);
    if (sessionRaw) {
      try {
        const u = JSON.parse(sessionRaw) as User;
        // Verify admin role integrity
        if (u.role === 'admin' && u.email.toLowerCase() !== 'juancar45620@gmail.com') {
          u.role = 'entrenador';
        }
        return u;
      } catch {
        // invalid JSON
      }
    }
    // Do NOT auto-seed default user! User starts unauthenticated.
    return null;
  }

  public static setCurrentUser(user: User | null): void {
    if (user) {
      const normalizedUser = { ...user };
      if (normalizedUser.role === 'admin' && normalizedUser.email.toLowerCase() !== 'juancar45620@gmail.com') {
        normalizedUser.role = 'entrenador';
      }
      sessionStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(normalizedUser));
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(normalizedUser));
    } else {
      sessionStorage.removeItem(KEYS.CURRENT_USER);
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  }

  public static login(emailOrName: string, password?: string): { success: boolean; user?: User; error?: string } {
    const trimmed = emailOrName.trim().toLowerCase();
    if (!trimmed) {
      return { success: false, error: 'Por favor ingresa tu usuario o correo institucional.' };
    }

    const users = this.getUsers();
    const found = users.find(
      u => u.email.toLowerCase() === trimmed ||
           u.name.toLowerCase() === trimmed ||
           u.name.toLowerCase().includes(trimmed)
    );

    if (found) {
      // Validate password for unique administrator (juancar45620@gmail.com)
      if (found.email.toLowerCase() === 'juancar45620@gmail.com') {
        if (!password || password !== '1234') {
          return {
            success: false,
            error: 'Contraseña incorrecta para el Administrador. La contraseña requerida es 1234.'
          };
        }
      } else if (password !== undefined && password.trim() !== '') {
        if (password.length > 10) {
          return { success: false, error: 'La contraseña no puede exceder los 10 caracteres.' };
        }
        if (found.password && found.password !== password) {
          return {
            success: false,
            error: 'Contraseña incorrecta. Verifica tus datos o usa la opción "Recuperar Contraseña".'
          };
        }
      }

      this.setCurrentUser(found);
      this.addNotification({
        title: 'Inicio de Sesión Exitoso',
        message: `Bienvenido(a) al sistema institucional, ${found.name}. Rol: ${found.role.toUpperCase()}.`,
        type: 'system',
        read: false
      });
      return { success: true, user: found };
    }

    return {
      success: false,
      error: 'Usuario o correo no encontrado en el registro institucional. Puedes crear una cuenta nueva o usar un perfil demo.'
    };
  }

  public static async recoverPassword(
    emailOrName: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string; message?: string }> {
    const trimmed = emailOrName.trim().toLowerCase();
    if (!trimmed) {
      return { success: false, error: 'Ingresa tu usuario o correo institucional.' };
    }
    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: 'La nueva contraseña debe tener al menos 4 caracteres.' };
    }
    if (newPassword.length > 10) {
      return { success: false, error: 'La contraseña no puede exceder el límite de 10 caracteres.' };
    }

    const users = this.getUsers();
    const userIndex = users.findIndex(
      u => u.email.toLowerCase() === trimmed ||
           u.name.toLowerCase() === trimmed ||
           u.name.toLowerCase().includes(trimmed)
    );

    if (userIndex === -1) {
      return { success: false, error: 'No se encontró ningún usuario institucional con ese correo o nombre.' };
    }

    users[userIndex].password = newPassword;
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));

    try {
      await setDoc(doc(db, 'users', users[userIndex].id), users[userIndex]);
    } catch (e) {
      console.warn('Firestore recover password error:', e);
    }

    this.addNotification({
      title: 'Contraseña Restablecida Exitosamente',
      message: `La clave de acceso para ${users[userIndex].name} ha sido actualizada. Ya puedes iniciar sesión con tu nueva contraseña.`,
      type: 'system',
      read: false
    });

    return {
      success: true,
      message: `¡Contraseña de ${users[userIndex].name} actualizada! Ahora puedes ingresar con tu nueva clave institucional.`
    };
  }

  public static async registerUser(newUser: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = this.getUsers();
    const emailLower = newUser.email.trim().toLowerCase();

    // Unique administrator enforcement: ONLY juancar45620@gmail.com can be admin
    let role = newUser.role;
    if (role === 'admin' && emailLower !== 'juancar45620@gmail.com') {
      role = 'estudiante';
    } else if (emailLower === 'juancar45620@gmail.com') {
      role = 'admin';
    }

    const user: User = {
      ...newUser,
      role,
      password: emailLower === 'juancar45620@gmail.com' ? '1234' : newUser.password,
      id: emailLower === 'juancar45620@gmail.com' ? 'usr-admin' : `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      institutionId: emailLower === 'juancar45620@gmail.com' ? 'DIR-ADM-01' : `INST-${Math.floor(1000 + Math.random() * 9000)}`
    };

    const existingIdx = users.findIndex(u => u.email.toLowerCase() === emailLower);
    if (existingIdx >= 0) {
      users[existingIdx] = { ...users[existingIdx], ...user };
    } else {
      users.push(user);
    }

    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(user);

    try {
      await setDoc(doc(db, 'users', user.id), user);
    } catch (e) {
      console.warn('Firestore user save error:', e);
    }

    this.addNotification({
      title: '¡Cuenta Creada con Éxito!',
      message: `Bienvenido(a) a la plataforma institucional, ${user.name}. Rol asignado: ${user.role.toUpperCase()}.`,
      type: 'system',
      read: false
    });
    return user;
  }

  public static logout(): void {
    sessionStorage.removeItem(KEYS.CURRENT_USER);
    localStorage.removeItem(KEYS.CURRENT_USER);
  }

  // --- COACHES ---
  public static getCoaches(): Coach[] {
    const raw = localStorage.getItem(KEYS.COACHES);
    if (!raw) {
      localStorage.setItem(KEYS.COACHES, JSON.stringify(INITIAL_COACHES));
      return INITIAL_COACHES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_COACHES;
    }
  }

  public static async updateCoachStatus(coachId: string, status: CoachStatus, notes?: string): Promise<Coach[]> {
    const coaches = this.getCoaches().map(coach => {
      if (coach.id === coachId) {
        let currentActivity = coach.currentActivity;
        if (status === 'disponible') {
          currentActivity = 'Disponible en área técnica / atención';
        } else if (status === 'en_clase') {
          currentActivity = notes || 'Sesión práctica en desarrollo';
        } else if (status === 'incapacitado') {
          currentActivity = notes || 'Licencia médica activa';
        }
        return {
          ...coach,
          status,
          currentActivity,
          statusNotes: notes || coach.statusNotes
        };
      }
      return coach;
    });

    localStorage.setItem(KEYS.COACHES, JSON.stringify(coaches));
    const target = coaches.find(c => c.id === coachId);

    if (target) {
      try {
        await setDoc(doc(db, 'coaches', target.id), target);
      } catch (e) {
        console.warn('Firestore coach update error:', e);
      }

      this.addNotification({
        title: 'Estado de Entrenador Actualizado',
        message: `${target.name} ahora se encuentra: ${status.replace('_', ' ').toUpperCase()}.`,
        type: 'coach_status',
        read: false,
        relatedId: target.id
      });
    }
    return coaches;
  }

  public static async addCoach(coach: Omit<Coach, 'id'>): Promise<Coach> {
    const coaches = this.getCoaches();
    const newCoach: Coach = {
      ...coach,
      id: `coach-${Date.now()}`
    };
    coaches.push(newCoach);
    localStorage.setItem(KEYS.COACHES, JSON.stringify(coaches));

    try {
      await setDoc(doc(db, 'coaches', newCoach.id), newCoach);
    } catch (e) {
      console.warn('Firestore add coach error:', e);
    }

    this.addNotification({
      title: 'Nuevo Entrenador Registrado',
      message: `${newCoach.name} ha sido vinculado al cuerpo técnico de ${newCoach.sport}.`,
      type: 'coach_status',
      read: false,
      relatedId: newCoach.id
    });
    return newCoach;
  }

  public static notifyCoachesAvailability(): void {
    const coaches = this.getCoaches();
    const available = coaches.filter(c => c.status === 'disponible').map(c => `${c.name} (${c.sport})`);
    const inClass = coaches.filter(c => c.status === 'en_clase').map(c => `${c.name} (${c.sport})`);
    const disabled = coaches.filter(c => c.status === 'incapacitado').map(c => `${c.name} (${c.sport})`);

    const availableText = available.length > 0 ? available.join(', ') : 'Ninguno disponible en este turno';
    const notAvailableParts: string[] = [];
    if (inClass.length > 0) notAvailableParts.push(`En clases/entrenamiento: ${inClass.join(', ')}`);
    if (disabled.length > 0) notAvailableParts.push(`Incapacitados/licencia: ${disabled.join(', ')}`);
    const notAvailableText = notAvailableParts.length > 0 ? notAvailableParts.join(' | ') : 'Todos los entrenadores se encuentran disponibles';

    this.addNotification({
      title: 'Reporte Oficial: Disponibilidad de Entrenadores',
      message: `🟢 ESTÁN PRESENTES Y DISPONIBLES: ${availableText}.\n🔴 NO DISPONIBLES AHORA: ${notAvailableText}.`,
      type: 'coach_status',
      read: false
    });
  }

  // --- MATCHES ---
  public static getMatches(): Match[] {
    const raw = localStorage.getItem(KEYS.MATCHES);
    if (!raw) {
      localStorage.setItem(KEYS.MATCHES, JSON.stringify(INITIAL_MATCHES));
      return INITIAL_MATCHES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MATCHES;
    }
  }

  public static saveMatches(matches: Match[]): void {
    localStorage.setItem(KEYS.MATCHES, JSON.stringify(matches));
  }

  public static async addMatch(match: Omit<Match, 'id'>): Promise<Match> {
    const matches = this.getMatches();
    const newMatch: Match = {
      ...match,
      id: `match-${Date.now()}`
    };
    matches.push(newMatch);
    this.saveMatches(matches);

    try {
      await setDoc(doc(db, 'matches', newMatch.id), newMatch);
    } catch (e) {
      console.warn('Firestore add match error:', e);
    }

    this.addNotification({
      title: 'Partido Programado',
      message: `${newMatch.teamHome.name} vs ${newMatch.teamAway.name} programado para el ${newMatch.date} a las ${newMatch.time}. Sede: ${newMatch.venue}.`,
      type: 'system',
      read: false,
      relatedId: newMatch.id
    });
    return newMatch;
  }

  public static async startMatch(matchId: string): Promise<Match | null> {
    const matches = this.getMatches();
    let updatedMatch: Match | null = null;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const newMatches = matches.map(m => {
      if (m.id === matchId) {
        updatedMatch = {
          ...m,
          status: 'en_vivo' as MatchStatus,
          startTime: nowStr,
          scoreHome: m.scoreHome ?? 0,
          scoreAway: m.scoreAway ?? 0
        };
        return updatedMatch;
      }
      return m;
    });

    if (updatedMatch) {
      this.saveMatches(newMatches);
      audioNotification.playWhistle(false);

      try {
        await setDoc(doc(db, 'matches', matchId), updatedMatch);
      } catch (e) {
        console.warn('Firestore start match error:', e);
      }

      this.addNotification({
        title: '¡PARTIDO INICIADO!',
        message: `Ha comenzado el encuentro: ${(updatedMatch as Match).teamHome.name} vs ${(updatedMatch as Match).teamAway.name} en ${(updatedMatch as Match).venue}. Hora de inicio: ${nowStr}.`,
        type: 'match_start',
        read: false,
        relatedId: matchId
      });
    }
    return updatedMatch;
  }

  public static async updateLiveScore(
    matchId: string,
    deltaHome: number,
    deltaAway: number,
    eventDetail?: string
  ): Promise<Match | null> {
    const matches = this.getMatches();
    let updatedMatch: Match | null = null;

    const newMatches = matches.map(m => {
      if (m.id === matchId) {
        const curHome = m.scoreHome ?? 0;
        const curAway = m.scoreAway ?? 0;
        const newHome = Math.max(0, curHome + deltaHome);
        const newAway = Math.max(0, curAway + deltaAway);
        updatedMatch = {
          ...m,
          scoreHome: newHome,
          scoreAway: newAway
        };
        return updatedMatch;
      }
      return m;
    });

    if (updatedMatch) {
      this.saveMatches(newMatches);
      audioNotification.playGoal();

      try {
        await setDoc(doc(db, 'matches', matchId), updatedMatch);
      } catch (e) {
        console.warn('Firestore live score update error:', e);
      }

      this.addNotification({
        title: `¡Anotación en Vivo! • ${(updatedMatch as Match).sport}`,
        message: `Marcador en directo: ${(updatedMatch as Match).teamHome.name} ${(updatedMatch as Match).scoreHome} - ${(updatedMatch as Match).scoreAway} ${(updatedMatch as Match).teamAway.name}${eventDetail ? ` [${eventDetail}]` : ''}`,
        type: 'score_update',
        read: false,
        relatedId: matchId
      });
    }
    return updatedMatch;
  }

  public static async finishMatch(
    matchId: string,
    scoreHome: number,
    scoreAway: number,
    observations?: string
  ): Promise<Match | null> {
    const matches = this.getMatches();
    let updatedMatch: Match | null = null;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const newMatches = matches.map(m => {
      if (m.id === matchId) {
        updatedMatch = {
          ...m,
          status: 'jugado' as MatchStatus,
          endTime: nowStr,
          scoreHome,
          scoreAway,
          observations: observations || m.observations || 'Partido finalizado reglamentariamente.'
        };
        return updatedMatch;
      }
      return m;
    });

    if (updatedMatch) {
      this.saveMatches(newMatches);
      audioNotification.playWhistle(true);

      try {
        await setDoc(doc(db, 'matches', matchId), updatedMatch);
      } catch (e) {
        console.warn('Firestore finish match error:', e);
      }

      this.addNotification({
        title: '¡PARTIDO FINALIZADO!',
        message: `Resultado final: ${(updatedMatch as Match).teamHome.name} ${scoreHome} - ${scoreAway} ${(updatedMatch as Match).teamAway.name}. Hora de término: ${nowStr}. Acta arbitral consolidada en Resultados.`,
        type: 'match_end',
        read: false,
        relatedId: matchId
      });
    }
    return updatedMatch;
  }

  public static async updateMatch(updated: Match): Promise<void> {
    const matches = this.getMatches().map(m => m.id === updated.id ? updated : m);
    this.saveMatches(matches);
    try {
      await setDoc(doc(db, 'matches', updated.id), updated);
    } catch (e) {
      console.warn('Firestore update match error:', e);
    }
  }

  // --- EVENTS ---
  public static getEvents(): InstitutionalEvent[] {
    const raw = localStorage.getItem(KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_EVENTS;
    }
  }

  public static async addEvent(event: Omit<InstitutionalEvent, 'id'>): Promise<InstitutionalEvent> {
    const events = this.getEvents();
    const newEvent: InstitutionalEvent = {
      ...event,
      id: `evt-${Date.now()}`
    };
    events.push(newEvent);
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));

    try {
      await setDoc(doc(db, 'events', newEvent.id), newEvent);
    } catch (e) {
      console.warn('Firestore add event error:', e);
    }

    this.addNotification({
      title: 'Nuevo Evento Institucional Agendado',
      message: `${newEvent.title} - ${newEvent.date} a las ${newEvent.startTime}. Lugar: ${newEvent.venue}.`,
      type: 'event_alert',
      read: false,
      relatedId: newEvent.id
    });
    return newEvent;
  }

  public static triggerEventAlert(event: InstitutionalEvent): void {
    audioNotification.playChime();
    this.addNotification({
      title: `Aviso de Evento Institucional: ${event.title}`,
      message: `Programado para el ${event.date} (${event.startTime} a ${event.endTime}) en ${event.venue}. Organiza: ${event.organizer}.`,
      type: 'event_alert',
      read: false,
      relatedId: event.id
    });
  }

  // --- NOTIFICATIONS ---
  public static getNotifications(): AppNotification[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  public static async addNotification(notif: Omit<AppNotification, 'id' | 'timestamp'>): Promise<AppNotification> {
    const list = this.getNotifications();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: `${dateStr} ${timeStr}`
    };

    list.unshift(newNotif);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));

    try {
      await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
    } catch (e) {
      console.warn('Firestore add notification error:', e);
    }

    // Dispatch a custom DOM event so UI components react in real-time
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sports_notification', { detail: newNotif }));
    }

    return newNotif;
  }

  public static async markAllNotificationsRead(): Promise<void> {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sports_notification_update'));
    }

    try {
      const snap = await getDocs(collection(db, 'notifications'));
      const batch = writeBatch(db);
      snap.forEach(docSnap => {
        batch.update(docSnap.ref, { read: true });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore mark read error:', e);
    }
  }

  public static async clearNotifications(): Promise<void> {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sports_notification_update'));
    }

    try {
      const snap = await getDocs(collection(db, 'notifications'));
      const batch = writeBatch(db);
      snap.forEach(docSnap => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore clear notifications error:', e);
    }
  }
}
