import type { AdvancedFilterConfigV2, FilterValueV2 } from '../types';
import type { DateRange } from '../../date-picker';

// Helper to check if a filter value is "selected" (non-empty) and should count.
export function isNonEmptyFilterValue(value: FilterValueV2 | undefined): boolean {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;

  // DateRange check: expected shape { from, to }
  if (typeof value === 'object' && 'from' in value && 'to' in value) {
    const range = value as DateRange;
    return Boolean(range.from || range.to);
  }

  // DateValue check
  if (typeof value === 'string') return value !== '';
  if (value instanceof Date) return true;
  return false;
}

// Helper to compare filter values (used to avoid counting "defaults" as selected).
export function areFilterValuesEqual(
  a: FilterValueV2 | undefined,
  b: FilterValueV2 | undefined
): boolean {
  // Array comparison (multi-select) - order-sensitive (matches existing behavior)
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  // DateRange comparison
  if (
    typeof a === 'object' &&
    a !== null &&
    'from' in a &&
    typeof b === 'object' &&
    b !== null &&
    'from' in b
  ) {
    const aRange = a as DateRange;
    const bRange = b as DateRange;
    const aFrom = aRange.from instanceof Date ? aRange.from.getTime() : aRange.from;
    const bFrom = bRange.from instanceof Date ? bRange.from.getTime() : bRange.from;
    const aTo = aRange.to instanceof Date ? aRange.to.getTime() : aRange.to;
    const bTo = bRange.to instanceof Date ? bRange.to.getTime() : bRange.to;
    return aFrom === bFrom && aTo === bTo;
  }

  // Date comparison
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Primitive comparison (string, undefined)
  return a === b;
}

export function countSelectedAdvancedFilters({
  allAdvancedFilters,
  values,
  defaultValues,
}: {
  allAdvancedFilters: AdvancedFilterConfigV2[];
  values: Record<string, FilterValueV2>;
  defaultValues: Record<string, FilterValueV2>;
}): number {
  return allAdvancedFilters.filter((filter) => {
    const currentValue = values[filter.key];
    const defaultValue = defaultValues[filter.key];
    const isDifferent =
      isNonEmptyFilterValue(currentValue) && !areFilterValuesEqual(currentValue, defaultValue);
    return isDifferent;
  }).length;
}
