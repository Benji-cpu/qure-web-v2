import { useNavigate } from 'react-router-dom';
import { usePremium } from '@/hooks/usePremium';
import { FeatureList } from '@/components/premium/FeatureList';
import { PricingCard } from '@/components/premium/PricingCard';
import { useEffect } from 'react';

export function Premium() {
  const isPremiumUser = usePremium();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPremiumUser) navigate('/', { replace: true });
  }, [isPremiumUser, navigate]);

  const handlePurchase = async () => {
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'tier1' }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--color-bg-primary)]">
      <div className="px-4 pt-[env(safe-area-inset-top)] mt-3 pb-4 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Premium</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Unlock all features with a one-time purchase.
          </p>
        </div>

        <FeatureList />
        <PricingCard onPurchase={handlePurchase} />
      </div>
    </div>
  );
}
