import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '../../../ui/actions/button';
import { cn } from '../../../../lib/utils';
import { generateYears, toUTCDate, toDateOrUndefined } from '../utils';
import type { DateRange } from '../types';

type YearRangeViewProps = {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  onClose?: () => void;
  autoScroll?: boolean;
};

export function YearRangeView({
  range,
  onRangeChange,
  minDate,
  maxDate,
  onClose,
  autoScroll = false,
}: YearRangeViewProps) {
  const fromDate = toDateOrUndefined(range.from);
  const toDate = toDateOrUndefined(range.to);

  const currentYear = fromDate?.getFullYear() ?? new Date().getFullYear();
  const [centerYear, setCenterYear] = React.useState<number>(currentYear);
  const [selectingStart, setSelectingStart] = React.useState(true);

  const selectedYearRef = React.useRef<HTMLButtonElement>(null);
  const hasScrolled = React.useRef(false);

  // Reset scroll flag when centerYear or range changes (e.g., preset click)
  React.useEffect(() => {
    hasScrolled.current = false;
  }, [centerYear, range]);

  // Auto scroll to selected year after render
  React.useEffect(() => {
    if (autoScroll && !hasScrolled.current && selectedYearRef.current) {
      setTimeout(() => {
        selectedYearRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        hasScrolled.current = true;
      }, 100);
    }
  }, [autoScroll, fromDate, toDate, centerYear]);

  const years = generateYears(centerYear, 12);
  const fromYear = fromDate?.getFullYear();
  const toYear = toDate?.getFullYear();

  const handleYearClick = (year: number) => {
    const newDate = toUTCDate(new Date(year, 0, 1));

    if (selectingStart) {
      onRangeChange({ from: newDate, to: undefined });
      setSelectingStart(false);
    } else {
      if (!fromDate) {
        onRangeChange({ from: newDate, to: newDate });
        setSelectingStart(true);
        // Don't close - wait for second year selection
        return;
      }

      if (newDate < fromDate) {
        // If selected year is before start, swap them
        onRangeChange({ from: newDate, to: fromDate });
      } else {
        onRangeChange({ from: fromDate, to: newDate });
      }
      setSelectingStart(true);
      onClose?.();
    }
  };

  const isYearDisabled = (year: number): boolean => {
    if (maxDate && year > maxDate.getFullYear()) return true;
    if (minDate && year < minDate.getFullYear()) return true;
    return false;
  };

  const isYearInRange = (year: number): boolean => {
    if (!fromYear) return false;
    const endYear = toYear ?? fromYear;
    return year >= fromYear && year <= endYear;
  };

  const isYearSelected = (year: number): boolean => {
    return fromYear === year || toYear === year;
  };

  // Group years into rows of 4
  const yearRows: number[][] = [];
  for (let i = 0; i < years.length; i += 4) {
    yearRows.push(years.slice(i, i + 4));
  }

  return (
    <div className="w-[280px] p-3">
      <div className="relative flex items-center justify-center pt-1 pb-4">
        <div className="font-medium text-sm">
          {years[0]} - {years[years.length - 1]}
        </div>
        <button
          type="button"
          onClick={() => setCenterYear(centerYear - 12)}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'absolute left-1 inline-flex h-7 w-7 items-center justify-center p-0'
          )}
        >
          <ChevronLeft className="h-4 w-4 opacity-50" />
        </button>
        <button
          type="button"
          onClick={() => setCenterYear(centerYear + 12)}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'absolute right-1 inline-flex h-7 w-7 items-center justify-center p-0'
          )}
        >
          <ChevronRight className="h-4 w-4 opacity-50" />
        </button>
      </div>

      <table className="w-full border-collapse">
        <tbody>
          {yearRows.map((yearRow, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="mt-2 flex w-full">
              {yearRow.map((year) => {
                const isSelected = isYearSelected(year);
                const isInRange = isYearInRange(year);
                const isDisabled = isYearDisabled(year);
                const isFirst = fromYear === year;
                const isLast = toYear === year;
                const isFirstSelected = isFirst;

                // Check if this is the current year
                const currentYear = new Date().getFullYear();
                const isCurrentYear = year === currentYear;

                return (
                  <td
                    key={year}
                    className={cn(
                      'relative h-10 w-1/4 p-0 text-center text-sm',
                      isInRange && !isSelected && 'bg-accent',
                      isFirst && 'rounded-l-md',
                      isLast && 'rounded-r-md'
                    )}
                  >
                    <button
                      ref={isFirstSelected ? selectedYearRef : undefined}
                      type="button"
                      onClick={() => handleYearClick(year)}
                      disabled={isDisabled}
                      className={cn(
                        buttonVariants({
                          variant: isSelected ? 'default' : 'ghost',
                        }),
                        'relative h-full w-full p-0 font-normal'
                      )}
                    >
                      {year}
                      {isCurrentYear && (
                        <span
                          className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary"
                          title="Current year"
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

      <div className="mt-2 text-center text-muted-foreground text-xs">
        {selectingStart ? 'Select start year' : 'Select end year'}
      </div>
    </div>
  );
}

YearRangeView.displayName = 'YearRangeView';
