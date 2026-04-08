import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonInputProps {
  className?: string;
  showLabel?: boolean;
  showHelper?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
};

export function SkeletonInput({
  className,
  showLabel = true,
  showHelper = false,
  size = 'md',
}: SkeletonInputProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && <Skeleton className="h-4 w-24" />}
      <Skeleton className={cn('w-full rounded-md', sizeClasses[size])} />
      {showHelper && <Skeleton className="h-3 w-48" />}
    </div>
  );
}
