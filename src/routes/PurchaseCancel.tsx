import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function PurchaseCancel() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[var(--color-bg-primary)] p-4">
      <div className="text-4xl">😔</div>
      <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Purchase Cancelled</h1>
      <p className="text-sm text-[var(--color-text-secondary)] text-center">
        No worries! You can try again anytime.
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => navigate('/', { replace: true })}>
          Go Home
        </Button>
        <Button onClick={() => navigate('/premium', { replace: true })}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
