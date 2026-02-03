import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({ size = 'md', className, children, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all duration-150 active:scale-[0.95]',
        'bg-[var(--color-glass)] backdrop-blur-xl border border-[var(--color-glass-border)]',
        'text-[var(--color-text-primary)]',
        size === 'sm' && 'w-8 h-8 text-sm',
        size === 'md' && 'w-10 h-10 text-base',
        size === 'lg' && 'w-12 h-12 text-lg',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
