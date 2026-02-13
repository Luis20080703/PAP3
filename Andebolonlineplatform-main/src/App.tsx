import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';
import { AppProvider, useApp } from './context/AppContext';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

import { PremiumPage } from './components/PremiumPage';
import { PendingApproval } from './components/PendingApproval';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'dashboard' | 'premium' | 'pending'>('home');
  const { user, carregando, logout: apiLogout } = useApp();

  // Set document title
  useEffect(() => {
    document.title = 'NexusHand - Plataforma de Andebol';
  }, []);

  // Check if user is logged in and handle routing based on validation status
  useEffect(() => {
    if (user) {
      if (!user.validado) {
        if (currentPage !== 'pending') {
          setCurrentPage('pending');
        }
      } else {
        // Redireciona se estiver na home, login ou na página de pendente (mas já validado)
        if (currentPage === 'home' || currentPage === 'login' || currentPage === 'pending') {
          setCurrentPage('dashboard');
        }
      }
    } else {
      // Se não há user e não estamos na home ou login, volta para home
      if (currentPage !== 'home' && currentPage !== 'login') {
        setCurrentPage('home');
      }
    }
  }, [user, user?.validado, currentPage]);

  const handleLogout = async () => {
    await apiLogout();
    setCurrentPage('home');
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'home' && !user && (
        <Home onNavigateToLogin={() => setCurrentPage('login')} />
      )}
      {currentPage === 'login' && !user && (
        <Login onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'pending' && user && !user.validado && (
        <PendingApproval
          userName={user.nome}
          userEmail={user.email}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'dashboard' && user && user.validado && (
        <Dashboard
          onLogout={handleLogout}
          onNavigateToPremium={() => setCurrentPage('premium')}
        />
      )}
      {currentPage === 'premium' && user && (
        <PremiumPage onBack={() => setCurrentPage('dashboard')} />
      )}
      <PWAInstallPrompt />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
