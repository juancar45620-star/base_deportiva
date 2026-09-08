import React from 'react';
import {
  Home,
  User as UserIcon,
  Users,
  Trophy,
  CalendarDays,
  FileCheck2,
  Clock,
  UserPlus,
  Shield,
  LogOut,
  ChevronRight,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { User } from '../types';

export type ActiveTab =
  | 'inicio'
  | 'usuario'
  | 'entrenadores'
  | 'partidos'
  | 'eventos'
  | 'resultados'
  | 'partidos_pendientes';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  pendingMatchesCount: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onOpenRegister?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  pendingMatchesCount,
  isOpenMobile,
  setIsOpenMobile,
  onOpenRegister,
  onLogout
}) => {
  const navItems = [
    {
      id: 'inicio' as ActiveTab,
      label: 'Inicio',
      icon: Home,
      description: 'Panel general institucional'
    },
    {
      id: 'usuario' as ActiveTab,
      label: 'Usuario',
      icon: UserIcon,
      description: 'Iniciar sesión y cuenta',
      badge: currentUser ? currentUser.role : 'Invitado'
    },
    {
      id: 'entrenadores' as ActiveTab,
      label: 'Entrenadores',
      icon: Users,
      description: 'Disponibles, clases e incapacidades'
    },
    {
      id: 'partidos' as ActiveTab,
      label: 'Partidos',
      icon: Trophy,
      description: 'Historial y programación'
    },
    {
      id: 'eventos' as ActiveTab,
      label: 'Eventos',
      icon: CalendarDays,
      description: 'Cronología y agenda institucional'
    },
    {
      id: 'resultados' as ActiveTab,
      label: 'Resultados',
      icon: FileCheck2,
      description: 'Actas arbitrales e infracciones'
    },
    {
      id: 'partidos_pendientes' as ActiveTab,
      label: 'Partidos Pendientes',
      icon: Clock,
      description: 'Próximos juegos y alertas en vivo',
      counter: pendingMatchesCount > 0 ? pendingMatchesCount : undefined
    }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B192C] text-white select-none border-r border-blue-950/80 shadow-2xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-blue-900/60 bg-gradient-to-b from-[#071322] to-[#0B192C]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-400 p-0.5 shadow-lg shadow-blue-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-black/40 rounded-[10px] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                DEPORTE<span className="text-sky-400">SYS</span>
              </h1>
              <p className="text-[11px] text-blue-200/80 font-medium">Gestión de Eventos Deportivos</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpenMobile(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Cerrar menú lateral"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-blue-300 uppercase">
          Módulos Principales
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div key={item.id} className="space-y-1">
              <button
                id={`nav-btn-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left font-semibold text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 border border-blue-400/40'
                    : 'text-slate-100 hover:bg-[#1E3E62]/60 hover:text-white border border-transparent'
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-black/30 text-white'
                      : 'bg-black/40 text-blue-200 group-hover:text-white group-hover:bg-blue-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.counter !== undefined && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-black shadow-sm animate-pulse">
                        {item.counter}
                      </span>
                    )}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded bg-blue-950 text-blue-200 border border-blue-800">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    {item.description}
                  </p>
                </div>

                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-white opacity-100 translate-x-0.5' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                  }`}
                />
              </button>

              {/* Sub-action for Usuario: Quick direct "Crear Cuenta" button as requested */}
              {item.id === 'usuario' && (
                <div className="pl-4 pr-1 py-1">
                  <button
                    id="btn-create-account-sub"
                    onClick={() => {
                      if (onOpenRegister) onOpenRegister();
                      handleSelectTab('usuario');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg bg-[#071322] hover:bg-[#1E3E62] text-sky-300 hover:text-white border border-blue-800/40 transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                      <span>Crear Cuenta Nueva</span>
                    </span>
                    <span className="text-[10px] bg-blue-900/60 px-1.5 py-0.5 rounded text-blue-200">
                      Registro
                    </span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Institutional Status Card */}
      <div className="p-4 border-t border-blue-900/60 bg-[#071322]/90 m-3 rounded-xl border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Sistema Institucional</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Activo
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-tight">
          Control institucional y actas en tiempo real.
        </p>

        {currentUser && (
          <div className="mt-3 pt-3 border-t border-blue-950 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-600 font-bold text-xs flex items-center justify-center text-white shrink-0 border border-white/20">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-blue-300 capitalize">{currentUser.role}</p>
              </div>
            </div>
            {onLogout && (
              <button
                id="sidebar-logout-btn"
                onClick={onLogout}
                title="Cerrar sesión institucional"
                className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/40 transition-colors shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet permanent Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative w-4/5 max-w-xs h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
