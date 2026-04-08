import type * as React from 'react';
import type { Payload } from 'recharts/types/component/DefaultTooltipContent';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { TimeGranularity } from '../../../../types/date';
import type { UOM } from '../../../../types/uom';
import type { ChartFormattingAdapter } from '../types/chart-formatting';
import { defaultChartFormattingAdapter } from '../types/chart-formatting';

/**
 * Chart formatter functions
 */
export interface ChartFormatters {
  /** Format X-axis labels (dates/periods) */
  xAxisFormatter: (value: string | number) => string;
  /** Format Y-axis labels (values with units) */
  yAxisFormatter: (value: number) => string;
  /** Format tooltip labels (detailed dates) - for ChartTooltipContent labelFormatter prop */
  tooltipLabelFormatter: (
    value: NameType,
    payload: Payload<ValueType, NameType>[]
  ) => React.ReactNode;
  /** Format tooltip values (numbers with UOM) - for ChartTooltipContent formatter prop */
  tooltipValueFormatter: (
    value: ValueType,
    name: NameType,
    item: Payload<ValueType, NameType>,
    index: number,
    payload: Payload<ValueType, NameType>[]
  ) => React.ReactNode;
}

/**
 * Hook to get chart formatters based on time granularity and unit of measure
 *
 * @param timeGranularity - Time granularity for date formatting
 * @param uom - Unit of measure for value formatting
 * @param formattingAdapter - Optional adapter to override default formatting behavior
 * @returns Chart formatter functions
 */
export function useChartFormatter(
  timeGranularity?: TimeGranularity,
  _uom?: UOM,
  formattingAdapter?: Partial<ChartFormattingAdapter>
): ChartFormatters {
  const adapter: ChartFormattingAdapter = {
    ...defaultChartFormattingAdapter,
    ...formattingAdapter,
  };

  const xAxisFormatter = (value: string | number): string => {
    return adapter.xAxisFormatter(value, timeGranularity);
  };

  const yAxisFormatter = (value: number): string => {
    return adapter.yAxisFormatter(value);
  };

  const tooltipLabelFormatter = (
    value: NameType,
    payload: Payload<ValueType, NameType>[]
  ): React.ReactNode => {
    return adapter.tooltipLabelFormatter(value, payload, timeGranularity);
  };

  const tooltipValueFormatter = (
    value: ValueType,
    name: NameType,
    item: Payload<ValueType, NameType>,
    _index: number,
    _payload: Payload<ValueType, NameType>[]
  ): React.ReactNode => {
    return adapter.tooltipValueFormatter(value, name, item, _index, _payload);
  };

  return {
    xAxisFormatter,
    yAxisFormatter,
    tooltipLabelFormatter,
    tooltipValueFormatter,
  };
}

/**
 * Hook to get responsive chart height based on viewport
 * Automatically adjusts chart height for mobile, tablet, desktop
 *
 * @returns Current chart height class
 */
export function useChartResponsive(): 'sm' | 'md' | 'lg' {
  // Will be implemented with window resize listener
  // For now, returns default
  return 'lg';
}
