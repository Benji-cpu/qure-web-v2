import { cn } from '@/lib/cn';
import type { QRTypeConfig } from '@/domain/qr-types';

interface QRTypeCardProps {
  config: QRTypeConfig;
  selected: boolean;
  onClick: () => void;
}

export function QRTypeCard({ config, selected, onClick }: QRTypeCardProps) {
  return (
    <button
      className={cn(
        'flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all duration-150 active:scale-[0.95]',
        selected
          ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)] text-[var(--color-accent)]'
          : 'bg-[var(--color-glass-card)] backdrop-blur-xl border-[var(--color-glass-border)] text-[var(--color-text-primary)]',
      )}
      onClick={onClick}
    >
      <span className="text-2xl">{config.icon}</span>
      <span className="text-xs font-medium truncate w-full text-center">{config.title}</span>
    </button>
  );
}
