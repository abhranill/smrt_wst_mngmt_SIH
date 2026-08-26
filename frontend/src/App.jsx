import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ReportWastePage from './pages/ReportWastePage';
import CitizenDashboard from './pages/CitizenDashboard';
import TrackComplaintPage from './pages/TrackComplaintPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminMapPage from './pages/AdminMapPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import WorkersPage from './pages/WorkersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppContent() {
  const { user, isAdmin, isCitizen, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-xs">
        <div className="text-center space-y-2">
          <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-semibold">Loading CleanCity 360...</p>
        </div>
      </div>
    );
  }

  // Render Page Content based on path
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigate} />;
      case '/report':
        return <ReportWastePage onNavigate={navigate} />;
      case '/track':
        return <TrackComplaintPage onNavigate={navigate} />;
      case '/citizen':
        return <CitizenDashboard onNavigate={navigate} />;
      case '/admin':
        return <AdminDashboard onNavigate={navigate} />;
      case '/admin/map':
        return <AdminMapPage onNavigate={navigate} />;
      case '/admin/analytics':
        return <AdminAnalyticsPage onNavigate={navigate} />;
      case '/admin/workers':
        return <WorkersPage onNavigate={navigate} />;
      case '/login':
        return <LoginPage onNavigate={navigate} />;
      case '/register':
        return <RegisterPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
