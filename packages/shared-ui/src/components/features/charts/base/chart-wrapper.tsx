import type * as React from 'react';

import { CHART_THEME } from '../utils/chart-theme';
import { cn } from '../../../../lib/utils';
import type { BaseChartProps } from '../types/chart-types';
import { type ChartConfig, ChartContainer } from '../../../ui/display/chart';
import { EmptyState } from '../../../ui/feedback/empty-state';
import MLChartLoading from '../../ml-chart-loading/component';

/**
 * Props for ChartWrapper component
 */
export interface ChartWrapperProps extends BaseChartProps {
  /** Chart configuration for colors and labels */
  config: ChartConfig;
  /** Chart content - must be a Recharts chart component */
  children: React.ReactElement;
}

/**
 * ChartWrapper Component
 *
 * Provides consistent loading, error, and empty states for all charts.
 * Automatically applies CHART_THEME height tokens and integrates with ChartContainer.
 *
 * @example
 * ```tsx
 * <ChartWrapper
 *   config={chartConfig}
 *   height="lg"
 *   loading={isLoading}
 *   error={error}
 *   empty={!data.length}
 * >
 *   <LineChart data={data}>...</LineChart>
 * </ChartWrapper>
 * ```
 */
export function ChartWrapper({
  children,
  config,
  height = 'lg',
  loading,
  error,
  empty,
  className,
}: ChartWrapperProps) {
  // Show loading state
  if (loading) {
    return <MLChartLoading variant="wave" chartHeight={height} />;
  }

  // Show error state
  if (error) {
    return <EmptyState variant="error" size="lg" />;
  }

  // Show empty state (no data)
  if (empty) {
    return <EmptyState variant="chart" size="lg" />;
  }

  // Resolve height class from CHART_THEME or use custom value
  const heightClass =
    typeof height === 'string' && height in CHART_THEME.heights
      ? CHART_THEME.heights[height as keyof typeof CHART_THEME.heights]
      : height;

  return (
    <ChartContainer config={config} className={cn(heightClass, 'w-full', className)}>
      {children}
    </ChartContainer>
  );
}
