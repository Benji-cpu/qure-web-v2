import { useEffect, useState } from 'react';
import { GRADIENT_PRESETS } from '@/domain/gradients';
import type { GradientPreset } from '@/domain/gradients';
import { usePreferences } from '@/hooks/usePreferences';
import { useQRStorage } from '@/hooks/useQRStorage';
import { getQRCodeById } from '@/storage/qr-storage';
import { DEFAULT_QURE_QR } from '@/domain/qr-types';
import { QRCodePreview } from '@/components/qr/QRCodePreview';

interface LockScreenPreviewProps {
  className?: string;
}

function useCurrentTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function LockScreenPreview({ className }: LockScreenPreviewProps) {
  const time = useCurrentTime();
  const prefs = usePreferences();
  useQRStorage();

  const primaryQR = prefs.primaryQRId ? getQRCodeById(prefs.primaryQRId) : null;
  const secondaryQR = prefs.secondaryQRId ? getQRCodeById(prefs.secondaryQRId) : DEFAULT_QURE_QR;
  const singleMode = prefs.qrSlotMode === 'single';

  const gradient: GradientPreset = GRADIENT_PRESETS.find((g) => g.id === prefs.gradientId) ?? GRADIENT_PRESETS[0]!;
  const bgImage = prefs.backgroundType === 'image' ? prefs.backgroundImage : null;

  const timeStr = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
  const dateStr = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  // Gradient CSS
  const angle = Math.atan2(gradient.end.y - gradient.start.y, gradient.end.x - gradient.start.x) * (180 / Math.PI) + 90;
  const stops = gradient.colors.map((c, i) => `${c} ${(i / (gradient.colors.length - 1)) * 100}%`).join(', ');
  const bgStyle = bgImage
    ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: `linear-gradient(${angle}deg, ${stops})` };

  const qrSize = singleMode ? 52 : 40;

  return (
    <div
      className={`relative w-full aspect-[9/19.5] rounded-[2rem] overflow-hidden border-4 border-[var(--color-border)] shadow-[var(--shadow-lg)] ${className ?? ''}`}
      style={bgStyle}
    >
      {/* Status bar area */}
      <div className="flex justify-center pt-3">
        <div className="w-24 h-6 bg-black rounded-full" />
      </div>

      {/* Time */}
      <div className="flex flex-col items-center mt-8">
        <span className="text-[48px] leading-none font-thin text-white tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {timeStr}
        </span>
        <span className="text-xs text-white/80 mt-1">{dateStr}</span>
      </div>

      {/* QR codes positioned in lower portion */}
      <div className="absolute left-0 right-0 flex justify-center gap-2" style={{ bottom: '18%' }}>
        {primaryQR && (
          <QRCodePreview
            content={primaryQR.content}
            size={qrSize}
            color={primaryQR.design?.color}
            backgroundColor={primaryQR.design?.backgroundColor}
          />
        )}
        {!singleMode && secondaryQR && (
          <QRCodePreview
            content={secondaryQR.content}
            size={qrSize}
            color={secondaryQR.design?.color}
            backgroundColor={secondaryQR.design?.backgroundColor}
          />
        )}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <div className="w-28 h-1 bg-white/40 rounded-full" />
      </div>
    </div>
  );
}
