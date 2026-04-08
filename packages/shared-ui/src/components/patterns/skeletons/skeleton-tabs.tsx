import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonTabsProps {
  className?: string;
  tabs?: number;
  showContent?: boolean;
}

export function SkeletonTabs({ className, tabs = 3, showContent = true }: SkeletonTabsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Tab Headers */}
      <div className="flex gap-2 border-border border-b">
        {Array.from({ length: tabs }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-t-md" />
        ))}
      </div>

      {/* Tab Content */}
      {showContent && (
        <div className="space-y-4 pt-2">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      )}
    </div>
  );
}
