import { format, parseISO, isValid } from 'date-fns';

/** Functions to format dates
 *
 * @example
 * formatDate('2024-12-30T00:00:00Z') // '2024-12-30'
 * @param date - The date to format.
 * @param format - The format to use (date-fns format pattern).
 * @returns The formatted date or empty string if the date is invalid.
 */
export function toLocalDateString(date: string | Date, formatPattern?: string): string {
  try {
    if (!date) return '';

    if (typeof date === 'string' && date.startsWith('0001-01-01')) return '';

    const pdate = new Date(date);
    if (Number.isNaN(pdate.getTime())) return '';

    const parsedDate = parseISO(date as string);
    if (!isValid(parsedDate)) return '';

    return format(parsedDate, formatPattern || 'dd/MM/yyyy');
  } catch (error) {
    console.error(error);
    return '';
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
  date: string | number | Date,
  formatPattern?:
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
    return format(new Date(date), formatPattern || 'MMM dd, yyyy HH:mm');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
