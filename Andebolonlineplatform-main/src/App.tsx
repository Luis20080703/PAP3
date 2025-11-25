import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Toaster } from './components/ui/sonner';
import { AppProvider, useApp } from './context/AppContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'dashboard'>('home');
  const { user, loading, logout: apiLogout } = useApp();

  // Set document title
  useEffect(() => {
    document.title = 'NexusHand - Plataforma de Andebol';
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    if (user) {
      setCurrentPage('dashboard');
    }
  }, [user]);

  const handleLogout = async () => {
    await apiLogout();
    setCurrentPage('home');
  };

  if (loading) {
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
      {user && (
        <Dashboard onLogout={handleLogout} />
      )}
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
