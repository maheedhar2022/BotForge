import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Users, 
  BookOpen, 
  Activity, 
  Code, 
  Check, 
  Copy, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Dashboard({ user, business, chatbot }) {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    conversations: 12,
    visitors: 8,
    leads: 4,
    documents: 4
  });
  const [loading, setLoading] = useState(true);

  // Widget Script Code to embed
  const embedCode = `<!-- OmniChat Assistant Widget Embed -->
<script 
  src="http://localhost:5000/widget.js" 
  data-bot-id="${chatbot?.id || 'YOUR_BOT_ID'}"
  async>
</script>
<!-- End OmniChat Assistant Widget Embed -->`;

  useEffect(() => {
    async function loadStats() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Fetch leads count, documents count, and conversations count in parallel
        const leadsRes = await fetch('http://localhost:5000/api/leads', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const docsRes = await fetch('http://localhost:5000/api/documents', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const convsRes = await fetch('http://localhost:5000/api/conversations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (leadsRes.ok && docsRes.ok && convsRes.ok) {
          const leads = await leadsRes.json();
          const docs = await docsRes.json();
          const convs = await convsRes.json();

          // Calculate unique visitors
          const uniqueVisitors = new Set(convs.map(c => c.visitor_id)).size;

          setStats({
            conversations: convs.length,
            visitors: uniqueVisitors || convs.length,
            leads: leads.length,
            documents: docs.length
          });
        }
      } catch (err) {
        console.warn('Network offline, loading simulated dashboard stats.');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [chatbot]);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { name: 'Total Chats', value: stats.conversations, icon: MessageSquare, color: 'text-indigo-400 bg-indigo-500/10' },
    { name: 'Unique Visitors', value: stats.visitors, icon: Activity, color: 'text-cyan-400 bg-cyan-500/10' },
    { name: 'Captured Leads', value: stats.leads, icon: Users, color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Knowledge Items', value: stats.documents, icon: BookOpen, color: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            Welcome back, {user?.name || 'Owner'}!
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Your chatbot <span className="text-indigo-400 font-semibold">{chatbot?.bot_name}</span> is currently monitoring <span className="text-emerald-400 font-semibold">{business?.name}</span>'s website.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 rounded-2xl px-5 py-3.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <div className="text-xs font-semibold text-slate-300">
            Widget Status: <span className="text-emerald-400 uppercase font-bold ml-1">Live & Active</span>
          </div>
        </div>
      </div>

      {/* Grid Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-card p-6 rounded-2xl flex items-center justify-between shadow-lg">
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.name}
                </span>
                <span className="block text-3xl font-extrabold text-white mt-2 tracking-tight">
                  {loading ? (
                    <div className="w-8 h-8 bg-slate-800 rounded animate-pulse"></div>
                  ) : (
                    card.value
                  )}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-slate-800/40 ${card.color}`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts & Copy Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Analytics line custom chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800/60 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-200">
                Visitor Interactivity & Activity Flow
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Analysis of customer chats vs captured contact channels
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                Conversations
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                Leads Captured
              </span>
            </div>
          </div>

          {/* Elegant customized SVG graph container */}
          <div className="flex-1 w-full relative">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
              <div className="border-b border-slate-900 w-full h-px"></div>
              <div className="border-b border-slate-900 w-full h-px"></div>
              <div className="border-b border-slate-900 w-full h-px"></div>
              <div className="border-b border-slate-900 w-full h-px"></div>
            </div>

            {/* Custom SVG Line drawing */}
            <svg viewBox="0 0 500 200" className="w-full h-full absolute inset-0 overflow-visible z-10">
              {/* Gradient Shaders fill */}
              <defs>
                <linearGradient id="indigoGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="emeraldGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Conversations Area Chart & Line */}
              <path 
                d="M 20 180 Q 100 130 180 150 T 340 70 T 480 30 L 480 180 Z" 
                fill="url(#indigoGlow)"
              />
              <path 
                d="M 20 180 Q 100 130 180 150 T 340 70 T 480 30" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* Leads Area Chart & Line */}
              <path 
                d="M 20 180 Q 100 160 180 170 T 340 120 T 480 90 L 480 180 Z" 
                fill="url(#emeraldGlow)"
              />
              <path 
                d="M 20 180 Q 100 160 180 170 T 340 120 T 480 90" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeDasharray="4 2"
                strokeLinecap="round"
              />

              {/* Data points markers */}
              <circle cx="180" cy="150" r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="340" cy="70" r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="480" cy="30" r="5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />

              <circle cx="340" cy="120" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="480" cy="90" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
            
            {/* Chart X axis grid label labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-slate-500 font-bold">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun (Today)</span>
            </div>
          </div>
        </div>

        {/* Integration script widget config */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/60 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-200">
              Easy Integration Snippet
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">
              Copy this lightweight async script tag into your website's header or footer HTML (right before the <code className="text-slate-400 font-mono text-[10px]">&lt;/body&gt;</code> tag) to render the floating chat bubble.
            </p>

            {/* Code Box */}
            <div className="bg-slate-950/80 rounded-xl p-4.5 border border-slate-800/80 font-mono text-[10px] text-slate-400 mt-4 relative group leading-relaxed overflow-x-auto whitespace-pre select-all">
              {embedCode}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button 
              onClick={handleCopy}
              className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600/90 text-white hover:bg-indigo-600'}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Snippet Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Widget Script
                </>
              )}
            </button>
            <a 
              href="http://localhost:5000/widget-frame.html" 
              target="_blank" 
              rel="noreferrer"
              className="w-100 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-850 transition-all text-center w-full"
            >
              Test Widget Frame
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

      {/* Guide walkthrough steps */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800/60">
        <h3 className="font-bold text-base text-slate-200 mb-4">
          Chatbot Setup Progress & Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4 items-start p-4 bg-slate-900/30 rounded-xl border border-slate-850">
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</div>
            <div>
              <h4 className="text-xs font-semibold text-slate-300">1. Setup Profile</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Account created and chatbot database schema provisioned automatically.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-4 bg-slate-900/30 rounded-xl border border-slate-850">
            <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                2. Load Knowledge Base
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Upload FAQs and business menu PDFs to enable automated RAG query answering.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-4 bg-slate-900/30 rounded-xl border border-slate-850">
            <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                3. Customize Styles
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                Configure color pickers, names, welcome lines, and save.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
