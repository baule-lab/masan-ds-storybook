import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonFormProps {
  className?: string;
  fields?: number;
  showSubmitButton?: boolean;
  showCancelButton?: boolean;
}

export function SkeletonForm({
  className,
  fields = 4,
  showSubmitButton = true,
  showCancelButton = true,
}: SkeletonFormProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}

      <div className="flex gap-2 pt-2">
        {showSubmitButton && <Skeleton className="h-10 w-24" />}
        {showCancelButton && <Skeleton className="h-10 w-24" />}
      </div>
    </div>
  );
}
