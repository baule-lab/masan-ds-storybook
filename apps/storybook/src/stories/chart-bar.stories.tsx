import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@masan-group/shared-ui/chart';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const desktopConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const multiConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const meta = {
  title: 'Charts/Bar',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

// 1. Default — vertical bars, single series
export const Default: Story = {
  render: () => (
    <ChartContainer config={desktopConfig} className="h-[300px]">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  ),
};

// 2. Horizontal — layout="vertical", swapped axes
export const Horizontal: Story = {
  render: () => (
    <ChartContainer config={desktopConfig} className="h-[300px]">
      <BarChart accessibilityLayer data={chartData} layout="vertical">
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="month" tickLine={false} axisLine={false} width={70} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  ),
};

// 3. Multiple — two grouped series, no stackId
export const Multiple: Story = {
  render: () => (
    <ChartContainer config={multiConfig} className="h-[300px]">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  ),
};

// 4. Label — single series with built-in top labels
export const Label: Story = {
  render: () => (
    <ChartContainer config={desktopConfig} className="h-[300px]">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]}>
          <LabelList dataKey="desktop" position="top" className="fill-foreground text-xs" />
        </Bar>
      </BarChart>
    </ChartContainer>
  ),
};

// 5. LabelCustom — custom SVG text via content render prop
export const LabelCustom: Story = {
  render: () => (
    <ChartContainer config={desktopConfig} className="h-[300px]">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]}>
          <LabelList
            dataKey="desktop"
            position="top"
            content={({ x, y, width, value }) => {
              const cx = Number(x) + Number(width) / 2;
              const cy = Number(y) - 6;
              return (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={600}
                  fill="var(--chart-1)"
                >
                  {value}
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  ),
};
