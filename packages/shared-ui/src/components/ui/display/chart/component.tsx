'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '../../../../lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

/**
 * Builds CSS custom properties from chart config for use in inline styles.
 * This approach avoids dangerouslySetInnerHTML entirely.
 */
function buildChartColorStyles(config: ChartConfig): React.CSSProperties {
  const styles: Record<string, string> = {};

  Object.entries(config).forEach(([key, itemConfig]) => {
    // Use light theme color by default, or fall back to color property
    const color = itemConfig.theme?.light || itemConfig.color;
    if (color) {
      styles[`--color-${key}`] = color;
    }
  });

  return styles as React.CSSProperties;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  style,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  // Build color CSS custom properties from config
  const colorStyles = buildChartColorStyles(config);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden",
          className
        )}
        style={{ ...colorStyles, ...style }}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartTooltip = RechartsPrimitive.Tooltip;

/**
 * Tooltip content component for charts with customizable indicators
 *
 * @param indicator - Visual indicator type before label
 *   - 'dot': 10px × 10px rounded square (default)
 *   - 'line': 4px wide vertical bar
 *   - 'dashed': Borderless dashed line
 *   - 'box': 12px × 12px color box for prominent visual identification
 * @param hideIndicator - Hide the color indicator
 * @param hideLabel - Hide the tooltip label
 * @param showTotal - Show total row for stacked charts (default: true)
 * @param labelFormatter - Custom formatter for tooltip label
 * @param formatter - Custom formatter for tooltip values
 * @param nameKey - Key to use for series name
 * @param labelKey - Key to use for label
 */
function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  showTotal = true,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<'div'> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed' | 'box';
    nameKey?: string;
    labelKey?: string;
    showTotal?: boolean;
  }) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === 'string'
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn('font-medium', labelClassName)}>{labelFormatter(value, payload)}</div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn('font-medium', labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  // Calculate total for stacked charts (multiple series)
  const { isStacked, total } = React.useMemo(() => {
    const filtered = payload?.filter((item) => item.type !== 'none') || [];
    const stacked = filtered.length > 1;

    if (!stacked) {
      return { isStacked: false, total: 0 };
    }

    const sum = filtered.reduce((acc, item) => {
      const value = item.value;
      // Handle array values (stacked range charts) - use first element
      if (Array.isArray(value)) {
        return acc + (typeof value[0] === 'number' ? value[0] : 0);
      }
      // Handle numeric values
      if (typeof value === 'number') {
        return acc + value;
      }
      // Null/undefined/string treated as 0
      return acc;
    }, 0);

    return { isStacked: true, total: sum };
  }, [payload]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      className={cn(
        'grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== 'none')
          .map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload?.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center'
                )}
              >
                {itemConfig?.icon ? (
                  <itemConfig.icon />
                ) : (
                  !hideIndicator && (
                    <div
                      className={cn('shrink-0', {
                        'h-2.5 w-2.5 rounded-[2px]': indicator === 'dot',
                        'w-1 rounded-[2px]': indicator === 'line',
                        'w-0': indicator === 'dashed',
                        'my-0.5': nestLabel && indicator === 'dashed',
                        'h-3 w-3 rounded-sm': indicator === 'box',
                      })}
                      style={
                        {
                          backgroundColor: indicator === 'dashed' ? 'transparent' : indicatorColor,
                          borderColor: indicatorColor,
                          borderWidth: indicator === 'dashed' ? '1.5px' : '1px',
                          borderStyle: indicator === 'dashed' ? 'dashed' : 'solid',
                        } as React.CSSProperties
                      }
                    />
                  )
                )}
                {formatter && item.value !== undefined && item.name ? (
                  <div
                    className={cn(
                      'flex flex-1 justify-between leading-none',
                      nestLabel ? 'items-end' : 'items-center'
                    )}
                  >
                    {formatter(item.value, item.name, item, index, item.payload)}
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex flex-1 justify-between leading-none',
                      nestLabel ? 'items-end' : 'items-center'
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}{' '}
                      </span>
                    </div>
                    {item.value && (
                      <span className="pl-3 font-medium font-mono text-foreground tabular-nums">
                        {item.value.toLocaleString()}{' '}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

        {/* Total row for stacked charts */}
        {isStacked && showTotal && (
          <div className="mt-1.5 flex w-full flex-wrap items-stretch gap-2 border-border border-t pt-1.5 font-semibold text-xs">
            {formatter ? (
              formatter(
                total,
                'Total',
                { value: total, payload: {}, color: undefined },
                -1,
                payload
              )
            ) : (
              <>
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium font-mono text-foreground tabular-nums">
                  {total.toLocaleString()}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  nameKey,
}: React.ComponentProps<'div'> &
  Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
    hideIcon?: boolean;
    nameKey?: string;
  }) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-4', className)}>
      {payload
        .filter((item) => item.type !== 'none')
        .map((item) => {
          const key = `${nameKey || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value}
              className={cn(
                'flex items-center justify-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground'
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              <span className="text-muted-foreground">{itemConfig?.label || item.value}</span>
            </div>
          );
        })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent };
