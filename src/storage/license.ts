import { STORAGE_KEYS } from '@/lib/constants';
import { notify } from '@/lib/storage-events';

export interface LicenseToken {
  iss: string;
  sub: string;
  tier: string;
  iat: number;
  exp?: number | null;
}

export function setLicenseToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LICENSE, token);
    notify(STORAGE_KEYS.LICENSE);
  } catch {
    // ignore
  }
}

export function getLicenseToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.LICENSE);
  } catch {
    return null;
  }
}

export function clearLicenseToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.LICENSE);
    notify(STORAGE_KEYS.LICENSE);
  } catch {
    // ignore
  }
}

function decodeToken(token: string): LicenseToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1]!;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as LicenseToken;
  } catch {
    return null;
  }
}

export function isPremium(): boolean {
  const token = getLicenseToken();
  if (!token) return false;
  const decoded = decodeToken(token);
  if (!decoded) return false;
  if (decoded.exp && decoded.exp < Date.now() / 1000) return false;
  if (decoded.iss !== 'qure-web') return false;
  return decoded.tier === 'premium';
}

export function getLicenseInfo(): LicenseToken | null {
  const token = getLicenseToken();
  if (!token) return null;
  return decodeToken(token);
}
