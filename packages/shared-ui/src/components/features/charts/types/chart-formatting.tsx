import type * as React from 'react';
import type { Payload, NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { formatXAxisLabel } from '../utils/format-x-axis-label';
import { formatDetailedDate } from '../../../../utils/date-formatting';
import { formatCompact } from '../../../../utils/number-formatting';
import type { TimeGranularity } from '../../../../types/date';

export interface ChartFormattingAdapter {
  xAxisFormatter: (value: string | number, granularity?: TimeGranularity) => string;
  yAxisFormatter: (value: number) => string;
  tooltipLabelFormatter: (
    value: NameType,
    payload: Payload<ValueType, NameType>[],
    granularity?: TimeGranularity
  ) => React.ReactNode;
  tooltipValueFormatter: (
    value: ValueType,
    name: NameType,
    item: Payload<ValueType, NameType>,
    index: number,
    payload: Payload<ValueType, NameType>[]
  ) => React.ReactNode;
}

export const defaultChartFormattingAdapter: ChartFormattingAdapter = {
  xAxisFormatter: (value, granularity) =>
    granularity ? formatXAxisLabel(String(value), granularity) : String(value),

  yAxisFormatter: (value) => {
    if (!value && value !== 0) return '';
    return formatCompact(value, 1);
  },

  tooltipLabelFormatter: (value, payload, granularity) => {
    if (!granularity) return String(value);
    const timestamp = payload?.[0]?.payload?.timestamp ?? value;
    return formatDetailedDate(String(timestamp), granularity);
  },

  tooltipValueFormatter: (value, name, item, _index, _payload) => {
    const rawValue = Array.isArray(value) ? value[0] : value;
    const numericValue = rawValue == null ? 0 : Number(rawValue);
    const formattedValue = formatCompact(numericValue, 2);
    const color = item?.color || item?.payload?.fill || item?.stroke;

    return (
      <>
        <span className="text-muted-foreground" style={{ color }}>
          {name}:
        </span>
        <span className="pl-3 font-medium font-mono text-foreground tabular-nums">
          {formattedValue}
        </span>
      </>
    );
  },
};
