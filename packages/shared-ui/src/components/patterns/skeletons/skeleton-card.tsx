import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  showHeader?: boolean;
  showDescription?: boolean;
  showFooter?: boolean;
  lines?: number;
}

export function SkeletonCard({
  className,
  showImage = true,
  showHeader = true,
  showDescription = true,
  showFooter = true,
  lines = 3,
}: SkeletonCardProps) {
  return (
    <div className={cn('space-y-4 rounded-lg border border-border bg-card p-4', className)}>
      {showImage && <Skeleton className="h-48 w-full rounded-md" />}

      <div className="space-y-3">
        {showHeader && <Skeleton className="h-6 w-3/4" />}

        {showDescription && (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <Skeleton key={i} className={cn('h-4', i === lines - 1 ? 'w-2/3' : 'w-full')} />
            ))}
          </div>
        )}
      </div>

      {showFooter && (
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      )}
    </div>
  );
}
