import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@masan-group/shared-ui/chart';

/**
 * Radar Chart advanced variants: grid types, fill styles, legend, icons, and radius axis.
 */
const meta = {
  title: 'Charts/Radar Advanced',
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
    icon: TrendingUp,
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
    icon: TrendingDown,
  },
} satisfies ChartConfig;

// ============================================================================
// STORY 1: GridCircle — Circular polar grid
// ============================================================================

/** Radar with a circular (non-polygon) grid. */
export const GridCircle: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <RadarChart data={chartData}>
        <PolarGrid gridType="circle" />
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
// STORY 2: GridCircleFill — Circle grid with muted fill
// ============================================================================

/** Circular grid with a muted background fill for each ring. */
export const GridCircleFill: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <RadarChart data={chartData}>
        <PolarGrid gridType="circle" className="fill-muted" opacity={0.2} />
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
// STORY 3: GridCircleNoLines — Circle grid without radial spokes
// ============================================================================

/** Circular grid rings only — radial spoke lines hidden. */
export const GridCircleNoLines: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <RadarChart data={chartData}>
        <PolarGrid gridType="circle" radialLines={false} />
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
// STORY 4: GridCustom — Custom stroke and dash pattern on grid
// ============================================================================

/** Polar grid with custom stroke color and dashed line pattern. */
export const GridCustom: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <RadarChart data={chartData}>
        <PolarGrid stroke="var(--chart-2)" strokeDasharray="4 4" />
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
// STORY 5: GridFill — Default polygon grid with muted fill
// ============================================================================

/** Polygon grid with a subtle muted background fill. */
export const GridFill: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <RadarChart data={chartData}>
        <PolarGrid className="fill-muted" opacity={0.2} />
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
// STORY 6: GridNone — No polar grid rendered
// ============================================================================

/** Radar with no background grid lines — clean minimal look. */
export const GridNone: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <RadarChart data={chartData}>
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
// STORY 7: Legend — Radar with chart legend
// ============================================================================

/** Two-series radar with a legend using ChartLegendContent. */
export const Legend: Story = {
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
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 8: Icons — Config with lucide-react icon per series
// ============================================================================

/** Legend with TrendingUp / TrendingDown icons defined in ChartConfig. */
export const Icons: Story = {
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
        <ChartLegend content={<ChartLegendContent />} />
      </RadarChart>
    </ChartContainer>
  ),
};

// ============================================================================
// STORY 9: Radius — With explicit PolarRadiusAxis
// ============================================================================

/** Radar with a visible radius axis at 30° angle and fixed domain [0, 400]. */
export const Radius: Story = {
  render: () => (
    <ChartContainer config={singleConfig} className="h-[300px]">
      <RadarChart data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="month" />
        <PolarRadiusAxis angle={30} domain={[0, 400]} />
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
