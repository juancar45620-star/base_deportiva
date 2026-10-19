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
  Database,
  Key,
  RotateCcw,
  X
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
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('estudiante');
  const [regError, setRegError] = useState('');

  // Password Recovery states
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverNewPass, setRecoverNewPass] = useState('');
  const [recoverConfirmPass, setRecoverConfirmPass] = useState('');
  const [showRecoverPass, setShowRecoverPass] = useState(false);
  const [recoverMsg, setRecoverMsg] = useState('');
  const [recoverError, setRecoverError] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!emailOrUser.trim()) {
      setLoginError('Ingresa tu usuario o correo electrónico.');
      return;
    }

    if (password.length > 10) {
      setLoginError('La contraseña no puede tener más de 10 caracteres.');
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

    if (regPassword.length < 4 || regPassword.length > 10) {
      setRegError('La contraseña debe tener entre 4 y 10 caracteres como máximo.');
      return;
    }

    if (regRole === 'admin' && regEmail.trim().toLowerCase() !== 'juancar45620@gmail.com') {
      setRegError('El rol de Administrador es único y exclusivo para juancar45620@gmail.com. Por favor selecciona otro rol institucional.');
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await StorageService.registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        role: regRole,
        phone: regPhone.trim() || undefined,
        password: regPassword.trim()
      });
      setIsLoading(false);
      onLogin(newUser);
    } catch {
      setIsLoading(false);
      setRegError('Error al registrar la cuenta. Inténtalo nuevamente.');
    }
  };

  const handleRecoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoverError('');
    setRecoverMsg('');

    if (!recoverEmail.trim()) {
      setRecoverError('Por favor ingresa tu correo institucional o usuario.');
      return;
    }

    if (recoverNewPass.length < 4 || recoverNewPass.length > 10) {
      setRecoverError('La nueva contraseña debe tener entre 4 y 10 caracteres.');
      return;
    }

    if (recoverNewPass !== recoverConfirmPass) {
      setRecoverError('Las contraseñas no coinciden. Por favor verifica.');
      return;
    }

    setIsRecovering(true);
    const res = await StorageService.recoverPassword(recoverEmail, recoverNewPass);
    setIsRecovering(false);

    if (res.success) {
      setRecoverMsg(res.message || 'Contraseña actualizada exitosamente.');
      setEmailOrUser(recoverEmail);
      setPassword(recoverNewPass);
      setTimeout(() => {
        setShowRecoverModal(false);
        setRecoverMsg('');
      }, 2500);
    } else {
      setRecoverError(res.error || 'No se pudo recuperar la contraseña.');
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
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#0B192C] border-2 border-sky-400/60 shadow-xl">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-sky-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-black/50 rounded-[10px] flex items-center justify-center font-black text-sky-300 text-sm">
                IET
              </div>
            </div>
            <div className="text-left">
              <span className="text-xs sm:text-sm font-black tracking-tight text-white block uppercase">
                INSTITUCIÓN EDUCATIVA TÉCNICA PEREZ Y ALDANA
              </span>
              <span className="text-[11px] text-amber-300 font-bold block leading-tight">
                Purificación - Tolima
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Portal Deportivo Institucional
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 max-w-md mx-auto mt-1">
              Juegos Interclases, control de entrenadores y seguimiento de partidos en vivo en tiempo real.
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
                      placeholder="ej: juancar45620@gmail.com o Esteban Argüello"
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-200">
                      Contraseña <span className="text-sky-400">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Máx. 10 caracteres ({password.length}/10)
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-input-password"
                      type={showPassword ? 'text' : 'password'}
                      maxLength={10}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Máx. 10 caracteres"
                      className="w-full pl-10 pr-10 py-3 bg-black/50 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                      tabIndex={-1}
                      title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-end pt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRecoverModal(true);
                        setRecoverEmail(emailOrUser);
                        setRecoverNewPass('');
                        setRecoverConfirmPass('');
                        setRecoverError('');
                        setRecoverMsg('');
                      }}
                      className="text-xs text-sky-400 hover:text-sky-300 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>¿Olvidaste tu contraseña? Recuperar</span>
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
                      onClick={() => {
                        setEmailOrUser(usr.email);
                        setPassword(usr.password || '');
                        handleQuickLogin(usr);
                      }}
                      className={`p-3 rounded-xl bg-black/40 hover:bg-blue-900/40 border text-left transition-all duration-150 flex items-center justify-between group ${
                        usr.role === 'admin' ? 'border-sky-500/50 hover:border-sky-400 shadow-sm shadow-sky-500/20' : 'border-blue-950 hover:border-blue-600'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-white truncate group-hover:text-sky-300">
                            {usr.name}
                          </p>
                          {usr.role === 'admin' && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-sky-400 text-black uppercase">
                              Único Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-blue-300 capitalize flex items-center gap-1 mt-0.5">
                          <span>{usr.role}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-[10px]">
                            {usr.role === 'admin' ? `${usr.email} (1234)` : usr.institutionId}
                          </span>
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
                    <option value="admin" className="bg-[#0B192C]">Administrador (Exclusivo juancar45620@gmail.com)</option>
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-200">
                    Contraseña de Acceso <span className="text-sky-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Máx. 10 caracteres ({regPassword.length}/10)
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-input-password"
                    type={showRegPassword ? 'text' : 'password'}
                    maxLength={10}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 4 y máximo 10 caracteres"
                    className="w-full pl-10 pr-10 py-2.5 bg-black/50 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                    tabIndex={-1}
                    title={showRegPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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

      {/* MODAL: RECUPERAR CONTRASEÑA */}
      {showRecoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B192C] border border-blue-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-900/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-950 border border-blue-800 rounded-xl text-sky-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Recuperar Contraseña</h3>
                  <p className="text-xs text-blue-200">Restablece tu acceso institucional</p>
                </div>
              </div>
              <button
                onClick={() => setShowRecoverModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {recoverError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{recoverError}</span>
              </div>
            )}

            {recoverMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{recoverMsg}</span>
              </div>
            )}

            <form onSubmit={handleRecoverSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Correo Institucional o Usuario <span className="text-sky-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={recoverEmail}
                    onChange={(e) => setRecoverEmail(e.target.value)}
                    placeholder="ej: juancar45620@gmail.com o Esteban Argüello"
                    className="w-full pl-9 pr-3 py-2.5 bg-black/40 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-200">
                    Nueva Contraseña <span className="text-sky-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Máx. 10 caracteres ({recoverNewPass.length}/10)
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showRecoverPass ? 'text' : 'password'}
                    maxLength={10}
                    value={recoverNewPass}
                    onChange={(e) => setRecoverNewPass(e.target.value)}
                    placeholder="Entre 4 y 10 caracteres"
                    className="w-full pl-9 pr-10 py-2.5 bg-black/40 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRecoverPass(!showRecoverPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                    tabIndex={-1}
                    title={showRecoverPass ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showRecoverPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Confirmar Nueva Contraseña <span className="text-sky-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showRecoverPass ? 'text' : 'password'}
                    maxLength={10}
                    value={recoverConfirmPass}
                    onChange={(e) => setRecoverConfirmPass(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    className="w-full pl-9 pr-10 py-2.5 bg-black/40 border border-blue-900/80 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-400"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRecoverModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isRecovering}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {isRecovering ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restablecer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
