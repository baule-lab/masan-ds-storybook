import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '../../../ui/actions/button';
import { cn } from '../../../../lib/utils';
import { generateYears, toUTCDate, toDateOrUndefined } from '../utils';
import type { DateValue } from '../types';

type YearViewProps = {
  value: DateValue;
  onChange: (date: DateValue) => void;
  minDate?: Date;
  maxDate?: Date;
  onClose?: () => void;
};

export function YearView({ value, onChange, minDate, maxDate, onClose }: YearViewProps) {
  const dateValue = toDateOrUndefined(value);
  const currentYear = dateValue?.getFullYear() ?? new Date().getFullYear();
  const [centerYear, setCenterYear] = React.useState<number>(currentYear);

  const years = generateYears(centerYear, 12);
  const selectedYear = dateValue?.getFullYear();

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, 0, 1);
    onChange(toUTCDate(newDate));
    onClose?.();
  };

  const isYearDisabled = (year: number): boolean => {
    if (maxDate && year > maxDate.getFullYear()) return true;
    if (minDate && year < minDate.getFullYear()) return true;
    return false;
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
                const isSelected = selectedYear === year;
                const isDisabled = isYearDisabled(year);

                return (
                  <td key={year} className="relative h-10 w-1/4 p-0 text-center text-sm">
                    <button
                      type="button"
                      onClick={() => handleYearSelect(year)}
                      disabled={isDisabled}
                      className={cn(
                        buttonVariants({
                          variant: isSelected ? 'default' : 'ghost',
                        }),
                        'h-full w-full p-0 font-normal'
                      )}
                    >
                      {year}
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

YearView.displayName = 'YearView';
