import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QR_TYPES } from '@/domain/qr-types';
import type { QRCodeType, QRCodeTypeData } from '@/domain/qr-types';
import { generateContent } from '@/domain/qr-generator';
import { canGenerateQRCode } from '@/domain/qr-validation';
import { saveQRCode } from '@/storage/qr-storage';
import { setPrimaryQR, setSecondaryQR } from '@/storage/preferences';
import { PageHeader } from '@/components/layout/PageHeader';
import { QRTypeSelector } from '@/components/qr/QRTypeSelector';
import { QRForm } from '@/components/qr/QRForm';
import { QRColorSection } from '@/components/qr/QRColorSection';
import { QRCodePreview } from '@/components/qr/QRCodePreview';
import { Button } from '@/components/ui/Button';

export function QRCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slot = searchParams.get('slot') as 'primary' | 'secondary' | null;

  const [selectedType, setSelectedType] = useState<QRCodeType | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBg, setQrBg] = useState('#FFFFFF');

  // Initialize select fields with defaults when type changes
  const handleTypeChange = (type: QRCodeType) => {
    setSelectedType(type);
    const config = QR_TYPES.find((c) => c.type === type);
    const defaults: Record<string, string> = {};
    config?.fields.forEach((field) => {
      if (field.type === 'select' && field.options?.[0]) {
        defaults[field.key] = field.options[0].value;
      }
    });
    setFormData(defaults);
  };

  const canSave = selectedType ? canGenerateQRCode(selectedType, formData) : false;

  const previewContent = useMemo(() => {
    if (!selectedType || !canSave) return '';
    try {
      return generateContent(selectedType, formData as unknown as QRCodeTypeData);
    } catch {
      return '';
    }
  }, [selectedType, formData, canSave]);

  const handleSave = () => {
    if (!selectedType || !canSave) return;

    const qr = saveQRCode(
      selectedType,
      formData as unknown as QRCodeTypeData,
      { color: qrColor, backgroundColor: qrBg },
    );

    if (slot === 'primary') {
      setPrimaryQR(qr.id);
    } else if (slot === 'secondary') {
      setSecondaryQR(qr.id);
    }

    navigate('/', { replace: true });
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
      <PageHeader
        title="New QR Code"
        onBack={() => navigate(-1)}
      />

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        <div className="flex flex-col gap-6 pt-4">
          {/* Type selector */}
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Select Type</h2>
            <QRTypeSelector value={selectedType} onChange={handleTypeChange} />
          </div>

          {/* Form */}
          {selectedType && (
            <>
              <QRForm type={selectedType} data={formData} onChange={setFormData} />

              {/* Color customization */}
              <QRColorSection
                color={qrColor}
                backgroundColor={qrBg}
                onColorChange={setQrColor}
                onBackgroundColorChange={setQrBg}
              />

              {/* Live preview */}
              {previewContent && (
                <div className="flex flex-col items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Preview</h3>
                  <QRCodePreview
                    content={previewContent}
                    size={140}
                    color={qrColor}
                    backgroundColor={qrBg}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Save button */}
      {selectedType && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-t border-[var(--color-border)]">
          <Button className="w-full" disabled={!canSave} onClick={handleSave}>
            Save QR Code
          </Button>
        </div>
      )}
    </div>
  );
}
