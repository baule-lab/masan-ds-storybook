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
import { ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { buttonVariants } from '../../../ui/actions/button';
import { cn } from '../../../../lib/utils';
import { toUTCDate, toDateOrUndefined } from '../utils';
import type { DateValue } from '../types';

type WeekViewProps = {
  value: DateValue;
  onChange: (date: DateValue) => void;
  onClose?: () => void;
  minDate?: Date;
  maxDate?: Date;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};

type ViewMode = 'month' | 'year';

const DEFAULT_WEEK_STARTS_ON: WeekViewProps['weekStartsOn'] = 1;

export function WeekView({
  value,
  onChange,
  onClose,
  minDate,
  maxDate,
  weekStartsOn = DEFAULT_WEEK_STARTS_ON,
}: WeekViewProps) {
  const dateValue = toDateOrUndefined(value);

  const [baseDate, setBaseDate] = React.useState<Date>(() => dateValue ?? new Date());
  const [viewMode, setViewMode] = React.useState<ViewMode>('year');

  const monthStart = startOfMonth(baseDate);
  const monthEnd = endOfMonth(baseDate);
  const yearStart = startOfYear(baseDate);
  const yearEnd = endOfYear(baseDate);

  const periodStart = viewMode === 'year' ? yearStart : monthStart;
  const periodEnd = viewMode === 'year' ? yearEnd : monthEnd;

  const weeks: Array<{
    index: number;
    weekOfYear: number;
    start: Date;
    end: Date;
  }> = [];

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

  const handlePeriodChange = (offset: number) => {
    setBaseDate((prev) => (viewMode === 'year' ? addYears(prev, offset) : addMonths(prev, offset)));
  };

  const handleGoToToday = () => {
    setBaseDate(new Date());
  };

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

  const normalizeWeek = (date: Date) => {
    const normalizedStart = startOfWeek(date, { weekStartsOn });
    const normalizedEnd = endOfWeek(date, { weekStartsOn });

    return {
      start: toUTCDate(normalizedStart),
      end: toUTCDate(normalizedEnd),
    };
  };

  const handleWeekClick = (start: Date) => {
    if (isWeekDisabled(start, endOfWeek(start, { weekStartsOn }))) return;

    const normalized = normalizeWeek(start);
    onChange(normalized.start);
    onClose?.();
  };

  const isWeekSelected = (start: Date) => {
    if (!dateValue) return false;

    const normalized = normalizeWeek(start);
    const selectedWeek = normalizeWeek(dateValue);

    return isSameDay(normalized.start, selectedWeek.start);
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
      <div className="flex items-center justify-between gap-2">
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
      </div>

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
        className={cn(
          'grid gap-2',
          viewMode === 'year'
            ? 'max-h-[250px] overflow-y-auto sm:grid-cols-3 xl:grid-cols-3'
            : 'sm:grid-cols-3 xl:grid-cols-3'
        )}
      >
        {weeks.map(({ index, weekOfYear, start, end }) => {
          const disabled = isWeekDisabled(start, end);
          const isSelected = isWeekSelected(start);
          const formattedRange = `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;

          return (
            <button
              key={`${start.toISOString()}-${end.toISOString()}`}
              type="button"
              disabled={disabled}
              onClick={() => handleWeekClick(start)}
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
                'rounded-md',
                // Border and background styling
                isSelected && 'border-2 border-primary bg-primary/5 text-primary',
                !isSelected && 'border border-input hover:border-primary/50 hover:bg-primary/5'
              )}
            >
              <div className="flex flex-col text-left">
                <span className="font-medium text-muted-foreground text-xs">
                  {viewMode === 'year' ? `Week ${weekOfYear}` : `Week ${index}`}
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

WeekView.displayName = 'WeekView';
