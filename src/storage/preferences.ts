import { DEFAULT_GRADIENT_ID } from '@/domain/gradients';
import {
  DEFAULT_QR_X_POSITION,
  DEFAULT_QR_Y_POSITION,
  DEFAULT_QR_SCALE,
  DEFAULT_SINGLE_QR_X_POSITION,
  MIN_SINGLE_QR_SCALE,
} from '@/domain/placement';
import { STORAGE_KEYS } from '@/lib/constants';
import { notify } from '@/lib/storage-events';

export interface UserPreferences {
  gradientId: string;
  qrXPosition: number;
  qrYPosition: number;
  qrScale: number;
  singleQRXPosition: number;
  singleQRYPosition: number;
  singleQRScale: number;
  primaryQRId: string | null;
  secondaryQRId: string | null;
  qrSlotMode: 'single' | 'double';
  backgroundType: 'gradient' | 'image';
  customGradient: { color1: string; color2: string } | null;
  backgroundImage: string | null;
  theme: 'light' | 'dark' | 'system';
}

const DEFAULT_PREFERENCES: UserPreferences = {
  gradientId: DEFAULT_GRADIENT_ID,
  qrXPosition: DEFAULT_QR_X_POSITION,
  qrYPosition: DEFAULT_QR_Y_POSITION,
  qrScale: DEFAULT_QR_SCALE,
  singleQRXPosition: DEFAULT_SINGLE_QR_X_POSITION,
  singleQRYPosition: DEFAULT_QR_Y_POSITION,
  singleQRScale: MIN_SINGLE_QR_SCALE,
  primaryQRId: null,
  secondaryQRId: null,
  qrSlotMode: 'double',
  backgroundType: 'gradient',
  customGradient: null,
  backgroundImage: null,
  theme: 'system',
};

export function getPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!stored) return { ...DEFAULT_PREFERENCES };
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_PREFERENCES, ...parsed };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export function savePreferences(preferences: Partial<UserPreferences>): UserPreferences {
  const current = getPreferences();
  const updated = { ...current, ...preferences };
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch {
    // ignore
  }
  notify(STORAGE_KEYS.PREFERENCES);
  return updated;
}

export function setGradient(gradientId: string): void {
  savePreferences({ gradientId, backgroundType: 'gradient', backgroundImage: null });
}

export function setPrimaryQR(qrId: string | null): void {
  savePreferences({ primaryQRId: qrId });
}

export function setSecondaryQR(qrId: string | null): void {
  savePreferences({ secondaryQRId: qrId });
}

export function setQRPosition(x: number, y: number, scale: number, mode: 'single' | 'double' = 'double'): void {
  if (mode === 'single') {
    savePreferences({ singleQRXPosition: x, singleQRYPosition: y, singleQRScale: scale });
  } else {
    savePreferences({ qrXPosition: x, qrYPosition: y, qrScale: scale });
  }
}

export function setSlotMode(mode: 'single' | 'double'): void {
  savePreferences({ qrSlotMode: mode });
}

export function setTheme(theme: 'light' | 'dark' | 'system'): void {
  savePreferences({ theme });
}

export function setBackgroundImage(dataUrl: string | null): void {
  if (dataUrl) {
    savePreferences({ backgroundImage: dataUrl, backgroundType: 'image' });
  } else {
    savePreferences({ backgroundImage: null, backgroundType: 'gradient' });
  }
}

export function setCustomGradient(color1: string, color2: string): void {
  savePreferences({ customGradient: { color1, color2 }, gradientId: 'custom', backgroundType: 'gradient', backgroundImage: null });
}
