/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { ToastNotification } from './components/ToastNotification';
import { NotificationModal } from './components/NotificationModal';
import { HomeView } from './views/HomeView';
import { UserView } from './views/UserView';
import { CoachesView } from './views/CoachesView';
import { MatchesView } from './views/MatchesView';
import { EventsView } from './views/EventsView';
import { ResultsView } from './views/ResultsView';
import { PendingMatchesView } from './views/PendingMatchesView';
import { LiveMatchesView } from './views/LiveMatchesView';
import { StorageService } from './services/storageService';
import { audioNotification } from './services/audioNotification';
import { User, Coach, Match, InstitutionalEvent, AppNotification } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
  const [tabHistory, setTabHistory] = useState<ActiveTab[]>(['inicio']);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [coaches, setCoaches] = useState<Coach[]>(StorageService.getCoaches());
  const [matches, setMatches] = useState<Match[]>(StorageService.getMatches());
  const [events, setEvents] = useState<InstitutionalEvent[]>(StorageService.getEvents());
  const [notifications, setNotifications] = useState<AppNotification[]>(StorageService.getNotifications());
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(audioNotification.isSoundEnabled());

  const handleNavigate = (tab: ActiveTab) => {
    setTabHistory(prev => (prev[prev.length - 1] === tab ? prev : [...prev, tab]));
    setActiveTab(tab);
  };

  const handleGoBack = () => {
    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop(); // Remove current tab
      const previousTab = newHistory[newHistory.length - 1];
      setTabHistory(newHistory);
      setActiveTab(previousTab);
    } else {
      setActiveTab('inicio');
      setTabHistory(['inicio']);
    }
  };

  const handleGoHome = () => {
    setActiveTab('inicio');
    setTabHistory(['inicio']);
  };

  // Load initial data and subscribe to Firebase Firestore live streams
  useEffect(() => {
    // Clear legacy auto-assigned user so user starts at the login screen
    if (!sessionStorage.getItem('sports_app_session_user')) {
      StorageService.logout();
    }
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

  const handleLogout = () => {
    StorageService.logout();
    sessionStorage.removeItem('sports_app_session_user');
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user: User) => {
    sessionStorage.setItem('sports_app_session_user', 'true');
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    setActiveTab('inicio');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const pendingMatchesCount = matches.filter(m => m.status === 'pendiente' || m.status === 'en_vivo').length;

  // If not logged in, show the Login / Register screen directly as requested
  if (!currentUser) {
    return (
      <>
        <LoginScreen onLogin={handleLoginSuccess} />
        <ToastNotification onOpenNotifications={() => setIsNotificationsModalOpen(true)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#070F1E] text-white flex flex-col md:flex-row antialiased selection:bg-sky-500 selection:text-black">
      {/* Sidebar navigation in Dark Blue with White Text */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        currentUser={currentUser}
        pendingMatchesCount={pendingMatchesCount}
        liveMatchesCount={matches.filter(m => m.status === 'en_vivo').length}
        isOpenMobile={isMobileMenuOpen}
        setIsOpenMobile={setIsMobileMenuOpen}
        onOpenRegister={() => {
          handleNavigate('usuario');
        }}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Sticky Header with notifications and sound */}
        <Header
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          currentUser={currentUser}
          unreadCount={unreadNotificationsCount}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onLogout={handleLogout}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'inicio' && (
            <HomeView
              coaches={coaches}
              matches={matches}
              events={events}
              currentUser={currentUser}
              setActiveTab={handleNavigate}
              onStartMatch={handleStartMatch}
            />
          )}

          {activeTab === 'en_vivo' && (
            <LiveMatchesView
              matches={matches}
              onMatchesChange={setMatches}
              currentUser={currentUser}
              onGoBack={handleGoBack}
              onGoHome={handleGoHome}
            />
          )}

          {activeTab === 'usuario' && (
            <UserView
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              onGoBack={handleGoBack}
              onGoHome={handleGoHome}
            />
          )}

          {activeTab === 'entrenadores' && (
            <CoachesView
              coaches={coaches}
              onCoachesChange={setCoaches}
              currentUser={currentUser}
              onGoBack={handleGoBack}
              onGoHome={handleGoHome}
            />
          )}

          {activeTab === 'partidos' && (
            <MatchesView
              matches={matches}
              onMatchesChange={setMatches}
              setActiveTab={handleNavigate}
              onStartMatch={handleStartMatch}
              currentUser={currentUser}
              onGoBack={handleGoBack}
              onGoHome={handleGoHome}
            />
          )}

          {activeTab === 'eventos' && (
            <EventsView
              events={events}
              onEventsChange={setEvents}
              currentUser={currentUser}
              onGoBack={handleGoBack}
              onGoHome={handleGoHome}
            />
          )}

          {activeTab === 'resultados' && (
            <ResultsView
              matches={matches}
              onMatchesChange={setMatches}
              currentUser={currentUser}
              onGoBack={handleGoBack}
              onGoHome={handleGoHome}
            />
          )}

          {activeTab === 'partidos_pendientes' && (
            <PendingMatchesView
              matches={matches}
              onMatchesChange={setMatches}
              setActiveTab={handleNavigate}
              currentUser={currentUser}
              onGoBack={handleGoBack}
              onGoHome={handleGoHome}
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
