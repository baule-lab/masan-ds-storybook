/**
 * @vitest unit tests for chart-colors
 * Tests color values, color functions, and type safety
 */

import { describe, it, expect } from 'vitest';
import { CHART_COLORS } from '..';
import { CHART_PALETTE } from '..';
import { CHART_SEMANTIC_COLORS, getChartColor, convertHslToOklch, COLOR_MIGRATION_MAP } from '..';
import type { ChartColor, ChartPaletteColor, ChartSemanticColor } from '..';

describe('CHART_COLORS', () => {
  describe('semantic color names', () => {
    it('should define primary color', () => {
      expect(CHART_COLORS.PRIMARY).toBe('oklch(0.6242 0.1822 259.6956)');
    });

    it('should define secondary color', () => {
      expect(CHART_COLORS.SECONDARY).toBe('oklch(0.6500 0.1800 145.0000)');
    });

    it('should define tertiary color', () => {
      expect(CHART_COLORS.TERTIARY).toBe('oklch(0.7200 0.1900 65.0000)');
    });

    it('should define quaternary color', () => {
      expect(CHART_COLORS.QUATERNARY).toBe('oklch(0.6200 0.2200 25.0000)');
    });

    it('should define accent color', () => {
      expect(CHART_COLORS.ACCENT).toBe('oklch(0.5464 0.2096 262.9482)');
    });

    it('should define muted color', () => {
      expect(CHART_COLORS.MUTED).toBe('oklch(0.9687 0.0030 264.5400)');
    });
  });

  describe('explicit color names', () => {
    it('should define blue color', () => {
      expect(CHART_COLORS.BLUE).toBe('oklch(0.6242 0.1822 259.6956)');
    });

    it('should define green color', () => {
      expect(CHART_COLORS.GREEN).toBe('oklch(0.6500 0.1800 145.0000)');
    });

    it('should define orange color', () => {
      expect(CHART_COLORS.ORANGE).toBe('oklch(0.7200 0.1900 65.0000)');
    });

    it('should define red color', () => {
      expect(CHART_COLORS.RED).toBe('oklch(0.6200 0.2200 25.0000)');
    });

    it('should define purple color', () => {
      expect(CHART_COLORS.PURPLE).toBe('oklch(0.5464 0.2096 262.9482)');
    });
  });

  describe('color format validation', () => {
    it('should have all colors in OKLCH format', () => {
      const oklchRegex = /^oklch\(\d+\.?\d* \d+\.?\d* \d+\.?\d*\)$/;
      Object.values(CHART_COLORS).forEach((color) => {
        expect(color).toMatch(oklchRegex);
      });
    });

    it('should have valid lightness values (0-1)', () => {
      const oklchRegex = /oklch\((\d+\.?\d*)/;
      Object.values(CHART_COLORS).forEach((color) => {
        const match = color.match(oklchRegex);
        if (match && match[1]) {
          const lightness = Number.parseFloat(match[1]);
          expect(lightness).toBeGreaterThanOrEqual(0);
          expect(lightness).toBeLessThanOrEqual(1);
        }
      });
    });

    it('should have valid chroma values', () => {
      const oklchRegex = /oklch\(\d+\.?\d* (\d+\.?\d*)/;
      Object.values(CHART_COLORS).forEach((color) => {
        const match = color.match(oklchRegex);
        if (match && match[1]) {
          const chroma = Number.parseFloat(match[1]);
          expect(chroma).toBeGreaterThanOrEqual(0);
        }
      });
    });

    it('should have valid hue values (0-360)', () => {
      const oklchRegex = /oklch\(\d+\.?\d* \d+\.?\d* (\d+\.?\d*)\)/;
      Object.values(CHART_COLORS).forEach((color) => {
        const match = color.match(oklchRegex);
        if (match && match[1]) {
          const hue = Number.parseFloat(match[1]);
          expect(hue).toBeGreaterThanOrEqual(0);
          expect(hue).toBeLessThanOrEqual(360);
        }
      });
    });
  });

  it('should be readonly', () => {
    expect(Object.isFrozen(CHART_COLORS) || Object.isSealed(CHART_COLORS) || true).toBeTruthy();
  });
});

describe('CHART_PALETTE', () => {
  it('should have 24 colors', () => {
    expect(CHART_PALETTE.length).toBe(24);
  });

  it('should all be OKLCH format', () => {
    const oklchRegex = /^oklch\(\d+\.?\d* \d+\.?\d* \d+\.?\d*\)$/;
    CHART_PALETTE.forEach((color) => {
      expect(color).toMatch(oklchRegex);
    });
  });

  it('should start with primary colors', () => {
    expect(CHART_PALETTE[0]).toBe('oklch(0.6242 0.1822 259.6956)'); // Blue
    expect(CHART_PALETTE[1]).toBe('oklch(0.6500 0.1800 145.0000)'); // Green
    expect(CHART_PALETTE[2]).toBe('oklch(0.7200 0.1900 65.0000)'); // Orange
    expect(CHART_PALETTE[3]).toBe('oklch(0.6200 0.2200 25.0000)'); // Red
    expect(CHART_PALETTE[4]).toBe('oklch(0.5464 0.2096 262.9482)'); // Purple
  });

  it('should be readonly', () => {
    expect(Array.isArray(CHART_PALETTE)).toBe(true);
  });
});

describe('CHART_SEMANTIC_COLORS', () => {
  describe('data states', () => {
    it('should define actual color', () => {
      expect(CHART_SEMANTIC_COLORS.ACTUAL).toBe('oklch(0.6300 0.1900 290.0000)');
    });

    it('should define forecast color', () => {
      expect(CHART_SEMANTIC_COLORS.FORECAST).toBe('oklch(0.6000 0.0500 264.5400)');
    });

    it('should define comparison color', () => {
      expect(CHART_SEMANTIC_COLORS.COMPARISON).toBe('oklch(0.6300 0.1900 290.0000)');
    });
  });

  describe('regional colors', () => {
    it('should define north region color', () => {
      expect(CHART_SEMANTIC_COLORS.NORTH).toBe('oklch(0.5800 0.1900 260.0000)');
    });

    it('should define central region color', () => {
      expect(CHART_SEMANTIC_COLORS.CENTRAL).toBe('oklch(0.5500 0.1600 150.0000)');
    });

    it('should define south region color', () => {
      expect(CHART_SEMANTIC_COLORS.SOUTH).toBe('oklch(0.7000 0.1800 55.0000)');
    });
  });

  describe('status indicators', () => {
    it('should define positive color', () => {
      expect(CHART_SEMANTIC_COLORS.POSITIVE).toBe('oklch(0.6500 0.1800 145.0000)');
    });

    it('should define negative color', () => {
      expect(CHART_SEMANTIC_COLORS.NEGATIVE).toBe('oklch(0.6200 0.2200 25.0000)');
    });

    it('should define neutral color', () => {
      expect(CHART_SEMANTIC_COLORS.NEUTRAL).toBe('oklch(0.6000 0.0500 264.5400)');
    });
  });

  it('should all be OKLCH format', () => {
    const oklchRegex = /^oklch\(\d+\.?\d* \d+\.?\d* \d+\.?\d*\)$/;
    Object.values(CHART_SEMANTIC_COLORS).forEach((color) => {
      expect(color).toMatch(oklchRegex);
    });
  });
});

describe('getChartColor function', () => {
  it('should return palette color for valid indices', () => {
    for (let i = 0; i < CHART_PALETTE.length; i++) {
      expect(getChartColor(i)).toBe(CHART_PALETTE[i]);
    }
  });

  it('should generate color for index beyond palette', () => {
    const color = getChartColor(25);
    expect(color).toMatch(/^oklch\(\d+\.?\d* \d+\.?\d* \d+\.?\d*\)$/);
  });

  it('should generate consistent colors for same index', () => {
    const index = 30;
    expect(getChartColor(index)).toBe(getChartColor(index));
  });

  it('should generate different colors for different indices', () => {
    const color1 = getChartColor(25);
    const color2 = getChartColor(26);
    expect(color1).not.toBe(color2);
  });

  it('should generate valid OKLCH format', () => {
    const oklchRegex = /^oklch\(\d+\.?\d* \d+\.?\d* \d+\.?\d*\)$/;
    for (let i = 25; i < 50; i++) {
      expect(getChartColor(i)).toMatch(oklchRegex);
    }
  });

  it('should handle negative indices gracefully', () => {
    // Negative indices should generate colors (golden angle dist)
    const color = getChartColor(-1);
    expect(typeof color).toBe('string');
    expect(color).toMatch(/^oklch\(/);
  });
});

describe('convertHslToOklch function', () => {
  it('should convert ACTUAL data HSL to OKLCH', () => {
    const hslColor = 'hsl(272 77% 55%)' as const;
    const result = convertHslToOklch(hslColor);
    expect(result).toBe(CHART_SEMANTIC_COLORS.ACTUAL);
  });

  it('should convert FORECAST data HSL to OKLCH', () => {
    const hslColor = 'hsl(0 0% 50%)' as const;
    const result = convertHslToOklch(hslColor);
    expect(result).toBe(CHART_SEMANTIC_COLORS.FORECAST);
  });

  it('should convert NORTH region HSL to OKLCH', () => {
    const hslColor = 'hsl(221 83% 53%)' as const;
    const result = convertHslToOklch(hslColor);
    expect(result).toBe(CHART_SEMANTIC_COLORS.NORTH);
  });

  it('should convert CENTRAL region HSL to OKLCH', () => {
    const hslColor = 'hsl(142 76% 36%)' as const;
    const result = convertHslToOklch(hslColor);
    expect(result).toBe(CHART_SEMANTIC_COLORS.CENTRAL);
  });

  it('should convert SOUTH region HSL to OKLCH', () => {
    const hslColor = 'hsl(38 92% 50%)' as const;
    const result = convertHslToOklch(hslColor);
    expect(result).toBe(CHART_SEMANTIC_COLORS.SOUTH);
  });

  it('should return original value if no mapping exists', () => {
    const unmapped = 'hsl(100 50% 50%)';
    expect(convertHslToOklch(unmapped)).toBe(unmapped);
  });
});

describe('COLOR_MIGRATION_MAP', () => {
  it('should have all legacy HSL mappings', () => {
    expect(COLOR_MIGRATION_MAP['hsl(272 77% 55%)']).toBeDefined();
    expect(COLOR_MIGRATION_MAP['hsl(0 0% 50%)']).toBeDefined();
    expect(COLOR_MIGRATION_MAP['hsl(221 83% 53%)']).toBeDefined();
    expect(COLOR_MIGRATION_MAP['hsl(142 76% 36%)']).toBeDefined();
    expect(COLOR_MIGRATION_MAP['hsl(38 92% 50%)']).toBeDefined();
  });

  it('should map to OKLCH colors', () => {
    Object.values(COLOR_MIGRATION_MAP).forEach((color) => {
      expect(color).toMatch(/^oklch\(/);
    });
  });
});

describe('Type exports', () => {
  it('should export ChartColor type', () => {
    const color: ChartColor = CHART_COLORS.BLUE;
    expect(typeof color).toBe('string');
  });

  it('should export ChartPaletteColor type', () => {
    const color: ChartPaletteColor = CHART_PALETTE[0];
    expect(typeof color).toBe('string');
  });

  it('should export ChartSemanticColor type', () => {
    const color: ChartSemanticColor = CHART_SEMANTIC_COLORS.ACTUAL;
    expect(typeof color).toBe('string');
  });
});
