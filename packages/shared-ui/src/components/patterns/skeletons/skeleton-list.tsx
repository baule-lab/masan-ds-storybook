import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonListProps {
  className?: string;
  items?: number;
  showAvatar?: boolean;
  showIcon?: boolean;
  lines?: number;
}

export function SkeletonList({
  className,
  items = 3,
  showAvatar = false,
  showIcon = false,
  lines = 1,
}: SkeletonListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-start gap-4 bg-card p-4">
          {showAvatar && <Skeleton className="h-12 w-12 flex-shrink-0 rounded-full" />}

          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton key={i} className={cn('h-4', i === lines - 1 ? 'w-1/2' : 'w-full')} />
            ))}
          </div>

          {showIcon && <Skeleton className="h-5 w-5 flex-shrink-0 rounded" />}
        </div>
      ))}
    </div>
  );
}
