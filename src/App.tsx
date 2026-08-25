/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastNotification } from './components/ToastNotification';
import { NotificationModal } from './components/NotificationModal';
import { HomeView } from './views/HomeView';
import { UserView } from './views/UserView';
import { CoachesView } from './views/CoachesView';
import { MatchesView } from './views/MatchesView';
import { EventsView } from './views/EventsView';
import { ResultsView } from './views/ResultsView';
import { PendingMatchesView } from './views/PendingMatchesView';
import { StorageService } from './services/storageService';
import { audioNotification } from './services/audioNotification';
import { User, Coach, Match, InstitutionalEvent, AppNotification } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [coaches, setCoaches] = useState<Coach[]>(StorageService.getCoaches());
  const [matches, setMatches] = useState<Match[]>(StorageService.getMatches());
  const [events, setEvents] = useState<InstitutionalEvent[]>(StorageService.getEvents());
  const [notifications, setNotifications] = useState<AppNotification[]>(StorageService.getNotifications());
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(audioNotification.isSoundEnabled());

  // Load initial data and subscribe to Firebase Firestore live streams
  useEffect(() => {
    setCurrentUser(StorageService.getCurrentUser());

    // Initialize Firebase collections / seed if necessary
    StorageService.initFirebase();

    // Subscribe to real-time Firestore updates
    const unsubCoaches = StorageService.subscribeToCoaches((updatedCoaches) => {
      setCoaches(updatedCoaches);
    });

    const unsubMatches = StorageService.subscribeToMatches((updatedMatches) => {
      setMatches(updatedMatches);
    });

    const unsubEvents = StorageService.subscribeToEvents((updatedEvents) => {
      setEvents(updatedEvents);
    });

    const unsubNotifs = StorageService.subscribeToNotifications((updatedNotifs) => {
      setNotifications(updatedNotifs);
    });

    const refreshNotifications = () => {
      setNotifications(StorageService.getNotifications());
    };

    window.addEventListener('sports_notification', refreshNotifications);
    window.addEventListener('sports_notification_update', refreshNotifications);

    return () => {
      unsubCoaches();
      unsubMatches();
      unsubEvents();
      unsubNotifs();
      window.removeEventListener('sports_notification', refreshNotifications);
      window.removeEventListener('sports_notification_update', refreshNotifications);
    };
  }, []);

  const handleToggleSound = () => {
    const newState = audioNotification.toggleSound();
    setSoundEnabled(newState);
  };

  const handleStartMatch = async (matchId: string) => {
    const updated = await StorageService.startMatch(matchId);
    if (updated) {
      setMatches(StorageService.getMatches());
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const pendingMatchesCount = matches.filter(m => m.status === 'pendiente' || m.status === 'en_vivo').length;

  return (
    <div className="min-h-screen bg-[#070F1E] text-white flex flex-col md:flex-row antialiased selection:bg-sky-500 selection:text-black">
      {/* Sidebar navigation in Dark Blue with White Text */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        pendingMatchesCount={pendingMatchesCount}
        isOpenMobile={isMobileMenuOpen}
        setIsOpenMobile={setIsMobileMenuOpen}
        onOpenRegister={() => {
          setActiveTab('usuario');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Sticky Header with notifications and sound */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          unreadCount={unreadNotificationsCount}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'inicio' && (
            <HomeView
              coaches={coaches}
              matches={matches}
              events={events}
              currentUser={currentUser}
              setActiveTab={setActiveTab}
              onStartMatch={handleStartMatch}
            />
          )}

          {activeTab === 'usuario' && (
            <UserView
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          )}

          {activeTab === 'entrenadores' && (
            <CoachesView
              coaches={coaches}
              onCoachesChange={setCoaches}
            />
          )}

          {activeTab === 'partidos' && (
            <MatchesView
              matches={matches}
              onMatchesChange={setMatches}
              setActiveTab={setActiveTab}
              onStartMatch={handleStartMatch}
            />
          )}

          {activeTab === 'eventos' && (
            <EventsView
              events={events}
              onEventsChange={setEvents}
            />
          )}

          {activeTab === 'resultados' && (
            <ResultsView
              matches={matches}
              onMatchesChange={setMatches}
            />
          )}

          {activeTab === 'partidos_pendientes' && (
            <PendingMatchesView
              matches={matches}
              onMatchesChange={setMatches}
              setActiveTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Live Toast Notifications */}
      <ToastNotification onOpenNotifications={() => setIsNotificationsModalOpen(true)} />

      {/* Full Notifications History Center */}
      <NotificationModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onRefresh={() => setNotifications(StorageService.getNotifications())}
      />
    </div>
  );
}
