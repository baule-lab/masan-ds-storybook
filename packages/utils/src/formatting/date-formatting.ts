/**
 * Date and week formatting utilities for consistent display
 * Handles week numbers, week ranges, and date labels
 */

/**
 * Format week number with "Wk" prefix
 * @param week - Week number (1-52)
 * @returns Formatted week string
 *
 * @example
 * formatWeekNumber(40) // "Wk 40"
 * formatWeekNumber(5) // "Wk 5"
 */
export function formatWeekNumber(week: number): string {
  return `Wk ${week}`;
}

/**
 * Format week range with "W" prefix for start and end
 * @param startWeek - Starting week number
 * @param endWeek - Ending week number
 * @returns Formatted week range string
 *
 * @example
 * formatWeekRange(40, 44) // "W40-W44"
 * formatWeekRange(3, 5) // "W3-W5"
 */
export function formatWeekRange(startWeek: number, endWeek: number): string {
  return `W${startWeek}-W${endWeek}`;
}

/**
 * Get week label with optional year suffix
 * @param week - Week number
 * @param year - Optional year (e.g., 2025)
 * @returns Formatted week label
 *
 * @example
 * getWeekLabel(3) // "W3"
 * getWeekLabel(3, 2025) // "W3 2025"
 */
export function getWeekLabel(week: number, year?: number): string {
  if (year) {
    return `W${week} ${year}`;
  }
  return `W${week}`;
}
