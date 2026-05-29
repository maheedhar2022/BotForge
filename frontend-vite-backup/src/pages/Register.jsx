import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building, Layers, Sparkles, MessageSquareCode } from 'lucide-react';

export default function Register({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Gym/Fitness');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const businessOptions = [
    'Gym/Fitness Center',
    'Restaurant/Cafe',
    'Medical/Dental Clinic',
    'Beauty/Hair Salon',
    'Real Estate Agency',
    'E-commerce Store',
    'Coaching Center/School',
    'Other Service Agency'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !businessName) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          businessName,
          businessType
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        if (onRegisterSuccess) onRegisterSuccess();
        navigate('/');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Server offline. Please run the backend first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#030712]">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10 my-8">
        
        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl gradient-indigo-violet flex items-center justify-center shadow-xl shadow-indigo-500/10 text-white font-bold mb-3">
            <MessageSquareCode className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            Create Business Account
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Launch your fully custom business AI Assistant in 30 seconds
          </p>
        </div>

        {/* Panel Form Container */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800/80 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="bg-red-950/20 border border-red-900/30 text-red-400 text-xs px-4 py-3.5 rounded-xl font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Contact Person Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 placeholder-slate-600 text-sm focus:border-indigo-500/80 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@fitlife.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 placeholder-slate-600 text-sm focus:border-indigo-500/80 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Name */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Business Entity Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="FitLife Gym"
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 placeholder-slate-600 text-sm focus:border-indigo-500/80 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Business Type Select */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Business Industry Type
                </label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-400 text-sm focus:border-indigo-500/80 transition-all font-medium appearance-none cursor-pointer"
                  >
                    {businessOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Create Account Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 placeholder-slate-600 text-sm focus:border-indigo-500/80 transition-all font-medium"
                />
              </div>
            </div>

            {/* Setup auto features notice */}
            <div className="p-3.5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Our platform will **automatically provision** a dedicated SQLite database profile, load sample conversation templates, and activate your embedded AI chatbot shell on registry!
              </p>
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
                  <Sparkles className="w-4 h-4" />
                  Configure & Launch My Chatbot
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500 mt-6 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}
