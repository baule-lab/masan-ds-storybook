import {
  format,
  addMonths,
  subMonths,
  endOfWeek,
  isBefore,
  isAfter,
  isSameDay,
  startOfWeek,
  isWithinInterval,
} from 'date-fns';
import { cn } from '../../../../../../lib/utils';
import { toDateOrUndefined, getWeeksInMonth, isSameWeekStart } from '../utils';
import { ViewHeader } from '../components/ViewHeader';
import type { CalendarSelectionType, DateValue, DateRange, ViewSharedProps } from '../types';

const WEEK_STARTS_ON: 0 | 1 = 1; // Monday

type WeekViewProps = ViewSharedProps & {
  selectionType: CalendarSelectionType;
  value?: DateValue | DateValue[] | DateRange;
  onChange?: (value: DateValue | DateValue[] | DateRange) => void;
};

function getSelectedWeekStarts(
  selectionType: CalendarSelectionType,
  value?: DateValue | DateValue[] | DateRange
): Date[] {
  if (selectionType === 'range') {
    const range = value as DateRange | undefined;
    const results: Date[] = [];
    const from = toDateOrUndefined(range?.from);
    const to = toDateOrUndefined(range?.to);
    if (from) results.push(startOfWeek(from, { weekStartsOn: WEEK_STARTS_ON }));
    if (to) results.push(startOfWeek(to, { weekStartsOn: WEEK_STARTS_ON }));
    return results;
  }
  if (selectionType === 'multiple') {
    const dates = (value as DateValue[] | undefined) ?? [];
    return dates
      .map((d) => toDateOrUndefined(d))
      .filter((d): d is Date => d != null)
      .map((d) => startOfWeek(d, { weekStartsOn: WEEK_STARTS_ON }));
  }
  const single = toDateOrUndefined(value as DateValue);
  return single ? [startOfWeek(single, { weekStartsOn: WEEK_STARTS_ON })] : [];
}

export function WeekView({
  navDate,
  onNavDateChange,
  onDrillUp,
  selectionType,
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  readOnly,
}: WeekViewProps) {
  const weeks = getWeeksInMonth(navDate.getFullYear(), navDate.getMonth(), WEEK_STARTS_ON);
  const selectedStarts = getSelectedWeekStarts(selectionType, value);

  const rangeFrom =
    selectionType === 'range'
      ? toDateOrUndefined((value as DateRange | undefined)?.from)
      : undefined;
  const rangeTo =
    selectionType === 'range' ? toDateOrUndefined((value as DateRange | undefined)?.to) : undefined;

  const today = new Date();
  const todayWeekStart = startOfWeek(today, { weekStartsOn: WEEK_STARTS_ON });

  const isWeekDisabled = (start: Date, end: Date) => {
    if (minDate && isBefore(end, minDate)) return true;
    if (maxDate && isAfter(start, maxDate)) return true;
    return false;
  };

  const isWeekSelected = (start: Date) => selectedStarts.some((s) => isSameWeekStart(s, start));

  const isWeekInRange = (start: Date, end: Date) => {
    if (!rangeFrom || !rangeTo) return false;
    return !isBefore(end, rangeFrom) && !isAfter(start, rangeTo);
  };

  const isRangeEndpoint = (start: Date) => {
    if (!rangeFrom || !rangeTo) return false;
    return (
      isSameDay(start, startOfWeek(rangeFrom, { weekStartsOn: WEEK_STARTS_ON })) ||
      isSameDay(start, startOfWeek(rangeTo, { weekStartsOn: WEEK_STARTS_ON }))
    );
  };

  const isTodayWeek = (start: Date) => isSameDay(start, todayWeekStart);

  const isCurrentMonth = (start: Date, end: Date) =>
    isWithinInterval(today, { start, end }) ||
    (start.getMonth() === today.getMonth() && start.getFullYear() === today.getFullYear());

  const handleWeekClick = (start: Date, end: Date) => {
    if (disabled || readOnly || isWeekDisabled(start, end)) return;

    if (selectionType === 'single') {
      onChange?.(isWeekSelected(start) ? undefined : start);
    } else if (selectionType === 'multiple') {
      const current = (value as DateValue[] | undefined) ?? [];
      if (isWeekSelected(start)) {
        onChange?.(
          current.filter((d) => {
            const parsed = toDateOrUndefined(d);
            if (!parsed) return true;
            return !isSameWeekStart(startOfWeek(parsed, { weekStartsOn: WEEK_STARTS_ON }), start);
          })
        );
      } else {
        onChange?.([...current, start]);
      }
    } else {
      const range = (value as DateRange | undefined) ?? { from: undefined, to: undefined };
      const from = toDateOrUndefined(range.from);
      const to = toDateOrUndefined(range.to);
      if (!from || (from && to)) {
        onChange?.({ from: start, to: undefined });
      } else {
        const rangeStart = start < from ? start : from;
        const rangeEnd = start < from ? from : start;
        onChange?.({ from: rangeStart, to: endOfWeek(rangeEnd, { weekStartsOn: WEEK_STARTS_ON }) });
      }
    }
  };

  return (
    <div className="w-full p-3">
      <ViewHeader
        title={format(navDate, 'MMMM yyyy')}
        onPrev={() => onNavDateChange(subMonths(navDate, 1))}
        onNext={() => onNavDateChange(addMonths(navDate, 1))}
        onTitleClick={onDrillUp}
        prevLabel="Previous month"
        nextLabel="Next month"
      />

      <div className="mt-3 flex flex-col gap-1">
        {weeks.map(({ weekNumber, start, end }) => {
          const isDisabled = isWeekDisabled(start, end);
          const selected = isWeekSelected(start);
          const inRange = selectionType === 'range' && isWeekInRange(start, end);
          const endpoint = selectionType === 'range' && isRangeEndpoint(start);
          const isToday = isTodayWeek(start);
          const isCurrent = isCurrentMonth(start, end);

          return (
            <button
              key={start.toISOString()}
              type="button"
              disabled={isDisabled || disabled}
              onClick={() => handleWeekClick(start, end)}
              className={cn(
                'flex h-9 w-full items-center justify-between rounded-md px-3 text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                'disabled:pointer-events-none disabled:opacity-40',
                selected || endpoint
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : inRange
                    ? 'bg-accent text-accent-foreground hover:bg-accent/80'
                    : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <span
                className={cn(
                  'w-8 shrink-0 text-left text-xs tabular-nums',
                  selected || endpoint ? 'text-primary-foreground/70' : 'text-muted-foreground',
                  isToday && !selected && !endpoint && 'font-semibold text-primary'
                )}
              >
                W{weekNumber}
              </span>
              <span
                className={cn(
                  'font-medium',
                  !isCurrent && !selected && !endpoint && 'text-muted-foreground'
                )}
              >
                {format(start, 'MMM d')} – {format(end, 'MMM d')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

WeekView.displayName = 'WeekView';
