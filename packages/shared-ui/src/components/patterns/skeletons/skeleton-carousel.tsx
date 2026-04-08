import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonCarouselProps {
  className?: string;
  items?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  aspectRatio?: 'square' | 'video' | 'wide';
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
};

export function SkeletonCarousel({
  className,
  items = 3,
  showControls = true,
  showIndicators = true,
  aspectRatio = 'video',
}: SkeletonCarouselProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-lg">
        <Skeleton className={cn('w-full', aspectRatioClasses[aspectRatio])} />

        {/* Navigation Controls */}
        {showControls && (
          <>
            <Skeleton className="absolute top-1/2 left-4 h-10 w-10 -translate-y-1/2 rounded-full" />
            <Skeleton className="absolute top-1/2 right-4 h-10 w-10 -translate-y-1/2 rounded-full" />
          </>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: items }).map((_, i) => (
            <Skeleton key={i} className="h-2 w-8 rounded-full" />
          ))}
        </div>
      )}
    </div>
  );
}
