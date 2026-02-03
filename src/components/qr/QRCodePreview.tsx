import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { cn } from '@/lib/cn';

interface QRCodePreviewProps {
  content: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export function QRCodePreview({ content, size = 120, color = '#000000', backgroundColor = '#FFFFFF', className }: QRCodePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !content) return;

    QRCode.toCanvas(canvasRef.current, content, {
      width: size,
      margin: 2,
      color: { dark: color, light: backgroundColor },
      errorCorrectionLevel: 'M',
    }).catch(() => {
      // If content can't be encoded, show a placeholder
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = color;
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('QR', size / 2, size / 2 + 4);
      }
    });
  }, [content, size, color, backgroundColor]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={cn('rounded-xl', className)}
    />
  );
}
