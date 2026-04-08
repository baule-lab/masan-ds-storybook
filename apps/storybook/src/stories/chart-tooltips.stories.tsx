import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  useChartFormatter,
} from '@masan-group/shared-ui/charts';

/**
 * Chart Tooltip Patterns using useChartFormatter hook
 *
 * Demonstrates standardized tooltip formatting across different chart types.
 * Phase 1 implementation provides consistent date and value formatting.
 *
 * **Key Features**:
 * - tooltipLabelFormatter: Formats tooltip dates with time granularity support
 * - tooltipValueFormatter: Formats values with UOM (VND, cases) awareness
 * - Centralized formatting via @masan-group/utils (formatCompact, formatDetailedDate)
 * - Type-safe Recharts integration
 *
 * **Usage Pattern**:
 * ```tsx
 * const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter('week', 'vnd');
 *
 * <ChartTooltip
 *   content={
 *     <ChartTooltipContent
 *       labelFormatter={tooltipLabelFormatter}
 *       formatter={tooltipValueFormatter}
 *     />
 *   }
 * />
 * ```
 */
const meta = {
  title: 'Charts/Tooltip Patterns',
  component: ChartTooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Standardized tooltip formatting patterns using useChartFormatter hook. Provides consistent date and value formatting with UOM support (VND, cases).',
      },
    },
  },
} satisfies Meta<typeof ChartTooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

// ============================================================================
// SAMPLE DATA
// ============================================================================

const basicData = [
  { category: 'A', value: 400 },
  { category: 'B', value: 300 },
  { category: 'C', value: 200 },
  { category: 'D', value: 278 },
  { category: 'E', value: 189 },
];

const basicConfig = {
  value: {
    label: 'Sales',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const timeSeriesData = [
  { timestamp: '2025-01-06', sales: 1200000 },
  { timestamp: '2025-01-13', sales: 1500000 },
  { timestamp: '2025-01-20', sales: 1100000 },
  { timestamp: '2025-01-27', sales: 1800000 },
  { timestamp: '2025-02-03', sales: 2100000 },
  { timestamp: '2025-02-10', sales: 1900000 },
];

const timeSeriesConfig = {
  sales: {
    label: 'Weekly Sales',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const currencyData = [
  { product: 'Product A', revenue: 45000000 },
  { product: 'Product B', revenue: 78000000 },
  { product: 'Product C', revenue: 120000000 },
  { product: 'Product D', revenue: 95000000 },
  { product: 'Product E', revenue: 156000000 },
];

const currencyConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const multiSeriesData = [
  { timestamp: '2025-01-06', actual: 1200000, forecast: 1150000 },
  { timestamp: '2025-01-13', actual: 1500000, forecast: 1450000 },
  { timestamp: '2025-01-20', actual: 1100000, forecast: 1250000 },
  { timestamp: '2025-01-27', actual: 1800000, forecast: 1700000 },
  { timestamp: '2025-02-03', actual: 2100000, forecast: 1900000 },
  { timestamp: '2025-02-10', actual: 1900000, forecast: 2000000 },
];

const multiSeriesConfig = {
  actual: {
    label: 'Actual Sales',
    color: 'var(--chart-1)',
  },
  forecast: {
    label: 'Forecast',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const edgeCaseData = [
  { category: 'Normal', value: 1234 },
  { category: 'Large', value: 2500000000 }, // 2.5 billion
  { category: 'Small', value: 0.75 },
  { category: 'Zero', value: 0 },
  { category: 'Null', value: null },
  { category: 'Negative', value: -500 },
];

const edgeCaseConfig = {
  value: {
    label: 'Amount',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

// ============================================================================
// STORY 1: Basic Tooltip (Default Formatting)
// ============================================================================

/**
 * Basic bar chart with default tooltip formatting.
 *
 * **Pattern**: Simple value formatting without time granularity or UOM.
 *
 * **Use Case**: Generic charts where values don't need special formatting.
 *
 * **Before (Custom formatter)**:
 * ```tsx
 * const CustomTooltip = ({ payload }) => {
 *   return <div>{payload[0]?.value}</div>
 * }
 * <ChartTooltip content={<CustomTooltip />} />
 * ```
 *
 * **After (useChartFormatter)**:
 * ```tsx
 * const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter();
 * <ChartTooltip
 *   content={
 *     <ChartTooltipContent
 *       labelFormatter={tooltipLabelFormatter}
 *       formatter={tooltipValueFormatter}
 *     />
 *   }
 * />
 * ```
 */
export const BasicTooltip: Story = {
  render: () => {
    const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter();

    return (
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold text-lg">Basic Tooltip Pattern</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Default formatting without time granularity or UOM. Values formatted with thousand
            separators.
          </p>
        </div>

        <ChartContainer config={basicConfig} className="h-[300px]">
          <BarChart data={basicData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={tooltipLabelFormatter}
                  formatter={tooltipValueFormatter}
                />
              }
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>

        <div className="space-y-2 rounded-md bg-muted p-4 text-xs">
          <p className="font-semibold">Copy-Paste Example:</p>
          <pre className="overflow-x-auto rounded bg-background p-2">
            {`const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter();

<ChartTooltip
  content={
    <ChartTooltipContent
      labelFormatter={tooltipLabelFormatter}
      formatter={tooltipValueFormatter}
    />
  }
/>`}
          </pre>
        </div>
      </div>
    );
  },
};

// ============================================================================
// STORY 2: Time Series Tooltip (Date Formatting)
// ============================================================================

/**
 * Time series line chart with date formatting in tooltips.
 *
 * **Pattern**: Formats timestamps using timeGranularity for consistent date display.
 *
 * **Use Case**: Charts with time-based X-axis (week, month, year granularities).
 *
 * **Tooltip Output**:
 * - Label: "Jan 06 - Jan 12, 2025" (for week granularity)
 * - Value: "1.2M" (formatted with formatCompact)
 *
 * **Before (Custom date formatter)**:
 * ```tsx
 * const formatTooltipLabel = (timestamp: string) => {
 *   const date = new Date(timestamp);
 *   return date.toLocaleDateString('en-US', {
 *     month: 'short',
 *     day: 'numeric',
 *     year: 'numeric'
 *   });
 * };
 * ```
 *
 * **After (useChartFormatter with timeGranularity)**:
 * ```tsx
 * const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter('week');
 * // Automatically formats dates based on granularity
 * ```
 */
export const TimeSeriesTooltip: Story = {
  render: () => {
    const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter('week');

    return (
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold text-lg">Time Series Tooltip Pattern</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Formats timestamps with timeGranularity='week'. Label shows detailed date range, values
            formatted with thousand separators and units.
          </p>
        </div>

        <ChartContainer config={timeSeriesConfig} className="h-[300px]">
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={tooltipLabelFormatter}
                  formatter={tooltipValueFormatter}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>

        <div className="space-y-2 rounded-md bg-muted p-4 text-xs">
          <p className="font-semibold">Copy-Paste Example:</p>
          <pre className="overflow-x-auto rounded bg-background p-2">
            {`const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter('week');

<ChartTooltip
  content={
    <ChartTooltipContent
      labelFormatter={tooltipLabelFormatter}  // Formats dates
      formatter={tooltipValueFormatter}       // Formats values
    />
  }
/>`}
          </pre>
          <p className="mt-2 text-muted-foreground">
            <strong>Supported granularities:</strong> 'week' | 'month' | 'year'
          </p>
        </div>
      </div>
    );
  },
};

// ============================================================================
// STORY 3: Currency Tooltip (VND Formatting)
// ============================================================================

/**
 * Bar chart with VND currency formatting in tooltips.
 *
 * **Pattern**: Formats values with UOM='vnd' for Vietnamese Dong currency.
 *
 * **Use Case**: Financial charts, revenue dashboards, sales reports.
 *
 * **Tooltip Output**:
 * - Label: Product name
 * - Value: "45.0 million ₫" (formatted with VND symbol)
 *
 * **Before (Manual currency formatting)**:
 * ```tsx
 * const formatVND = (value: number) => {
 *   return new Intl.NumberFormat('vi-VN', {
 *     style: 'currency',
 *     currency: 'VND'
 *   }).format(value);
 * };
 * ```
 *
 * **After (useChartFormatter with UOM)**:
 * ```tsx
 * const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter(undefined, 'vnd');
 * // Automatically applies VND formatting with proper symbols
 * ```
 */
export const CurrencyTooltip: Story = {
  render: () => {
    const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter(undefined, 'vnd');

    return (
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold text-lg">Currency Tooltip Pattern (VND)</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Formats values with UOM='vnd' for Vietnamese Dong. Large numbers automatically scaled to
            millions/billions with ₫ symbol.
          </p>
        </div>

        <ChartContainer config={currencyConfig} className="h-[300px]">
          <BarChart data={currencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product" />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={tooltipLabelFormatter}
                  formatter={tooltipValueFormatter}
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>

        <div className="space-y-2 rounded-md bg-muted p-4 text-xs">
          <p className="font-semibold">Copy-Paste Example:</p>
          <pre className="overflow-x-auto rounded bg-background p-2">
            {`const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter(undefined, 'vnd');

<ChartTooltip
  content={
    <ChartTooltipContent
      labelFormatter={tooltipLabelFormatter}
      formatter={tooltipValueFormatter}  // Formats as VND currency
    />
  }
/>`}
          </pre>
          <p className="mt-2 text-muted-foreground">
            <strong>Supported UOMs:</strong> 'vnd' | 'case' | undefined
          </p>
        </div>
      </div>
    );
  },
};

// ============================================================================
// STORY 4: Multi-Series Tooltip (Composed Chart)
// ============================================================================

/**
 * Composed chart with multiple series and both date + VND formatting.
 *
 * **Pattern**: Combines timeGranularity and UOM for comprehensive formatting.
 *
 * **Use Case**: Dashboard charts comparing multiple metrics over time.
 *
 * **Tooltip Output**:
 * - Label: "Jan 06 - Jan 12, 2025" (formatted date range)
 * - Values: Multiple series formatted abbreviated (e.g., "Actual Sales: 1.2M")
 *
 * **Before (Multiple custom formatters)**:
 * ```tsx
 * const formatDate = (timestamp: string) => { ... };
 * const formatCurrency = (value: number) => { ... };
 * const CustomTooltip = ({ payload }) => {
 *   // Complex logic to format label and values
 * };
 * ```
 *
 * **After (useChartFormatter with both params)**:
 * ```tsx
 * const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter('week', 'vnd');
 * // Handles both date formatting AND currency formatting automatically
 * ```
 */
export const MultiSeriesTooltip: Story = {
  render: () => {
    const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter('week', 'vnd');

    return (
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold text-lg">Multi-Series Tooltip Pattern</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Combines timeGranularity='week' with UOM='vnd'. Formats date labels AND all series
            values consistently with currency symbols.
          </p>
        </div>

        <ChartContainer config={multiSeriesConfig} className="h-[300px]">
          <ComposedChart data={multiSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={tooltipLabelFormatter}
                  formatter={tooltipValueFormatter}
                />
              }
            />
            <Bar dataKey="actual" fill="var(--color-actual)" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="var(--color-forecast)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ChartContainer>

        <div className="space-y-2 rounded-md bg-muted p-4 text-xs">
          <p className="font-semibold">Copy-Paste Example:</p>
          <pre className="overflow-x-auto rounded bg-background p-2">
            {`const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter('week', 'vnd');

<ChartTooltip
  content={
    <ChartTooltipContent
      labelFormatter={tooltipLabelFormatter}  // Formats timestamp
      formatter={tooltipValueFormatter}       // Formats all series as VND
    />
  }
/>`}
          </pre>
          <p className="mt-2 text-muted-foreground">
            <strong>Pattern:</strong> Both parameters work together - date formatting + currency
            formatting
          </p>
        </div>
      </div>
    );
  },
};

// ============================================================================
// STORY 5: Edge Cases (Null, Zero, Large Numbers)
// ============================================================================

/**
 * Demonstrates tooltip behavior with edge case values.
 *
 * **Edge Cases Covered**:
 * - Null values: Displayed as "0"
 * - Zero values: Displayed as "0"
 * - Large numbers: Scaled to billions (e.g., "2.5 billion")
 * - Small decimals: Formatted with precision (e.g., "0.75")
 * - Negative values: Displayed with minus sign
 *
 * **Implementation**:
 * ```tsx
 * tooltipValueFormatter(null, 'name', ...) => ['name', '0']
 * tooltipValueFormatter(2500000000, 'name', ...) => ['name', '2.5 billion']
 * tooltipValueFormatter(-500, 'name', ...) => ['name', '-500']
 * ```
 */
export const EdgeCases: Story = {
  render: () => {
    const { tooltipLabelFormatter, tooltipValueFormatter } = useChartFormatter();

    return (
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-semibold text-lg">Edge Case Handling</h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Demonstrates tooltip behavior with null, zero, large numbers, decimals, and negative
            values.
          </p>
        </div>

        <ChartContainer config={edgeCaseConfig} className="h-[300px]">
          <BarChart data={edgeCaseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={tooltipLabelFormatter}
                  formatter={tooltipValueFormatter}
                />
              }
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>

        <div className="space-y-2 rounded-md bg-muted p-4 text-xs">
          <p className="font-semibold">Edge Case Behavior:</p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>
              <strong>Null values:</strong> Displayed as "0"
            </li>
            <li>
              <strong>Zero values:</strong> Displayed as "0"
            </li>
            <li>
              <strong>Large numbers:</strong> Scaled to "billion" or "million" (e.g., "2.5 billion")
            </li>
            <li>
              <strong>Small decimals:</strong> Formatted with precision (e.g., "0.75")
            </li>
            <li>
              <strong>Negative values:</strong> Displayed with minus sign (e.g., "-500")
            </li>
          </ul>
          <p className="mt-2">
            <strong>Implementation:</strong> formatCompact() handles all edge cases gracefully with
            fallback to 0 for null/undefined.
          </p>
        </div>
      </div>
    );
  },
};
