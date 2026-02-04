import { type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'h-11 px-4 rounded-xl bg-[var(--color-glass-input)] backdrop-blur-lg border border-[var(--color-glass-border)]',
          'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
          'outline-none transition-all duration-150',
          'focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]',
          error && 'border-[var(--color-danger)]',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
    </div>
  );
}
