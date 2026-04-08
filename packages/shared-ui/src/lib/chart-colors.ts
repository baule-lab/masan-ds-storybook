/**
 * Chart color utilities for consistent color mapping across promotion visualizations
 * Provides centralized color constants and helper functions
 */

export type PromotionType = 'brand' | 'trade' | 'regional';
export type ConflictStatus = 'ok' | 'conflict';

/**
 * Color mapping for promotion types
 * Used in Gantt charts and timeline visualizations
 */
export const PROMOTION_COLORS: Record<PromotionType, string> = {
  brand: '#3b82f6', // Blue - National brand layer
  trade: '#f97316', // Orange - WCM trade layer
  regional: '#14b8a6', // Teal - Regional push layer
};

/**
 * Color mapping for conflict/approval status
 * Used in status indicators and conflict grids
 */
export const STATUS_COLORS: Record<ConflictStatus, string> = {
  ok: '#10b981', // Green - Approved/no conflict
  conflict: '#ef4444', // Red - Conflict detected
};

/**
 * Consensus status colors for pie charts
 */
export const CONSENSUS_STATUS_COLORS = {
  approved: '#10b981', // Green
  pending: '#f59e0b', // Amber
  conflict: '#ef4444', // Red
};

/**
 * Get color for promotion type
 * @param type - Promotion type (brand, trade, regional)
 * @returns Hex color string
 *
 * @example
 * getPromotionColor('brand') // "#3b82f6"
 * getPromotionColor('trade') // "#f97316"
 */
export function getPromotionColor(type: PromotionType): string {
  return PROMOTION_COLORS[type];
}

/**
 * Get color for conflict status
 * @param status - Status (ok, conflict)
 * @returns Hex color string
 *
 * @example
 * getStatusColor('ok') // "#10b981"
 * getStatusColor('conflict') // "#ef4444"
 */
export function getStatusColor(status: ConflictStatus): string {
  return STATUS_COLORS[status];
}
