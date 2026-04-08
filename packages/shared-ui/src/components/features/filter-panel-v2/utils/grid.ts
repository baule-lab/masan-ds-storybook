import type { ColumnFilterPanelConfigV2 } from '../types';

/**
 * Generates Tailwind grid column classes from column config
 * @param config - Column configuration (number or responsive object)
 * @param defaultClasses - Default classes when config not provided
 * @returns Tailwind class string
 */
export function getGridClasses(
  config: ColumnFilterPanelConfigV2 | undefined,
  defaultClasses: string
): string {
  if (config === undefined) {
    return defaultClasses;
  }

  if (typeof config === 'number') {
    return `grid grid-cols-${config}`;
  }

  const classes: string[] = ['grid'];

  // Base (mobile-first)
  if (config.sm !== undefined) {
    classes.push(`grid-cols-${config.sm}`);
  } else {
    classes.push('grid-cols-1');
  }

  // Responsive breakpoints
  if (config.md !== undefined) {
    classes.push(`md:grid-cols-${config.md}`);
  }
  if (config.lg !== undefined) {
    classes.push(`lg:grid-cols-${config.lg}`);
  }
  if (config.xl !== undefined) {
    classes.push(`xl:grid-cols-${config.xl}`);
  }
  if (config['2xl'] !== undefined) {
    classes.push(`2xl:grid-cols-${config['2xl']}`);
  }

  return classes.join(' ');
}
