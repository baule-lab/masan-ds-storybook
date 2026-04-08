import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonChartProps {
  className?: string;
  type?: 'bar' | 'line' | 'pie' | 'area';
  showLegend?: boolean;
  showTitle?: boolean;
  chartHeight?: string;
}

export function SkeletonChart({
  className,
  type = 'bar',
  showLegend = true,
  showTitle = true,
  chartHeight = 'h-[280px]',
}: SkeletonChartProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {showTitle && (
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      )}

      <div className="space-y-4">
        {type === 'bar' && (
          <div className={cn('flex items-end justify-between gap-2', chartHeight)}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-full"
                style={{ height: `${Math.random() * 60 + 40}%` }}
              />
            ))}
          </div>
        )}

        {type === 'line' && (
          <div className={cn('relative', chartHeight)}>
            <Skeleton className="absolute inset-0 rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <svg className="h-full w-full opacity-10" viewBox="0 0 100 50">
                <polyline
                  points="0,40 20,30 40,35 60,15 80,20 100,10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <polyline
                  points="0,45 20,35 40,40 60,20 80,25 100,15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.5"
                />
              </svg>
            </div>
          </div>
        )}

        {type === 'pie' && (
          <div className={cn('flex items-center justify-center', chartHeight)}>
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>
        )}

        {type === 'area' && (
          <div className={cn('relative', chartHeight)}>
            <Skeleton className="absolute inset-0 rounded-lg" />
            <div className="absolute inset-0 flex items-end p-4">
              <svg className="h-full w-full opacity-20" viewBox="0 0 100 50">
                <polygon
                  points="0,50 0,40 20,30 40,35 60,15 80,20 100,10 100,50"
                  fill="currentColor"
                  opacity="0.3"
                />
              </svg>
            </div>
          </div>
        )}

        {showLegend && (
          <div className="flex flex-wrap justify-center gap-4 border-border border-t pt-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
