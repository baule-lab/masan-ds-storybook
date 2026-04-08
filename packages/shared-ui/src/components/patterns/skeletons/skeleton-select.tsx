import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonSelectProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
};

export function SkeletonSelect({ className, showLabel = true, size = 'md' }: SkeletonSelectProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && <Skeleton className="h-4 w-24" />}
      <Skeleton className={cn('w-full rounded-md', sizeClasses[size])} />
    </div>
  );
}
