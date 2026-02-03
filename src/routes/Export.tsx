import { useState } from 'react';
import { DEFAULT_DEVICE_PRESET } from '@/render/device-presets';
import type { DevicePreset } from '@/render/device-presets';
import { LockScreenPreview } from '@/components/export/LockScreenPreview';
import { DeviceSelector } from '@/components/export/DeviceSelector';
import { ExportButton } from '@/components/export/ExportButton';
import { usePremium } from '@/hooks/usePremium';

export function Export() {
  const [device, setDevice] = useState<DevicePreset>(DEFAULT_DEVICE_PRESET);
  const isPremiumUser = usePremium();

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--color-bg-primary)]">
      <div className="px-4 pt-[env(safe-area-inset-top)] mt-3 pb-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Export</h1>

        {/* Lock screen preview */}
        <div className="flex justify-center">
          <div className="w-48">
            <LockScreenPreview />
          </div>
        </div>

        {!isPremiumUser && (
          <p className="text-xs text-center text-[var(--color-text-tertiary)]">
            Free exports include a small "Made with QuRe" watermark
          </p>
        )}

        {/* Device selector */}
        <div>
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Device Size</h2>
          <DeviceSelector value={device.id} onChange={setDevice} />
        </div>

        {/* Export button */}
        <ExportButton device={device} />
      </div>
    </div>
  );
}
