import type { Meta, StoryObj } from '@storybook/react-vite';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@masan-group/shared-ui/chart';

/**
 * Area Chart core variants demonstrating interpolation types, stacking, and expand normalization.
 */
const meta = {
  title: 'Charts/Area',
  component: AreaChart,
  tags: ['autodocs'],
} satisfies Meta<typeof AreaChart>;

export default meta;

type Story = StoryObj<typeof meta>;

// ============================================================================
// SHARED DATA
// ============================================================================

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const singleConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

const stackedConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

// ============================================================================
// STORY 1: Default (natural interpolation, filled area)
// ============================================================================

/** Single area with natural curve interpolation and semi-transparent fill. */
export const Default: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="natural"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 2: Linear interpolation
// ============================================================================

/** Same single area but with straight-line (linear) interpolation between points. */
export const Linear: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="linear"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 3: Step interpolation
// ============================================================================

/** Single area with step interpolation — values jump discretely between data points. */
export const Step: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="step"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 4: Stacked areas
// ============================================================================

/** Two series stacked on top of each other using the same stackId. */
export const Stacked: Story = {
  render: () => (
    <ChartContainer config={stackedConfig} className="h-[300px]">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="natural"
          dataKey="desktop"
          stackId="a"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
        />
        <Area
          type="natural"
          dataKey="mobile"
          stackId="a"
          stroke="var(--color-mobile)"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 5: Stacked Expand (normalized to 100%)
// ============================================================================

/** Stacked areas normalized to 100% via stackOffset="expand". Y-axis shows percentage values. */
export const StackedExpand: Story = {
  render: () => (
    <ChartContainer config={stackedConfig} className="h-[300px]">
      <AreaChart accessibilityLayer data={chartData} stackOffset="expand">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="natural"
          dataKey="desktop"
          stackId="a"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
        />
        <Area
          type="natural"
          dataKey="mobile"
          stackId="a"
          stroke="var(--color-mobile)"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  ),
};
