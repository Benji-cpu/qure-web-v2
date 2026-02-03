import { useNavigate } from 'react-router-dom';
import { usePreferences } from '@/hooks/usePreferences';
import { useQRStorage } from '@/hooks/useQRStorage';
import { usePremium } from '@/hooks/usePremium';
import { getQRCodeById } from '@/storage/qr-storage';
import { DEFAULT_QURE_QR } from '@/domain/qr-types';
import { QRSlotDisplay } from './QRSlotDisplay';
import { useState } from 'react';
import { PremiumUpsellSheet } from './PremiumUpsellSheet';

interface QRSlotsProps {
  xPosition: number;
  yPosition: number;
  scale: number;
}

export function QRSlots({ xPosition, yPosition, scale }: QRSlotsProps) {
  const prefs = usePreferences();
  const isPremiumUser = usePremium();
  const navigate = useNavigate();
  const [showUpsell, setShowUpsell] = useState(false);

  // Force re-read when QR storage changes
  useQRStorage();

  const singleMode = prefs.qrSlotMode === 'single';
  const primaryQR = prefs.primaryQRId ? getQRCodeById(prefs.primaryQRId) : null;
  const secondaryQR = (prefs.secondaryQRId ? getQRCodeById(prefs.secondaryQRId) : null) ?? DEFAULT_QURE_QR;

  // Calculate sizes relative to viewport
  const baseSize = singleMode ? 140 : 110;
  const qrSize = Math.round(baseSize * scale);
  const gap = qrSize * 0.15;

  // Positions: xPosition 0-100 (50=center), yPosition 0-100 (0=bottom, 100=top)
  const maxHorizOffset = 40; // px
  const horizOffset = ((xPosition - 50) / 50) * maxHorizOffset;

  // Vertical: 0=near bottom, 100=near top of lower half
  const bottomPercent = 18 + (yPosition / 100) * 40; // 18%-58% from bottom

  const handlePrimaryClick = () => {
    if (primaryQR) {
      navigate(`/qr/${primaryQR.id}`);
    } else {
      navigate('/qr/new?slot=primary');
    }
  };

  const handleSecondaryClick = () => {
    if (!isPremiumUser) {
      setShowUpsell(true);
      return;
    }
    if (secondaryQR && secondaryQR.id !== DEFAULT_QURE_QR.id) {
      navigate(`/qr/${secondaryQR.id}`);
    } else {
      navigate('/qr/new?slot=secondary');
    }
  };

  if (!primaryQR && !secondaryQR) return null;

  return (
    <>
      <div
        className="absolute flex items-center pointer-events-auto z-10"
        style={{
          bottom: `${bottomPercent}%`,
          left: '50%',
          transform: `translateX(calc(-50% + ${horizOffset}px))`,
          gap: `${gap}px`,
        }}
      >
        {primaryQR && (
          <QRSlotDisplay
            qr={primaryQR}
            size={qrSize}
            onClick={handlePrimaryClick}
          />
        )}
        {!singleMode && secondaryQR && (
          <QRSlotDisplay
            qr={secondaryQR}
            size={qrSize}
            onClick={handleSecondaryClick}
          />
        )}
      </div>
      <PremiumUpsellSheet open={showUpsell} onClose={() => setShowUpsell(false)} />
    </>
  );
}
