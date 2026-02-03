import { QR_TYPES } from './qr-types';
import type { QRCodeType, QRCodeTypeData } from './qr-types';

type FormLikeData = Partial<Record<string, unknown>> | QRCodeTypeData;

export function canGenerateQRCode(type: QRCodeType, data: FormLikeData | null | undefined): boolean {
  if (!data) return false;

  const typeConfig = QR_TYPES.find(config => config.type === type);
  if (!typeConfig) return false;

  return typeConfig.fields
    .filter(field => field.required)
    .every(field => {
      const rawValue = (data as Record<string, unknown>)[field.key];
      if (typeof rawValue === 'number') return !Number.isNaN(rawValue);
      if (rawValue === null || rawValue === undefined) return false;
      return String(rawValue).trim().length > 0;
    });
}

export function getMissingFields(type: QRCodeType, data: FormLikeData | null | undefined): string[] {
  if (!data) {
    const typeConfig = QR_TYPES.find(config => config.type === type);
    return typeConfig?.fields.filter(f => f.required).map(f => f.label) ?? [];
  }

  const typeConfig = QR_TYPES.find(config => config.type === type);
  if (!typeConfig) return [];

  return typeConfig.fields
    .filter(field => field.required)
    .filter(field => {
      const rawValue = (data as Record<string, unknown>)[field.key];
      if (rawValue === null || rawValue === undefined) return true;
      return String(rawValue).trim().length === 0;
    })
    .map(field => field.label);
}
