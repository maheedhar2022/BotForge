import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — BotForge',
  description: 'Sign in to your BotForge account to manage your AI chatbots.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 30% 50%, rgba(111,70,255,0.25), transparent)' }}
        />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-brand-600/10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative max-w-md text-center">
          <div className="text-6xl mb-6">🤖</div>
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Your AI-powered support team, <span className="gradient-text">working 24/7</span>
          </h2>
          <p className="text-slate-400 leading-relaxed">
            BotForge lets any business deploy a smart chatbot in minutes — no developers, no complexity, just results.
          </p>
          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: '1,200+', label: 'Businesses' },
              { value: '5M+', label: 'Chats Handled' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-3">
                <div className="font-display text-xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
