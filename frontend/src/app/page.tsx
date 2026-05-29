import Link from 'next/link';
import {
  Bot, Zap, MessageSquare, Users, BarChart3, Shield,
  Globe, ArrowRight, Check, Star, ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// ── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Instant Setup',
    description: 'Go from zero to a fully functional AI chatbot in under 5 minutes. No technical expertise required.',
    color: 'amber',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Smart RAG Engine',
    description: 'Upload your FAQs, PDFs, or policy documents. The AI learns your business and answers with precision.',
    color: 'brand',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Lead Capture',
    description: 'Automatically collect visitor names, emails, and phone numbers. Never miss a potential customer.',
    color: 'emerald',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Analytics Dashboard',
    description: 'Track conversations, leads, and visitor trends with a beautiful real-time dashboard.',
    color: 'rose',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Enterprise Security',
    description: 'JWT authentication, rate limiting, and data isolation. Your business data stays yours.',
    color: 'brand',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'One-Line Embed',
    description: 'Copy a single script tag and your chatbot appears on any website instantly.',
    color: 'amber',
  },
];

const STEPS = [
  { step: '01', title: 'Create Account', desc: 'Sign up and set up your business profile in seconds.' },
  { step: '02', title: 'Upload Knowledge', desc: 'Add FAQs, PDFs, and documents to power your AI.' },
  { step: '03', title: 'Customize', desc: 'Brand your chatbot with your colors, name, and tone.' },
  { step: '04', title: 'Deploy', desc: 'Paste one line of code. Go live instantly.' },
];

const PLANS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for small businesses just getting started.',
    features: ['1 chatbot', '500 conversations/mo', '5 documents', 'Email support', 'Basic analytics'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Growth',
    price: '$79',
    period: '/month',
    description: 'The complete toolkit for growing businesses.',
    features: ['5 chatbots', '5,000 conversations/mo', '50 documents', 'Priority support', 'Advanced analytics', 'Lead export', 'Custom branding'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    description: 'For large teams with advanced needs.',
    features: ['Unlimited chatbots', 'Unlimited conversations', 'Unlimited documents', 'Dedicated support', 'White-label', 'API access', 'SSO / SAML'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Founder, FitLife Studio',
    text: 'BotForge cut our customer support time by 70%. Our chatbot handles membership questions 24/7 — we focus on the gym, not emails.',
    rating: 5,
  },
  {
    name: 'Marcus Rivera',
    role: 'CEO, Apex Legal Services',
    text: 'Setup was incredibly easy. We uploaded our intake FAQs and had a live chatbot in 20 minutes. Game-changer for our firm.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Digital, LushBeauty Co.',
    text: 'The lead capture feature alone has paid for the subscription 10x over. Our chatbot books consultations every night while we sleep.',
    rating: 5,
  },
];

// ── Color map ─────────────────────────────────────────────────────────────────
const featureColors: Record<string, string> = {
  amber:   'text-amber-400 bg-amber-500/15',
  brand:   'text-brand-400 bg-brand-500/15',
  emerald: 'text-emerald-400 bg-emerald-500/15',
  rose:    'text-rose-400 bg-rose-500/15',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(111,70,255,0.28), transparent)',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-brand-600/10 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-slate-300">Now with GPT-4o Intelligence</span>
            <Badge label="New" variant="brand" />
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6 animate-fade-up">
            Your Business Deserves a{' '}
            <span className="gradient-text">24/7 AI Assistant</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Deploy a smart AI chatbot on your website in minutes. Handle customer queries, capture leads, and book appointments — automatically, around the clock.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/register">
              <Button size="lg" className="gap-3">
                Start Free Trial <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="secondary" className="gap-2">
                See How It Works <ChevronRight size={16} />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-slate-600 mt-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            No credit card required · 14-day free trial · Cancel anytime
          </p>

          {/* Hero mockup */}
          <div className="mt-20 relative animate-float">
            <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Window bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/8">
                <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                <div className="ml-4 flex-1 h-5 rounded-md bg-white/8 max-w-xs mx-auto" />
              </div>
              {/* Chat mockup */}
              <div className="p-6 space-y-4 min-h-[240px]">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-600/40 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-brand-300" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-slate-200 max-w-sm">
                    👋 Hi! I'm FitBot. Ask me about memberships, classes, or trainers!
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-brand-600/30 border border-brand-500/20 rounded-2xl rounded-tr-none px-4 py-2.5 text-sm text-slate-200 max-w-sm">
                    What are your membership prices?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-600/40 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-brand-300" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-slate-200 max-w-sm">
                    We have 3 tiers: Basic at $29/mo, Gold at $49/mo (includes 24/7 access + group classes), and Platinum VIP at $79/mo. Want me to book a tour? 💪
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative glow beneath */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-brand-600/10 blur-2xl" />
          </div>
        </div>
      </section>

      {/* ── Social proof strip ────────────────────────────────────── */}
      <section className="border-y border-white/8 py-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 mb-6">Trusted by 1,200+ businesses worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-40">
            {['Zendesk', 'Shopify', 'HubSpot', 'Stripe', 'Notion', 'Figma'].map((brand) => (
              <span key={brand} className="text-slate-300 font-semibold text-sm tracking-wide">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge label="Features" variant="brand" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-4">
              Everything you need to <span className="gradient-text">delight customers</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A complete toolkit for building, deploying, and managing AI chatbots — without writing a single line of code.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <Card key={feature.title} hover className="group">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${featureColors[feature.color]}`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 relative">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(111,70,255,0.08), transparent)' }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge label="How It Works" variant="slate" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-4">
              Live in <span className="gradient-text">4 simple steps</span>
            </h2>
            <p className="text-slate-400">From signup to a live chatbot on your website in under 10 minutes.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                <Card className="h-full">
                  <div className="text-5xl font-display font-bold text-brand-500/20 mb-4">{s.step}</div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </Card>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10 text-brand-700">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────── */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge label="Pricing" variant="emerald" />
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-4">
              Simple, <span className="gradient-text">transparent pricing</span>
            </h2>
            <p className="text-slate-400">No hidden fees. Start free, scale as you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div key={plan.name} className="relative">
                {plan.popular && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center">
                    <Badge label="Most Popular" variant="brand" />
                  </div>
                )}
                <Card
                  padding="lg"
                  glow={plan.popular}
                  className={plan.popular ? 'border-brand-500/40' : ''}
                >
                  <h3 className="font-display text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{plan.description}</p>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="font-display text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400 mb-1">{plan.period}</span>
                  </div>
                  <Link href="/register">
                    <Button
                      variant={plan.popular ? 'primary' : 'secondary'}
                      className="w-full mb-6"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                  <ul className="space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <Check size={15} className="text-emerald-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="py-24 relative">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(111,70,255,0.06), transparent)' }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-3">
              Loved by businesses <span className="gradient-text">like yours</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} hover className="flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed flex-1">&quot;{t.text}&quot;</p>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Card padding="lg" glow className="border-brand-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-violet-600/10" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to automate your customer support?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Join 1,200+ businesses using BotForge to deliver exceptional customer experiences on autopilot.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started Free <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="ghost">Already have an account?</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
