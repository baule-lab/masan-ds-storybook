import * as React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { endOfMonth } from 'date-fns';
import { buttonVariants } from '../../../ui/actions/button';
import { cn } from '../../../../lib/utils';
import { generateYears, toUTCDate, toDateOrUndefined } from '../utils';
import type { DateRange } from '../types';

type Month = {
  number: number;
  name: string;
  yearOffset: number;
};

const MONTHS: Month[][] = [
  [
    { number: 0, name: 'Jan', yearOffset: 0 },
    { number: 1, name: 'Feb', yearOffset: 0 },
    { number: 2, name: 'Mar', yearOffset: 0 },
    { number: 3, name: 'Apr', yearOffset: 0 },
    { number: 0, name: 'Jan', yearOffset: 1 },
    { number: 1, name: 'Feb', yearOffset: 1 },
    { number: 2, name: 'Mar', yearOffset: 1 },
    { number: 3, name: 'Apr', yearOffset: 1 },
  ],
  [
    { number: 4, name: 'May', yearOffset: 0 },
    { number: 5, name: 'Jun', yearOffset: 0 },
    { number: 6, name: 'Jul', yearOffset: 0 },
    { number: 7, name: 'Aug', yearOffset: 0 },
    { number: 4, name: 'May', yearOffset: 1 },
    { number: 5, name: 'Jun', yearOffset: 1 },
    { number: 6, name: 'Jul', yearOffset: 1 },
    { number: 7, name: 'Aug', yearOffset: 1 },
  ],
  [
    { number: 8, name: 'Sep', yearOffset: 0 },
    { number: 9, name: 'Oct', yearOffset: 0 },
    { number: 10, name: 'Nov', yearOffset: 0 },
    { number: 11, name: 'Dec', yearOffset: 0 },
    { number: 8, name: 'Sep', yearOffset: 1 },
    { number: 9, name: 'Oct', yearOffset: 1 },
    { number: 10, name: 'Nov', yearOffset: 1 },
    { number: 11, name: 'Dec', yearOffset: 1 },
  ],
];

type MonthRangeViewProps = {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  onClose?: () => void;
  autoScroll?: boolean;
};

export function MonthRangeView({
  range,
  onRangeChange,
  minDate,
  maxDate,
  onClose,
  autoScroll = false,
}: MonthRangeViewProps) {
  const fromDate = toDateOrUndefined(range.from);
  const toDate = toDateOrUndefined(range.to);

  const [baseYear, setBaseYear] = React.useState<number>(
    fromDate?.getFullYear() ?? new Date().getFullYear()
  );
  const [selectingStart, setSelectingStart] = React.useState(true);

  const selectedMonthRef = React.useRef<HTMLButtonElement>(null);
  const hasScrolled = React.useRef(false);

  // Reset scroll flag when baseYear or range changes (e.g., preset click)
  React.useEffect(() => {
    hasScrolled.current = false;
  }, [baseYear, range]);

  // Auto scroll to selected month after render
  React.useEffect(() => {
    if (autoScroll && !hasScrolled.current && selectedMonthRef.current) {
      setTimeout(() => {
        selectedMonthRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        hasScrolled.current = true;
      }, 100);
    }
  }, [autoScroll, fromDate, toDate, baseYear]);

  const fromMonth = fromDate?.getMonth();
  const fromYear = fromDate?.getFullYear();
  const toMonth = toDate?.getMonth();
  const toYear = toDate?.getFullYear();

  const handleMonthClick = (month: number, yearOffset: number) => {
    const year = baseYear + yearOffset;
    const monthStart = toUTCDate(new Date(year, month, 1));

    if (selectingStart) {
      onRangeChange({ from: monthStart, to: undefined });
      setSelectingStart(false);
    } else {
      if (!fromDate) {
        onRangeChange({ from: monthStart, to: monthStart });
        setSelectingStart(true);
        // Don't close - wait for second month selection
        return;
      }

      // Normalize to end of month for the selected end month
      const monthEnd = toUTCDate(endOfMonth(new Date(year, month, 1)));

      if (monthStart < fromDate) {
        // If selected date is before start, swap them
        // Start month stays as startOfMonth, end month becomes endOfMonth
        const fromEnd = toUTCDate(endOfMonth(fromDate));
        onRangeChange({ from: monthStart, to: fromEnd });
      } else {
        onRangeChange({ from: fromDate, to: monthEnd });
      }
      setSelectingStart(true);
      onClose?.();
    }
  };

  const isMonthDisabled = (month: number, yearOffset: number): boolean => {
    const year = baseYear + yearOffset;
    if (
      maxDate &&
      (year > maxDate.getFullYear() ||
        (year === maxDate.getFullYear() && month > maxDate.getMonth()))
    ) {
      return true;
    }
    if (
      minDate &&
      (year < minDate.getFullYear() ||
        (year === minDate.getFullYear() && month < minDate.getMonth()))
    ) {
      return true;
    }
    return false;
  };

  const isMonthInRange = (month: number, yearOffset: number): boolean => {
    if (!fromYear || fromMonth === undefined) return false;

    const year = baseYear + yearOffset;
    const currentDate = new Date(year, month, 1).getTime();
    const fromDate = new Date(fromYear, fromMonth ?? 0, 1).getTime();
    const toDate =
      toYear !== undefined && toMonth !== undefined
        ? new Date(toYear, toMonth, 1).getTime()
        : fromDate;

    return currentDate >= fromDate && currentDate <= toDate;
  };

  const isMonthSelected = (month: number, yearOffset: number): boolean => {
    const year = baseYear + yearOffset;
    return (fromYear === year && fromMonth === month) || (toYear === year && toMonth === month);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = generateYears(currentYear, 20);

  return (
    <div className="min-w-[400px] p-3">
      <div className="relative flex items-center justify-evenly pt-1 pb-4">
        <div className="relative w-[100px]">
          <select
            value={baseYear.toString()}
            onChange={(e) => setBaseYear(Number.parseInt(e.target.value, 10))}
            className="h-7 w-full cursor-pointer appearance-none rounded-md border border-input bg-background py-1 pr-6 pl-2 text-center text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-1 h-4 w-4 -translate-y-1/2 opacity-50" />
        </div>
        <button
          type="button"
          onClick={() => setBaseYear(baseYear - 1)}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'absolute left-1 inline-flex h-7 w-7 items-center justify-center p-0'
          )}
        >
          <ChevronLeft className="h-4 w-4 opacity-50" />
        </button>
        <button
          type="button"
          onClick={() => setBaseYear(baseYear + 1)}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'absolute right-1 inline-flex h-7 w-7 items-center justify-center p-0'
          )}
        >
          <ChevronRight className="h-4 w-4 opacity-50" />
        </button>
        <div className="relative w-[100px]">
          <select
            value={(baseYear + 1).toString()}
            onChange={(e) => setBaseYear(Number.parseInt(e.target.value, 10) - 1)}
            className="h-7 w-full cursor-pointer appearance-none rounded-md border border-input bg-background py-1 pr-6 pl-2 text-center text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-1 h-4 w-4 -translate-y-1/2 opacity-50" />
        </div>
      </div>

      <table className="w-full border-collapse">
        <tbody>
          {MONTHS.map((monthRow, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="mt-2 flex w-full">
              {monthRow.map((m, colIndex) => {
                const isSelected = isMonthSelected(m.number, m.yearOffset);
                const isInRange = isMonthInRange(m.number, m.yearOffset);
                const isDisabled = isMonthDisabled(m.number, m.yearOffset);
                const isFirst = fromYear === baseYear + m.yearOffset && fromMonth === m.number;
                const isLast = toYear === baseYear + m.yearOffset && toMonth === m.number;
                const isFirstSelected = isFirst;

                // Check if this is the current month
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                const isCurrentMonth =
                  m.number === currentMonth && baseYear + m.yearOffset === currentYear;

                return (
                  <td
                    key={`${m.number}-${m.yearOffset}`}
                    className={cn(
                      'relative h-10 w-1/8 p-0 text-center text-sm',
                      isInRange && !isSelected && 'bg-accent',
                      isFirst && 'rounded-l-md',
                      isLast && 'rounded-r-md',
                      colIndex === 3 && 'mr-2',
                      colIndex === 4 && 'ml-2'
                    )}
                  >
                    <button
                      ref={isFirstSelected ? selectedMonthRef : undefined}
                      type="button"
                      onClick={() => handleMonthClick(m.number, m.yearOffset)}
                      disabled={isDisabled}
                      className={cn(
                        buttonVariants({
                          variant: isSelected ? 'default' : 'ghost',
                        }),
                        'relative h-full w-full p-0 font-normal'
                      )}
                    >
                      {m.name}
                      {isCurrentMonth && (
                        <span
                          className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary"
                          title="Current month"
                        />
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

MonthRangeView.displayName = 'MonthRangeView';
