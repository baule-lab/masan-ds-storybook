import { cva } from 'class-variance-authority';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { cn } from '../../../../lib/utils';

const toasterVariants = cva('toaster group [&_div[data-content]]:w-full');

export function Toaster({ theme = 'system', className, toastOptions, ...props }: ToasterProps) {
  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className={cn(toasterVariants(), className)}
      toastOptions={{
        classNames: {
          toast: cn('border-border bg-popover text-popover-foreground'),
          success: cn(
            '[--normal-bg:color-mix(in_oklab,light-dark(var(--color-green-600),var(--color-green-400))_10%,var(--background))]',
            '[--normal-text:light-dark(var(--color-green-600),var(--color-green-400))]',
            '[--normal-border:light-dark(var(--color-green-600),var(--color-green-400))]',
            'border-[var(--normal-border)] bg-[var(--normal-bg)] text-[var(--normal-text)]',
            '[&_[data-description]]:!text-[var(--normal-text)]/70'
          ),
          warning: cn(
            '[--normal-bg:color-mix(in_oklab,light-dark(var(--color-amber-600),var(--color-amber-400))_10%,var(--background))]',
            '[--normal-text:light-dark(var(--color-amber-600),var(--color-amber-400))]',
            '[--normal-border:light-dark(var(--color-amber-600),var(--color-amber-400))]',
            'border-[var(--normal-border)] bg-[var(--normal-bg)] text-[var(--normal-text)]',
            '[&_[data-description]]:!text-[var(--normal-text)]/70'
          ),
          error: cn(
            '[--normal-bg:color-mix(in_oklab,var(--destructive)_10%,var(--background))]',
            '[--normal-text:var(--destructive)]',
            '[--normal-border:var(--destructive)]',
            'border-[var(--normal-border)] bg-[var(--normal-bg)] text-[var(--normal-text)]',
            '[&_[data-description]]:!text-[var(--normal-text)]/70'
          ),
        },
        ...toastOptions,
      }}
      {...props}
    />
  );
}
