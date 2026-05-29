import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  Mail, 
  Phone, 
  Calendar,
  MessageSquare,
  Download
} from 'lucide-react';

export default function Leads({ chatbot }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState('');

  // Fetch leads lists
  async function loadLeads() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.warn('Network offline, using mock captured leads list.');
      // Fallback mockup leads for high fidelity demonstration
      setLeads([
        { id: '1', name: 'John Doe', email: 'john@gmail.com', phone: '+1 555-0199', message: 'Looking for Gold Membership schedules.', created_at: new Date(Date.now() - 3600000) },
        { id: '2', name: 'Sara Conner', email: 'sara@sky.net', phone: '+1 555-0211', message: 'Inquiring about personal trainers package.', created_at: new Date(Date.now() - 86400000) }
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, [chatbot]);

  // Handle Delete Lead
  const handleDeleteLead = async (id) => {
    if (!confirm('Are you sure you want to delete this lead record?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  // Convert array to CSV file stream download
  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Name', 'Email', 'Phone', 'Visitor Inquiry', 'Captured At'];
    const rows = leads.map(l => [
      l.name || 'Anonymous',
      l.email || '',
      l.phone || '',
      l.message || '',
      new Date(l.created_at).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_inbox_${chatbot?.id || 'bot'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter leads based on searching query input
  const filteredLeads = leads.filter(l => {
    const query = search.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(query)) ||
      (l.email && l.email.toLowerCase().includes(query)) ||
      (l.phone && l.phone.toLowerCase().includes(query)) ||
      (l.message && l.message.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Users className="w-7 h-7 text-indigo-400" />
            Leads Inbox
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Review contact details collected during AI chatbot customer conversational paths.
          </p>
        </div>

        <button 
          onClick={handleExportCSV}
          disabled={leads.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-500/20 text-white disabled:opacity-40 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Inbox CSV
        </button>
      </div>

      {/* Main Container list table */}
      <div className="glass-panel rounded-2xl border border-slate-800/60 flex flex-col min-h-[400px]">
        
        {/* Table Filters Search Controls */}
        <div className="p-4 border-b border-slate-850 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads by name, email, query..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-slate-200 placeholder-slate-600 text-xs focus:border-indigo-500/85 transition-all font-medium"
            />
          </div>
          <span className="text-[10px] text-slate-500 font-bold bg-slate-950/60 border border-slate-850 px-2.5 py-1.5 rounded-xl uppercase">
            Total Leads: {filteredLeads.length}
          </span>
        </div>

        {/* The Leads Table content */}
        <div className="flex-1 overflow-x-auto">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-12 bg-slate-900/40 rounded-xl border border-slate-850/50 animate-pulse"></div>
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-slate-650 h-[300px] p-6">
              <Users className="w-12 h-12 mb-3 text-slate-700" />
              <span className="text-xs font-semibold text-slate-400">No Leads Captured Yet</span>
              <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                As visitors interact and leave contact channels, they will be listed here.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-850 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider bg-slate-950/30">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email Channel</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6">Customer Query Notes</th>
                  <th className="py-4 px-6">Captured Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300 text-xs">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-900/25 transition-colors">
                    {/* Name */}
                    <td className="py-4 px-6 font-semibold text-slate-200">
                      {lead.name || <span className="text-slate-600 font-medium italic">Anonymous Visitor</span>}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 font-mono text-[11px] text-indigo-300">
                      {lead.email ? (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          {lead.email}
                          <button 
                            onClick={() => handleCopyText(lead.email, lead.id + '_mail')}
                            className="text-slate-500 hover:text-slate-300 transition-colors ml-1 cursor-pointer"
                          >
                            {copiedId === lead.id + '_mail' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-600 italic">—</span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-6 font-mono text-[11px] text-cyan-300">
                      {lead.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          {lead.phone}
                        </div>
                      ) : (
                        <span className="text-slate-600 italic">—</span>
                      )}
                    </td>

                    {/* Message Context */}
                    <td className="py-4 px-6 max-w-[220px] truncate font-medium text-slate-400" title={lead.message}>
                      {lead.message ? (
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                          <span className="truncate">{lead.message}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 italic">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 font-medium text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Delete Action */}
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => handleDeleteLead(lead.id)}
                        className="w-8 h-8 rounded-lg bg-red-950/20 text-red-400 border border-red-900/30 flex items-center justify-center hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
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
