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
