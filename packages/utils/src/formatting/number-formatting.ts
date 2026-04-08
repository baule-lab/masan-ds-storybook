/**
 * Number formatting utilities for consistent display across the application
 * Handles currency, percentages, compact numbers, and general number formatting
 */

/**
 * Format number as currency with locale-specific formatting
 * @param value - The numeric value to format
 * @param currency - Currency code (default: 'VND')
 * @param locale - Locale for formatting (default: 'vi-VN')
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234567) // "1.234.567 ₫"
 * formatCurrency(1234.56, 'USD', 'en-US') // "$1,234.56"
 */
export function formatCurrency(value: number, currency = 'VND', locale = 'vi-VN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(value);
}

/**
 * Format number with locale-specific thousand separators
 * @param value - The numeric value to format
 * @param options - Intl.NumberFormatOptions for custom formatting
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.567, { maximumFractionDigits: 2 }) // "1,234.57"
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', options).format(value);
}

/**
 * Format number as percentage with specified decimal places
 * @param value - The numeric value (e.g., 0.15 for 15% or 15 for 15%)
 * @param decimals - Number of decimal places (default: 0)
 * @param alreadyPercentage - If true, value is already in percentage form (default: false)
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentage(0.15) // "15%"
 * formatPercentage(15, 0, true) // "15%"
 * formatPercentage(0.1567, 2) // "15.67%"
 */
export function formatPercentage(value: number, decimals = 0, alreadyPercentage = false): string {
  const percentValue = alreadyPercentage ? value : value * 100;
  return `${percentValue.toFixed(decimals)}%`;
}

/**
 * Format large numbers in compact notation (K, M, B, T, Q)
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted compact number string
 *
 * @example
 * formatCompactNumber(1500) // "1.5k"
 * formatCompactNumber(1500000) // "1.5M"
 * formatCompactNumber(1500000000) // "1.5B"
 * formatCompactNumber(1500000000000) // "1.5T"
 * formatCompactNumber(150000, 0) // "150k"
 */
export function formatCompactNumber(value: number, decimals = 2): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  // Quadrillion (Q) - >= 1,000,000,000,000,000
  if (absValue >= 1_000_000_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000_000_000).toFixed(decimals)}Q`;
  }
  // Trillion (T) - >= 1,000,000,000,000
  if (absValue >= 1_000_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000_000).toFixed(decimals)}T`;
  }
  // Billion (B) - >= 1,000,000,000
  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(decimals)}B`;
  }
  // Million (M) - >= 1,000,000
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(decimals)}M`;
  }
  // Thousand (k) - >= 1,000
  if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(decimals)}k`;
  }
  return `${sign}${absValue.toFixed(decimals)}`;
}
