import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setLicenseToken } from '@/storage/license';
import { Spinner } from '@/components/ui/Spinner';

export function PurchaseSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('No session ID found');
      return;
    }

    fetch('/api/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          setLicenseToken(data.token);
          navigate('/', { replace: true });
        } else {
          setError(data.error || 'Verification failed');
        }
      })
      .catch(() => {
        setError('Failed to verify purchase');
      });
  }, [searchParams, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[var(--color-bg-primary)] p-4">
      {error ? (
        <>
          <p className="text-[var(--color-danger)] text-center">{error}</p>
          <button
            className="text-[var(--color-accent)]"
            onClick={() => navigate('/', { replace: true })}
          >
            Go home
          </button>
        </>
      ) : (
        <>
          <Spinner size="lg" />
          <p className="text-[var(--color-text-secondary)]">Verifying your purchase...</p>
        </>
      )}
    </div>
  );
}
