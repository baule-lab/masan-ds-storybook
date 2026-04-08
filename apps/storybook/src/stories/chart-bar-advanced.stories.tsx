import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@masan-group/shared-ui/chart';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const negativeData = [
  { month: 'January', value: 186 },
  { month: 'February', value: -105 },
  { month: 'March', value: 237 },
  { month: 'April', value: -73 },
  { month: 'May', value: 209 },
  { month: 'June', value: -140 },
];

const multiConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const singleConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const negativeConfig = {
  positive: { label: 'Positive', color: 'var(--chart-1)' },
  negative: { label: 'Negative', color: 'var(--chart-4)' },
} satisfies ChartConfig;

const meta = {
  title: 'Charts/Bar Advanced',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

// 1. Mixed — multiple bars with different radius and colors
export const Mixed: Story = {
  render: () => (
    <ChartContainer config={multiConfig} className="h-[300px]">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ChartContainer>
  ),
};

// 2. Stacked — two series stacked with legend
export const Stacked: Story = {
  render: () => (
    <ChartContainer config={multiConfig} className="h-[300px]">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" stackId="a" radius={[0, 0, 0, 0]} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" stackId="a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  ),
};

// 3. Active — bars with active highlight using activeBar prop
export const Active: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="desktop"
          fill="var(--color-desktop)"
          radius={[4, 4, 0, 0]}
          activeBar={{ fill: 'var(--color-desktop)', opacity: 0.8 }}
        />
      </BarChart>
    </ChartContainer>
  ),
};

// 4. Negative — conditionally colored positive/negative bars
export const Negative: Story = {
  render: () => (
    <ChartContainer config={negativeConfig} className="h-[300px]">
      <BarChart accessibilityLayer data={negativeData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {negativeData.map((entry) => (
            <Cell key={entry.month} fill={entry.value >= 0 ? 'var(--chart-1)' : 'var(--chart-4)'} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  ),
};

// 5. Interactive — selected bar highlight via useState
export const Interactive: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeMonth, setActiveMonth] = useState<string | null>(null);

    return (
      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">
          Active: <span className="font-medium text-foreground">{activeMonth ?? 'none'}</span>
        </p>
        <ChartContainer config={singleConfig} className="h-[300px]">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="desktop"
              radius={[4, 4, 0, 0]}
              cursor="pointer"
              onClick={(data) => setActiveMonth(data.month === activeMonth ? null : data.month)}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={
                    activeMonth === null || activeMonth === entry.month
                      ? 'var(--chart-1)'
                      : 'var(--chart-1)'
                  }
                  opacity={activeMonth === null || activeMonth === entry.month ? 1 : 0.4}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    );
  },
};
