'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bot, User, Building2, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter',  test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number',            test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', businessName: '', email: '', password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.businessName.trim()) errs.businessName = 'Business name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (!PASSWORD_RULES.every((r) => r.test(form.password)))
      errs.password = 'Password does not meet requirements';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          name: form.name,
          businessName: form.businessName,
        }
      }
    });

    setLoading(false);

    if (error) {
      setErrors({ email: error.message });
      return;
    }

    router.push('/dashboard');
  }

  const passwordMeta = PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(form.password) }));
  const passedCount = passwordMeta.filter((r) => r.passed).length;
  const strength = passedCount === 0 ? 0 : passedCount === 1 ? 33 : passedCount === 2 ? 66 : 100;
  const strengthColor = strength < 40 ? 'bg-rose-500' : strength < 80 ? 'bg-amber-400' : 'bg-emerald-400';

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
        <h1 className="font-display text-3xl font-bold text-white mb-2">Create your account</h1>
        <p className="text-slate-400">Start your free 14-day trial. No card required.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="reg-name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              icon={<User size={16} />}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />
            <Input
              id="reg-business"
              label="Business Name"
              type="text"
              placeholder="Acme Corp"
              icon={<Building2 size={16} />}
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              error={errors.businessName}
            />
          </div>

          <Input
            id="reg-email"
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            icon={<Mail size={16} />}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="reg-password" className="text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
                <Lock size={16} />
              </span>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                autoComplete="new-password"
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
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength bar */}
            {form.password && (
              <div className="mt-1.5 space-y-2">
                <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', strengthColor)}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <ul className="grid grid-cols-1 gap-1">
                  {passwordMeta.map((rule) => (
                    <li key={rule.label} className={cn('flex items-center gap-1.5 text-xs transition-colors', rule.passed ? 'text-emerald-400' : 'text-slate-500')}>
                      <Check size={11} className={rule.passed ? 'opacity-100' : 'opacity-30'} />
                      {rule.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            className="w-full gap-2 mt-2"
            size="lg"
            loading={loading}
          >
            Create Account <ArrowRight size={16} />
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-slate-500">Already have an account? </span>
          <Link
            href="/login"
            className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </Card>

      <p className="mt-6 text-center text-xs text-slate-600">
        By creating an account, you agree to our{' '}
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
