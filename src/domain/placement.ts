export const DEFAULT_QR_X_POSITION = 50;
export const DEFAULT_SINGLE_QR_X_POSITION = 50;
export const DEFAULT_QR_Y_POSITION = 30;
export const DEFAULT_QR_SCALE = 0.7;
export const MIN_SINGLE_QR_SCALE = 0.5;
export const MIN_DOUBLE_QR_SCALE = 0.7;
export const MAX_QR_SCALE = 1.5;
export const MIN_QR_SCALE = 0.3;

const REFERENCE_WIDTH = 375;
const REFERENCE_HEIGHT = 812;

function getQRSizePx(scale: number, singleMode: boolean): number {
  const baseQRSize = singleMode ? 300 : 240;
  return baseQRSize * scale * (REFERENCE_WIDTH / 375);
}

function getTotalQRWidthPx(scale: number, singleMode: boolean): number {
  const qrSize = getQRSizePx(scale, singleMode);
  if (singleMode) return qrSize;
  const gap = qrSize * 0.2;
  return qrSize * 2 + gap;
}

export function getValidXRange(scale: number, singleMode: boolean): { min: number; max: number } {
  const width = REFERENCE_WIDTH;
  const qrWidth = getTotalQRWidthPx(scale, singleMode);
  const maxOffsetPx = (width - qrWidth) / 2;
  if (maxOffsetPx <= 0) return { min: 50, max: 50 };
  const maxHorizontalOffsetPx = width * 0.15;
  const factor = Math.min(1, maxOffsetPx / maxHorizontalOffsetPx);
  const halfRange = 50 * factor;
  return { min: Math.max(0, 50 - halfRange), max: Math.min(100, 50 + halfRange) };
}

export function getValidYRange(scale: number, singleMode: boolean): { min: number; max: number } {
  const height = REFERENCE_HEIGHT;
  const qrSize = getQRSizePx(scale, singleMode);
  const minBottom = height * 0.10;
  const maxBottom = height * 0.60;
  const maxBottomOffset = height - qrSize;
  if (maxBottomOffset < minBottom) return { min: 0, max: 0 };
  const effectiveMaxBottom = Math.min(maxBottom, maxBottomOffset);
  const yMax = (100 * (effectiveMaxBottom - minBottom)) / (maxBottom - minBottom);
  return { min: 0, max: Math.min(100, Math.max(0, yMax)) };
}

export function clampPosition(
  x: number,
  y: number,
  scale: number,
  singleMode: boolean,
): { x: number; y: number } {
  const xRange = getValidXRange(scale, singleMode);
  const yRange = getValidYRange(scale, singleMode);
  return {
    x: Math.max(xRange.min, Math.min(xRange.max, x)),
    y: Math.max(yRange.min, Math.min(yRange.max, y)),
  };
}
