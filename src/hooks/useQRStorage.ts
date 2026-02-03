import { useSyncExternalStore } from 'react';
import { getAllQRCodes } from '@/storage/qr-storage';
import { subscribe } from '@/lib/storage-events';
import { STORAGE_KEYS } from '@/lib/constants';
import type { QRCodeData } from '@/domain/qr-types';

function subscribeQR(callback: () => void): () => void {
  return subscribe(STORAGE_KEYS.QR_CODES, callback);
}

function getSnapshot(): QRCodeData[] {
  return getAllQRCodes();
}

export function useQRStorage(): QRCodeData[] {
  return useSyncExternalStore(subscribeQR, getSnapshot, () => []);
}
