import type { AsyncSelectProps } from '../../patterns/async-select';
import type { MultiSelectProps } from '../../patterns/multi-select';
import type { TreeSelectProps, TreeMultipleSelectProps } from '../../patterns/tree-select';
import type { DateValue, DateRange, DateRangePickerChangeMeta } from '../date-picker';
import type { FilterTemplateDBV2 } from './hooks/use-persistent-filter-template';
import type { FilterPanelLocaleV2 } from './i18n';

/**
 * Responsive column configuration for grid layouts
 * - number: Fixed columns across all breakpoints
 * - object: Responsive columns per breakpoint
 */
export type ColumnFilterPanelConfigV2 =
  | number
  | {
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      '2xl'?: number;
    };

export interface BaseFilterOptionV2 {
  value: string;
  label: string;
}

export interface TabFilterConfigV2 {
  key: string;
  label: string;
  type: 'tabs';
  options: BaseFilterOptionV2[];
  onChange?: (v: unknown) => void;
  disable?: boolean;
}

export interface SelectFilterConfigV2 {
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

export interface MultiSelectFilterConfigV2 {
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

export interface DatePickerFilterConfigV2 {
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

export interface DateRangePickerFilterConfigV2 {
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

export type FilterConfigV2 =
  | TabFilterConfigV2
  | SelectFilterConfigV2
  | MultiSelectFilterConfigV2
  | DatePickerFilterConfigV2
  | DateRangePickerFilterConfigV2
  | TreeMultipleSelectFilterConfig
  | TreeSelectFilterConfig;

export type AdvancedFilterConfigV2 = Exclude<FilterConfigV2, TabFilterConfigV2>;
/**
 * Group of advanced filters with a title
 */
export interface AdvancedFilterGroupV2 {
  /** Title displayed above the group */
  title: string;
  /** Filters in this group */
  filters: AdvancedFilterConfigV2[];
}

/**
 * Union type for all possible filter values
 * - string: tabs, select
 * - string[]: multi-select
 * - DateValue: date-picker
 * - DateRange: date-range-picker
 */
export type FilterValueV2 = string | string[] | DateValue | DateRange;

export interface FilterPanelPropsV2 {
  /**
   * Main filters displayed in the card
   */
  filters: FilterConfigV2[];

  /**
   * Advanced filters shown when expanded (flat list)
   */
  advancedFilters?: AdvancedFilterConfigV2[];

  /**
   * Grouped advanced filters with section titles
   * Takes precedence over advancedFilters if both provided
   */
  advancedFilterGroups?: AdvancedFilterGroupV2[];

  /**
   * Current filter values
   * - string: tabs, select
   * - string[]: multi-select
   * - DateValue: date-picker
   * - DateRange: date-range-picker
   */
  values: Record<string, FilterValueV2>;

  /**
   * Default filter values to compare against
   */
  defaultValues?: Record<string, FilterValueV2>;

  /**
   * Callback when any filter changes
   */
  onChange: (key: string, value: FilterValueV2) => void;

  /**
   * Callback when reset button is clicked.
   * Receives the active template's filter values when a template is active,
   * allowing the caller to reset to template baseline instead of global defaults.
   */
  onReset?: (templateValues?: Record<string, FilterValueV2>) => void;

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
  primaryFiltersColumns?: ColumnFilterPanelConfigV2;

  /**
   * Grid columns for advanced filters section
   * - number: Fixed columns (e.g., 3)
   * - object: Responsive columns (e.g., { sm: 1, md: 2, lg: 3 })
   * Default: grid-cols-1 md:grid-cols-2
   */
  advancedFiltersColumns?: ColumnFilterPanelConfigV2;
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

  // ─── Template feature (opt-in) ──────────────────────────────────────

  /**
   * Module identifier that scopes templates in IndexedDB.
   * When provided, enables the template save/load feature.
   */
  module?: string;

  /**
   * Called when a template is applied — either by user selection from the
   * drawer or auto-applied on mount (latest template).
   * The parent should use this to update its controlled `values` state.
   */
  onApplyTemplate?: (filters: Record<string, FilterValueV2>) => void;

  /**
   * Called whenever the active template changes (selection, auto-apply on
   * mount, or deletion). Receives `undefined` when no template is active.
   * Use this to read the current active template's metadata/filters externally.
   */
  onActiveTemplateChange?: (template: FilterTemplateDBV2 | undefined) => void;

  /**
   * Partial locale overrides for all hardcoded strings inside the filter panel.
   * Only supply the keys you want to translate — the rest fall back to English defaults.
   *
   * @example
   * ```tsx
   * // Using next-intl
   * locale={{
   *   savedTemplatesLabel: t('filter.savedTemplates'),
   *   saveButtonLabel: t('common.save'),
   *   cancelLabel: t('common.cancel'),
   *   deleteDialogDescription: (name) => t('filter.deleteConfirm', { name }),
   *   templateUpdatedToast: (name) => t('filter.templateUpdated', { name }),
   * }}
   * ```
   */
  locale?: Partial<FilterPanelLocaleV2>;
}
