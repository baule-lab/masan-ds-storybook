import type { ReactNode } from 'react';
import { cn } from '../../../../lib/utils';

interface LabelValueProps {
  label: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  variant?: 'default' | 'outline';
  layout?: 'row' | 'row-start' | 'col';
}

export function LabelValue({
  label,
  children,
  className,
  labelClassName,
  valueClassName,
  variant = 'default',
  layout = 'row',
}: LabelValueProps) {
  const valueStyles =
    variant === 'outline' ? 'rounded-md border bg-transparent px-3 py-2 text-sm' : 'text-sm';

  if (layout === 'row' || layout === 'row-start') {
    return (
      <div
        className={cn(
          'flex items-start gap-3',
          layout === 'row-start' ? 'justify-start' : 'justify-between',
          className
        )}
      >
        <label
          className={cn(
            'whitespace-nowrap text-muted-foreground text-xs',
            'min-w-[150px]',
            labelClassName
          )}
        >
          {label}
        </label>
        <div className={cn('text-sm', valueStyles, valueClassName)}>{children}</div>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <label className={cn('text-muted-foreground text-xs', labelClassName)}>{label}</label>
      <div className={cn('text-sm', valueStyles, valueClassName)}>{children}</div>
    </div>
  );
}
