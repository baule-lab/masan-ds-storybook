import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonTextProps {
  className?: string;
  lines?: number;
  variant?: 'paragraph' | 'heading' | 'caption';
}

export function SkeletonText({ className, lines = 3, variant = 'paragraph' }: SkeletonTextProps) {
  const heightClass = {
    paragraph: 'h-4',
    heading: 'h-6',
    caption: 'h-3',
  }[variant];

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn(heightClass, i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}
