import { useSyncExternalStore } from 'react';
import { subscribe } from '@/lib/storage-events';
import { STORAGE_KEYS } from '@/lib/constants';
import type { QRCodeData } from '@/domain/qr-types';

let cachedRaw: string | null = null;
let cachedResult: QRCodeData[] = [];
const EMPTY: QRCodeData[] = [];

function getSnapshot(): QRCodeData[] {
  const raw = localStorage.getItem(STORAGE_KEYS.QR_CODES);
  if (raw === cachedRaw) return cachedResult;
  cachedRaw = raw;
  cachedResult = raw ? (JSON.parse(raw) as QRCodeData[]) : EMPTY;
  return cachedResult;
}

function subscribeQR(callback: () => void): () => void {
  return subscribe(STORAGE_KEYS.QR_CODES, callback);
}

export function useQRStorage(): QRCodeData[] {
  return useSyncExternalStore(subscribeQR, getSnapshot, () => EMPTY);
}
