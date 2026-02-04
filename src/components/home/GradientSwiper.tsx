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
  const [prevGradientIndex, setPrevGradientIndex] = useState<number | null>(null);

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
      if (swipeDelta < 0 && currentIndex < allGradients.length - 1) {
        setPrevGradientIndex(currentIndex);
        onIndexChange(currentIndex + 1);
        setTimeout(() => setPrevGradientIndex(null), 500);
      } else if (swipeDelta > 0 && currentIndex > 0) {
        setPrevGradientIndex(currentIndex);
        onIndexChange(currentIndex - 1);
        setTimeout(() => setPrevGradientIndex(null), 500);
      }
    }
    setSwipeDelta(0);
  }, [swipeDelta, currentIndex, allGradients.length, onIndexChange, backgroundImage]);

  const currentGradient = allGradients[currentIndex] ?? allGradients[0]!;
  const prevGradient = prevGradientIndex !== null ? allGradients[prevGradientIndex] : null;

  return (
    <div
      className="absolute inset-0 touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Previous gradient stays fully visible underneath during transition */}
      {prevGradient && (
        <GradientBackground
          gradient={prevGradient}
          backgroundImage={backgroundImage}
        />
      )}

      {/* Current gradient fades in on top */}
      <GradientBackground
        gradient={currentGradient}
        backgroundImage={backgroundImage}
        className={prevGradient ? 'animate-[fadeIn_500ms_ease]' : undefined}
      />
    </div>
  );
}
