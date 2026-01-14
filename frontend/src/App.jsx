import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { NotificationProvider, NotificationContext } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import GigList from './pages/GigList';
import CreateGig from './pages/CreateGig';
import GigDetail from './pages/GigDetail';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  return user ? children : <Navigate to="/auth" />;
};

function AppContent() {
  const { user } = useContext(AuthContext);
  const { fetchNotifications } = useContext(NotificationContext);

  // Global Socket Listener
  useEffect(() => {
    if (!user) return;

    const SOCKET_URL = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
      : 'http://localhost:5000';

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socket.emit('join', user._id);

    socket.on('notification', () => {
      fetchNotifications(); // Refresh notifications on event
    });

    socket.on('hired', (data) => {
      // Simple browser alert for now, could be a toast in a polished version
      alert(`🎉 ${data.message}`);
      fetchNotifications();
    });

    socket.on('rejected', (data) => {
      alert(`🔔 ${data.message}`);
      fetchNotifications();
    });

    return () => {
      socket.disconnect();
    };
  }, [user, fetchNotifications]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/gigs" element={<GigList />} />
          <Route path="/gigs/:id" element={<GigDetail />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/gigs/new" element={
            <ProtectedRoute>
              <CreateGig />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
