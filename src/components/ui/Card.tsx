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
        'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-4 shadow-[var(--shadow-sm)]',
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform duration-150',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
