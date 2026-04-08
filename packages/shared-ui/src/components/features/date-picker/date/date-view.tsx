import { Calendar } from '../../../ui/forms/calendar';
import { toUTCDate, toDateOrUndefined } from '../utils';
import type { DateValue } from '../types';

type DateViewProps = {
  value: DateValue;
  onChange: (date: DateValue) => void;
  onClose?: () => void;
  minDate?: Date;
  maxDate?: Date;
  hideYearSelect?: boolean;
};

export function DateView({
  value,
  onChange,
  onClose,
  minDate,
  maxDate,
  hideYearSelect = false,
}: DateViewProps) {
  const dateValue = toDateOrUndefined(value);

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }
    onChange(toUTCDate(date));
    onClose?.();
  };

  return (
    <Calendar
      mode="single"
      selected={dateValue}
      onSelect={handleSelect}
      captionLayout={hideYearSelect ? 'label' : 'dropdown'}
      hidden={
        [minDate, maxDate]?.some((d) => d !== undefined)
          ? {
              before: minDate!,
              after: maxDate!,
            }
          : undefined
      }
      defaultMonth={dateValue}
      endMonth={maxDate ? maxDate : new Date('2040-01-01')}
    />
  );
}

DateView.displayName = 'DateView';
