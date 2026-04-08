/**
 * Generates page numbers for pagination with ellipsis
 * @param currentPage - Current page number (1-based)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and ellipsis strings
 *
 * Examples:
 * - Small dataset (≤5 pages): [1, 2, 3, 4, 5]
 * - Near beginning: [1, 2, 3, 4, '...', 10]
 * - In middle: [1, '...', 4, 5, 6, '...', 10]
 * - Near end: [1, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5;
  const rangeWithDots: (string | number)[] = [];

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i);
    }
  } else {
    rangeWithDots.push(1);

    if (currentPage <= 3) {
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push('...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      rangeWithDots.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i);
      }
    } else {
      rangeWithDots.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push('...', totalPages);
    }
  }

  return rangeWithDots;
}

/**
 * Functions to convert numbers
 *
 * @example
 * toNumber('1234567890') // 1234567890
 * @param value - The string to convert
 * @returns The number
 */
export function toNumber(value: string | number | undefined | null): number {
  try {
    return Number(value);
  } catch (error) {
    console.error(error);
    return 0;
  }
}

/**
 * Convert a number to a percentage
 * @param value - The number to convert
 * @param precision - The number of decimal places to round to
 * @returns The percentage
 * @example
 * toPercentage(0.1) // 10
 * toPercentage(0.1234567890, 2) // 12.35
 * toPercentage(1) // 100
 * toPercentage(10, 2) // 1000.00
 */
export function toPercentage(
  value: number | string | undefined | null,
  precision?: number
): number {
  if (!value) return 0;
  return Number((toNumber(value) * 100).toFixed(precision ?? 2));
}

/**
 * Convert a percentage to a number
 * @param value - The percentage to convert
 * @param precision - The number of decimal places to round to
 * @returns The number
 * @example
 * fromPercentage(10) // 0.1
 * fromPercentage(100) // 1
 * fromPercentage(100, 2) // 1.00
 * fromPercentage(100.1234567890, 4) // 1.0012
 */
export function fromPercentage(
  value: number | string | undefined | null,
  precision?: number
): number {
  if (!value) return 0;
  return Number((toNumber(value) / 100).toFixed(precision ?? 2));
}
