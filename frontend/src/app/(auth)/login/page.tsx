'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bot, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // TODO: call /api/auth/login and redirect to /dashboard
    await new Promise((r) => setTimeout(r, 1200));
    
    // Mock user for UI presentation in Phase 1
    const mockName = form.email.split('@')[0];
    login({
      name: mockName.charAt(0).toUpperCase() + mockName.slice(1),
      businessName: 'My Business',
      email: form.email,
    });
    
    router.push('/dashboard');
  }

  return (
    <div className="w-full max-w-md animate-fade-up">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 group">
        <div className="p-2 rounded-xl bg-brand-600/30 border border-brand-500/40">
          <Bot className="w-5 h-5 text-brand-400" />
        </div>
        <span className="text-xl font-bold font-display gradient-text">BotForge</span>
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-slate-400">Sign in to manage your AI chatbots</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            id="login-email"
            label="Email address"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            icon={<Mail size={16} />}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <Link
                href="#"
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                <Lock size={16} />
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-white/5 text-sm text-white placeholder:text-slate-500 transition-all outline-none
                  ${errors.password
                    ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-white/10 hover:border-white/20 focus:border-brand-500/70 focus:ring-2 focus:ring-brand-500/20'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            size="lg"
            loading={loading}
          >
            Sign In <ArrowRight size={16} />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-slate-500">Don&apos;t have an account? </span>
          <Link
            href="/register"
            className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
          >
            Sign up free
          </Link>
        </div>
      </Card>

      <p className="mt-6 text-center text-xs text-slate-600">
        By signing in, you agree to our{' '}
        <a href="#" className="text-slate-500 hover:text-slate-400 underline underline-offset-2">
          Terms
        </a>{' '}
        and{' '}
        <a href="#" className="text-slate-500 hover:text-slate-400 underline underline-offset-2">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
