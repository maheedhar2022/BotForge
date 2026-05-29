'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot, LayoutDashboard, BookOpen, Palette,
  Users, Shield, Settings, LogOut, X, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',      href: '/dashboard',             icon: <LayoutDashboard size={18} /> },
  { label: 'Knowledge Base', href: '/dashboard/knowledge',   icon: <BookOpen size={18} /> },
  { label: 'Customizer',     href: '/dashboard/customizer',  icon: <Palette size={18} /> },
  { label: 'Leads',          href: '/dashboard/leads',       icon: <Users size={18} />, badge: '12' },
  { label: 'Admin Panel',    href: '/dashboard/admin',       icon: <Shield size={18} />, adminOnly: true },
  { label: 'Settings',       href: '/dashboard/settings',    icon: <Settings size={18} /> },
];

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col w-64 glass border-r border-white/8 transition-transform duration-300 ease-in-out',
          'lg:relative lg:translate-x-0 lg:flex',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-xl bg-brand-600/30 border border-brand-500/40">
              <Bot className="w-4 h-4 text-brand-400" />
            </div>
            <span className="font-bold font-display gradient-text text-base">BotForge</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  active
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/6',
                )}
              >
                <span className={cn('flex-shrink-0', active ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300')}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-brand-600/30 text-brand-300 border border-brand-500/30">
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight size={14} className="text-brand-500/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user card */}
        <div className="px-3 py-4 border-t border-white/8">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass-hover glass group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-brand-600/40 border border-brand-500/30 flex items-center justify-center text-sm font-bold text-brand-300 flex-shrink-0">
              {user?.name.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Alex Mercer'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.businessName || 'FitLife Gym'}</p>
            </div>
            <LogOut size={15} className="text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" onClick={async () => {
               const { createClient } = await import('@/utils/supabase/client');
               const supabase = createClient();
               await supabase.auth.signOut();
               window.location.href = '/login';
            }} />
          </div>
        </div>
      </aside>
    </>
  );
}
