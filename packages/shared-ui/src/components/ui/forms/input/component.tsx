import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../../../lib/utils';

const inputVariants = cva(
  'h-8 w-full min-w-0 border-input bg-card py-0.5 text-sm outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/3 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      variant: {
        default:
          'rounded-md border focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        underline:
          'rounded-none border-0 border-b-1 px-0! pb-1 focus-visible:border-ring focus-visible:border-b-1 focus-visible:shadow-none focus-visible:ring-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface InputProps extends React.ComponentProps<'input'>, VariantProps<typeof inputVariants> {
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  suffixClass?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type, prefixIcon, suffixIcon, suffixClass, variant, ...props },
  ref
) {
  const getPaddingClasses = () => {
    const hasPrefix = !!prefixIcon;
    const hasSuffix = !!suffixIcon;

    if (hasPrefix && hasSuffix) {
      return 'pl-10 pr-10';
    }

    if (hasPrefix) {
      return 'pl-10 pr-3';
    }

    if (hasSuffix) {
      return 'pl-3 pr-10';
    }

    return 'px-3';
  };

  return (
    <div className={cn('relative w-full', className)}>
      {prefixIcon && (
        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
          {prefixIcon}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          'placeholder:text-stale-500!',
          inputVariants({ variant }),
          getPaddingClasses(),
          className
        )}
        placeholder={props.placeholder}
        {...props}
      />
      {suffixIcon && (
        <div
          className={cn(
            'absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground',
            suffixClass
          )}
        >
          {suffixIcon}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input, inputVariants };
