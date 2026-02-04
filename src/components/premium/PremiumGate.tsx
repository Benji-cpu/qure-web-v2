import { useNavigate } from 'react-router-dom';
import { usePremium } from '@/hooks/usePremium';
import { Button } from '@/components/ui/Button';
import type { ReactNode } from 'react';

interface PremiumGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function PremiumGate({ children, fallback }: PremiumGateProps) {
  const isPremiumUser = usePremium();
  const navigate = useNavigate();

  if (isPremiumUser) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-[var(--color-glass-card)] backdrop-blur-xl rounded-2xl border border-[var(--color-glass-border)]">
      <span className="text-2xl">⭐</span>
      <p className="text-sm text-[var(--color-text-secondary)] text-center">
        This feature is available with Premium.
      </p>
      <Button size="sm" onClick={() => navigate('/premium')}>Upgrade</Button>
    </div>
  );
}
