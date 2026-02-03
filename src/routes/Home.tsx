import { useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { usePreferences } from '@/hooks/usePreferences';
import { useOnboarding } from '@/hooks/useOnboarding';
import { GRADIENT_PRESETS } from '@/domain/gradients';
import { savePreferences } from '@/storage/preferences';
import { GradientSwiper } from '@/components/home/GradientSwiper';
import { GradientDots } from '@/components/home/GradientDots';
import { QRSlots } from '@/components/home/QRSlots';
import { ControlsOverlay } from '@/components/home/ControlsOverlay';
import { IconButton } from '@/components/ui/IconButton';
import type { GradientPreset } from '@/domain/gradients';

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="16" y2="6" />
    <line x1="4" y1="10" x2="16" y2="10" />
    <line x1="4" y1="14" x2="16" y2="14" />
    <circle cx="7" cy="6" r="1.5" fill="currentColor" />
    <circle cx="13" cy="10" r="1.5" fill="currentColor" />
    <circle cx="9" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

export function Home() {
  const prefs = usePreferences();
  const { needsOnboarding } = useOnboarding();
  const [showControls, setShowControls] = useState(false);

  if (needsOnboarding) {
    return <Navigate to="/qr/new?slot=primary&onboarding=true" replace />;
  }

  const gradientIndex = GRADIENT_PRESETS.findIndex((g) => g.id === prefs.gradientId);
  const currentIndex = gradientIndex >= 0 ? gradientIndex : 0;

  const customGradient: GradientPreset | null = prefs.customGradient
    ? {
        id: 'custom',
        name: 'Custom',
        colors: [prefs.customGradient.color1, prefs.customGradient.color2],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }
    : null;

  const allGradients = customGradient ? [...GRADIENT_PRESETS, customGradient] : GRADIENT_PRESETS;
  const totalDots = allGradients.length;
  const activeIndex = prefs.gradientId === 'custom' ? allGradients.length - 1 : currentIndex;

  const bgImage = prefs.backgroundType === 'image' ? prefs.backgroundImage : null;

  const singleMode = prefs.qrSlotMode === 'single';
  const xPos = singleMode ? prefs.singleQRXPosition : prefs.qrXPosition;
  const yPos = singleMode ? prefs.singleQRYPosition : prefs.qrYPosition;
  const scale = singleMode ? prefs.singleQRScale : prefs.qrScale;

  const handleIndexChange = useCallback(
    (index: number) => {
      const gradient = allGradients[index];
      if (gradient) {
        savePreferences({ gradientId: gradient.id, backgroundType: 'gradient', backgroundImage: null });
      }
    },
    [allGradients],
  );

  const handleXChange = useCallback(
    (v: number) => {
      if (singleMode) savePreferences({ singleQRXPosition: v });
      else savePreferences({ qrXPosition: v });
    },
    [singleMode],
  );

  const handleYChange = useCallback(
    (v: number) => {
      if (singleMode) savePreferences({ singleQRYPosition: v });
      else savePreferences({ qrYPosition: v });
    },
    [singleMode],
  );

  const handleScaleChange = useCallback(
    (v: number) => {
      if (singleMode) savePreferences({ singleQRScale: v });
      else savePreferences({ qrScale: v });
    },
    [singleMode],
  );

  const handleSlotModeChange = useCallback((v: 'single' | 'double') => {
    savePreferences({ qrSlotMode: v });
  }, []);

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Gradient background with swipe */}
      <GradientSwiper
        currentIndex={activeIndex}
        onIndexChange={handleIndexChange}
        customGradient={customGradient}
        backgroundImage={bgImage}
      />

      {/* Dot indicators */}
      {!bgImage && (
        <GradientDots
          total={totalDots}
          current={activeIndex}
          className="absolute top-[env(safe-area-inset-top)] mt-3 left-0 right-0 z-10"
        />
      )}

      {/* Settings button */}
      <IconButton
        className="absolute top-[env(safe-area-inset-top)] mt-3 right-3 z-10"
        onClick={() => setShowControls(!showControls)}
      >
        <SettingsIcon />
      </IconButton>

      {/* QR code slots */}
      <QRSlots xPosition={xPos} yPosition={yPos} scale={scale} />

      {/* Controls overlay */}
      <ControlsOverlay
        visible={showControls}
        xPosition={xPos}
        yPosition={yPos}
        scale={scale}
        slotMode={prefs.qrSlotMode}
        onXChange={handleXChange}
        onYChange={handleYChange}
        onScaleChange={handleScaleChange}
        onSlotModeChange={handleSlotModeChange}
        onClose={() => setShowControls(false)}
      />
    </div>
  );
}
