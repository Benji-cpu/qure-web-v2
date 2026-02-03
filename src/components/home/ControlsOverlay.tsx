import { Slider } from '@/components/ui/Slider';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Badge } from '@/components/ui/Badge';
import { usePremium } from '@/hooks/usePremium';
import { cn } from '@/lib/cn';

interface ControlsOverlayProps {
  visible: boolean;
  xPosition: number;
  yPosition: number;
  scale: number;
  slotMode: 'single' | 'double';
  onXChange: (v: number) => void;
  onYChange: (v: number) => void;
  onScaleChange: (v: number) => void;
  onSlotModeChange: (v: 'single' | 'double') => void;
  onClose: () => void;
}

export function ControlsOverlay({
  visible,
  xPosition,
  yPosition,
  scale,
  slotMode,
  onXChange,
  onYChange,
  onScaleChange,
  onSlotModeChange,
  onClose,
}: ControlsOverlayProps) {
  const isPremiumUser = usePremium();

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 z-20" onClick={onClose} />

      {/* Panel */}
      <div
        className={cn(
          'absolute left-3 right-3 bottom-16 z-30',
          'bg-[var(--color-glass)] backdrop-blur-2xl rounded-2xl p-4 border border-[var(--color-glass-border)]',
          'shadow-[var(--shadow-lg)] animate-[fadeIn_150ms_ease]',
        )}
      >
        <div className="flex flex-col gap-3">
          <Slider
            label="X Position"
            min={0}
            max={100}
            value={xPosition}
            onChange={(e) => onXChange(Number((e.target as HTMLInputElement).value))}
          />
          <Slider
            label="Y Position"
            min={0}
            max={100}
            value={yPosition}
            onChange={(e) => onYChange(Number((e.target as HTMLInputElement).value))}
          />
          <Slider
            label="Size"
            min={30}
            max={150}
            value={Math.round(scale * 100)}
            onChange={(e) => onScaleChange(Number((e.target as HTMLInputElement).value) / 100)}
          />
          <div className="flex items-center gap-2">
            <SegmentedControl
              options={[
                { value: 'double', label: 'Double' },
                { value: 'single', label: 'Single' },
              ]}
              value={slotMode}
              onChange={(v) => {
                if (v === 'single' && !isPremiumUser) return;
                onSlotModeChange(v as 'single' | 'double');
              }}
              className="flex-1"
            />
            {!isPremiumUser && <Badge variant="premium">PRO</Badge>}
          </div>
        </div>
      </div>
    </>
  );
}
