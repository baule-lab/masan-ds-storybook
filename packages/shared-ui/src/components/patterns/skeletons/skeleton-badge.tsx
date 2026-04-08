import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-5 w-12',
  md: 'h-6 w-16',
  lg: 'h-7 w-20',
};

export function SkeletonBadge({ className, size = 'md' }: SkeletonBadgeProps) {
  return <Skeleton className={cn('rounded-full', sizeClasses[size], className)} />;
}
