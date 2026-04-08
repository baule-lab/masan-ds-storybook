import {
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addWeeks,
  getWeek,
  parse,
} from 'date-fns';

export {
  toUTCDate,
  toDateOrUndefined,
  parseUTCString,
  formatDateToUTCString,
} from '../../../../features/date-picker/utils';

/** Floor year to the start of its decade (e.g. 2026 → 2020) */
export function getDecadeStart(year: number): number {
  return Math.floor(year / 10) * 10;
}

/** Return array of 10 years for the given decade start */
export function getDecadeYears(decadeStart: number): number[] {
  return Array.from({ length: 10 }, (_, i) => decadeStart + i);
}

/** Parse a YYYY-MM-DD preset string to a local Date */
export function parsePresetValue(value: string): Date {
  return parse(value, 'yyyy-MM-dd', new Date());
}

/** Format a Date to YYYY-MM-DD string for comparison with preset values */
export function formatToPresetValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export type WeekEntry = {
  weekNumber: number;
  start: Date;
  end: Date;
};

/** Get all weeks that overlap with a given month */
export function getWeeksInMonth(
  year: number,
  month: number,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1
): WeekEntry[] {
  const monthStart = startOfMonth(new Date(year, month, 1));
  const monthEnd = endOfMonth(monthStart);

  const weeks: WeekEntry[] = [];
  let current = startOfWeek(monthStart, { weekStartsOn });

  while (current <= monthEnd) {
    const weekEnd = endOfWeek(current, { weekStartsOn });
    const weekContainsMonthDay =
      (current >= monthStart && current <= monthEnd) ||
      (weekEnd >= monthStart && weekEnd <= monthEnd) ||
      (current <= monthStart && weekEnd >= monthEnd);

    if (weekContainsMonthDay) {
      weeks.push({
        weekNumber: getWeek(current, { weekStartsOn, firstWeekContainsDate: 4 }),
        start: current,
        end: weekEnd,
      });
    }

    current = addWeeks(current, 1);
  }

  return weeks;
}

/** Check if two dates represent the same week start */
export function isSameWeekStart(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Check if a year-month is between two year-months (inclusive) */
export function isMonthInRange(
  year: number,
  month: number,
  fromYear?: number,
  fromMonth?: number,
  toYear?: number,
  toMonth?: number
): boolean {
  if (fromYear == null || fromMonth == null || toYear == null || toMonth == null) return false;
  const val = year * 12 + month;
  const from = fromYear * 12 + fromMonth;
  const to = toYear * 12 + toMonth;
  return val >= Math.min(from, to) && val <= Math.max(from, to);
}

/** Check if a year is between two years (inclusive) */
export function isYearInRange(year: number, fromYear?: number, toYear?: number): boolean {
  if (fromYear == null || toYear == null) return false;
  return year >= Math.min(fromYear, toYear) && year <= Math.max(fromYear, toYear);
}
