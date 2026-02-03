import { useSyncExternalStore } from 'react';
import { getPreferences } from '@/storage/preferences';
import { subscribe } from '@/lib/storage-events';
import { STORAGE_KEYS } from '@/lib/constants';
import type { UserPreferences } from '@/storage/preferences';

function subscribePref(callback: () => void): () => void {
  return subscribe(STORAGE_KEYS.PREFERENCES, callback);
}

function getSnapshot(): UserPreferences {
  return getPreferences();
}

export function usePreferences(): UserPreferences {
  return useSyncExternalStore(subscribePref, getSnapshot, getSnapshot);
}
