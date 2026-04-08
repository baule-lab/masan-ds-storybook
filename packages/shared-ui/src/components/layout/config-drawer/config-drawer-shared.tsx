/**
 * Shared sub-components used across all ConfigDrawer sections
 */
import { RotateCcw, CircleCheck } from 'lucide-react';
import { Item } from '@radix-ui/react-radio-group';
import type { SVGProps } from 'react';
import { Button } from '../../ui/actions/button/index';
import { cn } from '../../../lib/utils';

// --- SectionTitle ---

type SectionTitleProps = {
  title: string;
  showReset?: boolean;
  onReset?: () => void;
  className?: string;
};

export function SectionTitle({ title, showReset = false, onReset, className }: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-2 flex items-center gap-2 font-semibold text-muted-foreground text-sm',
        className
      )}
    >
      {title}
      {showReset && onReset && (
        <Button size="icon" variant="secondary" className="size-4 rounded-full" onClick={onReset}>
          <RotateCcw className="size-3" />
        </Button>
      )}
    </div>
  );
}

// --- RadioGroupItem ---

type RadioGroupItemOption = {
  value: string;
  label: string;
  icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
};

type RadioGroupItemProps = {
  item: RadioGroupItemOption;
  isTheme?: boolean;
};

export function RadioGroupItem({ item, isTheme = false }: RadioGroupItemProps) {
  return (
    <Item
      value={item.value}
      className={cn('group outline-none', 'transition duration-200 ease-in')}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        className={cn(
          'relative rounded-[6px] ring-[1px] ring-border',
          'group-data-[state=checked]:shadow-2xl group-data-[state=checked]:ring-primary',
          'group-focus-visible:ring-2'
        )}
        role="img"
        aria-hidden="false"
        aria-label={`${item.label} option preview`}
      >
        <CircleCheck
          className={cn(
            'size-6 fill-primary stroke-white',
            'group-data-[state=unchecked]:hidden',
            'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
          )}
          aria-hidden="true"
        />
        <item.icon
          className={cn(
            !isTheme &&
              'fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground'
          )}
          aria-hidden="true"
        />
      </div>
      <div className="mt-1 text-xs" id={`${item.value}-description`} aria-live="polite">
        {item.label}
      </div>
    </Item>
  );
}
