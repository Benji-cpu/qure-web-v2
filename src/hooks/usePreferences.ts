import { useSyncExternalStore } from 'react';
import { getPreferences } from '@/storage/preferences';
import { subscribe } from '@/lib/storage-events';
import { STORAGE_KEYS } from '@/lib/constants';
import type { UserPreferences } from '@/storage/preferences';

let cachedRaw: string | null = undefined as unknown as string | null;
let cachedResult: UserPreferences = getPreferences();

function getSnapshot(): UserPreferences {
  const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  if (raw === cachedRaw) return cachedResult;
  cachedRaw = raw;
  cachedResult = getPreferences();
  return cachedResult;
}

function subscribePref(callback: () => void): () => void {
  return subscribe(STORAGE_KEYS.PREFERENCES, callback);
}

export function usePreferences(): UserPreferences {
  return useSyncExternalStore(subscribePref, getSnapshot, getSnapshot);
}
