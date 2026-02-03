import type { DevicePreset } from './device-presets';
import type { GradientPreset } from '@/domain/gradients';
import type { QRCodeData } from '@/domain/qr-types';
import { drawGradient } from './draw-gradient';
import { drawQRCode } from './draw-qr';

export interface RenderOptions {
  preset: DevicePreset;
  gradient: GradientPreset;
  primaryQR: QRCodeData | null;
  secondaryQR: QRCodeData | null;
  xPosition: number;
  yPosition: number;
  scale: number;
  singleMode?: boolean;
  backgroundImage?: HTMLImageElement | null;
  showWatermark?: boolean;
}

export async function renderWallpaper(options: RenderOptions): Promise<Blob> {
  const {
    preset,
    gradient,
    primaryQR,
    secondaryQR,
    xPosition,
    yPosition,
    scale,
    singleMode = false,
    backgroundImage,
    showWatermark = false,
  } = options;

  const { width, height } = preset;

  let canvas: HTMLCanvasElement | OffscreenCanvas;
  let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(width, height);
    ctx = canvas.getContext('2d')!;
  } else {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d')!;
  }

  // 1. Draw background
  if (backgroundImage) {
    const imgRatio = backgroundImage.naturalWidth / backgroundImage.naturalHeight;
    const canvasRatio = width / height;
    let sx = 0, sy = 0, sw = backgroundImage.naturalWidth, sh = backgroundImage.naturalHeight;
    if (imgRatio > canvasRatio) {
      sw = backgroundImage.naturalHeight * canvasRatio;
      sx = (backgroundImage.naturalWidth - sw) / 2;
    } else {
      sh = backgroundImage.naturalWidth / canvasRatio;
      sy = (backgroundImage.naturalHeight - sh) / 2;
    }
    ctx.drawImage(backgroundImage, sx, sy, sw, sh, 0, 0, width, height);
  } else {
    drawGradient(ctx, gradient, width, height);
  }

  // 2. Calculate QR sizes and positions
  const baseQRSize = singleMode ? 300 : 240;
  const qrSize = Math.round(baseQRSize * scale * (width / 375));

  const minBottom = height * 0.10;
  const maxBottom = height * 0.60;
  const bottomOffset = minBottom + (yPosition / 100) * (maxBottom - minBottom);
  let qrY = height - bottomOffset - qrSize;

  const maxHorizontalOffset = width * 0.15;
  const horizontalOffset = ((xPosition - 50) / 50) * maxHorizontalOffset;
  let centerX = width / 2 + horizontalOffset;

  const totalQRWidth = singleMode ? qrSize : qrSize * 2 + qrSize * 0.2;
  const minCenterX = totalQRWidth / 2;
  const maxCenterX = width - totalQRWidth / 2;
  centerX = Math.max(minCenterX, Math.min(maxCenterX, centerX));
  qrY = Math.max(0, Math.min(height - qrSize, qrY));

  // 3. Draw QR codes
  if (singleMode) {
    if (primaryQR) {
      await drawQRCode(ctx, {
        content: primaryQR.content,
        x: centerX - qrSize / 2,
        y: qrY,
        size: qrSize,
        color: primaryQR.design?.color ?? '#000000',
        backgroundColor: primaryQR.design?.backgroundColor ?? '#FFFFFF',
      });
    }
  } else {
    const gap = qrSize * 0.2;
    const totalWidth = qrSize * 2 + gap;
    const startX = centerX - totalWidth / 2;

    if (primaryQR) {
      await drawQRCode(ctx, {
        content: primaryQR.content,
        x: startX,
        y: qrY,
        size: qrSize,
        color: primaryQR.design?.color ?? '#000000',
        backgroundColor: primaryQR.design?.backgroundColor ?? '#FFFFFF',
      });
    }

    if (secondaryQR) {
      await drawQRCode(ctx, {
        content: secondaryQR.content,
        x: startX + qrSize + gap,
        y: qrY,
        size: qrSize,
        color: secondaryQR.design?.color ?? '#000000',
        backgroundColor: secondaryQR.design?.backgroundColor ?? '#FFFFFF',
      });
    }
  }

  // 4. Draw watermark for free users
  if (showWatermark) {
    const fontSize = Math.round(width * 0.028);
    ctx.font = `500 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Made with QuRe', width - fontSize, height - fontSize);
  }

  // 5. Export as PNG blob
  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: 'image/png' });
  } else {
    return new Promise((resolve) => {
      (canvas as HTMLCanvasElement).toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateFilename(preset: DevicePreset): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `qure-wallpaper-${preset.id}-${timestamp}.png`;
}
