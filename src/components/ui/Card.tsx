import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--color-glass-card)] backdrop-blur-xl border border-[var(--color-glass-border)] rounded-2xl p-4 shadow-[var(--shadow-sm)]',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform duration-150',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
