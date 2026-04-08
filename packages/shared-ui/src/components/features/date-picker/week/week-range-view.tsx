import * as React from 'react';
import {
  addMonths,
  addWeeks,
  addYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  getWeek,
  isAfter,
  isBefore,
  isSameDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '../../../ui/actions/button';
import { cn } from '../../../../lib/utils';
import { toUTCDate, toDateOrUndefined } from '../utils';
import type { DateRange } from '../types';

type WeekRangeViewProps = {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  onClose?: () => void;
  minDate?: Date;
  maxDate?: Date;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  autoScroll?: boolean;
};

type ViewMode = 'month' | 'year';

type WeekData = {
  index: number;
  weekOfYear: number;
  start: Date;
  end: Date;
};

const DEFAULT_WEEK_STARTS_ON: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1;

// Pure function to calculate weeks - extracted for React Compiler optimization
function calculateWeeks(
  baseDate: Date,
  viewMode: ViewMode,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6
): WeekData[] {
  const monthStart = startOfMonth(baseDate);
  const monthEnd = endOfMonth(baseDate);
  const yearStart = startOfYear(baseDate);
  const yearEnd = endOfYear(baseDate);

  const periodStart = viewMode === 'year' ? yearStart : monthStart;
  const periodEnd = viewMode === 'year' ? yearEnd : monthEnd;

  const weeks: WeekData[] = [];

  // Start from the first week that contains any day of the period
  let current = startOfWeek(periodStart, { weekStartsOn });
  let index = 1;

  // Continue until we've passed the end of the period
  while (current <= periodEnd) {
    const weekStart = current;
    const weekEnd = endOfWeek(current, { weekStartsOn });

    // Check if this week contains any day from the current period
    const weekContainsPeriodDay =
      (weekStart >= periodStart && weekStart <= periodEnd) ||
      (weekEnd >= periodStart && weekEnd <= periodEnd) ||
      (weekStart <= periodStart && weekEnd >= periodEnd);

    if (weekContainsPeriodDay) {
      const weekOfYear = getWeek(weekStart, { weekStartsOn, firstWeekContainsDate: 4 });
      weeks.push({
        index,
        weekOfYear,
        start: toUTCDate(weekStart),
        end: toUTCDate(weekEnd),
      });
      index += 1;
    }

    current = addWeeks(current, 1);
  }

  return weeks;
}

export function WeekRangeView({
  range,
  onRangeChange,
  onClose,
  minDate,
  maxDate,
  weekStartsOn = DEFAULT_WEEK_STARTS_ON,
  autoScroll = false,
}: WeekRangeViewProps) {
  const fromDate = toDateOrUndefined(range.from);
  const toDate = toDateOrUndefined(range.to);

  const [baseDate, setBaseDate] = React.useState<Date>(() => fromDate ?? toDate ?? new Date());
  const [viewMode] = React.useState<ViewMode>('year');
  const [selectingStart, setSelectingStart] = React.useState<boolean>(() => {
    if (!range.from) return true;
    if (range.from && !range.to) return false;
    return true;
  });

  const containerRef = React.useRef<HTMLDivElement>(null);
  const selectedWeekRef = React.useRef<HTMLButtonElement>(null);
  const hasScrolled = React.useRef(false);

  // // Auto scroll to selected week after weeks are rendered
  React.useEffect(() => {
    if (autoScroll && !hasScrolled.current && selectedWeekRef.current && containerRef.current) {
      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        selectedWeekRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        hasScrolled.current = true;
      }, 100);
    }
  }, [autoScroll, fromDate, toDate, baseDate]);

  // Use pure function - React Compiler will auto-optimize
  const weeks = calculateWeeks(baseDate, viewMode, weekStartsOn ?? DEFAULT_WEEK_STARTS_ON);

  const handlePeriodChange = (offset: number) => {
    setBaseDate((prev) => (viewMode === 'year' ? addYears(prev, offset) : addMonths(prev, offset)));
  };

  // const handleGoToToday = () => {
  //   setBaseDate(new Date());
  // };

  const handleMonthSelect = (value: string) => {
    const [yearPart, monthPart] = value.split('-');
    const year = Number(yearPart);
    const month = Number(monthPart);

    if (!Number.isNaN(year) && !Number.isNaN(month)) {
      setBaseDate(new Date(year, month, 1));
    }
  };

  const isWeekDisabled = (start: Date, end: Date) => {
    if (minDate && isBefore(end, minDate)) {
      return true;
    }

    if (maxDate && isAfter(start, maxDate)) {
      return true;
    }

    return false;
  };

  const normalizeRange = (start: Date, end: Date) => {
    const normalizedStart = startOfWeek(start, { weekStartsOn });
    const normalizedEnd = endOfWeek(end, { weekStartsOn });

    return {
      from: toUTCDate(normalizedStart),
      to: toUTCDate(normalizedEnd),
    };
  };

  const handleWeekClick = (start: Date, end: Date) => {
    if (isWeekDisabled(start, end)) return;

    const normalized = normalizeRange(start, end);

    if (selectingStart) {
      onRangeChange({ from: normalized.from, to: undefined });
      setSelectingStart(false);
    } else {
      if (!fromDate) {
        onRangeChange({ from: normalized.from, to: normalized.to });
        setSelectingStart(true);
        // Don't close - wait for second week selection
        return;
      }

      if (isAfter(normalized.from, fromDate)) {
        onRangeChange({ from: fromDate, to: normalized.to });
      } else {
        onRangeChange({
          from: normalized.from,
          to: normalizeRange(fromDate, fromDate).to,
        });
      }

      setSelectingStart(true);
      onClose?.();
    }
  };

  const classifyWeek = (start: Date, end: Date) => {
    const normalized = normalizeRange(start, end);

    if (!fromDate) {
      return {
        isStart: false,
        isMiddle: false,
        isEnd: false,
        isSingle: false,
      };
    }

    const isFrom = isSameDay(fromDate, normalized.from);
    const isTo = toDate ? isSameDay(toDate, normalized.to) : false;

    if (!toDate) {
      return {
        isStart: isFrom,
        isMiddle: false,
        isEnd: isFrom,
        isSingle: true,
      };
    }

    // Check if this week is the start week
    const isStart = isFrom;
    // Check if this week is the end week
    const isEnd = isTo;
    // Check if this week is in between start and end
    const isMiddle =
      !isStart && !isEnd && isAfter(normalized.from, fromDate) && isBefore(normalized.to, toDate);

    return {
      isStart,
      isMiddle,
      isEnd,
      isSingle: isStart && isEnd,
    };
  };

  const currentYear = baseDate?.getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - 2 + index);

  const periodOptions: Array<{ label: string; value: string }> = [];

  if (viewMode === 'year') {
    years.forEach((year) => {
      periodOptions.push({
        label: `${year}`,
        value: `${year}-0`,
      });
    });
  } else {
    years.forEach((year) => {
      for (let month = 0; month < 12; month += 1) {
        const date = new Date(year, month, 1);
        periodOptions.push({
          label: format(date, 'MMMM yyyy'),
          value: `${year}-${month}`,
        });
      }
    });
  }

  const selectedPeriodValue = baseDate
    ? `${baseDate.getFullYear()}-${viewMode === 'year' ? 0 : baseDate.getMonth()}`
    : '';

  return (
    <div className="min-w-[420px] space-y-4 p-3">
      {/* <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={cn(
              buttonVariants({ variant: viewMode === 'month' ? 'default' : 'outline' }),
              'h-8 px-3 text-xs'
            )}
          >
            Month
          </button>
          <button
            type="button"
            onClick={() => setViewMode('year')}
            className={cn(
              buttonVariants({ variant: viewMode === 'year' ? 'default' : 'outline' }),
              'h-8 px-3 text-xs'
            )}
          >
            Year
          </button>
        </div>
        <button
          type="button"
          onClick={handleGoToToday}
          className={cn(buttonVariants({ variant: 'outline' }), 'h-8 px-2')}
          title="Today"
        >
          <Calendar className="h-4 w-4" />
        </button>
      </div> */}

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => handlePeriodChange(-1)}
          className={cn(buttonVariants({ variant: 'outline' }), 'h-8 px-2')}
        >
          <ChevronLeft className="h-4 w-4 opacity-50" />
        </button>
        <div className="relative w-[200px]">
          <select
            value={selectedPeriodValue}
            onChange={(e) => handleMonthSelect(e.target.value)}
            className="h-8 max-h-60 w-full cursor-pointer appearance-none rounded-md border border-input bg-background py-1 pr-8 pl-3 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 opacity-50" />
        </div>
        <button
          type="button"
          onClick={() => handlePeriodChange(1)}
          className={cn(buttonVariants({ variant: 'outline' }), 'h-8 px-2')}
        >
          <ChevronRight className="h-4 w-4 opacity-50" />
        </button>
      </div>

      <div
        ref={containerRef}
        className={cn(
          'grid gap-2',
          viewMode === 'year'
            ? 'max-h-[250px] overflow-y-auto sm:grid-cols-2 xl:grid-cols-3'
            : 'sm:grid-cols-2 xl:grid-cols-3'
        )}
      >
        {weeks.map(({ index, weekOfYear, start, end }) => {
          const disabled = isWeekDisabled(start, end);
          const { isStart, isMiddle, isEnd, isSingle } = classifyWeek(start, end);
          const formattedRange = `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
          const isFirstSelected = isStart || isSingle;

          // Check if this week contains today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isCurrentWeek = today >= start && today <= end;

          return (
            <button
              key={`${start.toISOString()}-${end.toISOString()}`}
              ref={isFirstSelected ? selectedWeekRef : undefined}
              type="button"
              disabled={disabled}
              onClick={() => handleWeekClick(start, end)}
              className={cn(
                'relative',
                'flex',
                'h-14',
                'items-center',
                'justify-between',
                'px-3',
                'transition-colors',
                'disabled:cursor-not-allowed',
                'disabled:opacity-50',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-ring',
                'focus-visible:ring-offset-2',
                'overflow-hidden',
                // Border styling based on position
                isSingle && 'rounded-md border-2 border-primary',
                isStart && !isSingle && 'rounded-l-md border-2 border-primary border-r',
                isEnd && !isSingle && 'rounded-r-md border-2 border-primary border-l',
                isMiddle && 'border-primary border-x border-y-2',
                !isStart &&
                  !isMiddle &&
                  !isEnd &&
                  'rounded-md border border-input hover:border-primary/50',
                // Background
                (isSingle || isStart || isMiddle || isEnd) && 'bg-primary/5',
                !isStart && !isMiddle && !isEnd && 'hover:bg-primary/5',
                // Text color
                (isSingle || isStart || isEnd) && 'text-primary'
              )}
            >
              <div className="flex flex-col text-left">
                <span className="flex items-center gap-1 font-medium text-muted-foreground text-xs">
                  {viewMode === 'year' ? `Week ${weekOfYear}` : `Week ${index}`}
                  {isCurrentWeek && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" title="Current week" />
                  )}
                </span>
                <span className="font-semibold text-sm">{formattedRange}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

WeekRangeView.displayName = 'WeekRangeView';
