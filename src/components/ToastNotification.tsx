import React, { useEffect, useState } from 'react';
import { AppNotification } from '../types';
import { Bell, Trophy, Calendar, UserCheck, X, Volume2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  onOpenNotifications?: () => void;
}

export const ToastNotification: React.FC<ToastProps> = ({ onOpenNotifications }) => {
  const [toasts, setToasts] = useState<AppNotification[]>([]);

  useEffect(() => {
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent<AppNotification>;
      if (customEvent.detail) {
        const newToast = customEvent.detail;
        setToasts(prev => [newToast, ...prev.slice(0, 2)]);

        // Auto remove toast after 6 seconds
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, 6000);
      }
    };

    window.addEventListener('sports_notification', handleNotification);
    return () => {
      window.removeEventListener('sports_notification', handleNotification);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'match_start':
        return <Trophy className="w-5 h-5 text-emerald-400 animate-pulse" />;
      case 'match_end':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'event_alert':
        return <Calendar className="w-5 h-5 text-sky-400" />;
      case 'coach_status':
        return <UserCheck className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-white" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'match_start':
        return 'border-emerald-500/60 bg-[#0B192C] shadow-emerald-500/20';
      case 'match_end':
        return 'border-amber-500/60 bg-[#0B192C] shadow-amber-500/20';
      case 'event_alert':
        return 'border-sky-500/60 bg-[#0B192C] shadow-sky-500/20';
      default:
        return 'border-blue-700/60 bg-[#0B192C] shadow-blue-500/20';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl text-white backdrop-blur-md ${getBorderColor(toast.type)}`}
          >
            <div className="p-2 rounded-lg bg-black/40 border border-white/10 shrink-0 mt-0.5">
              {getIcon(toast.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-xs tracking-wider uppercase text-blue-300">
                  Aviso Institucional
                </span>
                <span className="text-[10px] text-slate-400">{toast.timestamp.split(' ')[1] || 'Ahora'}</span>
              </div>
              <h4 className="text-sm font-semibold text-white leading-tight mb-1">{toast.title}</h4>
              <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed">{toast.message}</p>
              
              {onOpenNotifications && (
                <button
                  onClick={() => {
                    removeToast(toast.id);
                    onOpenNotifications();
                  }}
                  className="mt-2 text-[11px] text-sky-300 hover:text-white font-medium underline underline-offset-2 flex items-center gap-1"
                >
                  Ver centro de avisos
                </button>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 shrink-0"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
