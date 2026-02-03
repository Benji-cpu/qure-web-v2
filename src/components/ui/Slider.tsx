import { type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Slider({ label, className, ...props }: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</label>
      )}
      <input
        type="range"
        className={cn('w-full', className)}
        {...props}
      />
    </div>
  );
}
