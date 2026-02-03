import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';

interface PremiumUpsellSheetProps {
  open: boolean;
  onClose: () => void;
}

export function PremiumUpsellSheet({ open, onClose }: PremiumUpsellSheetProps) {
  const navigate = useNavigate();

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-4 pt-2">
        <div className="text-4xl">⭐</div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Upgrade to customize this slot</h2>
        <p className="text-sm text-[var(--color-text-secondary)] text-center">
          Unlock the secondary QR code slot and customize it with your own content.
        </p>
        <Button
          className="w-full"
          onClick={() => {
            onClose();
            navigate('/premium');
          }}
        >
          Upgrade
        </Button>
        <button className="text-sm text-[var(--color-text-tertiary)]" onClick={onClose}>
          Maybe later
        </button>
      </div>
    </BottomSheet>
  );
}
