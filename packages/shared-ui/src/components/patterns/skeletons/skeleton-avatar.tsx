import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

export function SkeletonAvatar({ className, size = 'md', shape = 'circle' }: SkeletonAvatarProps) {
  return (
    <Skeleton
      className={cn(
        sizeClasses[size],
        shape === 'circle' ? 'rounded-full' : 'rounded-md',
        className
      )}
    />
  );
}
