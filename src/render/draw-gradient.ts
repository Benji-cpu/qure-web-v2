import type { GradientPreset } from '@/domain/gradients';

export function drawGradient(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  gradient: GradientPreset,
  width: number,
  height: number,
): void {
  const { colors, start, end } = gradient;
  const x0 = start.x * width;
  const y0 = start.y * height;
  const x1 = end.x * width;
  const y1 = end.y * height;

  const canvasGradient = ctx.createLinearGradient(x0, y0, x1, y1);
  colors.forEach((color, index) => {
    const stop = index / (colors.length - 1);
    canvasGradient.addColorStop(stop, color);
  });

  ctx.fillStyle = canvasGradient;
  ctx.fillRect(0, 0, width, height);
}
