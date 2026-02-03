import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  className?: string;
}

const BackArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export function PageHeader({ title, onBack, right, className }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        'flex items-center h-12 px-4 pt-[env(safe-area-inset-top)]',
        'bg-[var(--color-bg-primary)]/80 backdrop-blur-xl',
        className,
      )}
    >
      <button
        className="flex items-center justify-center w-10 h-10 -ml-2 text-[var(--color-accent)]"
        onClick={onBack || (() => navigate(-1))}
      >
        <BackArrow />
      </button>
      <h1 className="flex-1 text-lg font-semibold text-center text-[var(--color-text-primary)]">{title}</h1>
      <div className="w-10 flex justify-end">
        {right}
      </div>
    </header>
  );
}
