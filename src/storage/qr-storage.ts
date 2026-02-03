import type { QRCodeData, QRCodeType, QRCodeTypeData } from '@/domain/qr-types';
import { generateContent, generateLabel } from '@/domain/qr-generator';
import { STORAGE_KEYS } from '@/lib/constants';
import { notify } from '@/lib/storage-events';

function generateId(): string {
  return `qr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function getAllQRCodes(): QRCodeData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.QR_CODES);
    if (!stored) return [];
    return JSON.parse(stored) as QRCodeData[];
  } catch {
    return [];
  }
}

export function getQRCodeById(id: string): QRCodeData | null {
  const codes = getAllQRCodes();
  return codes.find(qr => qr.id === id) ?? null;
}

export function saveQRCode(
  type: QRCodeType,
  data: QRCodeTypeData,
  design?: QRCodeData['design'],
  existingId?: string,
): QRCodeData {
  const codes = getAllQRCodes();
  const content = generateContent(type, data);
  const label = generateLabel(type, data);

  if (existingId) {
    const index = codes.findIndex(qr => qr.id === existingId);
    if (index >= 0) {
      const updated: QRCodeData = { ...codes[index]!, type, data, content, label, design: design ?? codes[index]!.design };
      codes[index] = updated;
      localStorage.setItem(STORAGE_KEYS.QR_CODES, JSON.stringify(codes));
      notify(STORAGE_KEYS.QR_CODES);
      return updated;
    }
  }

  const newQR: QRCodeData = {
    id: generateId(),
    type,
    data,
    content,
    label,
    createdAt: new Date().toISOString(),
    design,
  };
  codes.push(newQR);
  localStorage.setItem(STORAGE_KEYS.QR_CODES, JSON.stringify(codes));
  notify(STORAGE_KEYS.QR_CODES);
  return newQR;
}

export function deleteQRCode(id: string): boolean {
  const codes = getAllQRCodes();
  const filtered = codes.filter(qr => qr.id !== id);
  if (filtered.length === codes.length) return false;
  localStorage.setItem(STORAGE_KEYS.QR_CODES, JSON.stringify(filtered));
  notify(STORAGE_KEYS.QR_CODES);
  return true;
}

export function updateQRCodeDesign(id: string, design: QRCodeData['design']): QRCodeData | null {
  const codes = getAllQRCodes();
  const index = codes.findIndex(qr => qr.id === id);
  if (index < 0) return null;
  codes[index] = { ...codes[index]!, design };
  localStorage.setItem(STORAGE_KEYS.QR_CODES, JSON.stringify(codes));
  notify(STORAGE_KEYS.QR_CODES);
  return codes[index]!;
}
