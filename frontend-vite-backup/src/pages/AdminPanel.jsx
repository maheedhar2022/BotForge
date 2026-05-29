import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  Building, 
  MessageSquare, 
  UserMinus, 
  BookOpen,
  PieChart
} from 'lucide-react';

export default function AdminPanel() {
  const [stats, setStats] = useState({
    users: 0,
    businesses: 0,
    conversations: 0,
    messages: 0,
    leads: 0,
    documents: 0
  });

  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAdminData() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const tenantsRes = await fetch('http://localhost:5000/api/admin/tenants', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsRes.ok && tenantsRes.ok) {
        const statsData = await statsRes.json();
        const tenantsData = await tenantsRes.json();

        setStats(statsData.summary);
        setTenants(tenantsData);
      }
    } catch (err) {
      console.warn('Network offline, using mock admin dashboard data.');
      // Simulated stats fallback for showcase
      setStats({
        users: 3,
        businesses: 2,
        conversations: 16,
        messages: 74,
        leads: 9,
        documents: 8
      });
      setTenants([
        { user_id: '1', name: 'Alex Mercer', email: 'owner@fitlife.com', role: 'business', user_created: new Date(), business_name: 'FitLife Gym & Wellness', business_type: 'Gym/Fitness Center', bot_name: 'FitBot', theme_color: '#0ea5e9', lead_count: 5, conversation_count: 8 },
        { user_id: '2', name: 'Dr. Jane Smith', email: 'drjane@smithdental.com', role: 'business', user_created: new Date(), business_name: 'Smith Family Dentistry', business_type: 'Medical/Dental Clinic', bot_name: 'DentistAI', theme_color: '#10b981', lead_count: 4, conversation_count: 6 }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (confirm(`⚠️ CASCADE WARNING: Deleting user '${name}' will permanently remove their Business entity, Chatbot styles, Document vectors, Conversation logs, and Captured leads. Are you sure you want to proceed?`)) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          setTenants(prev => prev.filter(t => t.user_id !== id));
          await loadAdminData(); // reload counters
        } else {
          const err = await res.json();
          alert(err.error || 'Failed to delete user.');
        }
      } catch (error) {
        alert('Action failed.');
      }
    }
  };

  const statBoxes = [
    { name: 'Total Users', value: stats.users, icon: Users, color: 'text-indigo-400 border-indigo-500/25 bg-indigo-500/5' },
    { name: 'Active Businesses', value: stats.businesses, icon: Building, color: 'text-cyan-400 border-cyan-500/25 bg-cyan-500/5' },
    { name: 'System Chats', value: stats.conversations, icon: MessageSquare, color: 'text-violet-400 border-violet-500/25 bg-violet-500/5' },
    { name: 'Total Messages', value: stats.messages, icon: Activity, color: 'text-emerald-400 border-emerald-500/25 bg-emerald-500/5' },
    { name: 'Captured Leads', value: stats.leads, icon: ShieldAlert, color: 'text-rose-400 border-rose-500/25 bg-rose-500/5' },
    { name: 'Document Files', value: stats.documents, icon: BookOpen, color: 'text-amber-400 border-amber-500/25 bg-amber-500/5' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <ShieldAlert className="w-7 h-7 text-indigo-400 animate-pulse" />
          SaaS Admin Control Center
        </h2>
        <p className="text-slate-400 text-sm mt-1 font-medium">
          Global platform supervisor. Monitor system resources, usage analytics, active subscription accounts, and cascade abusive accounts.
        </p>
      </div>

      {/* Grid boxes system counters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {statBoxes.map((box, i) => {
          const Icon = box.icon;
          return (
            <div key={i} className={`p-4 border rounded-xl flex flex-col justify-between shadow ${box.color}`}>
              <Icon className="w-4 h-4 mb-2 flex-shrink-0" />
              <div>
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  {box.name}
                </span>
                <span className="block text-2xl font-extrabold text-white mt-1 tracking-tight">
                  {loading ? '—' : box.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tenant multi-directory lists */}
      <div className="glass-panel rounded-2xl border border-slate-800/60">
        
        <div className="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-950/20">
          <div>
            <h3 className="font-bold text-base text-slate-200">
              Registered System Tenants
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time directories listing all active business integrations.
            </p>
          </div>
          <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-md uppercase">
            Multi-Tenant Manager
          </span>
        </div>

        {/* Tenants table contents */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-3.5 p-6">
              {[1, 2].map(n => (
                <div key={n} className="h-14 bg-slate-900/35 rounded-xl border border-slate-850 animate-pulse"></div>
              ))}
            </div>
          ) : tenants.length === 0 ? (
            <div className="p-12 text-center text-slate-650 flex flex-col items-center justify-center">
              <ShieldAlert className="w-10 h-10 mb-3 text-slate-700" />
              <span className="text-xs font-semibold text-slate-400">No Business Tenants Found</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-[9px] text-slate-500 font-extrabold uppercase tracking-wider bg-slate-950/30">
                  <th className="py-4 px-6">Account User Info</th>
                  <th className="py-4 px-6">Company / Entity</th>
                  <th className="py-4 px-6">Chatbot Name</th>
                  <th className="py-4 px-6 text-center">Chat Threads</th>
                  <th className="py-4 px-6 text-center">Leads Captured</th>
                  <th className="py-4 px-6 text-center">Platform Role</th>
                  <th className="py-4 px-6 text-center">Danger Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300 text-xs">
                {tenants.map((t) => (
                  <tr key={t.user_id} className="hover:bg-slate-900/20 transition-colors">
                    {/* User profile */}
                    <td className="py-4 px-6">
                      <span className="block font-semibold text-slate-200">{t.name}</span>
                      <span className="block text-[10px] text-slate-500 font-medium font-mono mt-0.5">{t.email}</span>
                    </td>

                    {/* Company */}
                    <td className="py-4 px-6">
                      <span className="block font-semibold text-slate-200">
                        {t.business_name || <span className="text-slate-600 font-medium italic">No Business Profile</span>}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-medium mt-0.5">
                        {t.business_type || '—'}
                      </span>
                    </td>

                    {/* Chatbot visual custom */}
                    <td className="py-4 px-6">
                      {t.bot_name ? (
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full inline-block" 
                            style={{ backgroundColor: t.theme_color || '#6366f1' }}
                          ></span>
                          <span className="font-medium text-slate-300">{t.bot_name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 italic">No Chatbot Setup</span>
                      )}
                    </td>

                    {/* Chat counts */}
                    <td className="py-4 px-6 text-center font-bold font-mono text-[11px] text-indigo-400">
                      {t.conversation_count || 0}
                    </td>

                    {/* Leads count */}
                    <td className="py-4 px-6 text-center font-bold font-mono text-[11px] text-emerald-400">
                      {t.lead_count || 0}
                    </td>

                    {/* User role */}
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${t.role === 'admin' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
                        {t.role.toUpperCase()}
                      </span>
                    </td>

                    {/* Danger zone user remove */}
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => handleDeleteUser(t.user_id, t.name)}
                        disabled={t.role === 'admin'}
                        className="p-1.5 rounded-lg bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-950/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Delete Tenant Profile"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

    </div>
  );
}
