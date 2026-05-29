import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';

// Import Pages
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import KnowledgeBase from './pages/KnowledgeBase.jsx';
import ThemeCustomizer from './pages/ThemeCustomizer.jsx';
import Leads from './pages/Leads.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

// Protected Route Guard Wrapper
function ProtectedRoute({ children, isAuthenticated, isLoading }) {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-darkBg text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-400">Loading profile services...</span>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Admin Route Guard Wrapper
function AdminRoute({ children, user }) {
  return user && user.role === 'admin' ? children : <Navigate to="/" replace />;
}

// Inner App Layout Manager
function AppContent({ user, business, chatbot, setRefreshTrigger, refreshTrigger, isAuthLoading, logoutUser }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-darkBg">
      <Sidebar user={user} business={business} />
      <main className="flex-1 pl-64 min-h-screen flex flex-col">
        {/* Top Header info bar */}
        <header className="h-16 border-b border-slate-900 flex items-center justify-between px-8 bg-slate-950/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700/50 font-medium">
              API Status: <span className="text-emerald-400 font-bold ml-1">● Operational</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">
              Session Expires in 7 Days
            </span>
            <div className="w-px h-4 bg-slate-800"></div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md">
              {user?.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : 'BUSINESS TENANT'}
            </span>
          </div>
        </header>

        {/* Dynamic Inner Router Views */}
        <div className="flex-grow p-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard 
                  user={user} 
                  business={business} 
                  chatbot={chatbot} 
                />
              } 
            />
            <Route 
              path="/knowledge" 
              element={
                <KnowledgeBase 
                  chatbot={chatbot} 
                />
              } 
            />
            <Route 
              path="/customizer" 
              element={
                <ThemeCustomizer 
                  chatbot={chatbot} 
                  onUpdate={() => setRefreshTrigger(prev => prev + 1)}
                />
              } 
            />
            <Route 
              path="/leads" 
              element={
                <Leads 
                  chatbot={chatbot} 
                />
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute user={user}>
                  <AdminPanel />
                </AdminRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [chatbot, setChatbot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setBusiness(data.business);
          setChatbot(data.chatbot);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.warn('Auth server offline or network failure.');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [refreshTrigger]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login onLoginSuccess={() => setRefreshTrigger(prev => prev + 1)} />} />
        <Route path="/register" element={<Register onRegisterSuccess={() => setRefreshTrigger(prev => prev + 1)} />} />

        {/* Private Application Dashboard routes */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
              <AppContent 
                user={user} 
                business={business} 
                chatbot={chatbot} 
                setRefreshTrigger={setRefreshTrigger}
                refreshTrigger={refreshTrigger}
                isAuthLoading={isLoading}
              />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
