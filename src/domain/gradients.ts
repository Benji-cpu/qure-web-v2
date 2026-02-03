export interface GradientPreset {
  id: string;
  name: string;
  colors: string[];
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#0f2027', '#2c5364'],
    start: { x: 0, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  {
    id: 'mint',
    name: 'Mint',
    colors: ['#0d9488', '#a7f3d0'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    colors: ['#f97316', '#fbbf24'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    colors: ['#7c3aed', '#c4b5fd'],
    start: { x: 0, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  {
    id: 'rose',
    name: 'Rose',
    colors: ['#e11d48', '#fda4af'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    id: 'storm',
    name: 'Storm',
    colors: ['#1e293b', '#475569'],
    start: { x: 0, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: ['#14532d', '#86efac'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: ['#020617', '#312e81'],
    start: { x: 0, y: 0 },
    end: { x: 0.5, y: 1 },
  },
];

export const DEFAULT_GRADIENT_ID = 'ocean';
