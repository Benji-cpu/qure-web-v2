import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  const mq = typeof window !== 'undefined' ? window.matchMedia(query) : null;

  return useSyncExternalStore(
    (callback) => {
      mq?.addEventListener('change', callback);
      return () => mq?.removeEventListener('change', callback);
    },
    () => mq?.matches ?? false,
    () => false,
  );
}
