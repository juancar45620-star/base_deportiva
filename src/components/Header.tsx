import React from 'react';
import {
  Menu,
  Bell,
  Volume2,
  VolumeX,
  Trophy,
  User as UserIcon,
  ShieldCheck,
  Calendar,
  Clock,
  Database
} from 'lucide-react';
import { User, AppNotification } from '../types';
import { ActiveTab } from './Sidebar';
import { audioNotification } from '../services/audioNotification';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenMobileMenu: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string; icon: any }> = {
  inicio: {
    title: 'Panel General de Deportes',
    subtitle: 'Resumen operativo, eventos institucionales y partidos en curso',
    icon: Trophy
  },
  usuario: {
    title: 'Gestión de Usuario y Autenticación',
    subtitle: 'Inicio de sesión, registro de nuevas cuentas y roles del sistema',
    icon: UserIcon
  },
  entrenadores: {
    title: 'Cuerpo Técnico y Entrenadores',
    subtitle: 'Disponibilidad, clases activas e incapacidades médicas',
    icon: ShieldCheck
  },
  partidos: {
    title: 'Historial y Programación de Partidos',
    subtitle: 'Cronograma completo de encuentros jugados y por disputar',
    icon: Trophy
  },
  eventos: {
    title: 'Calendario de Eventos Institucionales',
    subtitle: 'Organización cronológica por fechas y horas de la institución',
    icon: Calendar
  },
  resultados: {
    title: 'Resultados y Actas Arbitrales',
    subtitle: 'Detalle de horarios, árbitros, alineaciones e infracciones',
    icon: ShieldCheck
  },
  partidos_pendientes: {
    title: 'Partidos Pendientes y Alertas',
    subtitle: 'Sedes, horarios y notificaciones de inicio y fin de partidos',
    icon: Clock
  }
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadCount,
  onOpenNotifications,
  onOpenMobileMenu,
  soundEnabled,
  onToggleSound
}) => {
  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.inicio;
  const CurrentIcon = currentTabInfo.icon;

  return (
    <header className="sticky top-0 z-20 bg-[#0B192C] border-b border-blue-900/60 shadow-md text-white">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left side: Hamburger & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl bg-black/40 text-blue-200 hover:text-white border border-blue-800/40 hover:bg-blue-900/50 transition-colors"
            aria-label="Abrir menú de navegación"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:flex p-2.5 rounded-xl bg-blue-950/80 border border-blue-800/60 text-sky-400">
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate flex items-center gap-2">
                {currentTabInfo.title}
              </h2>
              <p className="text-xs text-blue-200/80 hidden sm:block truncate">
                {currentTabInfo.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Controls & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Cloud Firestore Status Badge */}
          <div
            title="Conectado a Firebase Cloud Firestore en tiempo real"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px] font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Firebase Firestore Conectado</span>
          </div>

          {/* Sound Synthesizer toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Silbato y alertas de audio activados' : 'Silenciar alertas sonoras'}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
              soundEnabled
                ? 'bg-blue-900/50 text-sky-300 border-blue-700/60 hover:bg-blue-800/60'
                : 'bg-black/30 text-slate-400 border-slate-700 hover:text-white hover:bg-black/50'
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-sky-400" />
                <span className="hidden lg:inline text-[11px]">Audio Activo</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden lg:inline text-[11px]">Silencio</span>
              </>
            )}
          </button>

          {/* Notifications button with badge */}
          <button
            onClick={onOpenNotifications}
            id="header-notifications-btn"
            title="Centro de notificaciones y alertas de partidos"
            className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-black/40 hover:bg-blue-900/50 text-white border border-blue-800/50 transition-colors flex items-center gap-2"
          >
            <Bell className="w-4 h-4 text-blue-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:static px-1.5 py-0.2 text-[10px] font-extrabold bg-amber-500 text-black rounded-full min-w-[18px] text-center shadow">
                {unreadCount}
              </span>
            )}
            <span className="hidden xl:inline text-xs font-medium text-blue-100">Notificaciones</span>
          </button>

          {/* User Quick Button */}
          <button
            onClick={() => setActiveTab('usuario')}
            className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all ${
              activeTab === 'usuario'
                ? 'bg-blue-600 border-blue-400 text-white shadow'
                : 'bg-[#071322] border-blue-800/60 text-slate-100 hover:border-blue-700 hover:bg-[#1E3E62]'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-black/40 border border-white/20 flex items-center justify-center font-bold text-xs text-sky-300">
              {currentUser ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-tight truncate max-w-[120px]">
                {currentUser ? currentUser.name : 'Iniciar Sesión'}
              </p>
              <p className="text-[10px] text-blue-300 capitalize leading-none mt-0.5">
                {currentUser ? currentUser.role : 'Crear cuenta'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
