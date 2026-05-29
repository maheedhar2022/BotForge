import { Card } from '@/components/ui/Card';
import { Palette, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CustomizerPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Theme Customizer</h2>
        <p className="text-slate-400 text-sm mt-1">Personalize your chatbot appearance and behavior</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Settings panel */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-brand-500/15 text-brand-400">
              <Palette size={18} />
            </div>
            <h3 className="font-display font-semibold text-white">Appearance Settings</h3>
          </div>
          <div className="space-y-4">
            {['Bot Name', 'Theme Color', 'Welcome Message', 'Bot Personality'].map((field) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-300">{field}</label>
                <div className="h-10 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
              </div>
            ))}
            <Button className="w-full mt-2">Save Changes</Button>
          </div>
        </Card>

        {/* Preview panel */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-violet-500/15 text-violet-400">
              <Bot size={18} />
            </div>
            <h3 className="font-display font-semibold text-white">Live Preview</h3>
          </div>
          <div className="flex-1 flex items-center justify-center bg-white/3 rounded-xl border border-white/8 min-h-64">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center mx-auto mb-3">
                <Bot size={22} className="text-brand-400" />
              </div>
              <p className="text-sm text-slate-500">Widget preview will appear here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
