import React from 'react';
import { AppNotification } from '../types';
import { StorageService } from '../services/storageService';
import { Bell, CheckCheck, Trash2, X, Trophy, Calendar, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onRefresh: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefresh
}) => {
  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsRead();
    onRefresh();
  };

  const handleClearAll = () => {
    StorageService.clearNotifications();
    onRefresh();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'match_start':
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      case 'match_end':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'event_alert':
        return <Calendar className="w-4 h-4 text-sky-400" />;
      case 'coach_status':
        return <UserCheck className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#0B192C] border border-blue-800/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-blue-900/60 flex items-center justify-between bg-black/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-900/50 border border-blue-700/50 text-blue-300">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Centro de Notificaciones</h3>
                <p className="text-xs text-blue-200">Alertas en tiempo real de partidos y eventos institucionales</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          <div className="px-4 py-2.5 bg-[#071220] border-b border-blue-950 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              {notifications.length} {notifications.length === 1 ? 'notificación' : 'notificaciones'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllRead}
                disabled={notifications.length === 0}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-900/40 hover:bg-blue-800/60 text-blue-200 hover:text-white border border-blue-800/40 disabled:opacity-50 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar leídas
              </button>
              <button
                onClick={handleClearAll}
                disabled={notifications.length === 0}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/40 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Limpiar
              </button>
            </div>
          </div>

          {/* List */}
          <div className="p-4 overflow-y-auto space-y-3 flex-1 divide-y divide-blue-950/60">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-10 h-10 mx-auto text-slate-600 mb-3" />
                <p className="font-semibold text-sm text-slate-300">No hay notificaciones</p>
                <p className="text-xs text-slate-500 mt-1">Los avisos de inicio y fin de partidos aparecerán aquí.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`pt-3 first:pt-0 p-3 rounded-xl transition-colors ${
                    notif.read ? 'bg-black/20 opacity-80' : 'bg-blue-950/50 border border-blue-700/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-black/50 border border-white/10 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white">{notif.title}</h4>
                        <span className="text-[10px] text-blue-300 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-blue-900/60 bg-black/40 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
