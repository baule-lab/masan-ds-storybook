export const CHART_COLORS = {
  // Semantic names (recommended)
  PRIMARY: 'oklch(0.6242 0.1822 259.6956)',
  SECONDARY: 'oklch(0.6500 0.1800 145.0000)',
  TERTIARY: 'oklch(0.7200 0.1900 65.0000)',
  QUATERNARY: 'oklch(0.6200 0.2200 25.0000)',
  ACCENT: 'oklch(0.5464 0.2096 262.9482)',
  MUTED: 'oklch(0.9687 0.0030 264.5400)',

  // Explicit color names (aliases for clarity)
  BLUE: 'oklch(0.6242 0.1822 259.6956)',
  GREEN: 'oklch(0.6500 0.1800 145.0000)',
  ORANGE: 'oklch(0.7200 0.1900 65.0000)',
  RED: 'oklch(0.6200 0.2200 25.0000)',
  PURPLE: 'oklch(0.5464 0.2096 262.9482)',
} as const;

/**
 * Extended color palette for multi-series charts
 * 24 distinguishable colors for complex visualizations
 */
export const CHART_PALETTE = [
  // Primary (from CHART_COLORS)
  'oklch(0.6242 0.1822 259.6956)', // Blue
  'oklch(0.6500 0.1800 145.0000)', // Green
  'oklch(0.7200 0.1900 65.0000)', // Orange
  'oklch(0.6200 0.2200 25.0000)', // Red
  'oklch(0.5464 0.2096 262.9482)', // Purple

  // Secondary
  'oklch(0.7000 0.1500 200.0000)', // Cyan
  'oklch(0.6500 0.2000 330.0000)', // Pink
  'oklch(0.7500 0.1600 100.0000)', // Lime
  'oklch(0.5800 0.1800 280.0000)', // Indigo
  'oklch(0.7200 0.1400 180.0000)', // Teal

  // Tertiary
  'oklch(0.6800 0.1700 50.0000)', // Amber
  'oklch(0.6000 0.2100 310.0000)', // Fuchsia
  'oklch(0.7000 0.1300 220.0000)', // Sky
  'oklch(0.6500 0.1900 350.0000)', // Rose
  'oklch(0.7300 0.1500 120.0000)', // Emerald

  // Quaternary
  'oklch(0.5500 0.1600 270.0000)', // Violet
  'oklch(0.7100 0.1800 40.0000)', // Yellow-Orange
  'oklch(0.6300 0.1400 240.0000)', // Slate Blue
  'oklch(0.6800 0.2000 20.0000)', // Coral
  'oklch(0.7400 0.1200 160.0000)', // Mint

  // Additional
  'oklch(0.5900 0.1700 300.0000)', // Orchid
  'oklch(0.6700 0.1600 80.0000)', // Gold
  'oklch(0.6100 0.1500 250.0000)', // Periwinkle
  'oklch(0.7200 0.1700 10.0000)', // Salmon
] as const;

/**
 * Get chart color by index
 * Uses CHART_PALETTE for indices 0-23, generates new color beyond
 *
 * @param index - Zero-based index
 * @returns oklch color string
 */
export function getChartColor(index: number): string {
  if (index >= 0 && index < CHART_PALETTE.length) {
    return CHART_PALETTE[index] as string;
  }

  // Generate additional colors using golden angle distribution
  const hue = (index * 137.5) % 360;
  const lightness = 0.6 + (index % 3) * 0.05;
  const chroma = 0.15 + (index % 2) * 0.05;

  return `oklch(${lightness.toFixed(4)} ${chroma.toFixed(4)} ${hue.toFixed(4)})`;
}

/**
 * Semantic chart colors for data states and regions
 * All colors in OKLCH format for consistency
 * Replaces legacy HSL colors from forecast-chart-utils.ts
 */
export const CHART_SEMANTIC_COLORS = {
  // Data states
  /** Historical/actual data - Purple */
  ACTUAL: 'oklch(0.6300 0.1900 290.0000)',
  /** Forecast data - Gray */
  FORECAST: 'oklch(0.6000 0.0500 264.5400)',
  /** Comparison overlay - Purple (matches ACTUAL) */
  COMPARISON: 'oklch(0.6300 0.1900 290.0000)',

  // Regional colors (converted from HSL)
  /** North region - Blue */
  NORTH: 'oklch(0.5800 0.1900 260.0000)',
  /** Central region - Green */
  CENTRAL: 'oklch(0.5500 0.1600 150.0000)',
  /** South region - Orange */
  SOUTH: 'oklch(0.7000 0.1800 55.0000)',

  // Status indicators
  /** Positive/success state - Green */
  POSITIVE: 'oklch(0.6500 0.1800 145.0000)',
  /** Negative/error state - Red */
  NEGATIVE: 'oklch(0.6200 0.2200 25.0000)',
  /** Neutral state - Gray */
  NEUTRAL: 'oklch(0.6000 0.0500 264.5400)',
} as const;

/**
 * HSL to OKLCH color migration mapping
 * @deprecated Use CHART_SEMANTIC_COLORS instead
 * Legacy HSL colors from forecast-chart-utils.ts
 */
export const COLOR_MIGRATION_MAP = {
  // Old HSL → New OKLCH
  'hsl(272 77% 55%)': CHART_SEMANTIC_COLORS.ACTUAL,
  'hsl(0 0% 50%)': CHART_SEMANTIC_COLORS.FORECAST,
  'hsl(221 83% 53%)': CHART_SEMANTIC_COLORS.NORTH,
  'hsl(142 76% 36%)': CHART_SEMANTIC_COLORS.CENTRAL,
  'hsl(38 92% 50%)': CHART_SEMANTIC_COLORS.SOUTH,
} as const;

/**
 * Convert legacy HSL color to OKLCH equivalent
 * @param hslColor - HSL color string
 * @returns OKLCH color string or original if no mapping
 * @deprecated Migrate to CHART_SEMANTIC_COLORS directly
 */
export function convertHslToOklch(hslColor: string): string {
  return COLOR_MIGRATION_MAP[hslColor as keyof typeof COLOR_MIGRATION_MAP] || hslColor;
}

/** Type for CHART_COLORS values */
export type ChartColor = (typeof CHART_COLORS)[keyof typeof CHART_COLORS];

/** Type for CHART_PALETTE values */
export type ChartPaletteColor = (typeof CHART_PALETTE)[number];

/** Type for CHART_SEMANTIC_COLORS values */
export type ChartSemanticColor = (typeof CHART_SEMANTIC_COLORS)[keyof typeof CHART_SEMANTIC_COLORS];
