import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { getPreferences, setTheme as saveTheme } from '@/storage/preferences';
import { subscribe } from '@/lib/storage-events';
import { STORAGE_KEYS } from '@/lib/constants';

type ThemeSetting = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;

function getSystemTheme(): ResolvedTheme {
  return mq?.matches ? 'dark' : 'light';
}

function getSnapshot(): ThemeSetting {
  return getPreferences().theme;
}

function subscribeToTheme(callback: () => void): () => void {
  const unsub = subscribe(STORAGE_KEYS.PREFERENCES, callback);
  const handler = () => callback();
  mq?.addEventListener('change', handler);
  return () => {
    unsub();
    mq?.removeEventListener('change', handler);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeToTheme, getSnapshot, () => 'system' as ThemeSetting);

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (theme === 'system') return getSystemTheme();
    return theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', resolvedTheme === 'dark' ? '#000000' : '#ffffff');
    }
  }, [resolvedTheme]);

  const setTheme = useCallback((t: ThemeSetting) => {
    saveTheme(t);
  }, []);

  return { theme, resolvedTheme, setTheme } as const;
}
