'use client';

/**
 * main - page content wrapper with optional fixed/fluid layout modes
 * Adapted from e2e-frontend: replaced @workspace import with relative path
 */

import { cn } from '../../lib/utils';

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
  fluid?: boolean;
  ref?: React.Ref<HTMLElement>;
};

export function Main({ fixed, className, fluid: _fluid, ...props }: MainProps) {
  return (
    <main
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        'px-4 py-4',
        // If layout is fixed, make the main container flex and grow
        fixed && 'flex grow flex-col',
        className
      )}
      {...props}
    />
  );
}

export type { MainProps };
