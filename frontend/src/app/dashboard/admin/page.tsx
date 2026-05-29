import { Card, StatCard } from '@/components/ui/Card';
import { Shield, Users, Globe, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const TENANTS = [
  { name: 'Alex Mercer',   business: 'FitLife Gym',      plan: 'Growth',  status: 'active', chats: 1284 },
  { name: 'Priya Sharma',  business: 'LushBeauty Co.',   plan: 'Starter', status: 'active', chats: 342  },
  { name: 'Marcus Rivera', business: 'Apex Legal',        plan: 'Enterprise', status: 'active', chats: 2841 },
  { name: 'Tom Hughes',    business: 'TechConnect HQ',    plan: 'Growth',  status: 'suspended', chats: 56 },
];

export default function AdminPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
          <Shield size={20} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Admin Panel</h2>
          <p className="text-slate-400 text-sm">Platform-wide management and monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tenants"  value="4"      icon={<Users size={20} />}  color="brand" />
        <StatCard label="Active Chatbots" value="3"     icon={<Globe size={20} />}  color="emerald" />
        <StatCard label="Total Chats"    value="4,523"  icon={<AlertCircle size={20} />} color="amber" />
        <StatCard label="Suspended"      value="1"      icon={<Shield size={20} />} color="rose" />
      </div>

      <Card padding="none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h3 className="font-display font-semibold text-white">Tenant Accounts</h3>
          <Badge label="4 total" variant="slate" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User / Business</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Chats</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {TENANTS.map((t, i) => (
                <tr
                  key={t.business}
                  className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i === TENANTS.length - 1 ? 'border-0' : ''}`}
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.business}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={t.plan}
                      variant={t.plan === 'Enterprise' ? 'brand' : t.plan === 'Growth' ? 'amber' : 'slate'}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      label={t.status}
                      variant={t.status === 'active' ? 'emerald' : 'rose'}
                    />
                  </td>
                  <td className="px-5 py-4 text-slate-400 hidden md:table-cell">
                    {t.chats.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-xs px-2">View</Button>
                      <Button size="sm" variant="danger" className="text-xs px-2">
                        {t.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
