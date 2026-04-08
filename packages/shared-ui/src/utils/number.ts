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
