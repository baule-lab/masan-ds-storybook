export const PICKER_MODE = {
  DATE: 'date',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export type PickerMode = (typeof PICKER_MODE)[keyof typeof PICKER_MODE];

export type DateValue = Date | string | undefined;

export type DateRange = {
  from: DateValue;
  to: DateValue;
};

export type Preset = {
  name: string;
  label: string;
  range: DateRange;
};

export type SingleDatePreset = {
  name: string;
  label: string;
  date: Date;
};

export type DatePickerContextValue = {
  value: DateValue;
  onChange: (date: DateValue) => void;
  mode: PickerMode;
  onModeChange: (mode: PickerMode) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  placeholder?: string;
  ariaInvalid?: boolean;
  disabled?: boolean;
};

export type DateRangePickerContextValue = {
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  mode: PickerMode;
  onModeChange: (mode: PickerMode) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  placeholderFrom?: string;
  placeholderTo?: string;
  hideModeSelector?: boolean;
  ariaInvalid?: boolean;
  disabled?: boolean;
};

export const DATE_RANGE_PICKER_GRANULARITY = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export type DateRangePickerGranularity =
  (typeof DATE_RANGE_PICKER_GRANULARITY)[keyof typeof DATE_RANGE_PICKER_GRANULARITY];

export interface DateRangePickerChangeMeta {
  mode: PickerMode;
  granularity: DateRangePickerGranularity;
}

export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'destructive'
  | 'secondary'
  | null
  | undefined;

/**
 * Ref type for DateRangePicker component
 * Allows imperative control of the picker
 */
export interface DateRangePickerRef {
  /**
   * Reset the picker to default preset (e.g., "Last 7 days")
   */
  reset: () => void;
  /**
   * Clear the picker value to empty
   */
  clear: () => void;
  /**
   * Set a specific date range
   */
  setValue: (range: DateRange) => void;
}
