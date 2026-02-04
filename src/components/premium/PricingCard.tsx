import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { PREMIUM_PRICE, PREMIUM_PRICE_DESCRIPTION } from '@/lib/constants';

interface PricingCardProps {
  onPurchase: () => Promise<void>;
}

export function PricingCard({ onPurchase }: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onPurchase();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-[var(--color-glass-card)] backdrop-blur-xl rounded-2xl border border-[var(--color-glass-border)]">
      <div className="text-4xl">⭐</div>
      <div className="text-center">
        <div className="text-3xl font-bold text-[var(--color-text-primary)]">{PREMIUM_PRICE}</div>
        <div className="text-sm text-[var(--color-text-secondary)]">{PREMIUM_PRICE_DESCRIPTION}</div>
      </div>
      <Button className="w-full" loading={loading} onClick={handleClick}>
        Unlock Premium
      </Button>
    </div>
  );
}
