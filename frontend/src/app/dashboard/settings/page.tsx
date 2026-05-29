import { Card } from '@/components/ui/Card';
import { Settings, Bell, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const SECTIONS = [
  { icon: <User size={18} />, title: 'Profile', fields: ['Full Name', 'Email Address', 'Phone Number'] },
  { icon: <Lock size={18} />, title: 'Security', fields: ['Current Password', 'New Password', 'Confirm Password'] },
  { icon: <Bell size={18} />, title: 'Notifications', fields: [] },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Settings</h2>
        <p className="text-slate-400 text-sm mt-1">Manage your account preferences</p>
      </div>

      {SECTIONS.map((section) => (
        <Card key={section.title}>
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/8">
            <div className="p-2 rounded-xl bg-brand-500/15 text-brand-400">{section.icon}</div>
            <h3 className="font-display font-semibold text-white">{section.title}</h3>
          </div>
          {section.fields.length > 0 ? (
            <div className="space-y-4">
              {section.fields.map((field) => (
                <Input key={field} id={`setting-${field.toLowerCase().replace(/ /g, '-')}`} label={field} placeholder={`Enter ${field.toLowerCase()}`} type={field.toLowerCase().includes('password') ? 'password' : 'text'} />
              ))}
              <div className="flex justify-end mt-2">
                <Button size="sm">Save {section.title}</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {['New conversation alert', 'Lead captured', 'Weekly analytics digest'].map((pref) => (
                <div key={pref} className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-300">{pref}</span>
                  <div className="w-10 h-5 rounded-full bg-brand-600/40 border border-brand-500/30 relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-brand-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
