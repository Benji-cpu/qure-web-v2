import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQRCodeById, saveQRCode, deleteQRCode } from '@/storage/qr-storage';
import { getPreferences, setPrimaryQR, setSecondaryQR } from '@/storage/preferences';
import { generateContent } from '@/domain/qr-generator';
import { canGenerateQRCode } from '@/domain/qr-validation';
import type { QRCodeTypeData } from '@/domain/qr-types';
import { PageHeader } from '@/components/layout/PageHeader';
import { QRForm } from '@/components/qr/QRForm';
import { QRColorSection } from '@/components/qr/QRColorSection';
import { QRCodePreview } from '@/components/qr/QRCodePreview';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { QR_TYPES } from '@/domain/qr-types';

export function QREdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qr = id ? getQRCodeById(id) : null;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBg, setQrBg] = useState('#FFFFFF');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (qr) {
      setFormData(qr.data as unknown as Record<string, string>);
      setQrColor(qr.design?.color ?? '#000000');
      setQrBg(qr.design?.backgroundColor ?? '#FFFFFF');
    }
  }, [qr?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!qr) {
    return (
      <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
        <PageHeader title="QR Code Not Found" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--color-text-secondary)]">QR code not found.</p>
        </div>
      </div>
    );
  }

  const typeConfig = QR_TYPES.find((c) => c.type === qr.type);
  const canSave = canGenerateQRCode(qr.type, formData);

  const previewContent = useMemo(() => {
    if (!canSave) return qr.content;
    try { return generateContent(qr.type, formData as unknown as QRCodeTypeData); } catch { return qr.content; }
  }, [qr.type, qr.content, formData, canSave]);

  const handleSave = () => {
    if (!canSave) return;
    saveQRCode(qr.type, formData as unknown as QRCodeTypeData, { color: qrColor, backgroundColor: qrBg }, qr.id);
    navigate(-1);
  };

  const handleDelete = () => {
    // Clear slot references
    const prefs = getPreferences();
    if (prefs.primaryQRId === qr.id) setPrimaryQR(null);
    if (prefs.secondaryQRId === qr.id) setSecondaryQR(null);
    deleteQRCode(qr.id);
    navigate('/', { replace: true });
  };

  const handleOpenLink = () => {
    if (previewContent) {
      window.open(previewContent, '_blank', 'noopener');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)]">
      <PageHeader title="Edit QR Code" />

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="flex flex-col gap-5 pt-3">
          {/* Type indicator (locked) */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeConfig?.icon}</span>
            <span className="text-base font-semibold text-[var(--color-text-primary)]">{typeConfig?.title}</span>
            <Badge>Locked</Badge>
          </div>

          {/* Form */}
          <QRForm type={qr.type} data={formData} onChange={setFormData} />

          {/* Color customization */}
          <QRColorSection
            color={qrColor}
            backgroundColor={qrBg}
            onColorChange={setQrColor}
            onBackgroundColorChange={setQrBg}
          />

          {/* Preview */}
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Preview</h3>
            <QRCodePreview content={previewContent} size={140} color={qrColor} backgroundColor={qrBg} />
          </div>

          {/* Open Link button */}
          <Button variant="secondary" onClick={handleOpenLink}>
            Open Link
          </Button>

          {/* Delete button */}
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Delete QR Code
          </Button>
        </div>
      </div>

      {/* Save button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-t border-[var(--color-border)]">
        <Button className="w-full" disabled={!canSave} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      {/* Delete confirmation modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Delete QR Code?</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            This action cannot be undone. The QR code will be permanently removed.
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
