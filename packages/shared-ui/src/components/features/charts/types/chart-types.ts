import type * as React from 'react';
import type { UOM } from '../../../../types/uom';
import type { TimeGranularity } from '../../../../types/date';
import type { ChartHeight, ChartMarginPreset } from '../utils/chart-theme';

/**
 * Chart margin configuration
 * Compatible with Recharts margin prop
 */
export type ChartMargin = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

/**
 * Base props shared by all chart components
 */
export interface BaseChartProps {
  /** Chart height - semantic token or custom CSS class */
  height?: ChartHeight | string;
  /** Chart margin - preset or custom object */
  margin?: ChartMarginPreset | ChartMargin;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: Error | null;
  /** Empty state (no data) */
  empty?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Chart axis configuration props
 */
export interface ChartAxisProps {
  /** Time granularity for X-axis labels */
  timeGranularity?: TimeGranularity;
  /** Unit of measure for Y-axis labels */
  uom?: UOM;
  /** Show grid lines */
  showGrid?: boolean;
  /** Show X-axis */
  showXAxis?: boolean;
  /** Show Y-axis */
  showYAxis?: boolean;
  /** Custom X-axis tick formatter (overrides default timeGranularity formatting) */
  xAxisFormatter?: (value: string | number) => string;
  /** Custom Y-axis tick formatter (overrides default UOM formatting) */
  yAxisFormatter?: (value: number) => string;
}

/**
 * Generic chart data point
 * Flexible structure for various chart types
 */
export interface ChartDataPoint {
  [key: string]: string | number | Date | null | undefined;
}

/**
 * Common chart interaction props
 */
export interface ChartInteractionProps {
  /** Show tooltip on hover */
  showTooltip?: boolean;
  /** Show legend */
  showLegend?: boolean;
  /** Enable brush for zooming */
  showBrush?: boolean;
  /** Custom tooltip formatter */
  tooltipFormatter?: (value: any, name: string) => React.ReactNode;
  /** Custom label formatter (receives string | number from Recharts tooltip) */
  labelFormatter?: (label: string | number, payload?: any) => string;
}

/**
 * Chart container props
 * Combines all common props
 */
export interface ChartContainerProps extends BaseChartProps, ChartAxisProps, ChartInteractionProps {
  /** Chart data */
  data: ChartDataPoint[];
  /** Chart configuration for colors/labels */
  config: Record<string, { label?: string; color?: string }>;
}
