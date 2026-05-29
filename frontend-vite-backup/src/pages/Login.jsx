import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, MessageSquareCode } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all details.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        if (onLoginSuccess) onLoginSuccess();
        navigate('/');
      } else {
        setError(data.error || 'Failed to authenticate.');
      }
    } catch (err) {
      setError('Server offline. Please run the backend first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#030712]">
      {/* Decorative background grid and neon lights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-indigo-violet flex items-center justify-center shadow-xl shadow-indigo-500/10 text-white font-bold mb-3">
            <MessageSquareCode className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Manage your businesses AI assistant in real-time
          </p>
        </div>

        {/* Form Container Panel */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="bg-red-950/20 border border-red-900/30 text-red-400 text-xs px-4 py-3.5 rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 placeholder-slate-600 text-sm focus:border-indigo-500/80 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 placeholder-slate-600 text-sm focus:border-indigo-500/80 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl gradient-indigo-violet text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-indigo-600/20 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Seed credentials helpful tip */}
          <div className="mt-6 pt-6 border-t border-slate-800/60 text-center space-y-2">
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              💡 Testing account credentials loaded: <br />
              Business Owner: <span className="text-indigo-400">owner@fitlife.com</span> / Password: <span className="text-indigo-400">business123</span> <br />
              System Admin: <span className="text-violet-400">admin@saas.com</span> / Password: <span className="text-violet-400">admin123</span>
            </p>
          </div>
        </div>

        {/* Footer Sub-Links */}
        <p className="text-center text-xs text-slate-500 mt-6 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Register Business
          </Link>
        </p>

      </div>
    </div>
  );
}
