import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, LabelList, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@masan-group/shared-ui/chart';

/**
 * Radial Bar Chart variants: simple, labeled, grid, center text, shaped, and stacked.
 */
const meta = {
  title: 'Charts/Radial',
  component: RadialBarChart,
  tags: ['autodocs'],
} satisfies Meta<typeof RadialBarChart>;

export default meta;

type Story = StoryObj<typeof meta>;

// ============================================================================
// SHARED DATA
// ============================================================================

const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 187, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 90, fill: 'var(--color-other)' },
];

const chartConfig = {
  visitors: { label: 'Visitors' },
  chrome: { label: 'Chrome', color: 'var(--chart-1)' },
  safari: { label: 'Safari', color: 'var(--chart-2)' },
  firefox: { label: 'Firefox', color: 'var(--chart-3)' },
  edge: { label: 'Edge', color: 'var(--chart-4)' },
  other: { label: 'Other', color: 'var(--chart-5)' },
} satisfies ChartConfig;

const singleData = [{ browser: 'safari', visitors: 200, fill: 'var(--color-safari)' }];

const stackedData = [
  { month: 'january', desktop: 186, mobile: 80 },
  { month: 'february', desktop: 305, mobile: 200 },
  { month: 'march', desktop: 237, mobile: 120 },
  { month: 'april', desktop: 73, mobile: 190 },
  { month: 'may', desktop: 209, mobile: 130 },
];

const stackedConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig;

// ============================================================================
// STORIES
// ============================================================================

/** Basic radial bar chart with tooltip. */
export const Simple: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="browser" />}
        />
        <RadialBar dataKey="visitors" background />
      </RadialBarChart>
    </ChartContainer>
  ),
};

/** Radial bars with value labels rendered inside each bar. */
export const LabelVariant: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="browser" />}
        />
        <RadialBar dataKey="visitors" background>
          <LabelList
            position="insideStart"
            dataKey="browser"
            className="fill-white capitalize mix-blend-luminosity"
            fontSize={11}
          />
        </RadialBar>
      </RadialBarChart>
    </ChartContainer>
  ),
};

/** Radial chart with circular polar grid lines visible. */
export const Grid: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
        <PolarGrid gridType="circle" />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="browser" />}
        />
        <RadialBar dataKey="visitors" background />
      </RadialBarChart>
    </ChartContainer>
  ),
};

/** Single-value radial bar with centered text showing the total. */
export const Text: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadialBarChart
        data={singleData}
        startAngle={0}
        endAngle={250}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          polarRadius={[86, 74]}
          className="first:fill-muted last:fill-background"
        />
        <RadialBar dataKey="visitors" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground font-bold text-4xl"
                    >
                      200
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Visitors
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  ),
};

/** Radial bars with rounded corners via cornerRadius for a pill-shaped appearance. */
export const Shape: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="browser" />}
        />
        <RadialBar dataKey="visitors" background cornerRadius={10} />
      </RadialBarChart>
    </ChartContainer>
  ),
};

/** Stacked radial bars comparing desktop and mobile visitors per month. */
export const Stacked: Story = {
  render: () => (
    <ChartContainer config={stackedConfig} className="mx-auto aspect-square max-h-[250px]">
      <RadialBarChart data={stackedData} innerRadius={30} outerRadius={110}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <RadialBar dataKey="desktop" fill="var(--color-desktop)" background stackId="a" />
        <RadialBar dataKey="mobile" fill="var(--color-mobile)" stackId="a" />
      </RadialBarChart>
    </ChartContainer>
  ),
};
