import { cn } from '@/lib/cn';

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn('flex bg-[var(--color-bg-tertiary)] rounded-xl p-1', className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          className={cn(
            'flex-1 py-1.5 px-3 text-sm font-medium rounded-lg transition-all duration-150',
            value === opt.value
              ? 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]'
              : 'text-[var(--color-text-secondary)]',
          )}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
