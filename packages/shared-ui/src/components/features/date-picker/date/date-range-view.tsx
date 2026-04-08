import * as React from 'react';
import { Calendar } from '../../../ui/forms/calendar';
import { toUTCDate, toDateOrUndefined } from '../utils';
import type { DateRange } from '../types';

// Default date boundaries for dropdown navigation (module-level constants)
const DEFAULT_MIN_DATE = new Date(1900, 0, 1);
const DEFAULT_MAX_DATE = new Date(2100, 11, 31);

type DateRangeViewProps = {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  onClose?: () => void;
  minDate?: Date;
  maxDate?: Date;
};

export function DateRangeView({
  range,
  onRangeChange,
  onClose,
  minDate,
  maxDate,
}: DateRangeViewProps) {
  const fromDate = toDateOrUndefined(range.from);
  const toDate = toDateOrUndefined(range.to);
  const hasCompleteRange = fromDate !== undefined && toDate !== undefined;

  // Controlled month state - prevents auto-navigation on date click
  const [month, setMonth] = React.useState<Date>(() => fromDate || new Date());

  // Handle day click manually - bypasses react-day-picker's internal state
  const handleDayClick = (day: Date) => {
    const clickedDate = toUTCDate(day);

    // Case 1: Complete range exists → Reset and start new selection
    if (hasCompleteRange) {
      onRangeChange({ from: clickedDate, to: undefined });
      return;
    }

    // Case 2: Only start selected → Set end and close
    if (fromDate !== undefined && toDate === undefined) {
      // Ensure correct order (earlier date is always "from")
      if (clickedDate < fromDate) {
        onRangeChange({ from: clickedDate, to: fromDate });
      } else {
        onRangeChange({ from: fromDate, to: clickedDate });
      }
      onClose?.();
      return;
    }

    // Case 3: No selection → Set start
    onRangeChange({ from: clickedDate, to: undefined });
  };

  // Build modifiers for range styling - only include defined values
  const modifiers = {
    ...(fromDate && { range_start: fromDate }),
    ...(toDate && { range_end: toDate }),
    ...(fromDate && toDate && { range_middle: { after: fromDate, before: toDate } }),
    ...(fromDate && { selected: toDate ? { from: fromDate, to: toDate } : fromDate }),
  };

  return (
    <Calendar
      month={month}
      onMonthChange={setMonth}
      modifiers={modifiers}
      onDayClick={handleDayClick}
      showOutsideDays={false}
      captionLayout="dropdown"
      startMonth={minDate ?? DEFAULT_MIN_DATE}
      endMonth={maxDate ?? DEFAULT_MAX_DATE}
      numberOfMonths={2}
    />
  );
}

DateRangeView.displayName = 'DateRangeView';
