import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, children, className }: BottomSheetProps) {
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
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-[var(--color-overlay)] animate-[fadeIn_150ms_ease]" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 w-full max-w-[430px] bg-[var(--color-bg-secondary)] rounded-t-2xl',
          'pb-[env(safe-area-inset-bottom)] animate-[slideUp_200ms_ease]',
          className,
        )}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--color-border)]" />
        </div>
        <div className="px-5 pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}
