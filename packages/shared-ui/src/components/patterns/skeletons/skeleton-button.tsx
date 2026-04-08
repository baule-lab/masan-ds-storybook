import { Skeleton } from '../../ui/feedback/skeleton';
import { cn } from '../../../lib/utils';

interface SkeletonButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'icon';
}

const sizeClasses = {
  sm: 'h-8 w-20',
  md: 'h-10 w-24',
  lg: 'h-11 w-28',
};

const iconSizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
};

export function SkeletonButton({
  className,
  size = 'md',
  variant = 'default',
}: SkeletonButtonProps) {
  return (
    <Skeleton
      className={cn(
        'rounded-md',
        variant === 'icon' ? iconSizeClasses[size] : sizeClasses[size],
        className
      )}
    />
  );
}
