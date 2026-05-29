import { Card } from '@/components/ui/Card';
import { Users, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const SAMPLE_LEADS = [
  { name: 'James Rodriguez', email: 'james@email.com', phone: '+1 555 0101', query: 'Gold membership inquiry', time: '8 min ago' },
  { name: 'Lena Wolf',       email: 'lena@email.com',  phone: '+1 555 0202', query: 'Personal trainer booking',  time: '1 hr ago' },
  { name: 'Omar Hassan',     email: 'omar@email.com',  phone: '+1 555 0303', query: 'VIP membership pricing',    time: '3 hr ago' },
  { name: 'Amy Kim',         email: 'amy@email.com',   phone: '+1 555 0404', query: 'Guest pass inquiry',        time: '5 hr ago' },
];

export default function LeadsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Leads</h2>
          <p className="text-slate-400 text-sm mt-1">Visitors who submitted their contact details</p>
        </div>
        <Button variant="secondary" size="sm" className="gap-2">
          <Download size={14} /> Export CSV
        </Button>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3 glass rounded-xl px-4 py-2.5 border border-white/8 max-w-sm">
        <Search size={16} className="text-slate-500" />
        <input
          placeholder="Search leads..."
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
        />
      </div>

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-left">
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Query</th>
                <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_LEADS.map((lead, i) => (
                <tr
                  key={lead.email}
                  className={`border-b border-white/5 hover:bg-white/4 transition-colors ${i === SAMPLE_LEADS.length - 1 ? 'border-0' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-300">
                        {lead.name[0]}
                      </div>
                      <span className="font-medium text-white">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{lead.email}</td>
                  <td className="px-5 py-4 text-slate-400 hidden md:table-cell">{lead.phone}</td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <Badge label={lead.query} variant="slate" />
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">{lead.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
