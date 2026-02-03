import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface SafeAreaProps {
  children: ReactNode;
  className?: string;
}

export function SafeArea({ children, className }: SafeAreaProps) {
  return (
    <div
      className={cn(
        'pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
