import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { CalendarV2 } from '../../ui/forms/calendar/calendar-v2';
import type { CalendarV2Props } from '../../ui/forms/calendar/calendar-v2';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/overlays/popover';
import { Button } from '../../ui/actions/button';
import { useControlledState } from '../../../hooks/use-controlled-state';
import { cn } from '../../../lib/utils';
import type { DateValue } from '../date-picker/types';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type DatePickerV2Props = Omit<
  CalendarV2Props<'single'>,
  'type' | 'value' | 'onChange' | 'className' | 'style'
> & {
  value?: DateValue;
  defaultValue?: DateValue;
  onChange?: (value: DateValue) => void;
  /** Placeholder shown when no date is selected. */
  placeholder?: string;
  /**
   * When true, a staged value is kept while the popover is open and only
   * committed via the Apply button. When false, changes propagate immediately
   * and the popover closes after selection.
   */
  hasApplyButton?: boolean;
  /** Applied to the trigger button. */
  className?: string;
  'aria-invalid'?: boolean;
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function toDate(value: DateValue): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isNaN(value.getTime()) ? undefined : value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

function formatSingleDate(value: DateValue, placeholder: string): string {
  const date = toDate(value);
  return date ? format(date, 'MMM d, yyyy') : placeholder;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function DatePickerV2({
  value: valueProp,
  defaultValue,
  onChange: onChangeProp,
  placeholder = 'Select date',
  hasApplyButton = false,
  className,
  'aria-invalid': ariaInvalid,
  disabled,
  renderActions: renderActionsProp,
  ...calendarProps
}: DatePickerV2Props) {
  const [value, setValue] = useControlledState<DateValue>({
    value: valueProp,
    defaultValue,
    onChange: onChangeProp,
  });

  const [isOpen, setIsOpen] = React.useState(false);
  // Staged value — only diverges from `value` while the popover is open with hasApplyButton.
  const [tempValue, setTempValue] = React.useState<DateValue>(value);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setTempValue(value); // sync staged state on open
      setIsOpen(true);
    } else if (hasApplyButton) {
      setTempValue(value); // discard staged changes on dismiss
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleCalendarChange = (newValue: DateValue) => {
    if (hasApplyButton) {
      setTempValue(newValue);
    } else {
      setValue(newValue);
      setIsOpen(false);
    }
  };

  const handleApply = () => {
    setValue(tempValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsOpen(false);
  };

  const activeValue = hasApplyButton ? tempValue : value;
  const isEmpty = !activeValue;
  const displayText = formatSingleDate(activeValue, placeholder);

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
          type="single"
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

DatePickerV2.displayName = 'DatePickerV2';
