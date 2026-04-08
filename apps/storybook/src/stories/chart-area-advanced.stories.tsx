import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@masan-group/shared-ui/chart';

/**
 * Advanced Area Chart variants: legend, icons, gradient fills, custom axes, interactive toggle.
 */
const meta = {
  title: 'Charts/Area Advanced',
  component: AreaChart,
  tags: ['autodocs'],
} satisfies Meta<typeof AreaChart>;

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

const dualConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

const iconConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
    icon: TrendingUp,
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
    icon: TrendingDown,
  },
} satisfies ChartConfig;

const singleConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

// ============================================================================
// STORY 1: Legend
// ============================================================================

/** Two areas with a chart legend rendered below the chart. */
export const Legend: Story = {
  render: () => (
    <ChartContainer config={dualConfig} className="h-[300px]">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="natural"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
        />
        <Area
          type="natural"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 2: Icons in legend
// ============================================================================

/** Legend items display custom icons (TrendingUp / TrendingDown) from lucide-react. */
export const Icons: Story = {
  render: () => (
    <ChartContainer config={iconConfig} className="h-[300px]">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="natural"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
        />
        <Area
          type="natural"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 3: Gradient fill
// ============================================================================

/** Single area with SVG linearGradient fill fading from opaque at top to transparent at bottom. */
export const Gradient: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <AreaChart accessibilityLayer data={chartData}>
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="natural"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="url(#fillDesktop)"
        />
      </AreaChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 4: Custom axes
// ============================================================================

/** X-axis tick labels truncated to 3 characters; Y-axis added with default ticks. */
export const Axes: Story = {
  render: () => (
    <ChartContainer config={dualConfig} className="h-[300px]">
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tickFormatter={(value: string) => value.slice(0, 3)} />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="natural"
          dataKey="desktop"
          stroke="var(--color-desktop)"
          fill="var(--color-desktop)"
          fillOpacity={0.4}
        />
        <Area
          type="natural"
          dataKey="mobile"
          stroke="var(--color-mobile)"
          fill="var(--color-mobile)"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 5: Interactive — toggle series visibility
// ============================================================================

/** Clickable legend items toggle the visibility of each series independently. */
export const Interactive: Story = {
  render: () => {
    const [hidden, setHidden] = useState<Record<string, boolean>>({});

    const toggleSeries = (key: string) => {
      setHidden((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
      <div className="space-y-2">
        {/* Manual clickable legend */}
        <div className="flex justify-center gap-4">
          {(['desktop', 'mobile'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleSeries(key)}
              className="flex items-center gap-1.5 text-sm"
              style={{ opacity: hidden[key] ? 0.4 : 1 }}
            >
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ background: `var(--chart-${key === 'desktop' ? 1 : 2})` }}
              />
              {dualConfig[key].label}
            </button>
          ))}
        </div>

        <ChartContainer config={dualConfig} className="h-[300px]">
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={(v: string) => v.slice(0, 3)} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            {!hidden.desktop && (
              <Area
                type="natural"
                dataKey="desktop"
                stroke="var(--color-desktop)"
                fill="var(--color-desktop)"
                fillOpacity={0.4}
              />
            )}
            {!hidden.mobile && (
              <Area
                type="natural"
                dataKey="mobile"
                stroke="var(--color-mobile)"
                fill="var(--color-mobile)"
                fillOpacity={0.4}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </div>
    );
  },
};
