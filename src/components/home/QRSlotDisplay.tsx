import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import type { QRCodeData } from '@/domain/qr-types';

interface QRSlotDisplayProps {
  qr: QRCodeData;
  size: number;
  onClick?: () => void;
}

export function QRSlotDisplay({ qr, size, onClick }: QRSlotDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !qr.content) return;

    const color = qr.design?.color ?? '#000000';
    const bg = qr.design?.backgroundColor ?? '#FFFFFF';
    const padding = 6;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear and draw background with rounded corners
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, 12);
    ctx.fill();

    // Draw QR code
    const tempCanvas = document.createElement('canvas');
    QRCode.toCanvas(tempCanvas, qr.content, {
      width: size - padding * 2,
      margin: 1,
      color: { dark: color, light: bg },
      errorCorrectionLevel: 'M',
    }).then(() => {
      ctx.drawImage(tempCanvas, padding, padding);
    }).catch(() => {
      // fallback
    });
  }, [qr, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="cursor-pointer active:scale-[0.95] transition-transform duration-150"
      onClick={onClick}
      style={{ width: size, height: size }}
    />
  );
}
