import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary:
        'bg-brand-600 hover:bg-brand-500 text-white glow-brand-sm hover:glow-brand active:scale-[0.97]',
      secondary:
        'bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 active:scale-[0.97]',
      ghost:
        'hover:bg-white/8 text-slate-300 hover:text-white active:scale-[0.97]',
      outline:
        'border border-brand-500/50 hover:border-brand-400 text-brand-300 hover:text-brand-200 hover:bg-brand-500/10 active:scale-[0.97]',
      danger:
        'bg-red-600/80 hover:bg-red-600 text-white active:scale-[0.97]',
    };

    const sizes = {
      sm:  'h-8  px-3 text-sm',
      md:  'h-10 px-5 text-sm',
      lg:  'h-12 px-8 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export { Button };
