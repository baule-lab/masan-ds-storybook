export const TIME_GRANULARITY = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export type TimeGranularity = (typeof TIME_GRANULARITY)[keyof typeof TIME_GRANULARITY];
