import { useQRStorage } from './useQRStorage';

export function useOnboarding() {
  const qrCodes = useQRStorage();
  return { needsOnboarding: qrCodes.length === 0 };
}
