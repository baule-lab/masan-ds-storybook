import type { Meta, StoryObj } from '@storybook/react-vite';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@masan-group/shared-ui/chart';

/**
 * Radar Chart core variants demonstrating single/multi series, dots, lines-only, and custom labels.
 */
const meta = {
  title: 'Charts/Radar',
  component: RadarChart,
  tags: ['autodocs'],
} satisfies Meta<typeof RadarChart>;

export default meta;

type Story = StoryObj<typeof meta>;

// ============================================================================
// SHARED DATA & CONFIG
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

const multiConfig = {
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
// STORY 1: Default — Single series with fill
// ============================================================================

/** Basic radar with a single data series, semi-transparent fill. */
export const Default: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Radar
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 2: Dots — Radar with visible data point dots
// ============================================================================

/** Radar with dot markers on each data point. */
export const Dots: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Radar
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.6}
          dot={{ r: 4, fillOpacity: 1 }}
        />
      </RadarChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 3: Multiple — Two radar series overlaid
// ============================================================================

/** Two overlaid radar series for desktop and mobile comparison. */
export const Multiple: Story = {
  render: () => (
    <ChartContainer config={multiConfig} className="h-[300px]">
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Radar
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
        />
        <Radar
          dataKey="mobile"
          stroke="var(--color-mobile)"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 4: LinesOnly — No fill, outline only
// ============================================================================

/** Radar rendered as a line outline with no area fill. */
export const LinesOnly: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Radar dataKey="desktop" stroke="var(--color-desktop)" fill="none" />
      </RadarChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 5: LabelCustom — Custom styled SVG tick labels
// ============================================================================

/** Radar with a custom tick render function for styled angle axis labels. */
export const LabelCustom: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="month"
          tick={({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => (
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={600}
              fill="var(--chart-1)"
            >
              {payload.value.slice(0, 3)}
            </text>
          )}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Radar
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ChartContainer>
  ),
};
