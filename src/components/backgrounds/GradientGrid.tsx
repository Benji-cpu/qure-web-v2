import { GRADIENT_PRESETS } from '@/domain/gradients';
import { usePremium } from '@/hooks/usePremium';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

interface GradientGridProps {
  selectedId: string;
  onSelect: (gradientId: string) => void;
  onCustomClick: () => void;
}

export function GradientGrid({ selectedId, onSelect, onCustomClick }: GradientGridProps) {
  const isPremiumUser = usePremium();

  return (
    <div className="grid grid-cols-3 gap-2">
      {GRADIENT_PRESETS.map((gradient) => {
        const angle = Math.atan2(gradient.end.y - gradient.start.y, gradient.end.x - gradient.start.x) * (180 / Math.PI) + 90;
        const stops = gradient.colors.map((c, i) => `${c} ${(i / (gradient.colors.length - 1)) * 100}%`).join(', ');
        const bg = `linear-gradient(${angle}deg, ${stops})`;

        return (
          <button
            key={gradient.id}
            className={cn(
              'aspect-[3/4] rounded-xl border-2 transition-all duration-150 active:scale-[0.95] relative overflow-hidden',
              selectedId === gradient.id
                ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30'
                : 'border-transparent',
            )}
            style={{ background: bg }}
            onClick={() => onSelect(gradient.id)}
          >
            <span className="absolute bottom-1 left-0 right-0 text-[10px] font-medium text-white/80 text-center drop-shadow-sm">
              {gradient.name}
            </span>
          </button>
        );
      })}

      {/* Custom gradient tile (9th) */}
      <button
        className={cn(
          'aspect-[3/4] rounded-xl border-2 transition-all duration-150 active:scale-[0.95] relative overflow-hidden',
          'bg-[var(--color-glass-card)] backdrop-blur-xl flex flex-col items-center justify-center gap-1',
          selectedId === 'custom'
            ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30'
            : 'border-[var(--color-glass-border)]',
        )}
        onClick={() => {
          if (isPremiumUser) onCustomClick();
        }}
      >
        <span className="text-xl">🎨</span>
        <span className="text-[10px] font-medium text-[var(--color-text-secondary)]">Custom</span>
        {!isPremiumUser && <Badge variant="premium" className="absolute top-1 right-1 text-[8px] px-1 py-0">PRO</Badge>}
      </button>
    </div>
  );
}
