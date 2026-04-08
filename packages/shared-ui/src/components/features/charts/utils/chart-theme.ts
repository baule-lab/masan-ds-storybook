import type { ChartMargin } from '../types/chart-types';

/**
 * Chart theme configuration
 * All values follow design system standards
 */
export const CHART_THEME = {
  /**
   * Standard chart heights
   * Use semantic names for consistency
   */
  heights: {
    sm: 'h-[200px]',
    md: 'h-[300px]',
    lg: 'h-[400px]',
    xl: 'h-[500px]',
  },

  /**
   * Chart margins (Recharts format)
   * Controls spacing around chart area
   *
   * Note: Left margin prevents Y-axis label truncation
   * Values follow design system 8px spacing grid
   */
  margins: {
    /** Standard margin for most charts */
    default: { top: 16, right: 16, left: 16, bottom: 8 } as ChartMargin,
    /** Compact margin for dense layouts */
    compact: { top: 8, right: 8, left: 12, bottom: 0 } as ChartMargin,
    /** Spacious margin for featured charts */
    spacious: { top: 24, right: 24, left: 24, bottom: 8 } as ChartMargin,
  },

  /**
   * Typography settings for chart elements
   */
  typography: {
    /** Axis labels (X, Y) */
    axis: {
      fontSize: 12,
      fontFamily: 'inherit',
    },
    /** Tooltip content */
    tooltip: {
      fontSize: 13,
      fontFamily: 'inherit',
    },
    /** Legend labels */
    legend: {
      fontSize: 12,
      fontFamily: 'inherit',
    },
  },

  /**
   * Grid styling
   */
  grid: {
    /** Dashed line pattern */
    strokeDasharray: '4 4 4',
    /** Grid line opacity */
    strokeOpacity: 1,
    /** Grid line color */
    stroke: '#e2e8f0',
  },

  /**
   * Animation settings
   */
  animations: {
    /** Animation duration in milliseconds */
    duration: 300,
    /** Easing function */
    easing: 'ease-in-out' as const,
  },
} as const;

/**
 * Type for chart height keys
 */
export type ChartHeight = keyof typeof CHART_THEME.heights;

/**
 * Type for chart margin presets
 */
export type ChartMarginPreset = keyof typeof CHART_THEME.margins;
