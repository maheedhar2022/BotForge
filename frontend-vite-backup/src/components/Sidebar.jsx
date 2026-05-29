import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Palette, 
  Users, 
  ShieldAlert, 
  LogOut, 
  MessageSquareCode 
} from 'lucide-react';

export default function Sidebar({ user, business }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
    { name: 'Widget Customizer', path: '/customizer', icon: Palette },
    { name: 'Leads Inbox', path: '/leads', icon: Users },
  ];

  if (user && user.role === 'admin') {
    navItems.push({ name: 'Admin Console', path: '/admin', icon: ShieldAlert });
  }

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-20">
      
      {/* Brand logo header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-indigo-violet flex items-center justify-content-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg flex-shrink-0 flex justify-center items-center">
          <MessageSquareCode className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-300">
            OmniChat
          </span>
          <span className="text-[10px] block text-indigo-400 font-semibold tracking-wider uppercase -mt-0.5">
            SaaS Platform
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600/80 to-violet-600/80 text-white shadow-md shadow-indigo-600/10 border-l-4 border-indigo-400' 
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-900/40 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="truncate">
            <span className="block text-xs font-semibold text-slate-300 truncate">
              {user?.name || 'Owner User'}
            </span>
            <span className="block text-[10px] text-slate-500 truncate">
              {business?.name || 'My Business'}
            </span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-100 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-950/40 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log Out
        </button>
      </div>

    </aside>
  );
}
