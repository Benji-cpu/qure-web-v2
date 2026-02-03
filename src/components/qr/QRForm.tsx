import { QR_TYPES } from '@/domain/qr-types';
import type { QRCodeType } from '@/domain/qr-types';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface QRFormProps {
  type: QRCodeType;
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export function QRForm({ type, data, onChange }: QRFormProps) {
  const config = QR_TYPES.find((c) => c.type === type);
  if (!config) return null;

  const handleFieldChange = (key: string, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="flex flex-col gap-3">
      {config.fields.map((field) => {
        if (field.type === 'textarea') {
          return (
            <Textarea
              key={field.key}
              label={field.label + (field.required ? '' : ' (Optional)')}
              placeholder={field.placeholder}
              value={data[field.key] ?? ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
            />
          );
        }

        if (field.type === 'select' && field.options) {
          return (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                {field.label}
              </label>
              <select
                className="h-11 px-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] outline-none"
                value={data[field.key] ?? field.options[0]?.value ?? ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          );
        }

        return (
          <Input
            key={field.key}
            label={field.label + (field.required ? '' : ' (Optional)')}
            placeholder={field.placeholder}
            type={field.type || 'text'}
            value={data[field.key] ?? ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        );
      })}
    </div>
  );
}
