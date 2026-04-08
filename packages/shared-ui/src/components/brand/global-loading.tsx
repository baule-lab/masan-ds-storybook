import { cn } from '../../lib/utils';
import { MasanLogoIcon } from './masan-logo';

interface GlobalLoadingProps {
  className?: string;
  text?: string;
}

export function GlobalLoading({ className, text }: GlobalLoadingProps) {
  return (
    <div
      className={cn('flex h-screen w-full flex-col items-center justify-center gap-4', className)}
    >
      <div className="relative">
        <MasanLogoIcon className="size-20 animate-pulse text-primary" />
        <div className="absolute inset-0 animate-ping">
          <MasanLogoIcon className="size-20 text-primary opacity-75" />
        </div>
      </div>
      {text && <p className="animate-pulse font-medium text-muted-foreground text-sm">{text}</p>}
    </div>
  );
}
