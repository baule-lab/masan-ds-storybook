import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonBreadcrumbProps {
  className?: string;
  items?: number;
}

export function SkeletonBreadcrumb({ className, items = 3 }: SkeletonBreadcrumbProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          {i < items - 1 && <Skeleton className="h-4 w-4" />}
        </div>
      ))}
    </div>
  );
}
