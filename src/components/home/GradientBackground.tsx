import { useMemo } from 'react';
import type { GradientPreset } from '@/domain/gradients';
import { cn } from '@/lib/cn';

interface GradientBackgroundProps {
  gradient: GradientPreset;
  backgroundImage?: string | null;
  className?: string;
  opacity?: number;
}

export function GradientBackground({ gradient, backgroundImage, className, opacity = 1 }: GradientBackgroundProps) {
  const style = useMemo(() => {
    if (backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity,
      };
    }

    const { colors, start, end } = gradient;
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) + 90;
    const stops = colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`).join(', ');

    return {
      background: `linear-gradient(${angle}deg, ${stops})`,
      opacity,
    };
  }, [gradient, backgroundImage, opacity]);

  return (
    <div
      className={cn('absolute inset-0 transition-opacity duration-500', className)}
      style={style}
    />
  );
}
