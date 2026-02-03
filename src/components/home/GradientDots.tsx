import { cn } from '@/lib/cn';

interface GradientDotsProps {
  total: number;
  current: number;
  className?: string;
}

export function GradientDots({ total, current, className }: GradientDotsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-1.5', className)}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all duration-300',
            i === current
              ? 'w-2 h-2 bg-white'
              : 'w-1.5 h-1.5 bg-white/40',
          )}
        />
      ))}
    </div>
  );
}
