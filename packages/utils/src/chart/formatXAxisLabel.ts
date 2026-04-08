import { getISOWeek, getISOWeekYear } from 'date-fns';

/**
 * Format timestamp to readable label based on time granularity
 */
export function formatXAxisLabel(timestamp: string, timeGranularity = 'week'): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;

  switch (timeGranularity) {
    case 'day':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'week': {
      const week = getISOWeek(date);
      const year = getISOWeekYear(date);
      const shortYear = year.toString().slice(-2);
      return `W${week.toString().padStart(2, '0')}/${shortYear}`;
    }
    case 'month': {
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      const year = date.getFullYear().toString().slice(-2);
      return `M${month}/${year}`;
    }
    case 'year':
      return date.getFullYear().toString();
    default:
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }
}
