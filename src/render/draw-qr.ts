import QRCode from 'qrcode';

export interface QRDrawOptions {
  content: string;
  x: number;
  y: number;
  size: number;
  color?: string;
  backgroundColor?: string;
  padding?: number;
}

export async function drawQRCode(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  options: QRDrawOptions,
): Promise<void> {
  const {
    content,
    x,
    y,
    size,
    color = '#000000',
    backgroundColor = '#FFFFFF',
    padding = 8,
  } = options;

  if (!content) return;

  const tempCanvas = document.createElement('canvas');
  await QRCode.toCanvas(tempCanvas, content, {
    width: size - padding * 2,
    margin: 1,
    color: { dark: color, light: backgroundColor },
    errorCorrectionLevel: 'M',
  });

  const cornerRadius = 16;
  ctx.fillStyle = backgroundColor;
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, cornerRadius);
  ctx.fill();

  ctx.drawImage(tempCanvas, x + padding, y + padding);
}
