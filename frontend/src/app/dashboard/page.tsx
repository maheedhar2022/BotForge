'use client';

import {
  MessageSquare, Users, FileText, BarChart3,
  ArrowUpRight, Bot, Zap, Globe, Copy, ExternalLink,
} from 'lucide-react';
import { StatCard, Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

import { useAuth } from '@/lib/AuthContext';

// ── Fake activity feed ────────────────────────────────────────────────────────
const ACTIVITY = [
  { id: 1, user: 'Sarah K.',    action: 'asked about membership prices', time: '2 min ago', type: 'chat' },
  { id: 2, user: 'James R.',    action: 'submitted contact form (Lead)',   time: '8 min ago', type: 'lead' },
  { id: 3, user: 'Priya M.',    action: 'asked about personal training',   time: '15 min ago', type: 'chat' },
  { id: 4, user: 'Tom H.',      action: 'asked about operating hours',     time: '31 min ago', type: 'chat' },
  { id: 5, user: 'Lena W.',     action: 'submitted contact form (Lead)',   time: '1 hr ago',  type: 'lead' },
];

// ── SVG bar chart (no library needed) ────────────────────────────────────────
const CHART_DATA = [
  { day: 'Mon', chats: 38 },
  { day: 'Tue', chats: 52 },
  { day: 'Wed', chats: 45 },
  { day: 'Thu', chats: 70 },
  { day: 'Fri', chats: 63 },
  { day: 'Sat', chats: 29 },
  { day: 'Sun', chats: 41 },
];
const MAX_CHATS = Math.max(...CHART_DATA.map((d) => d.chats));

export default function DashboardPage() {
  const CHATBOT_ID = 'chatbot-fitlife-uuid'; // mock for embed snippet
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Welcome banner ───────────────────────────── */}
      <div className="glass rounded-2xl p-6 relative overflow-hidden border border-white/8">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/10 via-transparent to-violet-600/10" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display text-xl font-bold text-white">Good morning, {user?.name.split(' ')[0] || 'Alex'}! 👋</h2>
              <Badge label="FitBot Active" variant="emerald" />
            </div>
            <p className="text-slate-400 text-sm">
              Your chatbot handled <strong className="text-white">12 conversations</strong> while you were away.
            </p>
          </div>
          <Link href="/dashboard/customizer">
            <Button size="sm" className="gap-2 flex-shrink-0">
              Customize Bot <ArrowUpRight size={14} />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Chats"
          value="1,284"
          change="12% this week"
          positive
          icon={<MessageSquare size={20} />}
          color="brand"
        />
        <StatCard
          label="Unique Visitors"
          value="763"
          change="8% this week"
          positive
          icon={<Users size={20} />}
          color="emerald"
        />
        <StatCard
          label="Leads Captured"
          value="47"
          change="3 today"
          positive
          icon={<BarChart3 size={20} />}
          color="amber"
        />
        <StatCard
          label="Documents"
          value="4"
          change="Knowledge indexed"
          positive
          icon={<FileText size={20} />}
          color="rose"
        />
      </div>

      {/* ── Chart + Activity ─────────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-white">Conversations This Week</h3>
              <p className="text-sm text-slate-500 mt-0.5">Daily chat volume breakdown</p>
            </div>
            <Badge label="Last 7 days" variant="slate" />
          </div>
          {/* SVG Bar Chart */}
          <div className="flex items-end gap-2 h-40">
            {CHART_DATA.map((d) => {
              const pct = (d.chats / MAX_CHATS) * 100;
              return (
                <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1 group">
                  <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.chats}
                  </span>
                  <div className="w-full rounded-t-lg overflow-hidden" style={{ height: '120px', display: 'flex', alignItems: 'flex-end' }}>
                    <div
                      className="w-full rounded-t-lg transition-all duration-500 group-hover:bg-brand-400"
                      style={{
                        height: `${pct}%`,
                        background: 'linear-gradient(to top, #5e22ff, #8b73ff)',
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Activity feed */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-white">Recent Activity</h3>
            <Link href="/dashboard/leads" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              View all →
            </Link>
          </div>
          <ul className="space-y-3">
            {ACTIVITY.map((item) => (
              <li key={item.id} className="flex gap-3 items-start">
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 text-xs font-bold ${item.type === 'lead' ? 'bg-amber-500/20 text-amber-400' : 'bg-brand-500/20 text-brand-400'}`}>
                  {item.type === 'lead' ? <Users size={12} /> : <MessageSquare size={12} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">
                    <strong>{item.user}</strong> {item.action}
                  </p>
                  <p className="text-xs text-slate-500">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ── Quick actions + Embed snippet ─────────────── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick actions */}
        <Card>
          <h3 className="font-display font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add FAQ',        icon: <FileText size={16} />, href: '/dashboard/knowledge', color: 'brand' },
              { label: 'Edit Chatbot',   icon: <Bot size={16} />,      href: '/dashboard/customizer', color: 'violet' },
              { label: 'View Leads',     icon: <Users size={16} />,    href: '/dashboard/leads',      color: 'amber' },
              { label: 'Go Live',        icon: <Globe size={16} />,    href: '#',                     color: 'emerald' },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <div className="glass glass-hover rounded-xl p-4 flex items-center gap-3 group cursor-pointer">
                  <span className="text-brand-400 group-hover:text-brand-300 transition-colors">
                    {action.icon}
                  </span>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Embed snippet */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-white mb-1">Embed Your Chatbot</h3>
              <p className="text-xs text-slate-500">Paste this script before the closing &lt;/body&gt; tag</p>
            </div>
            <Badge label="Live" variant="emerald" />
          </div>
          <div className="relative">
            <pre className="glass rounded-xl p-4 text-xs text-brand-300 font-mono leading-relaxed overflow-x-auto border border-white/8">
              <code>{`<script src="https://botforge.io/widget.js"\n  data-chatbot-id="${CHATBOT_ID}"\n  defer>\n</script>`}</code>
            </pre>
            <button
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all"
              title="Copy snippet"
              aria-label="Copy embed snippet"
            >
              <Copy size={14} />
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="secondary" className="gap-1.5 flex-1">
              <ExternalLink size={13} /> Test on Sandbox
            </Button>
            <Button size="sm" className="gap-1.5 flex-1">
              <Zap size={13} /> Deploy
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
