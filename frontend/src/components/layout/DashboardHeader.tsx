'use client';

import { usePathname } from 'next/navigation';
import { Menu, Bell, Search, Sparkles } from 'lucide-react';
import { NAV_ITEMS } from './Sidebar';
import { useAuth } from '@/lib/AuthContext';


interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const currentPage = NAV_ITEMS.find(
    (item) => item.href === pathname || (item.href !== '/dashboard' && pathname.startsWith(item.href)),
  );

  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-white/8 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
      {/* Left: burger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-white/8 text-slate-400 hover:text-white transition-colors flex-shrink-0"
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-lg font-semibold text-white truncate">
            {currentPage?.label ?? 'Dashboard'}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right: search + actions */}
      <div className="flex items-center gap-2">
        {/* Search (desktop) */}
        <div className="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-2 w-48 border border-white/8 hover:border-white/15 transition-colors cursor-text">
          <Search size={14} className="text-slate-500 flex-shrink-0" />
          <span className="text-sm text-slate-600">Search...</span>
          <kbd className="ml-auto text-xs text-slate-600 bg-white/5 rounded px-1.5 py-0.5">⌘K</kbd>
        </div>

        {/* AI badge */}
        <div className="hidden sm:flex items-center gap-1.5 glass rounded-xl px-3 py-1.5 border border-white/8">
          <Sparkles size={13} className="text-brand-400" />
          <span className="text-xs text-slate-400 font-medium">AI Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl hover:bg-white/8 text-slate-400 hover:text-white transition-colors"
          aria-label="Notifications"
          id="notifications-btn"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-1 ring-slate-950" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-brand-600/40 border border-brand-500/30 flex items-center justify-center text-sm font-bold text-brand-300 cursor-pointer hover:glow-brand-sm transition-all">
          {user?.name.charAt(0).toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}
