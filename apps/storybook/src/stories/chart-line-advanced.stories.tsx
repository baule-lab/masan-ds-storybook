import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from 'recharts';

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

const singleConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
} satisfies ChartConfig;

const multiConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
} satisfies ChartConfig;

// Assign dot color based on value thresholds
function getDotColor(value: number): string {
  if (value >= 250) return 'var(--chart-3)';
  if (value >= 150) return 'var(--chart-1)';
  return 'var(--chart-4)';
}

const meta = {
  title: 'Charts/Line Advanced',
  component: ChartContainer,
  tags: ['autodocs'],
  args: { children: <div /> },
} satisfies Meta<typeof ChartContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Dots colored by value range: green (>=250), blue (>=150), red (<150). */
export const DotsColors: Story = {
  args: { config: singleConfig },
  render: (args) => (
    <ChartContainer {...args}>
      <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => v.slice(0, 3)}
        />
        <YAxis axisLine={false} tickLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={(props) => {
            const { cx, cy, value } = props;
            return (
              <circle
                key={`dot-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={5}
                fill={getDotColor(value as number)}
                stroke="white"
                strokeWidth={1.5}
              />
            );
          }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ChartContainer>
  ),
};

/** Custom diamond-shaped SVG dots instead of circles. */
export const DotsCustom: Story = {
  args: { config: singleConfig },
  render: (args) => (
    <ChartContainer {...args}>
      <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => v.slice(0, 3)}
        />
        <YAxis axisLine={false} tickLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={(props) => {
            const { cx, cy } = props;
            const size = 6;
            // Diamond shape: top, right, bottom, left points
            const points = `${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`;
            return (
              <polygon
                key={`diamond-${cx}-${cy}`}
                points={points}
                fill="var(--color-desktop)"
                stroke="white"
                strokeWidth={1.5}
              />
            );
          }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ChartContainer>
  ),
};

/** Line with LabelList showing numeric values above each data point. */
export const Label: Story = {
  args: { config: singleConfig },
  render: (args) => (
    <ChartContainer {...args}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 12, right: 12, top: 20, bottom: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => v.slice(0, 3)}
        />
        <YAxis axisLine={false} tickLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={{ r: 4, fill: 'var(--color-desktop)' }}
        >
          <LabelList dataKey="desktop" position="top" offset={8} fontSize={11} />
        </Line>
      </LineChart>
    </ChartContainer>
  ),
};

/** Line with custom styled SVG label rendered via LabelList content prop. */
export const LabelCustom: Story = {
  args: { config: singleConfig },
  render: (args) => (
    <ChartContainer {...args}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 12, right: 12, top: 32, bottom: 8 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(v) => v.slice(0, 3)}
        />
        <YAxis axisLine={false} tickLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line
          dataKey="desktop"
          type="natural"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={{ r: 4, fill: 'var(--color-desktop)' }}
        >
          <LabelList
            dataKey="desktop"
            position="top"
            content={(props) => {
              const { x, y, value } = props;
              if (x == null || y == null || value == null) return null;
              const px = Number(x);
              const py = Number(y);
              return (
                <g key={`label-${px}-${py}`}>
                  <rect
                    x={px - 16}
                    y={py - 26}
                    width={32}
                    height={18}
                    rx={4}
                    fill="var(--chart-1)"
                    opacity={0.15}
                  />
                  <text
                    x={px}
                    y={py - 13}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={600}
                    fill="var(--chart-1)"
                  >
                    {value}
                  </text>
                </g>
              );
            }}
          />
        </Line>
      </LineChart>
    </ChartContainer>
  ),
};

/** Two lines with clickable legend to toggle series visibility. */
export const Interactive: Story = {
  args: { config: multiConfig },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [hidden, setHidden] = useState<Record<string, boolean>>({});

    const toggleSeries = (key: string) => {
      setHidden((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const series = [
      { key: 'desktop', label: 'Desktop', color: 'var(--chart-1)' },
      { key: 'mobile', label: 'Mobile', color: 'var(--chart-2)' },
    ];

    return (
      <div className="space-y-3">
        {/* Clickable legend */}
        <div className="flex gap-4 px-3">
          {series.map(({ key, label, color }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleSeries(key)}
              className="flex items-center gap-1.5 text-sm"
              style={{ opacity: hidden[key] ? 0.4 : 1 }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: color,
                }}
              />
              {label}
            </button>
          ))}
        </div>

        <ChartContainer {...args}>
          <LineChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => v.slice(0, 3)}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {series.map(({ key, color }) =>
              hidden[key] ? null : (
                <Line
                  key={key}
                  dataKey={key}
                  type="natural"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                />
              )
            )}
          </LineChart>
        </ChartContainer>
      </div>
    );
  },
};
