import { QR_TYPES } from '@/domain/qr-types';
import type { QRCodeType } from '@/domain/qr-types';
import { QRTypeCard } from './QRTypeCard';

interface QRTypeSelectorProps {
  value: QRCodeType | null;
  onChange: (type: QRCodeType) => void;
}

export function QRTypeSelector({ value, onChange }: QRTypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {QR_TYPES.map((config) => (
        <QRTypeCard
          key={config.type}
          config={config}
          selected={value === config.type}
          onClick={() => onChange(config.type)}
        />
      ))}
    </div>
  );
}
