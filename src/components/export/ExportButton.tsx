import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { usePremium } from '@/hooks/usePremium';
import { usePreferences } from '@/hooks/usePreferences';
import { getQRCodeById } from '@/storage/qr-storage';
import { DEFAULT_QURE_QR } from '@/domain/qr-types';
import { GRADIENT_PRESETS } from '@/domain/gradients';
import type { DevicePreset } from '@/render/device-presets';
import { renderWallpaper, downloadBlob, generateFilename } from '@/render/wallpaper-renderer';
import type { GradientPreset } from '@/domain/gradients';

interface ExportButtonProps {
  device: DevicePreset;
}

export function ExportButton({ device }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const isPremiumUser = usePremium();
  const prefs = usePreferences();

  const handleExport = async () => {
    setLoading(true);
    try {
      const primaryQR = prefs.primaryQRId ? getQRCodeById(prefs.primaryQRId) : null;
      const secondaryQR = prefs.secondaryQRId ? getQRCodeById(prefs.secondaryQRId) : DEFAULT_QURE_QR;
      const singleMode = prefs.qrSlotMode === 'single';

      let gradient: GradientPreset = GRADIENT_PRESETS.find((g) => g.id === prefs.gradientId) ?? GRADIENT_PRESETS[0]!;
      if (prefs.gradientId === 'custom' && prefs.customGradient) {
        gradient = {
          id: 'custom',
          name: 'Custom',
          colors: [prefs.customGradient.color1, prefs.customGradient.color2],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
      }

      let backgroundImageEl: HTMLImageElement | null = null;
      if (prefs.backgroundType === 'image' && prefs.backgroundImage) {
        backgroundImageEl = await new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = prefs.backgroundImage!;
        });
      }

      const xPos = singleMode ? prefs.singleQRXPosition : prefs.qrXPosition;
      const yPos = singleMode ? prefs.singleQRYPosition : prefs.qrYPosition;
      const scale = singleMode ? prefs.singleQRScale : prefs.qrScale;

      const blob = await renderWallpaper({
        preset: device,
        gradient,
        primaryQR,
        secondaryQR: singleMode ? null : secondaryQR,
        xPosition: xPos,
        yPosition: yPos,
        scale,
        singleMode,
        backgroundImage: backgroundImageEl,
        showWatermark: !isPremiumUser,
      });

      downloadBlob(blob, generateFilename(device));
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="w-full" loading={loading} onClick={handleExport}>
      {isPremiumUser ? 'Export Wallpaper' : 'Export (with watermark)'}
    </Button>
  );
}
