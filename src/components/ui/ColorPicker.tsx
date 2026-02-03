import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/cn';

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ff3b30', '#ff9500',
  '#ffcc00', '#34c759', '#00c7be', '#30b0c7',
  '#0071e3', '#5856d6', '#af52de', '#ff2d55',
  '#a2845e', '#8e8e93', '#1c1c1e', '#f2f2f7',
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(100);
  const [bright, setBright] = useState(100);
  const areaRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Parse current value to HSB when entering custom mode
  useEffect(() => {
    if (showCustom) {
      const hsb = hexToHSB(value);
      setHue(hsb.h);
      setSat(hsb.s);
      setBright(hsb.b);
    }
  }, [showCustom, value]);

  const updateFromArea = useCallback((clientX: number, clientY: number) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    setSat(Math.round(x * 100));
    setBright(Math.round((1 - y) * 100));
    onChange(hsbToHex(hue, Math.round(x * 100), Math.round((1 - y) * 100)));
  }, [hue, onChange]);

  const onAreaPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromArea(e.clientX, e.clientY);
  }, [updateFromArea]);

  const onAreaPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromArea(e.clientX, e.clientY);
  }, [updateFromArea]);

  const onAreaPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Preset grid */}
      <div className="grid grid-cols-8 gap-1.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            className={cn(
              'w-full aspect-square rounded-lg border-2 transition-all duration-150',
              value.toLowerCase() === color.toLowerCase()
                ? 'border-[var(--color-accent)] scale-110'
                : 'border-transparent',
            )}
            style={{ backgroundColor: color }}
            onClick={() => { onChange(color); setShowCustom(false); }}
          />
        ))}
      </div>

      {/* Custom toggle */}
      <button
        className="text-sm font-medium text-[var(--color-accent)] text-left"
        onClick={() => setShowCustom(!showCustom)}
      >
        {showCustom ? 'Close picker' : 'Custom color...'}
      </button>

      {/* Full HSB picker */}
      {showCustom && (
        <div className="flex flex-col gap-2">
          {/* Saturation/Brightness area */}
          <div
            ref={areaRef}
            className="relative w-full h-32 rounded-lg cursor-crosshair touch-none"
            style={{
              background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`,
            }}
            onPointerDown={onAreaPointerDown}
            onPointerMove={onAreaPointerMove}
            onPointerUp={onAreaPointerUp}
          >
            <div
              className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
              style={{
                left: `${sat}%`,
                top: `${100 - bright}%`,
                backgroundColor: hsbToHex(hue, sat, bright),
              }}
            />
          </div>

          {/* Hue slider */}
          <input
            type="range"
            min={0}
            max={360}
            value={hue}
            onChange={(e) => {
              const h = Number(e.target.value);
              setHue(h);
              onChange(hsbToHex(h, sat, bright));
            }}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
            }}
          />

          {/* Current color preview */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border border-[var(--color-border)]" style={{ backgroundColor: value }} />
            <span className="text-sm text-[var(--color-text-secondary)] font-mono">{value.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function hexToHSB(hex: string): { h: number; s: number; b: number } {
  let r = 0, g = 0, b = 0;
  const h = hex.replace('#', '');
  if (h.length === 6) {
    r = parseInt(h.substring(0, 2), 16) / 255;
    g = parseInt(h.substring(2, 4), 16) / 255;
    b = parseInt(h.substring(4, 6), 16) / 255;
  }
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let hue = 0;
  if (d !== 0) {
    if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) hue = ((b - r) / d + 2) * 60;
    else hue = ((r - g) / d + 4) * 60;
  }
  const sat = max === 0 ? 0 : (d / max) * 100;
  const bright = max * 100;
  return { h: Math.round(hue), s: Math.round(sat), b: Math.round(bright) };
}

function hsbToHex(h: number, s: number, b: number): string {
  const sat = s / 100;
  const bright = b / 100;
  const c = bright * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = bright - c;
  let r = 0, g = 0, bl = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; bl = x; }
  else if (h < 240) { g = x; bl = c; }
  else if (h < 300) { r = x; bl = c; }
  else { r = c; bl = x; }
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}
