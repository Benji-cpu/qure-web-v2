import { useSyncExternalStore } from 'react';
import { isPremium } from '@/storage/license';
import { subscribe } from '@/lib/storage-events';
import { STORAGE_KEYS } from '@/lib/constants';

let cachedRaw: string | null = undefined as unknown as string | null;
let cachedResult = false;

function getSnapshot(): boolean {
  const raw = localStorage.getItem(STORAGE_KEYS.LICENSE);
  if (raw === cachedRaw) return cachedResult;
  cachedRaw = raw;
  cachedResult = isPremium();
  return cachedResult;
}

function subscribeLicense(callback: () => void): () => void {
  return subscribe(STORAGE_KEYS.LICENSE, callback);
}

export function usePremium(): boolean {
  return useSyncExternalStore(subscribeLicense, getSnapshot, () => false);
}
