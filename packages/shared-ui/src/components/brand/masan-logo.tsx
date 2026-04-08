import type { ImgHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export function MasanLogo({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <>
      <img
        src="/logo-masan.png"
        alt="Masan Group"
        className={cn('h-12 w-auto dark:hidden', className)}
        {...props}
      />
      <img
        src="/logo-masan-dark.png"
        alt="Masan Group"
        className={cn('hidden h-14 w-auto dark:block', className)}
        {...props}
      />
    </>
  );
}

// Icon version for sidebar (smaller, square aspect ratio)
export function MasanLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <>
      <img
        src="/logo-icon.png"
        alt="Masan"
        className={cn('size-5 object-contain dark:hidden', className)}
        {...props}
      />
      <img
        src="/logo-icon-dark.png"
        alt="Masan Group"
        className={cn('hidden size-5 object-contain dark:block', className)}
        {...props}
      />
    </>
  );
}
