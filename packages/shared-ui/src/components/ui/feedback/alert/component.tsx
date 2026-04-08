import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '../../../../lib/utils';

const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: '',
        destructive: '',
        success: '',
        warning: '',
        info: '',
      },
      appearance: {
        solid: '',
        outline: '',
        light: '',
      },
    },
    compoundVariants: [
      // Default - Solid appearance
      {
        variant: 'default',
        appearance: 'solid',
        class: 'border-transparent bg-primary text-primary-foreground',
      },
      // Default - Outline appearance
      {
        variant: 'default',
        appearance: 'outline',
        class: 'border-border bg-card text-card-foreground',
      },
      // Default - Light appearance
      {
        variant: 'default',
        appearance: 'light',
        class:
          'border-transparent bg-muted text-foreground *:data-[slot=alert-description]:text-muted-foreground',
      },
      // Destructive - Solid appearance
      {
        variant: 'destructive',
        appearance: 'solid',
        class:
          'border-transparent bg-destructive text-white *:data-[slot=alert-description]:text-white/90',
      },
      // Destructive - Outline appearance
      {
        variant: 'destructive',
        appearance: 'outline',
        class:
          'border-destructive bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90',
      },
      // Destructive - Light appearance
      {
        variant: 'destructive',
        appearance: 'light',
        class:
          'border-transparent bg-destructive/10 text-destructive *:data-[slot=alert-description]:text-destructive/90 dark:bg-destructive/20',
      },
      // Success - Solid appearance
      {
        variant: 'success',
        appearance: 'solid',
        class:
          'border-transparent bg-green-600 text-white *:data-[slot=alert-description]:text-white/90 dark:bg-green-400 dark:text-green-950 dark:*:data-[slot=alert-description]:text-green-950/90',
      },
      // Success - Outline appearance
      {
        variant: 'success',
        appearance: 'outline',
        class:
          'border-green-600 bg-card text-green-600 *:data-[slot=alert-description]:text-green-600/90 dark:border-green-400 dark:text-green-400 dark:*:data-[slot=alert-description]:text-green-400/90',
      },
      // Success - Light appearance
      {
        variant: 'success',
        appearance: 'light',
        class:
          'border-transparent bg-green-600/10 text-green-600 *:data-[slot=alert-description]:text-green-600/90 dark:bg-green-400/20 dark:text-green-400 dark:*:data-[slot=alert-description]:text-green-400/90',
      },
      // Warning - Solid appearance
      {
        variant: 'warning',
        appearance: 'solid',
        class:
          'border-transparent bg-amber-600 text-white *:data-[slot=alert-description]:text-white/90 dark:bg-amber-400 dark:text-amber-950 dark:*:data-[slot=alert-description]:text-amber-950/90',
      },
      // Warning - Outline appearance
      {
        variant: 'warning',
        appearance: 'outline',
        class:
          'border-amber-600 bg-card text-amber-600 *:data-[slot=alert-description]:text-amber-600/90 dark:border-amber-400 dark:text-amber-400 dark:*:data-[slot=alert-description]:text-amber-400/90',
      },
      // Warning - Light appearance
      {
        variant: 'warning',
        appearance: 'light',
        class:
          'border-transparent bg-amber-600/10 text-amber-600 *:data-[slot=alert-description]:text-amber-600/90 dark:bg-amber-400/20 dark:text-amber-400 dark:*:data-[slot=alert-description]:text-amber-400/90',
      },
      // Info - Solid appearance
      {
        variant: 'info',
        appearance: 'solid',
        class:
          'border-transparent bg-blue-600 text-white *:data-[slot=alert-description]:text-white/90 dark:bg-blue-400 dark:text-blue-950 dark:*:data-[slot=alert-description]:text-blue-950/90',
      },
      // Info - Outline appearance
      {
        variant: 'info',
        appearance: 'outline',
        class:
          'border-blue-600 bg-card text-blue-600 *:data-[slot=alert-description]:text-blue-600/90 dark:border-blue-400 dark:text-blue-400 dark:*:data-[slot=alert-description]:text-blue-400/90',
      },
      // Info - Light appearance
      {
        variant: 'info',
        appearance: 'light',
        class:
          'border-transparent bg-blue-600/10 text-blue-600 *:data-[slot=alert-description]:text-blue-600/90 dark:bg-blue-400/20 dark:text-blue-400 dark:*:data-[slot=alert-description]:text-blue-400/90',
      },
    ],
    defaultVariants: {
      variant: 'default',
      appearance: 'outline',
    },
  }
);

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;
type AlertAppearance = NonNullable<VariantProps<typeof alertVariants>['appearance']>;

function Alert({
  className,
  variant,
  appearance,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, appearance }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, alertVariants };
export type { AlertVariant, AlertAppearance };
