import { type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={3}
        className={cn(
          'px-3 py-2.5 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]',
          'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]',
          'outline-none transition-all duration-150 resize-none',
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
