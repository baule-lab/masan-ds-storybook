/**
 * Format number to Vietnamese currency format with automatic unit (triệu, tỷ, nghìn tỷ)
 * @param value - Number to format
 * @param options - Formatting options
 * @returns Formatted string (e.g., "1.5 triệu", "2.3 tỷ")
 */
export function formatMoney(
  value: number,
  options?: {
    showUnit?: boolean;
    decimals?: number;
    locale?: string;
  }
): string {
  const { showUnit = true, decimals = 3, locale = 'en-US' } = options || {};

  if (value === 0) return '0';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  // Nghìn tỷ (trillion) - >= 1,000,000,000,000
  if (absValue >= 1_000_000_000_000) {
    const formatted = (absValue / 1_000_000_000_000).toFixed(decimals);
    return `${sign}${formatted}${showUnit ? ' trillion' : ''}`;
  }

  // Tỷ (billion) - >= 1,000,000,000
  if (absValue >= 1_000_000_000) {
    const formatted = (absValue / 1_000_000_000).toFixed(decimals);
    return `${sign}${formatted}${showUnit ? ' billion' : ''}`;
  }

  // Triệu (million) - >= 1,000,000
  if (absValue >= 1_000_000) {
    const formatted = (absValue / 1_000_000).toFixed(decimals);
    return `${sign}${formatted}${showUnit ? ' million' : ''}`;
  }

  // Nghìn (thousand) - >= 1,000
  if (absValue >= 1_000) {
    const formatted = (absValue / 1_000).toFixed(decimals);
    return `${sign}${formatted}${showUnit ? ' thousand' : ''}`;
  }

  // Số nhỏ hơn 1000
  return `${sign}${absValue.toLocaleString(locale)}`;
}

/**
 * Format number with locale and options
 * @param value - Number to format
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted string
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('vi-VN', options).format(value);
}

/**
 * Format to VND currency
 * @param value - Number to format
 * @param compact - Use compact notation (1M, 1B)
 * @returns Formatted string with ₫ symbol
 */
export function formatVND(value: number, compact = false): string {
  if (compact) {
    return `${formatMoney(value, { showUnit: true, decimals: 1 })} ₫`;
  }

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format large numbers with K, M, B, T, Q notation (English style)
 * @param value - Number to format
 * @param decimals - Number of decimal places (undefined = full precision)
 * @returns Formatted string (e.g., "1.5K", "2.3M", "1.2B", "3.4T", "5.6Q")
 */
export function formatCompact({ value, decimals }: { value: number; decimals?: number }): string {
  // Handle edge cases
  if (!value || value === 0) return '0';
  if (!Number.isFinite(value)) return '0';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  // Helper: format number with optional fixed decimals
  const fmt = (n: number) => (decimals !== undefined ? n.toFixed(decimals) : String(n));

  // Quadrillion (Q) - >= 1,000,000,000,000,000
  if (absValue >= 1_000_000_000_000_000) {
    return `${sign}${fmt(absValue / 1_000_000_000_000_000)}Q`;
  }

  // Trillion (T) - >= 1,000,000,000,000
  if (absValue >= 1_000_000_000_000) {
    return `${sign}${fmt(absValue / 1_000_000_000_000)}T`;
  }

  // Billion (B) - >= 1,000,000,000
  if (absValue >= 1_000_000_000) {
    return `${sign}${fmt(absValue / 1_000_000_000)}B`;
  }

  // Million (M) - >= 1,000,000
  if (absValue >= 1_000_000) {
    return `${sign}${fmt(absValue / 1_000_000)}M`;
  }

  // Thousand (K) - >= 1,000
  if (absValue >= 1_000) {
    return `${sign}${fmt(absValue / 1_000)}K`;
  }

  return `${sign}${fmt(absValue)}`;
}
