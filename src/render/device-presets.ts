export interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
}

export const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', width: 1290, height: 2796 },
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', width: 1179, height: 2556 },
  { id: 'iphone-15', name: 'iPhone 15 / 14', width: 1170, height: 2532 },
  { id: 'iphone-se', name: 'iPhone SE', width: 750, height: 1334 },
  { id: 'android-1080p', name: 'Android 1080p', width: 1080, height: 2400 },
  { id: 'android-1440p', name: 'Android 1440p', width: 1440, height: 3200 },
  { id: 'pixel-8', name: 'Pixel 8', width: 1080, height: 2400 },
  { id: 'samsung-s24', name: 'Samsung S24', width: 1080, height: 2340 },
];

export const DEFAULT_DEVICE_PRESET = DEVICE_PRESETS[0]!;
