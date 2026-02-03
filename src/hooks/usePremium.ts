import { useSyncExternalStore } from 'react';
import { isPremium } from '@/storage/license';
import { subscribe } from '@/lib/storage-events';
import { STORAGE_KEYS } from '@/lib/constants';

function subscribeLicense(callback: () => void): () => void {
  return subscribe(STORAGE_KEYS.LICENSE, callback);
}

function getSnapshot(): boolean {
  return isPremium();
}

export function usePremium(): boolean {
  return useSyncExternalStore(subscribeLicense, getSnapshot, () => false);
}
