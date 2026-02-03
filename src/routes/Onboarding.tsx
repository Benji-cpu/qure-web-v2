import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QR_TYPES, DEFAULT_QURE_QR } from '@/domain/qr-types';
import type { QRCodeType, QRCodeTypeData } from '@/domain/qr-types';
import { canGenerateQRCode } from '@/domain/qr-validation';
import { saveQRCode } from '@/storage/qr-storage';
import { setPrimaryQR, setSecondaryQR } from '@/storage/preferences';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const ONBOARDING_TYPES: QRCodeType[] = ['whatsapp', 'instagram', 'link', 'phone', 'email'];

export function Onboarding() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<QRCodeType>('whatsapp');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const typeConfig = QR_TYPES.find((c) => c.type === selectedType);
  const requiredFields = typeConfig?.fields.filter((f) => f.required) ?? [];

  const canSave = canGenerateQRCode(selectedType, formData);

  const handleTypeChange = (type: QRCodeType) => {
    setSelectedType(type);
    setFormData({});
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!canSave) return;

    const qr = saveQRCode(
      selectedType,
      formData as unknown as QRCodeTypeData,
      { color: '#000000', backgroundColor: '#FFFFFF' },
    );

    setPrimaryQR(qr.id);

    // Create default QuRe QR for secondary slot
    const defaultQR = saveQRCode('link', { url: DEFAULT_QURE_QR.content }, DEFAULT_QURE_QR.design);
    setSecondaryQR(defaultQR.id);

    navigate('/', { replace: true });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
      <div className="flex-1 overflow-y-auto px-6 pt-[env(safe-area-inset-top)] pb-28">
        <div className="flex flex-col gap-8 pt-12">
          {/* Section A — Welcome */}
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Mini phone mockup with QR silhouettes */}
            <div className="w-20 h-36 rounded-2xl border-2 border-[var(--color-border)] relative overflow-hidden bg-gradient-to-br from-[var(--color-accent)] to-[#6366f1] opacity-80">
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-5 h-5 rounded-sm bg-white/40" />
                <div className="w-5 h-5 rounded-sm bg-white/30" />
              </div>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-white/20" />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Welcome to QuRe
              </h1>
              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                Create QR code wallpapers for your lock screen.
              </p>
            </div>
          </div>

          {/* Section B — Quick setup form */}
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Let's create your first QR code
            </h2>

            {/* Type pills */}
            <div className="flex flex-wrap gap-2">
              {ONBOARDING_TYPES.map((type) => {
                const config = QR_TYPES.find((c) => c.type === type);
                if (!config) return null;
                const isSelected = selectedType === type;
                return (
                  <button
                    key={type}
                    className={`flex items-center gap-1.5 px-4 h-9 rounded-full text-sm font-medium transition-all duration-150 ${
                      isSelected
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                    }`}
                    onClick={() => handleTypeChange(type)}
                  >
                    <span>{config.icon}</span>
                    <span>{config.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Required fields only */}
            <div className="flex flex-col gap-3">
              {requiredFields.map((field) => {
                if (field.type === 'textarea') {
                  return (
                    <Textarea
                      key={field.key}
                      label={field.label}
                      placeholder={field.placeholder}
                      value={formData[field.key] ?? ''}
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
                        value={formData[field.key] ?? field.options[0]?.value ?? ''}
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
                    label={field.label}
                    placeholder={field.placeholder}
                    type={field.type || 'text'}
                    value={formData[field.key] ?? ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Section C — Sticky save button */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-t border-[var(--color-border)]">
        <Button className="w-full" size="lg" disabled={!canSave} onClick={handleSave}>
          Get Started
        </Button>
      </div>
    </div>
  );
}
