import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../ui/actions/button';
import { Badge } from '../../ui/display/badge';
import { Card, CardContent } from '../../ui/display/card';
import { Tabs, TabsList, TabsTrigger } from '../../ui/actions/tabs';
import { Filter, RotateCcw, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { AsyncSelect, type AsyncSelectProps } from '../../patterns/async-select';
import { MultiSelect, type MultiSelectProps } from '../../patterns/multi-select';
import {
  DatePicker,
  DateRangePicker,
  type DateValue,
  type DateRange,
  type DateRangePickerChangeMeta,
} from '../date-picker';
import {
  TreeMultipleSelect,
  TreeSelect,
  type TreeMultipleSelectProps,
  type TreeSelectProps,
} from '../../patterns/tree-select';
import { Input } from '../../ui/forms/input';

function parseCommaSeparatedFilterValues(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

interface FilterPanelCommaSeparatedTextInputProps {
  id: string;
  value: string[];
  onCommit: (next: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function FilterPanelCommaSeparatedTextInput({
  id,
  value,
  onCommit,
  placeholder,
  className,
  disabled,
}: FilterPanelCommaSeparatedTextInputProps) {
  const serialized = JSON.stringify(value);
  const [draft, setDraft] = useState(() => value.join(', '));

  useEffect(() => {
    setDraft(value.join(', '));
  }, [serialized]);

  const commit = () => {
    const parsed = parseCommaSeparatedFilterValues(draft);
    if (JSON.stringify(parsed) !== serialized) {
      onCommit(parsed);
    }
  };

  return (
    <Input
      id={id}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
        }
      }}
      placeholder={placeholder}
      className={cn('w-full min-w-[200px]', className)}
      disabled={disabled}
    />
  );
}

/**
 * Responsive column configuration for grid layouts
 * - number: Fixed columns across all breakpoints
 * - object: Responsive columns per breakpoint
 */
export type ColumnFilterPanelConfig =
  | number
  | {
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      '2xl'?: number;
    };

/**
 * Generates Tailwind grid column classes from column config
 * @param config - Column configuration (number or responsive object)
 * @param defaultClasses - Default classes when config not provided
 * @returns Tailwind class string
 */
function getGridClasses(
  config: ColumnFilterPanelConfig | undefined,
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

export interface BaseFilterOption {
  value: string;
  label: string;
}

export interface TabFilterConfig {
  key: string;
  label: string;
  type: 'tabs';
  options: BaseFilterOption[];
  onChange?: (v: unknown) => void;
  disable?: boolean;
}

export interface SelectFilterConfig {
  key: string;
  label: string;
  type: 'select';
  /**
   * All AsyncSelect props can be passed here
   */
  asyncSelectProps?: Omit<AsyncSelectProps, 'value' | 'onValueChange'>;
  onChange?: (v: unknown) => void;
  disable?: boolean;
}

export interface MultiSelectFilterConfig {
  key: string;
  label: string;
  type: 'multi-select';
  /**
   * All MultiSelect props can be passed here
   */
  multiSelectProps?: Omit<MultiSelectProps, 'value' | 'onChange'>;
  onChange?: (v: unknown) => void;
  disable?: boolean;
}

export interface TreeMultipleSelectFilterConfig {
  key: string;
  label: string;
  type: 'tree-multiple-select';
  /**
   * All TreeMultipleSelect props can be passed here
   */
  treeMultipleSelectProps?: Omit<TreeMultipleSelectProps, 'value' | 'onChange'>;
  onChange?: (v: unknown) => void;
  disable?: boolean;
}

export interface TreeSelectFilterConfig {
  key: string;
  label: string;
  type: 'tree-select';
  /**
   * All TreeSelect props can be passed here
   */
  treeSelectProps?: Omit<TreeSelectProps, 'value' | 'onChange'>;
  onChange?: (v: unknown) => void;
  disable?: boolean;
}

export interface DatePickerFilterConfig {
  key: string;
  label: string;
  type: 'date-picker';
  /**
   * All DatePicker props can be passed here (excluding value/onChange)
   */
  datePickerProps?: {
    outputFormat?: 'date' | 'iso';
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    defaultMode?: 'date' | 'week' | 'month' | 'year';
    showPresets?: boolean;
    showActions?: boolean;
    hideYearSelect?: boolean;
    'aria-invalid'?: boolean;
  };
  onChange?: (v: DateValue) => void;
  disable?: boolean;
}

export interface DateRangePickerFilterConfig {
  key: string;
  label: string;
  type: 'date-range-picker';
  /**
   * All DateRangePicker props can be passed here (excluding value/onChange)
   */
  dateRangePickerProps?: {
    outputFormat?: 'date' | 'iso';
    placeholderFrom?: string;
    placeholderTo?: string;
    minDate?: Date;
    maxDate?: Date;
    defaultMode?: 'date' | 'week' | 'month' | 'year';
    mode?: 'date' | 'week' | 'month' | 'year';
    showPresets?: boolean;
    showActions?: boolean;
    availableModes?: ('date' | 'week' | 'month' | 'year')[];
    'aria-invalid'?: boolean;
  };
  onChange?: (v: DateRange, meta: DateRangePickerChangeMeta) => void;
  disable?: boolean;
}

export interface TextInputFilterConfig {
  key: string;
  label: string;
  type: 'text-input';
  /**
   * `values[key]` is `string[]`; the field edits comma-separated codes (commit on blur / Enter).
   */
  textInputProps?: {
    placeholder?: string;
    className?: string;
  };
  onChange?: (v: string[]) => void;
  disable?: boolean;
}

export type FilterConfig =
  | TabFilterConfig
  | SelectFilterConfig
  | MultiSelectFilterConfig
  | TreeSelectFilterConfig
  | TreeMultipleSelectFilterConfig
  | DatePickerFilterConfig
  | DateRangePickerFilterConfig
  | TextInputFilterConfig;

export type AdvancedFilterConfig = Exclude<FilterConfig, TabFilterConfig>;

/**
 * Group of advanced filters with a title
 */
export interface AdvancedFilterGroup {
  /** Title displayed above the group */
  title: string;
  /** Filters in this group */
  filters: AdvancedFilterConfig[];
}

/**
 * Union type for all possible filter values
 * - string: tabs, select
 * - string[]: multi-select
 * - DateValue: date-picker
 * - DateRange: date-range-picker
 */
export type FilterValue = string | string[] | DateValue | DateRange;

export interface FilterPanelProps {
  /**
   * Main filters displayed in the card
   */
  filters: FilterConfig[];

  /**
   * Advanced filters shown when expanded (flat list)
   */
  advancedFilters?: AdvancedFilterConfig[];

  /**
   * Grouped advanced filters with section titles
   * Takes precedence over advancedFilters if both provided
   */
  advancedFilterGroups?: AdvancedFilterGroup[];

  /**
   * Current filter values
   * - string: tabs, select
   * - string[]: multi-select
   * - DateValue: date-picker
   * - DateRange: date-range-picker
   */
  values: Record<string, FilterValue>;

  /**
   * Default filter values to compare against
   */
  defaultValues?: Record<string, FilterValue>;

  /**
   * Callback when any filter changes
   */
  onChange: (key: string, value: FilterValue) => void;

  /**
   * Callback when reset button is clicked
   */
  onReset?: () => void;

  /**
   * Label for advanced filters panel header
   */
  advancedFiltersLabel?: string;

  /**
   * Label for advanced filters toggle button
   */
  advancedFiltersButton?: string;

  /**
   * Label for reset button (icon only if not provided)
   */
  resetLabel?: string;

  /**
   * Additional className for the card
   */
  className?: string;

  /**
   * Whether to show the reset button
   */
  contentClassName?: string;

  maxWidthLongText?: string;

  /**
   * Custom content to render after main filters (before advanced filters toggle)
   */
  renderAfterFilters?: React.ReactNode;

  /**
   * Grid columns for primary (main) filters section
   * - number: Fixed columns (e.g., 4)
   * - object: Responsive columns (e.g., { sm: 1, md: 2, lg: 4 })
   * Default: flex wrap layout (no grid)
   */
  primaryFiltersColumns?: ColumnFilterPanelConfig;

  disable?: boolean;

  /**
   * Content rendered inside the Card below filters (e.g. always-visible required fields)
   */
  children?: React.ReactNode;

  /**
   * Tailwind top class for sticky positioning (e.g. 'top-0', 'top-16')
   * @default 'top-0'
   */
  stickyOffsetTop?: string;

  /**
   * Background class applied when the panel is stuck (e.g. 'bg-background')
   */
  stickyBg?: string;

  /**
   * Additional className applied only when the panel is stuck (e.g. '-mx-4')
   */
  stickyClassName?: string;

  /**
   * Enable sticky behavior (sentinel + IntersectionObserver)
   * @default true
   */
  isSticky?: boolean;
}

/** Detects when a sticky element is "stuck" at the top using a sentinel + IntersectionObserver */
function useStickyObserver() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => setIsStuck(!entries[0]?.isIntersecting),
      { threshold: 1.0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return { sentinelRef, isStuck };
}

export function FilterPanel({
  filters,
  advancedFilters = [],
  advancedFilterGroups,
  values,
  defaultValues = {},
  onChange,
  onReset,
  advancedFiltersLabel = 'Advanced Filters',
  advancedFiltersButton,
  resetLabel,
  className,
  contentClassName,
  renderAfterFilters,
  primaryFiltersColumns,
  disable,
  children,
  stickyOffsetTop = 'top-16',
  stickyBg = 'bg-white',
  stickyClassName = '-mx-4',
  isSticky = true,
}: FilterPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const advancedRef = useRef<HTMLDivElement>(null);
  const { sentinelRef, isStuck: rawIsStuck } = useStickyObserver();
  const isStuck = isSticky && rawIsStuck;

  // Compute effective groups (prioritize advancedFilterGroups)
  const effectiveGroups: AdvancedFilterGroup[] = useMemo(() => {
    if (advancedFilterGroups && advancedFilterGroups.length > 0) {
      return advancedFilterGroups;
    }
    if (advancedFilters && advancedFilters.length > 0) {
      // Wrap flat list in single group with empty title
      return [{ title: '', filters: advancedFilters }];
    }
    return [];
  }, [advancedFilterGroups, advancedFilters]);

  // Flat list of all advanced filters for calculations
  const allAdvancedFilters = useMemo(
    () => effectiveGroups.flatMap((g) => g.filters),
    [effectiveGroups]
  );

  // Check if there are any advanced filters
  const hasAdvancedFilters = effectiveGroups.length > 0 && allAdvancedFilters.length > 0;

  // Helper to check if a value is non-empty
  const isNonEmpty = (value: FilterValue | undefined): boolean => {
    if (!value) return false;
    if (Array.isArray(value)) return value.length > 0;
    // DateRange check
    if (typeof value === 'object' && 'from' in value && 'to' in value) {
      return Boolean(value.from || value.to);
    }
    // DateValue (string or Date) check
    if (typeof value === 'string') return value !== '';
    if (value instanceof Date) return true;
    return false;
  };

  // Helper to check if two values are equal
  const areValuesEqual = (a: FilterValue | undefined, b: FilterValue | undefined): boolean => {
    // Array comparison (multi-select)
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
      const aFrom = a.from instanceof Date ? a.from.getTime() : a.from;
      const bFrom = b.from instanceof Date ? b.from.getTime() : b.from;
      const aTo = a.to instanceof Date ? a.to.getTime() : a.to;
      const bTo = b.to instanceof Date ? b.to.getTime() : b.to;
      return aFrom === bFrom && aTo === bTo;
    }
    // Date comparison
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }
    // Primitive comparison (string, undefined)
    return a === b;
  };

  // Count selected advanced filters that differ from default values
  const selectedAdvancedCount = allAdvancedFilters.filter((filter) => {
    const currentValue = values[filter.key];
    const defaultValue = defaultValues[filter.key];
    const isDifferent = isNonEmpty(currentValue) && !areValuesEqual(currentValue, defaultValue);

    return isDifferent;
  }).length;

  const handleReset = () => {
    setShowAdvanced(false);
    onReset?.();
  };

  return (
    <>
      {isSticky && <div ref={sentinelRef} className="mb-0 h-0" />}
      <Card
        className={cn(
          isSticky && `sticky ${stickyOffsetTop} z-30`,
          'transition-[border-radius,margin] duration-200',
          isStuck && 'rounded-none',
          isStuck && stickyBg,
          isStuck && stickyClassName,
          className
        )}
      >
        <CardContent>
          {/* Main Filters */}
          <div className={cn('item-start flex justify-between', contentClassName)}>
            <div
              className={cn(
                primaryFiltersColumns
                  ? getGridClasses(primaryFiltersColumns, 'flex flex-wrap items-center')
                  : 'flex flex-wrap items-center',
                'gap-4'
              )}
            >
              {filters.map((filter) => {
                return (
                  <div key={filter.key} className="flex items-center gap-2">
                    <span className="whitespace-nowrap font-medium text-muted-foreground text-sm">
                      {filter.label}:
                    </span>

                    {filter.type === 'tabs' && (
                      <Tabs
                        value={values[filter.key] as string}
                        onValueChange={(value) => {
                          onChange(filter.key, value);
                          filter.onChange?.(value);
                        }}
                      >
                        <TabsList>
                          {filter.options.map((option) => (
                            <TabsTrigger
                              disabled={filter.disable}
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    )}

                    {filter.type === 'select' && filter.asyncSelectProps && (
                      <AsyncSelect
                        {...filter.asyncSelectProps}
                        value={values[filter.key] as string}
                        onChange={(value) => onChange(filter.key, value)}
                        className={cn('w-[200px]', filter.asyncSelectProps.className)}
                        disabled={filter.disable}
                      />
                    )}

                    {filter.type === 'multi-select' && filter.multiSelectProps && (
                      <MultiSelect
                        {...filter.multiSelectProps}
                        value={values[filter.key] as string[]}
                        onChange={(value) => onChange(filter.key, value)}
                        className={cn('w-[200px]', filter.multiSelectProps.className)}
                        disabled={filter.disable}
                      />
                    )}

                    {filter.type === 'tree-select' && filter.treeSelectProps && (
                      <TreeSelect
                        {...filter.treeSelectProps}
                        value={values[filter.key] as string}
                        onChange={(value) => onChange(filter.key, value ?? '')}
                        className={cn('w-[200px]', filter.treeSelectProps.className)}
                        disabled={filter.disable}
                      />
                    )}

                    {filter.type === 'tree-multiple-select' && filter.treeMultipleSelectProps && (
                      <TreeMultipleSelect
                        {...filter.treeMultipleSelectProps}
                        value={values[filter.key] as string[]}
                        onChange={(value) => onChange(filter.key, value ?? [])}
                        className={cn('w-[200px]', filter.treeMultipleSelectProps.className)}
                        disabled={filter.disable}
                      />
                    )}

                    {filter.type === 'date-picker' && (
                      <div className="w-fit">
                        <DatePicker
                          outputFormat="iso"
                          showPresets
                          showActions
                          {...filter.datePickerProps}
                          value={values[filter.key] as DateValue}
                          onChange={(value) => {
                            onChange(filter.key, value);
                            filter.onChange?.(value);
                          }}
                          disabled={filter.disable}
                        />
                      </div>
                    )}

                    {filter.type === 'date-range-picker' && (
                      <div className="w-fit">
                        <DateRangePicker
                          key={`${filter.key}-${filter.dateRangePickerProps?.defaultMode || 'date'}`}
                          outputFormat="iso"
                          showPresets
                          showActions
                          {...filter.dateRangePickerProps}
                          value={values[filter.key] as DateRange}
                          onChange={(value, meta) => {
                            onChange(filter.key, value);
                            filter.onChange?.(value, meta);
                          }}
                          disabled={filter.disable}
                        />
                      </div>
                    )}

                    {filter.type === 'text-input' && (
                      <FilterPanelCommaSeparatedTextInput
                        id={`filter-${filter.key}`}
                        value={(values[filter.key] as string[] | undefined) ?? []}
                        onCommit={(next) => {
                          onChange(filter.key, next);
                          filter.onChange?.(next);
                        }}
                        placeholder={filter.textInputProps?.placeholder}
                        className={filter.textInputProps?.className}
                        disabled={filter.disable}
                      />
                    )}
                  </div>
                );
              })}

              {/* Custom content after main filters */}
              {renderAfterFilters}
            </div>
            {/* Advanced Filters Toggle & Reset */}
            {(hasAdvancedFilters || onReset) && (
              <div className="flex items-start justify-end gap-2">
                {onReset && (
                  <Button
                    disabled={disable}
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {resetLabel}
                  </Button>
                )}
                {hasAdvancedFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="relative gap-2"
                    data-advanced-filter-toggle
                  >
                    <Filter className="h-4 w-4" />
                    {advancedFiltersButton}
                    {selectedAdvancedCount > 0 && (
                      <Badge
                        variant="primary"
                        className="ml-1 h-5 min-w-5 rounded-full px-1.5 text-xs"
                      >
                        {selectedAdvancedCount}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Advanced Filters Content - Absolute Positioned with Animation */}
          {showAdvanced && hasAdvancedFilters && (
            <div
              ref={advancedRef}
              className="fade-in-0 slide-in-from-top-2 absolute top-full right-0 left-0 z-50 mt-2 animate-in rounded-lg border border-border bg-card shadow-lg duration-200"
            >
              {/* Header with Close Button */}
              <div className="flex items-center justify-between rounded-t-lg border-border border-b bg-muted/50 px-4 py-3">
                <h3 className="font-semibold text-sm">{advancedFiltersLabel}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(false)}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Groups */}
              <div className="space-y-6 p-4">
                {effectiveGroups.map((group, groupIndex) => (
                  <div key={group.title || `group-${groupIndex}`}>
                    {/* Group Title */}
                    {group.title && (
                      <h4 className="mb-3 font-bold text-primary text-sm">{group.title}</h4>
                    )}
                    {/* Group Filters Grid */}
                    <div
                      className={cn(
                        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                        'gap-4'
                      )}
                    >
                      {group.filters.map((filter) => (
                        <div key={filter.key} className="flex flex-col gap-2">
                          <span className="font-medium text-muted-foreground text-sm">
                            {filter.label}
                          </span>
                          {filter.type === 'select' && filter.asyncSelectProps && (
                            <AsyncSelect
                              {...filter.asyncSelectProps}
                              value={values[filter.key] as string}
                              onChange={(value) => onChange(filter.key, value)}
                              className={cn('w-full', filter.asyncSelectProps.className)}
                              disabled={filter.disable}
                            />
                          )}
                          {filter.type === 'multi-select' && filter.multiSelectProps && (
                            <MultiSelect
                              {...filter.multiSelectProps}
                              value={values[filter.key] as string[]}
                              onChange={(value) => onChange(filter.key, value)}
                              className={cn('w-full', filter.multiSelectProps.className)}
                              disabled={filter.disable}
                            />
                          )}
                          {filter.type === 'tree-select' && filter.treeSelectProps && (
                            <TreeSelect
                              {...filter.treeSelectProps}
                              value={values[filter.key] as string}
                              onChange={(value) => onChange(filter.key, value ?? '')}
                              className={cn('w-full', filter.treeSelectProps.className)}
                              disabled={filter.disable}
                            />
                          )}

                          {filter.type === 'tree-multiple-select' &&
                            filter.treeMultipleSelectProps && (
                              <TreeMultipleSelect
                                {...filter.treeMultipleSelectProps}
                                value={values[filter.key] as string[]}
                                onChange={(value) => onChange(filter.key, value ?? [])}
                                className={cn('w-full', filter.treeMultipleSelectProps.className)}
                                disabled={filter.disable}
                              />
                            )}
                          {filter.type === 'date-picker' && (
                            <DatePicker
                              outputFormat="iso"
                              showPresets
                              showActions
                              {...filter.datePickerProps}
                              value={values[filter.key] as DateValue}
                              onChange={(value) => {
                                onChange(filter.key, value);
                                filter.onChange?.(value);
                              }}
                              disabled={filter.disable}
                            />
                          )}
                          {filter.type === 'date-range-picker' && (
                            <DateRangePicker
                              key={`${filter.key}-${filter.dateRangePickerProps?.defaultMode || 'date'}`}
                              outputFormat="iso"
                              showPresets
                              showActions
                              {...filter.dateRangePickerProps}
                              value={values[filter.key] as DateRange}
                              onChange={(value, meta) => {
                                onChange(filter.key, value);
                                filter.onChange?.(value, meta);
                              }}
                              disabled={filter.disable}
                            />
                          )}
                          {filter.type === 'text-input' && (
                            <FilterPanelCommaSeparatedTextInput
                              id={`advanced-filter-${filter.key}`}
                              value={(values[filter.key] as string[] | undefined) ?? []}
                              onCommit={(next) => {
                                onChange(filter.key, next);
                                filter.onChange?.(next);
                              }}
                              placeholder={filter.textInputProps?.placeholder}
                              className={filter.textInputProps?.className}
                              disabled={filter.disable}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional content (e.g. always-visible required fields) */}
          {children}
        </CardContent>
      </Card>
    </>
  );
}
