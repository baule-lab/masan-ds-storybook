import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonImageProps {
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  wide: 'aspect-[21/9]',
};

export function SkeletonImage({ className, aspectRatio = 'video' }: SkeletonImageProps) {
  return (
    <Skeleton className={cn('w-full rounded-md', aspectRatioClasses[aspectRatio], className)} />
  );
}
