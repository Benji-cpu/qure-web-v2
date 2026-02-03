import { cn } from '@/lib/cn';

interface BadgeProps {
  variant?: 'default' | 'premium' | 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full',
        variant === 'default' && 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
        variant === 'premium' && 'bg-[var(--color-premium)]/20 text-[var(--color-premium)]',
        variant === 'primary' && 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]',
        variant === 'secondary' && 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]',
        className,
      )}
    >
      {children}
    </span>
  );
}
