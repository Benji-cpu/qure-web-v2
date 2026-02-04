import { useState } from 'react';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { Button } from '@/components/ui/Button';

interface CustomGradientEditorProps {
  initialColor1?: string;
  initialColor2?: string;
  onSave: (color1: string, color2: string) => void;
  onCancel: () => void;
}

export function CustomGradientEditor({ initialColor1 = '#0f2027', initialColor2 = '#2c5364', onSave, onCancel }: CustomGradientEditorProps) {
  const [color1, setColor1] = useState(initialColor1);
  const [color2, setColor2] = useState(initialColor2);

  return (
    <div className="flex flex-col gap-4">
      {/* Preview */}
      <div
        className="w-full h-24 rounded-xl border border-[var(--color-glass-border)]"
        style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
      />

      <div>
        <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Color 1</h4>
        <ColorPicker value={color1} onChange={setColor1} />
      </div>

      <div>
        <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Color 2</h4>
        <ColorPicker value={color2} onChange={setColor2} />
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1" onClick={() => onSave(color1, color2)}>Save</Button>
      </div>
    </div>
  );
}
