import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        size === 'sm' && 'h-8 px-3 text-sm rounded-lg',
        size === 'md' && 'h-11 px-5 text-base rounded-xl',
        size === 'lg' && 'h-13 px-6 text-lg rounded-xl',
        variant === 'primary' && 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
        variant === 'secondary' && 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]',
        variant === 'ghost' && 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]',
        variant === 'danger' && 'bg-[var(--color-danger)] text-white',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
