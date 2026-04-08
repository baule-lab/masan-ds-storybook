import { cn } from '../../../../../../lib/utils';
import { toDateOrUndefined, isMonthInRange } from '../utils';
import { ViewHeader } from '../components/ViewHeader';
import type { CalendarSelectionType, DateValue, DateRange, ViewSharedProps } from '../types';

const NOW = new Date();
const TODAY_YEAR = NOW.getFullYear();
const TODAY_MONTH = NOW.getMonth();

type MonthGridViewProps = ViewSharedProps & {
  selectionType: CalendarSelectionType;
  value?: DateValue | DateValue[] | DateRange;
  onChange?: (value: DateValue | DateValue[] | DateRange) => void;
  /** Called when the year label is clicked to drill up to year selection. */
  onDrillUp?: () => void;
  /** Called after a month is committed (for drill-back to primary view). */
  onMonthSelect?: (date: Date) => void;
};

const MONTHS: { number: number; name: string }[][] = [
  [
    { number: 0, name: 'Jan' },
    { number: 1, name: 'Feb' },
    { number: 2, name: 'Mar' },
  ],
  [
    { number: 3, name: 'Apr' },
    { number: 4, name: 'May' },
    { number: 5, name: 'Jun' },
  ],
  [
    { number: 6, name: 'Jul' },
    { number: 7, name: 'Aug' },
    { number: 8, name: 'Sep' },
  ],
  [
    { number: 9, name: 'Oct' },
    { number: 10, name: 'Nov' },
    { number: 11, name: 'Dec' },
  ],
];

function getSelectedMonths(
  selectionType: CalendarSelectionType,
  value?: DateValue | DateValue[] | DateRange
): Array<{ year: number; month: number }> {
  if (selectionType === 'range') {
    const range = value as DateRange | undefined;
    const result: Array<{ year: number; month: number }> = [];
    const from = toDateOrUndefined(range?.from);
    const to = toDateOrUndefined(range?.to);
    if (from) result.push({ year: from.getFullYear(), month: from.getMonth() });
    if (to) result.push({ year: to.getFullYear(), month: to.getMonth() });
    return result;
  }
  if (selectionType === 'multiple') {
    const dates = (value as DateValue[] | undefined) ?? [];
    return dates
      .map((d) => toDateOrUndefined(d))
      .filter((d): d is Date => d != null)
      .map((d) => ({ year: d.getFullYear(), month: d.getMonth() }));
  }
  const single = toDateOrUndefined(value as DateValue);
  return single ? [{ year: single.getFullYear(), month: single.getMonth() }] : [];
}

function getRangeMonths(value?: DateValue | DateValue[] | DateRange) {
  const range = value as DateRange | undefined;
  const from = toDateOrUndefined(range?.from);
  const to = toDateOrUndefined(range?.to);
  return {
    fromYear: from?.getFullYear(),
    fromMonth: from?.getMonth(),
    toYear: to?.getFullYear(),
    toMonth: to?.getMonth(),
  };
}

export function MonthGridView({
  navDate,
  onNavDateChange,
  selectionType,
  value,
  onChange,
  onDrillUp,
  onMonthSelect,
  minDate,
  maxDate,
  disabled,
  readOnly,
}: MonthGridViewProps) {
  const year = navDate.getFullYear();
  const selectedMonths = getSelectedMonths(selectionType, value);
  const { fromYear, fromMonth, toYear, toMonth } =
    selectionType === 'range' ? getRangeMonths(value) : {};

  const isMonthDisabled = (monthNum: number) => {
    if (maxDate) {
      if (year > maxDate.getFullYear()) return true;
      if (year === maxDate.getFullYear() && monthNum > maxDate.getMonth()) return true;
    }
    if (minDate) {
      if (year < minDate.getFullYear()) return true;
      if (year === minDate.getFullYear() && monthNum < minDate.getMonth()) return true;
    }
    return false;
  };

  const handleMonthClick = (monthNum: number) => {
    if (disabled || readOnly || isMonthDisabled(monthNum)) return;
    const date = new Date(year, monthNum, 1);

    // Navigation-only mode (no onChange): treat any click as navigation
    if (!onChange) {
      onMonthSelect?.(date);
      return;
    }

    if (selectionType === 'single') {
      const current = toDateOrUndefined(value as DateValue);
      const isSame = current?.getFullYear() === year && current?.getMonth() === monthNum;
      onChange?.(isSame ? undefined : date);
      if (!isSame) onMonthSelect?.(date);
    } else if (selectionType === 'multiple') {
      const current = (value as DateValue[] | undefined) ?? [];
      const idx = current.findIndex((d) => {
        const p = toDateOrUndefined(d);
        return p?.getFullYear() === year && p?.getMonth() === monthNum;
      });
      onChange?.(idx >= 0 ? current.filter((_, i) => i !== idx) : [...current, date]);
    } else {
      const range = (value as DateRange | undefined) ?? { from: undefined, to: undefined };
      const from = toDateOrUndefined(range.from);
      const to = toDateOrUndefined(range.to);
      if (!from || (from && to)) {
        onChange?.({ from: date, to: undefined });
      } else {
        onChange?.({ from: date < from ? date : from, to: date < from ? from : date });
        onMonthSelect?.(date);
      }
    }
  };

  return (
    <div className="w-full p-3">
      <ViewHeader
        title={year}
        onPrev={() => onNavDateChange(new Date(year - 1, navDate.getMonth(), 1))}
        onNext={() => onNavDateChange(new Date(year + 1, navDate.getMonth(), 1))}
        onTitleClick={onDrillUp}
        prevLabel="Previous year"
        nextLabel="Next year"
      />

      <div className="mt-3 flex flex-col gap-1">
        {MONTHS.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex gap-1">
            {row.map((month) => {
              const isSelected = selectedMonths.some(
                (s) => s.year === year && s.month === month.number
              );
              const isToday = year === TODAY_YEAR && month.number === TODAY_MONTH;
              const isInRange =
                selectionType === 'range' &&
                isMonthInRange(year, month.number, fromYear, fromMonth, toYear, toMonth);
              const isRangeStart =
                selectionType === 'range' && year === fromYear && month.number === fromMonth;
              const isRangeEnd =
                selectionType === 'range' && year === toYear && month.number === toMonth;
              const isEndpoint = isRangeStart || isRangeEnd;
              const isDisabled = isMonthDisabled(month.number);

              return (
                <button
                  key={month.number}
                  type="button"
                  onClick={() => handleMonthClick(month.number)}
                  disabled={isDisabled || disabled}
                  className={cn(
                    'relative flex h-9 flex-1 items-center justify-center rounded-md font-normal text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                    'disabled:pointer-events-none disabled:opacity-40',
                    isInRange && !isEndpoint && 'rounded-none bg-accent text-accent-foreground',
                    isRangeStart && 'rounded-r-none',
                    isRangeEnd && 'rounded-l-none',
                    isSelected
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : isInRange && !isEndpoint
                        ? 'hover:bg-accent/80'
                        : 'hover:bg-accent hover:text-accent-foreground',
                    isToday && !isSelected && 'font-semibold text-primary'
                  )}
                >
                  {month.name}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

MonthGridView.displayName = 'MonthGridView';
