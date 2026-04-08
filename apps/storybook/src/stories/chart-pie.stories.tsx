import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pie, PieChart } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@masan-group/shared-ui/chart';

/**
 * Pie Chart core variants: simple, separator-less, built-in label, custom label, and label-list.
 */
const meta = {
  title: 'Charts/Pie',
  component: PieChart,
  tags: ['autodocs'],
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj<typeof meta>;

// ============================================================================
// SHARED DATA
// ============================================================================

const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 287, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 190, fill: 'var(--color-other)' },
];

const chartConfig = {
  visitors: { label: 'Visitors' },
  chrome: { label: 'Chrome', color: 'var(--chart-1)' },
  safari: { label: 'Safari', color: 'var(--chart-2)' },
  firefox: { label: 'Firefox', color: 'var(--chart-3)' },
  edge: { label: 'Edge', color: 'var(--chart-4)' },
  other: { label: 'Other', color: 'var(--chart-5)' },
} satisfies ChartConfig;

// ============================================================================
// STORY 1: Simple
// ============================================================================

/** Basic pie chart with fill colors from config. */
export const Simple: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie data={chartData} dataKey="visitors" nameKey="browser" />
      </PieChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 2: SeparatorNone
// ============================================================================

/** Pie with stroke removed so slices appear seamlessly joined. */
export const SeparatorNone: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie data={chartData} dataKey="visitors" nameKey="browser" stroke="none" />
      </PieChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 3: Label (built-in)
// ============================================================================

/** Pie with built-in labels rendered directly on each slice. */
export const Label: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie data={chartData} dataKey="visitors" nameKey="browser" label />
      </PieChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 4: LabelCustom
// ============================================================================

const totalVisitors = chartData.reduce((sum, d) => sum + d.visitors, 0);

/** Pie with a custom label render function displaying percentage for each slice. */
export const LabelCustom: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={chartData}
          dataKey="visitors"
          nameKey="browser"
          label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            const pct = ((value / totalVisitors) * 100).toFixed(0);
            return (
              <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
              >
                {`${pct}%`}
              </text>
            );
          }}
        />
      </PieChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 5: LabelList
// ============================================================================

/** Pie with labels positioned outside slices using midAngle and outerRadius calculation. */
export const LabelList: Story = {
  render: () => (
    <ChartContainer
      config={chartConfig}
      className="h-[300px] [&_.recharts-pie-label-text]:fill-foreground"
    >
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={chartData}
          dataKey="visitors"
          nameKey="browser"
          outerRadius={80}
          label={({ cx, cy, midAngle, outerRadius, name }) => {
            const RADIAN = Math.PI / 180;
            const radius = outerRadius + 24;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
              <text
                x={x}
                y={y}
                className="recharts-pie-label-text"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
              >
                {name}
              </text>
            );
          }}
        />
      </PieChart>
    </ChartContainer>
  ),
};
