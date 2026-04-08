import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { CalendarV2 } from '../../ui/forms/calendar/calendar-v2';
import type { CalendarV2Props } from '../../ui/forms/calendar/calendar-v2';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/overlays/popover';
import { Button } from '../../ui/actions/button';
import { useControlledState } from '../../../hooks/use-controlled-state';
import { cn } from '../../../lib/utils';
import type { DateValue, DateRange } from '../date-picker/types';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type DateRangePickerV2Props = Omit<
  CalendarV2Props<'range'>,
  'type' | 'value' | 'onChange' | 'className' | 'style'
> & {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
  /** Placeholder for the start date when unset. */
  placeholderFrom?: string;
  /** Placeholder for the end date when unset. */
  placeholderTo?: string;
  /**
   * When true, a staged value is kept while the popover is open and only
   * committed via the Apply button. When false, changes propagate immediately
   * and the popover closes once both `from` and `to` are selected.
   */
  hasApplyButton?: boolean;
  /** Applied to the trigger button. */
  className?: string;
  'aria-invalid'?: boolean;
};

const EMPTY_RANGE: DateRange = { from: undefined, to: undefined };

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function toDate(value: DateValue): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isNaN(value.getTime()) ? undefined : value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

function formatDateRange(
  range: DateRange | undefined,
  placeholderFrom: string,
  placeholderTo: string
): string {
  const from = toDate(range?.from);
  const to = toDate(range?.to);
  const fromText = from ? format(from, 'MMM d, yyyy') : placeholderFrom;
  const toText = to ? format(to, 'MMM d, yyyy') : placeholderTo;
  return `${fromText} – ${toText}`;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function DateRangePickerV2({
  value: valueProp,
  defaultValue,
  onChange: onChangeProp,
  placeholderFrom = 'Start date',
  placeholderTo = 'End date',
  hasApplyButton = false,
  className,
  'aria-invalid': ariaInvalid,
  disabled,
  renderActions: renderActionsProp,
  ...calendarProps
}: DateRangePickerV2Props) {
  const [value, setValue] = useControlledState<DateRange>({
    value: valueProp,
    defaultValue: defaultValue ?? EMPTY_RANGE,
    onChange: onChangeProp,
  });

  const [isOpen, setIsOpen] = React.useState(false);
  // Staged value — only diverges from `value` while the popover is open with hasApplyButton.
  const [tempValue, setTempValue] = React.useState<DateRange>(value ?? EMPTY_RANGE);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setTempValue(value ?? EMPTY_RANGE); // sync staged state on open
      setIsOpen(true);
    } else if (hasApplyButton) {
      setTempValue(value ?? EMPTY_RANGE); // discard staged changes on dismiss
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleCalendarChange = (newValue: DateRange) => {
    if (hasApplyButton) {
      setTempValue(newValue);
    } else {
      setValue(newValue);
      // Auto-close once both endpoints are selected.
      if (newValue?.from && newValue?.to) {
        setIsOpen(false);
      }
    }
  };

  const handleApply = () => {
    setValue(tempValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempValue(value ?? EMPTY_RANGE);
    setIsOpen(false);
  };

  const activeValue = hasApplyButton ? tempValue : (value ?? EMPTY_RANGE);
  const isEmpty = !activeValue.from && !activeValue.to;
  const displayText = formatDateRange(activeValue, placeholderFrom, placeholderTo);

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        disabled={disabled}
        render={(props) => (
          <Button
            {...props}
            type="button"
            variant="outline"
            data-empty={isEmpty}
            aria-invalid={ariaInvalid}
            disabled={disabled}
            className={cn(
              'w-full justify-start text-start font-normal',
              'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
              'data-[empty=true]:text-muted-foreground',
              'dark:aria-invalid:ring-destructive/40',
              className
            )}
          >
            {displayText}
            <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
          </Button>
        )}
      />
      <PopoverContent className="w-auto overflow-hidden border p-0 ring-0" align="start">
        <CalendarV2
          type="range"
          value={activeValue}
          onChange={handleCalendarChange}
          disabled={disabled}
          className="rounded-[inherit] border-0 shadow-none"
          renderActions={
            hasApplyButton
              ? () => (
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" type="button" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button size="sm" type="button" onClick={handleApply}>
                      Apply
                    </Button>
                  </div>
                )
              : renderActionsProp
          }
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}

DateRangePickerV2.displayName = 'DateRangePickerV2';
