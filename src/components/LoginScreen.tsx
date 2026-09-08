import React, { useState } from 'react';
import {
  Trophy,
  Shield,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  Database
} from 'lucide-react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storageService';
import { INITIAL_USERS } from '../data/initialData';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form states
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Register form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('estudiante');
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!emailOrUser.trim()) {
      setLoginError('Ingresa tu usuario o correo electrónico.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = StorageService.login(emailOrUser, password);
      setIsLoading(false);

      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        setLoginError(result.error || 'Credenciales inválidas.');
      }
    }, 250);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError('Por favor completa todos los campos requeridos (*).');
      return;
    }

    if (regPassword.length < 4) {
      setRegError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await StorageService.registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        role: regRole,
        phone: regPhone.trim() || undefined
      });
      setIsLoading(false);
      onLogin(newUser);
    } catch {
      setIsLoading(false);
      setRegError('Error al registrar la cuenta. Inténtalo nuevamente.');
    }
  };

  const handleQuickLogin = (demoUser: User) => {
    StorageService.setCurrentUser(demoUser);
    onLogin(demoUser);
  };

  const handleGuestLogin = () => {
    const guestUser: User = {
      id: `guest-${Date.now()}`,
      name: 'Espectador Invitado',
      email: 'espectador@deportes.edu',
      role: 'espectador',
      institutionId: 'GUEST-PUBLIC',
      createdAt: new Date().toISOString().split('T')[0]
    };
    StorageService.setCurrentUser(guestUser);
    onLogin(guestUser);
  };

  return (
    <div className="min-h-screen bg-[#070F1E] text-white flex flex-col items-center justify-center p-4 sm:p-6 antialiased selection:bg-sky-500 selection:text-black">
      {/* Background ambient elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#0B192C] border border-blue-900/60 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-400 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-black/40 rounded-[10px] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-left">
              <span className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1">
                DEPORTE<span className="text-sky-400">SYS</span>
              </span>
              <span className="text-[10px] text-blue-200 block leading-none">
                Gestor Deportivo Institucional
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Portal de Acceso Institucional
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1">
              Ingresa con tus credenciales institucionales para gestionar partidos, eventos y actas en tiempo real.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#0B192C] border border-blue-900/70 rounded-3xl p-6 sm:p-8 text-white shadow-2xl backdrop-blur-sm">
          {/* Tab Selector: Iniciar Sesión vs Crear Cuenta */}
          <div className="flex rounded-2xl bg-[#071322] p-1.5 border border-blue-950 mb-6">
            <button
              id="login-screen-tab-login"
              type="button"
              onClick={() => {
                setTab('login');
                setLoginError('');
                setRegError('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                tab === 'login'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              id="login-screen-tab-register"
              type="button"
              onClick={() => {
                setTab('register');
                setLoginError('');
                setRegError('');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                tab === 'register'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Crear Cuenta Nueva</span>
            </button>
          </div>

          {/* TAB 1: INICIAR SESIÓN */}
          {tab === 'login' && (
            <div className="space-y-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Usuario o Correo Institucional <span className="text-sky-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="login-input-email"
                      type="text"
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      placeholder="ej: director@deportes.edu o Roberto Morales"
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Contraseña <span className="text-sky-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-input-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-black/50 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Ingresar al Sistema</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Institutional Demo Access */}
              <div className="pt-5 border-t border-blue-900/60">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-sky-400" />
                    <span>Acceso Rápido por Roles Institucionales</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">1 Clic</span>
                </div>
                <p className="text-xs text-slate-300 mb-3">
                  Ingresa directamente con uno de los perfiles institucionales registrados:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INITIAL_USERS.map((usr) => (
                    <button
                      key={usr.id}
                      id={`btn-quick-login-${usr.role}`}
                      type="button"
                      onClick={() => handleQuickLogin(usr)}
                      className="p-3 rounded-xl bg-black/40 hover:bg-blue-900/40 border border-blue-950 hover:border-blue-600 text-left transition-all duration-150 flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-white truncate group-hover:text-sky-300">
                          {usr.name}
                        </p>
                        <p className="text-[11px] text-blue-300 capitalize flex items-center gap-1 mt-0.5">
                          <span>{usr.role}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-[10px]">{usr.institutionId}</span>
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>

                {/* Enter as Public Spectator button */}
                <div className="mt-4 pt-3 border-t border-blue-950 flex items-center justify-center">
                  <button
                    id="btn-guest-login"
                    type="button"
                    onClick={handleGuestLogin}
                    className="text-xs font-semibold text-slate-300 hover:text-sky-300 py-1 px-3 rounded-lg hover:bg-black/30 transition-colors flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Explorar como Espectador / Invitado (Modo Consulta)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREAR CUENTA NUEVA */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-xs text-slate-300">
                  Crea tu usuario institucional para acceder con tu rol correspondiente
                </p>
              </div>

              {regError && (
                <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Nombre Completo <span className="text-sky-400">*</span>
                  </label>
                  <input
                    id="reg-input-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="ej: Andrés Torres"
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Correo Institucional <span className="text-sky-400">*</span>
                  </label>
                  <input
                    id="reg-input-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="andres.torres@deportes.edu"
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Rol Institucional <span className="text-sky-400">*</span>
                  </label>
                  <select
                    id="reg-select-role"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-blue-900/80 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                  >
                    <option value="estudiante" className="bg-[#0B192C]">Estudiante / Atleta</option>
                    <option value="entrenador" className="bg-[#0B192C]">Entrenador / Técnico</option>
                    <option value="arbitro" className="bg-[#0B192C]">Árbitro Oficial</option>
                    <option value="admin" className="bg-[#0B192C]">Administrador / Director</option>
                    <option value="espectador" className="bg-[#0B192C]">Espectador / Aficionado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Teléfono Celular
                  </label>
                  <input
                    id="reg-input-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+57 300 123 4567"
                    className="w-full px-3.5 py-2.5 bg-black/50 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Contraseña de Acceso <span className="text-sky-400">*</span>
                </label>
                <input
                  id="reg-input-password"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full px-3.5 py-2.5 bg-black/50 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                  required
                />
              </div>

              <button
                id="btn-reg-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Crear Cuenta e Ingresar</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info badge */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sincronización Cloud Firestore Activa</span>
          </span>
          <span>•</span>
          <span>Portal Seguro Institucional 2026</span>
        </div>
      </div>
    </div>
  );
};
