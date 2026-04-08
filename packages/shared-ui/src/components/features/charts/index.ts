export { CHART_THEME } from './utils/chart-theme';
export type { ChartHeight, ChartMarginPreset } from './utils/chart-theme';

// Types
export type {
  BaseChartProps,
  ChartAxisProps,
  ChartDataPoint,
  ChartMargin,
  ChartInteractionProps,
  ChartContainerProps,
} from './types/chart-types';

// Hooks
export { useChartFormatter, useChartResponsive } from './hooks/use-chart-formatter';
export type { ChartFormatters } from './hooks/use-chart-formatter';

// Base components
export { ChartWrapper } from './base/chart-wrapper';
export type { ChartWrapperProps } from './base/chart-wrapper';
export { ChartLegend, ChartLegendContent } from '../../ui';

// UI chart primitives
export { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/display/chart';
export type { ChartConfig } from '../../ui/display/chart';

// Re-export color system from shared-ui root
export {
  CHART_COLORS,
  CHART_PALETTE,
  CHART_SEMANTIC_COLORS,
  COLOR_MIGRATION_MAP,
  getChartColor,
  convertHslToOklch,
} from './utils/chart-colors';
export type {
  ChartColor,
  ChartPaletteColor,
  ChartSemanticColor,
} from './utils/chart-colors';
