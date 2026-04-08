import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../../lib/utils';

const cardVariants = cva(
  'flex flex-col rounded-xl border border-border/50 text-card-foreground shadow-sm',
  {
    variants: {
      size: {
        default: 'gap-1.5 py-3',
        sm: 'gap-1.5 py-2',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface CardProps
  extends React.ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, size, ...props },
  ref
) {
  return (
    <div ref={ref} data-slot="card" className={cn(cardVariants({ size }), className)} {...props} />
  );
});

const cardHeaderVariants = cva(
  '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
  {
    variants: {
      size: {
        default: 'px-2.5 [.border-b]:pb-2.5',
        sm: 'px-2 [.border-b]:pb-2',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface CardHeaderProps
  extends React.ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof cardHeaderVariants> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { className, size, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(cardHeaderVariants({ size }), className)}
      {...props}
    />
  );
});

const CardTitle = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-title"
        className={cn('pl-2 font-semibold text-lg leading-none', className)}
        {...props}
      />
    );
  }
);

const CardDescription = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function CardDescription({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-description"
        className={cn('pl-2 text-muted-foreground text-sm', className)}
        {...props}
      />
    );
  }
);

const CardAction = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function CardAction({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="card-action"
        className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
        {...props}
      />
    );
  }
);

const cardContentVariants = cva('', {
  variants: {
    size: {
      default: 'px-3',
      sm: 'px-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface CardContentProps
  extends React.ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof cardContentVariants> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className, size, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn(cardContentVariants({ size }), className)}
      {...props}
    />
  );
});

const cardFooterVariants = cva('flex items-center', {
  variants: {
    size: {
      default: 'px-2.5 [.border-t]:pt-2.5',
      sm: 'px-2 [.border-t]:pt-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface CardFooterProps
  extends React.ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { className, size, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(cardFooterVariants({ size }), className)}
      {...props}
    />
  );
});

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
