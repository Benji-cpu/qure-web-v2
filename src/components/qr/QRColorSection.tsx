import { ColorPicker } from '@/components/ui/ColorPicker';

interface QRColorSectionProps {
  color: string;
  backgroundColor: string;
  onColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
}

export function QRColorSection({ color, backgroundColor, onColorChange, onBackgroundColorChange }: QRColorSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">QR Color</h3>
        <ColorPicker value={color} onChange={onColorChange} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Background Color</h3>
        <ColorPicker value={backgroundColor} onChange={onBackgroundColorChange} />
      </div>
    </div>
  );
}
