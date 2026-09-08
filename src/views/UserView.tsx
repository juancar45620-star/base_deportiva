import React, { useState } from 'react';
import {
  User as UserIcon,
  Lock,
  Mail,
  UserPlus,
  LogIn,
  Shield,
  CheckCircle,
  LogOut,
  Phone,
  Sparkles,
  KeyRound,
  IdCard,
  Building2,
  AlertCircle
} from 'lucide-react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storageService';
import { INITIAL_USERS } from '../data/initialData';

interface UserViewProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  initialMode?: 'login' | 'register';
}

export const UserView: React.FC<UserViewProps> = ({
  currentUser,
  setCurrentUser,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('estudiante');
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Por favor complete su usuario/correo y contraseña.');
      return;
    }

    const users = StorageService.getUsers();
    // Search by email or name matching
    const found = users.find(
      u => u.email.toLowerCase() === loginEmail.trim().toLowerCase() ||
           u.name.toLowerCase().includes(loginEmail.trim().toLowerCase())
    );

    if (found) {
      StorageService.setCurrentUser(found);
      setCurrentUser(found);
      setLoginError('');
    } else {
      // Create guest session with provided credentials if user not found, or show friendly alert
      const newUser = StorageService.registerUser({
        name: loginEmail.split('@')[0] || loginEmail,
        email: loginEmail.includes('@') ? loginEmail : `${loginEmail}@deportes.edu`,
        role: 'estudiante',
        phone: '+57 300 000 0000'
      });
      setCurrentUser(newUser);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Por favor complete todos los campos obligatorios (*).');
      return;
    }

    if (regPassword.length < 4) {
      setRegError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    const newUser = StorageService.registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      phone: regPhone.trim() || undefined
    });

    setCurrentUser(newUser);
    setRegSuccess('¡Cuenta creada y sesión iniciada exitosamente!');
  };

  const handleQuickLogin = (demoUser: User) => {
    StorageService.setCurrentUser(demoUser);
    setCurrentUser(demoUser);
  };

  const handleLogout = () => {
    StorageService.logout();
    sessionStorage.removeItem('sports_app_session_user');
    setCurrentUser(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-[#0B192C] border border-blue-900/60 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-black/40 rounded-[14px] flex items-center justify-center">
              <UserIcon className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Módulo de Usuarios y Cuentas</h2>
            <p className="text-xs text-blue-200">
              Acceso a roles de administradores, entrenadores, árbitros y atletas institucionales
            </p>
          </div>
        </div>

        {currentUser && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 hover:text-white border border-rose-800/60 font-semibold text-xs flex items-center gap-2 transition-colors shadow"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        )}
      </div>

      {/* If logged in, show Profile Card + Switch account */}
      {currentUser ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Profile Info */}
          <div className="md:col-span-2 bg-[#0B192C] border border-blue-800/60 rounded-2xl p-6 text-white shadow-xl space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 border-2 border-sky-400 flex items-center justify-center font-extrabold text-2xl text-white shadow-lg">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
                    <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider">
                      Sesión Activa
                    </span>
                  </div>
                  <p className="text-xs text-blue-300 mt-0.5">{currentUser.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-blue-900/60 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-blue-950">
                <span className="text-slate-400 font-medium">Rol Institucional:</span>
                <p className="text-sm font-bold text-sky-300 uppercase mt-1 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-sky-400" />
                  {currentUser.role}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-blue-950">
                <span className="text-slate-400 font-medium">ID Institucional:</span>
                <p className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                  <IdCard className="w-4 h-4 text-blue-400" />
                  {currentUser.institutionId || 'INST-2026-REG'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-blue-950">
                <span className="text-slate-400 font-medium">Teléfono de Contacto:</span>
                <p className="text-sm font-semibold text-slate-200 mt-1 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {currentUser.phone || 'No registrado'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-blue-950">
                <span className="text-slate-400 font-medium">Fecha de Registro:</span>
                <p className="text-sm font-semibold text-slate-200 mt-1">
                  {currentUser.createdAt || '2026-08-21'}
                </p>
              </div>
            </div>

            {/* Action buttons inside user profile */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-blue-900/60">
              <button
                onClick={() => setMode('register')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow"
              >
                <UserPlus className="w-4 h-4" />
                Registrar Otra Cuenta
              </button>
              <button
                onClick={() => setMode('login')}
                className="px-4 py-2.5 rounded-xl bg-black/50 hover:bg-black/80 text-blue-200 hover:text-white border border-blue-800 font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Cambiar de Usuario
              </button>
            </div>
          </div>

          {/* Quick Switch Demo Accounts */}
          <div className="bg-[#0B192C] border border-blue-900/60 rounded-2xl p-5 text-white shadow-xl space-y-3">
            <h4 className="font-bold text-sm text-sky-300 flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Perfiles Institucionales
            </h4>
            <p className="text-xs text-slate-300">
              Cambia instantáneamente entre roles para probar permisos del sistema:
            </p>

            <div className="space-y-2 pt-2">
              {INITIAL_USERS.map((usr) => {
                const isSelected = currentUser.id === usr.id;
                return (
                  <button
                    key={usr.id}
                    onClick={() => handleQuickLogin(usr)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600/30 border-sky-400 text-white shadow'
                        : 'bg-black/40 border-blue-950 hover:border-blue-700 text-slate-200 hover:text-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-bold truncate">{usr.name}</p>
                      <p className="text-[11px] text-blue-300 capitalize">{usr.role}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Auth Form (Login or Register) */}
      <div className="bg-[#0B192C] border border-blue-900/60 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
        {/* Toggle Mode Buttons (Iniciar Sesión vs Crear Cuenta) */}
        <div className="flex rounded-xl bg-black/50 p-1.5 border border-blue-900/60 mb-6 max-w-md mx-auto">
          <button
            id="tab-btn-login"
            onClick={() => {
              setMode('login');
              setLoginError('');
              setRegError('');
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Iniciar Sesión
          </button>

          <button
            id="tab-btn-register"
            onClick={() => {
              setMode('register');
              setLoginError('');
              setRegError('');
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Crear Cuenta
          </button>
        </div>

        {/* --- LOGIN FORM --- */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white">Ingreso al Sistema Deportivo</h3>
              <p className="text-xs text-slate-300 mt-1">
                Ingresa con tu usuario o correo institucional y tu contraseña
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Usuario o Correo Electrónico <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="input-login-username"
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ej: director@deportes.edu o Roberto Morales"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-blue-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Contraseña <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-login-password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-blue-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                />
              </div>
            </div>

            <button
              id="btn-submit-login"
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </button>

            {/* Quick Demo Access Bar */}
            <div className="pt-4 border-t border-blue-900/60">
              <p className="text-[11px] text-center text-slate-400 mb-2">
                O ingresa rápidamente con una cuenta de prueba:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin(INITIAL_USERS[0])}
                  className="py-1.5 px-2 bg-blue-950/70 hover:bg-blue-900 border border-blue-800 rounded-lg text-[11px] font-semibold text-sky-300"
                >
                  👑 Director Deportivo
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin(INITIAL_USERS[1])}
                  className="py-1.5 px-2 bg-blue-950/70 hover:bg-blue-900 border border-blue-800 rounded-lg text-[11px] font-semibold text-blue-300"
                >
                  ⚽ Prof. Entrenador
                </button>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-xs text-sky-400 hover:text-white font-medium underline underline-offset-4"
              >
                ¿No tienes cuenta creada aún? Haz clic aquí para Crear Cuenta
              </button>
            </div>
          </form>
        )}

        {/* --- REGISTER FORM (Crear Cuenta) --- */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="max-w-lg mx-auto space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white">Registro de Nueva Cuenta</h3>
              <p className="text-xs text-slate-300 mt-1">
                Crea tu cuenta institucional para participar y gestionar los eventos
              </p>
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{regSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Nombre Completo <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="input-reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="ej: Juan Carlos Pérez"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-blue-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Correo Electrónico / Usuario <span className="text-sky-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="input-reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="usuario@deportes.edu"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-blue-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Contraseña <span className="text-sky-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-blue-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Rol Institucional <span className="text-sky-400">*</span>
                </label>
                <select
                  id="select-reg-role"
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-blue-800/80 rounded-xl text-white text-sm focus:outline-none focus:border-sky-400 capitalize"
                >
                  <option value="estudiante" className="bg-[#0B192C]">Estudiante / Atleta</option>
                  <option value="entrenador" className="bg-[#0B192C]">Entrenador(a)</option>
                  <option value="arbitro" className="bg-[#0B192C]">Árbitro Oficial</option>
                  <option value="admin" className="bg-[#0B192C]">Administrador Institucional</option>
                  <option value="espectador" className="bg-[#0B192C]">Espectador / Aficionado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Teléfono Móvil
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="input-reg-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+57 300 123 4567"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-blue-800/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            </div>

            <button
              id="btn-submit-register"
              type="submit"
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <UserPlus className="w-4 h-4" />
              Crear Cuenta e Iniciar Sesión
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-sky-400 hover:text-white font-medium underline underline-offset-4"
              >
                ¿Ya tienes una cuenta? Inicia sesión aquí
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
