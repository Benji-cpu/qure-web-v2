import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="w-full h-[100dvh] max-w-[430px] mx-auto flex flex-col overflow-hidden relative bg-[var(--color-bg-primary)] desktop-shell">
      {children}
    </div>
  );
}
