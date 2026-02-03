import { DEVICE_PRESETS } from '@/render/device-presets';
import type { DevicePreset } from '@/render/device-presets';
import { cn } from '@/lib/cn';

interface DeviceSelectorProps {
  value: string;
  onChange: (preset: DevicePreset) => void;
}

export function DeviceSelector({ value, onChange }: DeviceSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {DEVICE_PRESETS.map((preset) => (
        <button
          key={preset.id}
          className={cn(
            'flex flex-col items-start px-3 py-2 rounded-xl border transition-all duration-150 text-left',
            value === preset.id
              ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]'
              : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-[var(--color-text-primary)]',
          )}
          onClick={() => onChange(preset)}
        >
          <span className="text-sm font-medium truncate w-full">{preset.name}</span>
          <span className="text-[10px] text-[var(--color-text-tertiary)]">{preset.width}×{preset.height}</span>
        </button>
      ))}
    </div>
  );
}
