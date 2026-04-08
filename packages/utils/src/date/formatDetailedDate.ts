import type { TimeGranularity } from '@masan-group/types/common';

/**
 * Format timestamp to detailed date string based on time granularity
 * @param timestamp - ISO timestamp string
 * @param granularity - Time granularity (year, month, week)
 * @returns Formatted date string
 *
 * @example
 * ```ts
 * formatDetailedDate('2024-01-15', 'year')  // "2024"
 * formatDetailedDate('2024-01-15', 'month') // "January 2024"
 * formatDetailedDate('2024-01-15', 'week')  // "Jan 15 - Jan 21, 2024"
 * ```
 */
export function formatDetailedDate(timestamp: string, granularity: TimeGranularity): string {
  const date = new Date(timestamp);

  switch (granularity) {
    case 'year':
      return date.getFullYear().toString();
    case 'month':
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    case 'week': {
      const endDate = new Date(timestamp);
      endDate.setDate(endDate.getDate() + 6);
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    default:
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
  }
}
