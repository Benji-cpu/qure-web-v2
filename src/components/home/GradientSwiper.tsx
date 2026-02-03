import { useRef, useCallback, useState } from 'react';
import { GRADIENT_PRESETS } from '@/domain/gradients';
import { GradientBackground } from './GradientBackground';
import type { GradientPreset } from '@/domain/gradients';

interface GradientSwiperProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
  customGradient?: GradientPreset | null;
  backgroundImage?: string | null;
}

export function GradientSwiper({ currentIndex, onIndexChange, customGradient, backgroundImage }: GradientSwiperProps) {
  const startX = useRef(0);
  const [swipeDelta, setSwipeDelta] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const allGradients = customGradient ? [...GRADIENT_PRESETS, customGradient] : GRADIENT_PRESETS;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0]!.clientX;
    setSwipeDelta(0);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = e.touches[0]!.clientX - startX.current;
    setSwipeDelta(delta);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const threshold = 50;
    if (Math.abs(swipeDelta) > threshold && !backgroundImage) {
      setTransitioning(true);
      if (swipeDelta < 0 && currentIndex < allGradients.length - 1) {
        onIndexChange(currentIndex + 1);
      } else if (swipeDelta > 0 && currentIndex > 0) {
        onIndexChange(currentIndex - 1);
      }
      setTimeout(() => setTransitioning(false), 500);
    }
    setSwipeDelta(0);
  }, [swipeDelta, currentIndex, allGradients.length, onIndexChange, backgroundImage]);

  const currentGradient = allGradients[currentIndex] ?? allGradients[0]!;

  return (
    <div
      className="absolute inset-0 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Current gradient */}
      <GradientBackground
        gradient={currentGradient}
        backgroundImage={backgroundImage}
        opacity={transitioning ? 0 : 1}
      />

      {/* Next/prev gradient for crossfade */}
      {transitioning && (
        <GradientBackground
          gradient={currentGradient}
          backgroundImage={backgroundImage}
          className="animate-[fadeIn_500ms_ease]"
        />
      )}
    </div>
  );
}
