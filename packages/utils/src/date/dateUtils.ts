import { TIME_GRANULARITY, type TimeGranularity } from '@masan-group/types/common';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format as fnsFormat,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';

/**
 * Calculate number of forecast periods based on start/end dates and granularity
 * @param startDate - Start date string (ISO format)
 * @param endDate - End date string (ISO format)
 * @param granularity - Time granularity (week, month, year)
 * @returns Number of periods, defaults to 6 if invalid input
 */
export function calculateNumForecastPeriods(
  startDate: string | undefined,
  endDate: string | undefined,
  granularity: TimeGranularity
): number {
  if (!startDate || !endDate) return 6; // Default to 6 periods

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) return 6; // Invalid range, return default

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (granularity === TIME_GRANULARITY.WEEK) {
    return Math.ceil(diffDays / 7);
  }

  if (granularity === TIME_GRANULARITY.MONTH) {
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(1, months);
  }

  if (granularity === TIME_GRANULARITY.YEAR) {
    return Math.max(1, end.getFullYear() - start.getFullYear());
  }

  return 6; // Default fallback
}

/**
 * Format timezone offset as ±HH:MM string
 * @param offsetMinutes - Timezone offset in minutes (from getTimezoneOffset)
 * @returns Formatted offset string (e.g., '+05:30', '-08:00', 'Z')
 */
function formatTimezoneOffset(offsetMinutes: number): string {
  if (offsetMinutes === 0) return 'Z';

  // getTimezoneOffset returns positive for west of UTC, negative for east
  // We need to invert the sign for ISO format
  const sign = offsetMinutes <= 0 ? '+' : '-';
  const absOffset = Math.abs(offsetMinutes);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;

  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Convert date to ISO string with local timezone offset
 * @param date - Date or string to convert
 * @returns ISO-formatted string with timezone offset (e.g., '2024-01-15T10:30:00.000+05:30')
 * @example
 * toISOWithTimezone(new Date('2024-01-15T10:30:00')) // '2024-01-15T10:30:00.000-08:00' (in PST)
 * toISOWithTimezone('2024-01-15') // '2024-01-15'
 * toISOWithTimezone(undefined) // ''
 */
export function toISOWithTimezone(date: Date | string | undefined): string {
  try {
    if (!date) return '';
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    const milliseconds = String(d.getMilliseconds()).padStart(3, '0');
    const offset = formatTimezoneOffset(d.getTimezoneOffset());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offset}`;
  } catch (error) {
    console.error(error);
    return '';
  }
}

/**
 * Convert date to ISO string in zulu
 * @param date - Date or string
 * @returns ISO string or empty string if date is falsy
 * @example
 * toISOString('2024-01-01') // '2024-01-01T00:00:00.000Z'
 * toISOString(new Date('2024-01-01')) // '2024-01-01T00:00:00.000Z'
 * toISOString(undefined) // ''
 */
export function toISOString(date: Date | string | undefined): string {
  try {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Format date to display locale string
 * @param date - Date string or Date object
 * @param format - Format type (date-fns format pattern)
 * @returns Formatted date string
 * @example
 * formatDate('2024-01-01') // 'Jan 01, 2024 00:00'
 * formatDate(new Date('2024-01-01')) // 'Jan 01, 2024 00:00'
 * formatDate(undefined) // ''
 */
export function formatDate(
  date: string | Date,
  format?:
    | 'MMM dd, yyyy HH:mm'
    | 'MMM dd, yyyy'
    | 'yyyy-MM-dd'
    | 'dd-MM-yyyy'
    | 'dd-MM-yyyy HH:mm:ss'
    | 'dd/MM/yyyy'
    | 'MM/dd/yyyy'
    | 'dd/MM/yyyy HH:mm'
    | 'MM/dd/yyyy HH:mm'
    | 'EEEE, MMMM dd, yyyy'
    | (string & {})
): string {
  try {
    if (!date) return '';
    return fnsFormat(new Date(date), format || 'MMM dd, yyyy HH:mm');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function getStartDate(
  date: string | Date | undefined,
  granularity: 'day' | 'week' | 'month' | 'year'
): Date {
  if (!date) throw new Error('Date is required');
  const d = new Date(date);
  switch (granularity) {
    case 'day':
      return startOfDay(d);
    case 'week':
      return startOfWeek(d);
    case 'month':
      return startOfMonth(d);
    case 'year':
      return startOfYear(d);
    default:
      throw new Error('Invalid granularity');
  }
}

export function getEndDate(
  date: string | Date | undefined,
  granularity: 'day' | 'week' | 'month' | 'year'
): Date {
  if (!date) throw new Error('Date is required');
  const d = new Date(date);
  switch (granularity) {
    case 'day':
      return endOfDay(d);
    case 'week':
      return endOfWeek(d);
    case 'month':
      return endOfMonth(d);
    case 'year':
      return endOfYear(d);
    default:
      throw new Error('Invalid granularity');
  }
}

/**
 * Get date range label based on granularity
 * @param startDate - Start date
 * @param endDate - End date
 * @param granularity - Time granularity
 * @returns Human-readable date range label
 */
export function getDateRangeLabel(
  startDate: string | Date,
  endDate: string | Date,
  granularity: TimeGranularity
): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  const numPeriods = calculateNumForecastPeriods(
    start.toISOString(),
    end.toISOString(),
    granularity
  );

  const granularityLabel =
    granularity === TIME_GRANULARITY.WEEK
      ? 'weeks'
      : granularity === TIME_GRANULARITY.MONTH
        ? 'months'
        : 'years';

  return `${numPeriods} ${granularityLabel} (${formatDate(start, 'short')} - ${formatDate(end, 'short')})`;
}

/* -----------------------------
   Date Alignment Functions
--------------------------------*/

/**
 * Align week start to Monday 00:00:00.000 UTC
 */
function alignWeekStart(date: Date): Date {
  const day = date.getUTCDay(); // Sun=0..Sat=6
  const diff = day === 0 ? -6 : 1 - day; // Monday=1
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + diff, 0, 0, 0, 0)
  );
}

/**
 * Align week end to Sunday 23:59:59.999 UTC
 */
function alignWeekEnd(date: Date): Date {
  const day = date.getUTCDay();
  const diff = day === 0 ? 0 : 7 - day; // Sunday
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + diff, 23, 59, 59, 999)
  );
}

/**
 * Align month start to first day 00:00:00.000 UTC
 */
function alignMonthStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
}

/**
 * Align month end to last day 23:59:59.999 UTC
 */
function alignMonthEnd(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      0, // 0 = last day of previous month
      23,
      59,
      59,
      999
    )
  );
}

/**
 * Align year start to Jan 1 00:00:00.000 UTC
 */
function alignYearStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
}

/**
 * Align year end to Dec 31 23:59:59.999 UTC
 */
function alignYearEnd(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
}

/**
 * Build aligned date range based on granularity
 * @param startIso - Start date in ISO format
 * @param endIso - End date in ISO format
 * @param granularity - Time granularity (week, month, year)
 * @returns Object with aligned start_date and end_date in ISO format
 */
export function buildAlignedRange(
  startIso: string,
  endIso: string,
  granularity: TimeGranularity
): {
  start_date: string;
  end_date: string;
} {
  const start = new Date(startIso);
  const end = new Date(endIso);

  let alignedStart: Date;
  let alignedEnd: Date;

  switch (granularity) {
    case TIME_GRANULARITY.WEEK:
      alignedStart = alignWeekStart(start);
      alignedEnd = alignWeekEnd(end);
      break;

    case TIME_GRANULARITY.MONTH:
      alignedStart = alignMonthStart(start);
      alignedEnd = alignMonthEnd(end);
      break;

    case TIME_GRANULARITY.YEAR:
      alignedStart = alignYearStart(start);
      alignedEnd = alignYearEnd(end);
      break;

    default:
      throw new Error(`Unsupported granularity: ${granularity}`);
  }

  return {
    start_date: alignedStart.toISOString(),
    end_date: alignedEnd.toISOString(),
  };
}
