import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonDialogProps {
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  contentLines?: number;
}

export function SkeletonDialog({
  className,
  showHeader = true,
  showFooter = true,
  contentLines = 5,
}: SkeletonDialogProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-card shadow-lg', className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between border-border border-b p-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      )}

      {/* Content */}
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          {Array.from({ length: contentLines }).map((_, i) => (
            <Skeleton key={i} className={cn('h-4', i === contentLines - 1 ? 'w-2/3' : 'w-full')} />
          ))}
        </div>
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="flex items-center justify-end gap-2 border-border border-t p-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      )}
    </div>
  );
}
