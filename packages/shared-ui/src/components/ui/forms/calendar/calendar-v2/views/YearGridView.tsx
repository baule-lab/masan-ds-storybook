import { cn } from '../../../../../../lib/utils';
import { toDateOrUndefined, getDecadeStart, getDecadeYears, isYearInRange } from '../utils';
import { ViewHeader } from '../components/ViewHeader';
import type { CalendarSelectionType, DateValue, DateRange, ViewSharedProps } from '../types';

const COLS = 3;
const TODAY_YEAR = new Date().getFullYear();

type YearGridViewProps = ViewSharedProps & {
  selectionType: CalendarSelectionType;
  value?: DateValue | DateValue[] | DateRange;
  onChange?: (value: DateValue | DateValue[] | DateRange) => void;
};

function getSelectedYears(
  selectionType: CalendarSelectionType,
  value?: DateValue | DateValue[] | DateRange
): number[] {
  if (selectionType === 'range') {
    const range = value as DateRange | undefined;
    const years: number[] = [];
    const from = toDateOrUndefined(range?.from);
    const to = toDateOrUndefined(range?.to);
    if (from) years.push(from.getFullYear());
    if (to) years.push(to.getFullYear());
    return years;
  }
  if (selectionType === 'multiple') {
    const dates = (value as DateValue[] | undefined) ?? [];
    return dates
      .map((d) => toDateOrUndefined(d)?.getFullYear())
      .filter((y): y is number => y != null);
  }
  const single = toDateOrUndefined(value as DateValue);
  return single ? [single.getFullYear()] : [];
}

function getRangeEndpoints(value?: DateValue | DateValue[] | DateRange) {
  const range = value as DateRange | undefined;
  return {
    from: toDateOrUndefined(range?.from)?.getFullYear(),
    to: toDateOrUndefined(range?.to)?.getFullYear(),
  };
}

export function YearGridView({
  navDate,
  onNavDateChange,
  selectionType,
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  readOnly,
}: YearGridViewProps) {
  const decadeStart = getDecadeStart(navDate.getFullYear());
  const years = getDecadeYears(decadeStart);
  const selectedYears = getSelectedYears(selectionType, value);
  const { from: rangeFrom, to: rangeTo } =
    selectionType === 'range' ? getRangeEndpoints(value) : {};

  const isYearDisabled = (year: number) => {
    if (maxDate && year > maxDate.getFullYear()) return true;
    if (minDate && year < minDate.getFullYear()) return true;
    return false;
  };

  const handleYearClick = (year: number) => {
    if (disabled || readOnly || isYearDisabled(year)) return;
    const date = new Date(year, 0, 1);

    if (selectionType === 'single') {
      const currentYear = toDateOrUndefined(value as DateValue)?.getFullYear();
      onChange?.(currentYear === year ? undefined : date);
    } else if (selectionType === 'multiple') {
      const current = (value as DateValue[] | undefined) ?? [];
      const exists = current.some((d) => toDateOrUndefined(d)?.getFullYear() === year);
      onChange?.(
        exists
          ? current.filter((d) => toDateOrUndefined(d)?.getFullYear() !== year)
          : [...current, date]
      );
    } else {
      const range = (value as DateRange | undefined) ?? { from: undefined, to: undefined };
      const from = toDateOrUndefined(range.from);
      const to = toDateOrUndefined(range.to);
      if (!from || (from && to)) {
        onChange?.({ from: date, to: undefined });
      } else {
        onChange?.({ from: date < from ? date : from, to: date < from ? from : date });
      }
    }
  };

  // Split years into rows of COLS
  const rows: number[][] = [];
  for (let i = 0; i < years.length; i += COLS) {
    rows.push(years.slice(i, i + COLS));
  }

  return (
    <div className="w-full p-3">
      <ViewHeader
        title={`${years[0]} – ${years[years.length - 1]}`}
        onPrev={() => onNavDateChange(new Date(decadeStart - 10, navDate.getMonth(), 1))}
        onNext={() => onNavDateChange(new Date(decadeStart + 10, navDate.getMonth(), 1))}
        prevLabel="Previous decade"
        nextLabel="Next decade"
      />

      <div className="mt-3 flex flex-col gap-1">
        {rows.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex gap-1">
            {row.map((year) => {
              const isSelected = selectedYears.includes(year);
              const isToday = year === TODAY_YEAR;
              const isInRange =
                selectionType === 'range' && isYearInRange(year, rangeFrom, rangeTo);
              const isRangeStart = selectionType === 'range' && year === rangeFrom;
              const isRangeEnd = selectionType === 'range' && year === rangeTo;
              const isEndpoint = isRangeStart || isRangeEnd;
              const isDisabled = isYearDisabled(year);

              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearClick(year)}
                  disabled={isDisabled || disabled}
                  className={cn(
                    'relative flex h-9 flex-1 items-center justify-center rounded-md font-normal text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                    'disabled:pointer-events-none disabled:opacity-40',
                    // Range highlight (background strip, endpoints get overridden below)
                    isInRange && !isEndpoint && 'rounded-none bg-accent text-accent-foreground',
                    isRangeStart && 'rounded-r-none',
                    isRangeEnd && 'rounded-l-none',
                    // Selection
                    isSelected
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : isInRange && !isEndpoint
                        ? 'hover:bg-accent/80'
                        : 'hover:bg-accent hover:text-accent-foreground',
                    // Today indicator (when not selected)
                    isToday && !isSelected && 'font-semibold text-primary'
                  )}
                >
                  {year}
                  {/* Today dot */}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
            {/* Fill empty cells in last row so range strip spans correctly */}
            {row.length < COLS &&
              Array.from({ length: COLS - row.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex-1" />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

YearGridView.displayName = 'YearGridView';
