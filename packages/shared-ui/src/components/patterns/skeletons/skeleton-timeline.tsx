import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonTimelineProps {
  className?: string;
  items?: number;
  showIcon?: boolean;
}

export function SkeletonTimeline({ className, items = 4, showIcon = true }: SkeletonTimelineProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex gap-4">
          {/* Timeline Icon/Dot */}
          <div className="flex flex-col items-center">
            {showIcon ? (
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            ) : (
              <Skeleton className="h-3 w-3 shrink-0 rounded-full" />
            )}
            {index < items - 1 && <div className="mt-2 h-full min-h-16 w-px bg-border" />}
          </div>

          {/* Timeline Content */}
          <div className="flex-1 space-y-2 pb-8">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
