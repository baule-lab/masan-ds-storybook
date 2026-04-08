import * as React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '../../../ui/actions/button';
import { cn } from '../../../../lib/utils';
import { toUTCDate, toDateOrUndefined } from '../utils';
import type { DateValue } from '../types';

const YEAR_RANGE = 20;

type Month = {
  number: number;
  name: string;
};

const MONTHS: Month[][] = [
  [
    { number: 0, name: 'Jan' },
    { number: 1, name: 'Feb' },
    { number: 2, name: 'Mar' },
    { number: 3, name: 'Apr' },
  ],
  [
    { number: 4, name: 'May' },
    { number: 5, name: 'Jun' },
    { number: 6, name: 'Jul' },
    { number: 7, name: 'Aug' },
  ],
  [
    { number: 8, name: 'Sep' },
    { number: 9, name: 'Oct' },
    { number: 10, name: 'Nov' },
    { number: 11, name: 'Dec' },
  ],
];

type MonthViewProps = {
  value: DateValue;
  onChange: (date: DateValue) => void;
  minDate?: Date;
  maxDate?: Date;
  onClose?: () => void;
};

export function MonthView({ value, onChange, minDate, maxDate, onClose }: MonthViewProps) {
  const dateValue = toDateOrUndefined(value);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = React.useState<number>(dateValue?.getFullYear() ?? currentYear);

  const selectedMonth = dateValue?.getMonth();
  const selectedYear = dateValue?.getFullYear();

  const minYear = minDate?.getFullYear() ?? currentYear - YEAR_RANGE;
  const maxYear = maxDate?.getFullYear() ?? currentYear + YEAR_RANGE;

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  const handleMonthSelect = (monthNumber: number) => {
    const newDate = new Date(year, monthNumber, 1);
    onChange(toUTCDate(newDate));
    onClose?.();
  };

  const isMonthDisabled = (monthNumber: number): boolean => {
    if (
      maxDate &&
      (year > maxDate.getFullYear() ||
        (year === maxDate.getFullYear() && monthNumber > maxDate.getMonth()))
    ) {
      return true;
    }
    if (
      minDate &&
      (year < minDate.getFullYear() ||
        (year === minDate.getFullYear() && monthNumber < minDate.getMonth()))
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="w-[280px] p-3">
      <div className="relative flex items-center justify-center pt-1 pb-4">
        <div className="relative">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="h-7 w-24 cursor-pointer appearance-none rounded-md border border-input bg-background px-2 pr-6 text-center font-medium text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-1 h-4 w-4 -translate-y-1/2 opacity-50" />
        </div>
        <button
          type="button"
          onClick={() => setYear(year - 1)}
          disabled={year <= minYear}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'absolute left-1 inline-flex h-7 w-7 items-center justify-center p-0'
          )}
        >
          <ChevronLeft className="h-4 w-4 opacity-50" />
        </button>
        <button
          type="button"
          onClick={() => setYear(year + 1)}
          disabled={year >= maxYear}
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
          {MONTHS.map((monthRow, rowIndex) => (
            <tr key={`row-${rowIndex}`} className="mt-2 flex w-full">
              {monthRow.map((month) => {
                const isSelected = selectedMonth === month.number && selectedYear === year;
                const isDisabled = isMonthDisabled(month.number);

                return (
                  <td key={month.number} className="relative h-10 w-1/4 p-0 text-center text-sm">
                    <button
                      type="button"
                      onClick={() => handleMonthSelect(month.number)}
                      disabled={isDisabled}
                      className={cn(
                        buttonVariants({
                          variant: isSelected ? 'default' : 'ghost',
                        }),
                        'h-full w-full p-0 font-normal'
                      )}
                    >
                      {month.name}
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

MonthView.displayName = 'MonthView';
