import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ className, children, hover = false, glow = false, padding = 'md', ...props }: CardProps) {
  const paddings = {
    none: '',
    sm:   'p-4',
    md:   'p-6',
    lg:   'p-8',
  };

  return (
    <div
      className={cn(
        'glass rounded-2xl',
        paddings[padding],
        hover && 'glass-hover cursor-pointer',
        glow && 'glow-brand-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: React.ReactNode;
  color?: 'brand' | 'emerald' | 'amber' | 'rose';
}

const colorMap = {
  brand:   'text-brand-400 bg-brand-500/15',
  emerald: 'text-emerald-400 bg-emerald-500/15',
  amber:   'text-amber-400 bg-amber-500/15',
  rose:    'text-rose-400 bg-rose-500/15',
};

export function StatCard({ label, value, change, positive = true, icon, color = 'brand' }: StatCardProps) {
  return (
    <Card hover className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-bold font-display text-white">{value}</p>
        {change && (
          <p className={cn('text-xs mt-1 font-medium', positive ? 'text-emerald-400' : 'text-rose-400')}>
            {positive ? '↑' : '↓'} {change}
          </p>
        )}
      </div>
      <div className={cn('p-3 rounded-xl flex-shrink-0', colorMap[color])}>
        {icon}
      </div>
    </Card>
  );
}
