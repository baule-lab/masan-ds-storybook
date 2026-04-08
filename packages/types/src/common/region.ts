/**
 * Geographic regions
 */
export const REGION = {
  ALL: 'all',
  NORTH: 'north',
  CENTRAL: 'central',
  SOUTH: 'south',
} as const;

export type Region = (typeof REGION)[keyof typeof REGION];

/**
 * @deprecated Use useRegionLabels hook for i18n support
 * Human-readable labels for regions
 */
export const REGION_LABELS: Record<Region, string> = {
  [REGION.ALL]: 'All',
  [REGION.NORTH]: 'North',
  [REGION.CENTRAL]: 'Central',
  [REGION.SOUTH]: 'South',
} as const;
