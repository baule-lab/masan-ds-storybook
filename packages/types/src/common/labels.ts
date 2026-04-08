import { UOM } from './uom';
import { TIME_GRANULARITY } from './date-time';

/**
 * Human-readable labels for UOM constants
 */
export const UOM_LABELS: Record<UOM, string> = {
  [UOM.CASE]: 'Cases',
  [UOM.VND]: 'VND',
} as const;

/**
 * Human-readable labels for Time Granularity constants
 */
export const TIME_GRANULARITY_LABELS: Record<
  (typeof TIME_GRANULARITY)[keyof typeof TIME_GRANULARITY],
  string
> = {
  [TIME_GRANULARITY.DAY]: 'Day',
  [TIME_GRANULARITY.WEEK]: 'Week',
  [TIME_GRANULARITY.MONTH]: 'Month',
  [TIME_GRANULARITY.YEAR]: 'Year',
} as const;
