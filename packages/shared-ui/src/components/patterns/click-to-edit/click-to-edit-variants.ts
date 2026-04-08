import { cva, type VariantProps } from 'class-variance-authority';

/** Variant definitions for the click-to-edit container */
export const clickToEditVariants = cva(
  'group/cte relative rounded-md transition-all duration-200',
  {
    variants: {
      status: {
        default: 'border-transparent',
        success:
          'border border-green-500 ring-1 ring-green-500/20 dark:border-green-400 dark:ring-green-400/20',
        warning:
          'border border-amber-500 ring-1 ring-amber-500/20 dark:border-amber-400 dark:ring-amber-400/20',
        error:
          'border border-destructive ring-1 ring-destructive/20 dark:border-destructive dark:ring-destructive/40',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      status: 'default',
      size: 'default',
    },
  }
);

export type ClickToEditVariants = VariantProps<typeof clickToEditVariants>;

/** Size-specific layout (padding + gap) for display mode */
export const sizeLayout = {
  sm: 'gap-1 py-0.5 px-0.5',
  default: 'gap-1.5 py-1 px-1',
  lg: 'gap-2 py-1.5 px-1.5',
} as const;

/** Size-specific icon dimensions */
export const sizeIcon = {
  sm: 'h-3 w-3',
  default: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
} as const;

/** Size-specific action button dimensions */
export const sizeActionBtn = {
  sm: 'h-5 w-5',
  default: 'h-6 w-6',
  lg: 'h-7 w-7',
} as const;

/** Status message color mapping */
export const statusMessageColors = {
  default: 'text-muted-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-destructive dark:text-red-400',
} as const;
