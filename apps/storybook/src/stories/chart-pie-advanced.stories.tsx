import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, Pie, PieChart, Sector } from 'recharts';
import type { PieSectorDataItem } from 'recharts/types/polar/Pie';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@masan-group/shared-ui/chart';

/** Pie Chart advanced variants: legend, donut, active, center-text, stacked, interactive. */
const meta = {
  title: 'Charts/Pie Advanced',
  component: PieChart,
  tags: ['autodocs'],
} satisfies Meta<typeof PieChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// -- Shared data ---------------------------------------------------------------

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

const totalVisitors = chartData.reduce((sum, d) => sum + d.visitors, 0);

// Active shape shared by DonutActive and Interactive
const EnlargedSector = ({
  cx,
  cy,
  innerRadius,
  outerRadius = 0,
  startAngle,
  endAngle,
  fill,
}: PieSectorDataItem) => (
  <Sector
    cx={cx}
    cy={cy}
    innerRadius={innerRadius}
    outerRadius={outerRadius + 8}
    startAngle={startAngle}
    endAngle={endAngle}
    fill={fill}
  />
);

// -- Story 1: Legend -----------------------------------------------------------

/** Pie with a chart legend listing browser names and colors. */
export const Legend: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-[320px]">
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent nameKey="browser" />} />
        <Pie data={chartData} dataKey="visitors" nameKey="browser" />
      </PieChart>
    </ChartContainer>
  ),
};

// -- Story 2: Donut ------------------------------------------------------------

/** Pie with innerRadius to create a donut shape. */
export const Donut: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} />
      </PieChart>
    </ChartContainer>
  ),
};

// -- Story 3: DonutActive ------------------------------------------------------

/** Donut that enlarges the hovered slice via activeShape. */
export const DonutActive: Story = {
  render: () => {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
      <ChartContainer config={chartConfig} className="h-[300px]">
        <PieChart accessibilityLayer>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="browser"
            innerRadius={60}
            activeIndex={activeIndex}
            activeShape={EnlargedSector}
            onMouseEnter={(_, index) => setActiveIndex(index)}
          />
        </PieChart>
      </ChartContainer>
    );
  },
};

// -- Story 4: DonutText --------------------------------------------------------

/** Donut with centered Label showing total visitor count. */
export const DonutText: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground font-bold text-3xl"
                    >
                      {totalVisitors.toLocaleString()}
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
        </Pie>
      </PieChart>
    </ChartContainer>
  ),
};

// -- Story 5: Stacked ----------------------------------------------------------

const innerData = chartData.slice(0, 3);
const outerData = [...chartData.slice(3), ...chartData.slice(0, 2)];

/** Two nested Pie rings forming a stacked donut. */
export const Stacked: Story = {
  render: () => (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie data={innerData} dataKey="visitors" nameKey="browser" outerRadius={50} stroke="none" />
        <Pie
          data={outerData}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={60}
          outerRadius={80}
          stroke="none"
        />
      </PieChart>
    </ChartContainer>
  ),
};

// -- Story 6: Interactive ------------------------------------------------------

/** Donut with useState-driven slice highlight, expanded on hover. */
export const Interactive: Story = {
  render: () => {
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
    return (
      <ChartContainer config={chartConfig} className="h-[300px]">
        <PieChart accessibilityLayer>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            dataKey="visitors"
            nameKey="browser"
            innerRadius={50}
            outerRadius={80}
            activeIndex={activeIndex}
            activeShape={(props: PieSectorDataItem) => (
              <Sector
                {...props}
                outerRadius={(props.outerRadius ?? 80) + 8}
                innerRadius={(props.innerRadius ?? 50) - 4}
              />
            )}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
          />
        </PieChart>
      </ChartContainer>
    );
  },
};
