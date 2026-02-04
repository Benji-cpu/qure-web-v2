import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm animate-[fadeIn_150ms_ease]" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 w-full max-w-sm bg-[var(--color-glass-elevated)] backdrop-blur-2xl border border-[var(--color-glass-border)] rounded-2xl p-6 shadow-[var(--shadow-lg)]',
          'animate-[scaleIn_150ms_ease]',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
