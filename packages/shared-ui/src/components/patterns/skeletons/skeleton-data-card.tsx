import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonDataCardProps {
  className?: string;
  showIcon?: boolean;
  showTrend?: boolean;
}

export function SkeletonDataCard({
  className,
  showIcon = true,
  showTrend = true,
}: SkeletonDataCardProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-6', className)}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          {showIcon && <Skeleton className="h-5 w-5 rounded" />}
        </div>

        <Skeleton className="h-8 w-20" />

        {showTrend && (
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 w-32" />
          </div>
        )}
      </div>
    </div>
  );
}
