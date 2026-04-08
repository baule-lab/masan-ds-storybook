import { parse } from 'date-fns';

/**
 * Convert Date to UTC midnight (00:00:00.000Z)
 */
export function toUTCDate(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

/**
 * Format Date object to YYYY-MM-DD string in UTC
 */
export function formatDateToUTCString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date object in UTC
 */
export function parseUTCString(dateString: string): Date {
  return parse(`${dateString}T00:00:00Z`, "yyyy-MM-dd'T'HH:mm:ss'Z'", new Date());
}

/**
 * Generate years array for year picker
 */
export function generateYears(centerYear: number, range = 12): number[] {
  const startYear = centerYear - Math.floor(range / 2);
  return Array.from({ length: range }, (_, i) => startYear + i);
}

/**
 * Convert DateValue (Date | string | undefined) to Date | undefined
 */
export function toDateOrUndefined(value: Date | string | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  return parseUTCString(value);
}
