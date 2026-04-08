import * as React from 'react';
import { format, isEqual, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../../../ui/actions/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/overlays/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/actions/tabs';
import { useControlledState } from '../../../../hooks/use-controlled-state';
import { DateRangeView } from './date-range-view';
import { MonthRangeView } from '../month/month-range-view';
import { WeekRangeView } from '../week/week-range-view';
import { YearRangeView } from '../year/year-range-view';
import { toUTCDate } from '../utils';
import {
  DEFAULT_PRESETS,
  DATE_MODE_PRESETS,
  WEEK_MODE_PRESETS,
  MONTH_MODE_PRESETS,
  YEAR_MODE_PRESETS,
} from '../presets';
import { PICKER_MODE, DATE_RANGE_PICKER_GRANULARITY } from '../types';
import type {
  DateRange,
  DateValue,
  PickerMode,
  DateRangePickerContextValue,
  Preset,
  DateRangePickerChangeMeta,
  DateRangePickerGranularity,
  DateRangePickerRef,
} from '../types';

type DateRangePickerProps = {
  /**
   * Controlled value. When provided, component is controlled.
   */
  value?: DateRange;
  /**
   * Default value for uncontrolled mode.
   */
  defaultValue?: DateRange;
  /**
   * Callback when date range changes.
   */
  onChange?: (range: DateRange, meta: DateRangePickerChangeMeta) => void;
  /**
   * Output format for onChange callback
   * - 'date': Returns Date objects (default)
   * - 'iso': Returns ISO strings
   */
  outputFormat?: 'date' | 'iso';
  placeholderFrom?: string;
  placeholderTo?: string;
  minDate?: Date;
  maxDate?: Date;
  defaultMode?: PickerMode;
  mode?: PickerMode;
  /**
   * Show preset buttons (Today, Yesterday, etc.)
   */
  showPresets?: boolean;
  /**
   * Custom presets. If not provided, uses default presets.
   */
  presets?: Preset[];
  /**
   * Show Cancel/Confirm action buttons
   */
  showActions?: boolean;
  /**
   * Available modes to show in tabs. If not provided, shows all modes.
   */
  availableModes?: PickerMode[];
  children?: React.ReactNode;
  /**
   * Error state from form validation
   */
  'aria-invalid'?: boolean;
  /**
   * Disable the date range picker
   */
  disabled?: boolean;
  className?: string;
};

const DateRangePickerContext = React.createContext<DateRangePickerContextValue | null>(null);

const mapModeToGranularity = (mode: PickerMode): DateRangePickerGranularity => {
  switch (mode) {
    case PICKER_MODE.WEEK:
      return DATE_RANGE_PICKER_GRANULARITY.WEEK;
    case PICKER_MODE.MONTH:
      return DATE_RANGE_PICKER_GRANULARITY.MONTH;
    case PICKER_MODE.YEAR:
      return DATE_RANGE_PICKER_GRANULARITY.YEAR;

    default:
      return DATE_RANGE_PICKER_GRANULARITY.DAY;
  }
};

// Helper to normalize DateValue (string | Date) to Date object
const toDateObject = (value: DateValue): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  return undefined;
};

// Helper to normalize DateRange to Date objects
const normalizeDateRange = (range: DateRange): { from: Date | undefined; to: Date | undefined } => {
  return {
    from: toDateObject(range.from),
    to: toDateObject(range.to),
  };
};

// Helper function outside component to avoid recreation
const formatDateRange = (
  range: DateRange,
  placeholderFrom: string,
  placeholderTo: string
): string => {
  if (!range.from && !range.to) {
    return `${placeholderFrom} - ${placeholderTo}`;
  }

  const normalizedRange = normalizeDateRange(range);
  const isValidFrom = normalizedRange.from && !Number.isNaN(normalizedRange.from.getTime());
  const isValidTo = normalizedRange.to && !Number.isNaN(normalizedRange.to.getTime());

  const fromText =
    isValidFrom && normalizedRange.from
      ? format(normalizedRange.from, 'MMM d, yyyy')
      : placeholderFrom;
  const toText =
    isValidTo && normalizedRange.to ? format(normalizedRange.to, 'MMM d, yyyy') : placeholderTo;

  return `${fromText} - ${toText}`;
};

// Pure function to get presets based on mode - React Compiler will auto-optimize
const getModePresets = (mode: PickerMode, presets: Preset[]): Preset[] => {
  if (presets !== DEFAULT_PRESETS) {
    return presets; // Use custom presets if provided
  }

  switch (mode) {
    case PICKER_MODE.WEEK:
      return WEEK_MODE_PRESETS;
    case PICKER_MODE.MONTH:
      return MONTH_MODE_PRESETS;
    case PICKER_MODE.YEAR:
      return YEAR_MODE_PRESETS;
    case PICKER_MODE.DATE:
    default:
      return DATE_MODE_PRESETS;
  }
};

// Pure function to find matching preset - moved outside component for React Compiler optimization
const findMatchingPreset = (range: DateRange, presets: Preset[]): string | null => {
  if (!range?.from || !range?.to) {
    return null;
  }

  const fromDate = toDateObject(range.from);
  const toDate = toDateObject(range.to);

  if (!fromDate || !toDate) {
    return null;
  }

  const matchedPreset = presets.find((preset) => {
    const presetFrom = toDateObject(preset.range.from);
    const presetTo = toDateObject(preset.range.to);

    if (!presetFrom || !presetTo) return false;

    return (
      isEqual(startOfDay(presetFrom), startOfDay(fromDate)) &&
      isEqual(startOfDay(presetTo), startOfDay(toDate))
    );
  });

  return matchedPreset?.name ?? null;
};

function useDateRangePickerContext() {
  const context = React.useContext(DateRangePickerContext);
  if (!context) {
    throw new Error('DateRangePicker compound components must be used within DateRangePicker');
  }
  return context;
}

// Root component
const DateRangePickerComponent = React.forwardRef<DateRangePickerRef, DateRangePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange: handleChange,
      outputFormat = 'date',
      placeholderFrom = 'Start date',
      placeholderTo = 'End date',
      minDate,
      maxDate,
      defaultMode = PICKER_MODE.DATE,
      mode: controlledMode,
      showPresets = true,
      presets = DEFAULT_PRESETS,
      showActions = false,
      availableModes,
      children,
      'aria-invalid': ariaInvalid,
      disabled,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    // Default preset (Last 7 days)
    const defaultPreset = presets.find((p) => p.name === 'last7');

    const [mode, setMode] = useControlledState<PickerMode>({
      value: controlledMode,
      defaultValue: defaultMode,
    });
    const [range, setRange] = useControlledState<DateRange>({
      value: controlledValue,
      defaultValue: defaultValue ?? { from: undefined, to: undefined },
      onChange: (nextRange) => {
        const normalizedRange = nextRange ?? { from: undefined, to: undefined };

        // Convert to ISO string if outputFormat is 'iso'
        let outputRange: DateRange = normalizedRange;
        if (outputFormat === 'iso') {
          const fromDate = toDateObject(normalizedRange.from);
          const toDate = toDateObject(normalizedRange.to);
          outputRange = {
            from: fromDate?.toISOString(),
            to: toDate?.toISOString(),
          };
        }

        handleChange?.(outputRange, {
          mode: mode ?? defaultMode,
          granularity: mapModeToGranularity(mode ?? defaultMode),
        });
      },
    });

    // Temp range for when showActions is true (only commit on confirm)
    const [tempRange, setTempRange] = React.useState<DateRange>(
      range ?? { from: undefined, to: undefined }
    );

    // Expose imperative methods via ref
    React.useImperativeHandle(ref, () => ({
      reset: () => {
        const resetRange = defaultPreset?.range ?? { from: undefined, to: undefined };
        if (showActions) {
          setTempRange(resetRange);
        } else {
          setRange(resetRange);
        }
      },
      clear: () => {
        const emptyRange = { from: undefined, to: undefined };
        if (showActions) {
          setTempRange(emptyRange);
        } else {
          setRange(emptyRange);
        }
      },
      setValue: (newRange: DateRange) => {
        if (showActions) {
          setTempRange(newRange);
        } else {
          setRange(newRange);
        }
      },
    }));

    const handleConfirm = () => {
      setRange(tempRange);
      setIsOpen(false);
    };

    const handleCancel = () => {
      setTempRange(range ?? { from: undefined, to: undefined });
      setIsOpen(false);
    };

    const handleReset = () => {
      const resetRange = defaultPreset?.range ?? { from: undefined, to: undefined };
      if (showActions) {
        setTempRange(resetRange);
      } else {
        setRange(resetRange);
      }
      if (!showActions) {
        setIsOpen(false);
      }
    };

    const handleOpenChange = (open: boolean) => {
      if (open) {
        // Sync tempRange when opening
        setTempRange(range ?? { from: undefined, to: undefined });
        setIsOpen(true);
      } else if (showActions) {
        handleCancel();
      } else {
        setIsOpen(false);
      }
    };

    // Derived state - React Compiler will auto-optimize this
    const currentRange = showActions ? tempRange : (range ?? { from: undefined, to: undefined });
    const currentRangeHandler = showActions ? setTempRange : setRange;
    const selectedPreset = findMatchingPreset(currentRange, presets);
    const currentMode = mode ?? defaultMode;
    const hideModeSelector = Boolean(controlledMode);

    const contextValue: DateRangePickerContextValue = {
      range: currentRange,
      onRangeChange: currentRangeHandler,
      mode: currentMode,
      onModeChange: setMode,
      isOpen,
      onOpenChange: setIsOpen,
      placeholderFrom,
      placeholderTo,
      hideModeSelector,
      ariaInvalid,
      disabled,
    };

    return (
      <DateRangePickerContext.Provider value={contextValue}>
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          {children ?? (
            <>
              <DateRangePickerTrigger className={className} />
              <DateRangePickerContent
                minDate={minDate}
                maxDate={maxDate}
                showPresets={showPresets}
                presets={presets}
                showActions={showActions}
                availableModes={availableModes}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onReset={handleReset}
                selectedPreset={selectedPreset}
              />
            </>
          )}
        </Popover>
      </DateRangePickerContext.Provider>
    );
  }
);

// Create a compound component wrapper
const DateRangePicker = DateRangePickerComponent as typeof DateRangePickerComponent & {
  Trigger: typeof DateRangePickerTrigger;
  Content: typeof DateRangePickerContent;
};

// Trigger component
type DateRangePickerTriggerProps = {
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  /**
   * Error state from form validation
   */
  'aria-invalid'?: boolean;
  /**
   * Disable the trigger button
   */
  disabled?: boolean;
};

function DateRangePickerTrigger({
  className,
  size = 'default',
  variant = 'outline',
  'aria-invalid': ariaInvalidProp,
  disabled: disabledProp,
}: DateRangePickerTriggerProps) {
  const {
    range,
    placeholderFrom,
    placeholderTo,
    ariaInvalid: ariaInvalidContext,
    disabled: disabledContext,
  } = useDateRangePickerContext();
  const ariaInvalid = ariaInvalidProp ?? ariaInvalidContext;
  const disabled = disabledProp ?? disabledContext;

  // Use helper function instead of inline function
  const displayText = formatDateRange(
    range,
    placeholderFrom ?? 'Start date',
    placeholderTo ?? 'End date'
  );
  const isEmpty = !range.from && !range.to;

  return (
    <PopoverTrigger
      disabled={disabled}
      render={(props) => (
        <Button
          {...props}
          size={size}
          variant={variant}
          data-empty={isEmpty}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={`w-full justify-start text-start font-normal aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[empty=true]:text-muted-foreground dark:aria-invalid:ring-destructive/40 ${
            className || ''
          }`}
        >
          {displayText}
          <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
        </Button>
      )}
    />
  );
}

// Content component
type DateRangePickerContentProps = {
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  showPresets?: boolean;
  presets?: Preset[];
  showActions?: boolean;
  availableModes?: PickerMode[];
  onConfirm?: () => void;
  onCancel?: () => void;
  onReset?: () => void;
  selectedPreset?: string | null;
  autoScroll?: boolean;
};

function DateRangePickerContent({
  minDate,
  maxDate,
  className,
  showPresets = false,
  presets = DEFAULT_PRESETS,
  showActions = false,
  availableModes,
  onConfirm,
  onReset,
  selectedPreset,
  autoScroll,
}: DateRangePickerContentProps) {
  const { range, onRangeChange, mode, onModeChange, onOpenChange, hideModeSelector } =
    useDateRangePickerContext();

  // Normalize range to Date objects for view components
  const normalizedRange = normalizeDateRange(range);

  // Determine which modes to show
  const modesToShow = availableModes || [
    PICKER_MODE.DATE,
    PICKER_MODE.WEEK,
    PICKER_MODE.MONTH,
    PICKER_MODE.YEAR,
  ];

  // Get presets based on current mode
  const modePresets = getModePresets(mode, presets);

  // Extract stable handlers - React Compiler optimizes these
  const handleClose = () => {
    if (!showActions) {
      onOpenChange(false);
    }
  };

  const handlePresetClick = (preset: Preset) => {
    // Normalize preset range to ensure consistent UTC format like calendar selections
    const normalizedPresetRange = normalizeDateRange(preset.range);

    // Convert to UTC dates (same as calendar selections)
    const outputRange: DateRange = {
      from: normalizedPresetRange.from ? toUTCDate(normalizedPresetRange.from) : undefined,
      to: normalizedPresetRange.to ? toUTCDate(normalizedPresetRange.to) : undefined,
    };

    onRangeChange(outputRange);
    if (!showActions) {
      onOpenChange(false);
    }
  };

  // Handler for view components - just delegates to context
  const handleRangeChange = onRangeChange;

  // Compute close handler once
  const closeHandler = showActions ? undefined : handleClose;

  return (
    <PopoverContent
      className={`w-auto bg-popover p-2 ${className || ''}`}
      side="bottom"
      align="start"
      sideOffset={4}
    >
      <div className="flex gap-2">
        {/* Main content */}
        <div className="flex-1">
          <Tabs value={mode} onValueChange={(value) => onModeChange(value as PickerMode)}>
            {!hideModeSelector && (
              <TabsList className="w-full">
                {modesToShow.includes(PICKER_MODE.DATE) && (
                  <TabsTrigger value={PICKER_MODE.DATE}>Date</TabsTrigger>
                )}
                {modesToShow.includes(PICKER_MODE.WEEK) && (
                  <TabsTrigger value={PICKER_MODE.WEEK}>Week</TabsTrigger>
                )}
                {modesToShow.includes(PICKER_MODE.MONTH) && (
                  <TabsTrigger value={PICKER_MODE.MONTH}>Month</TabsTrigger>
                )}
                {modesToShow.includes(PICKER_MODE.YEAR) && (
                  <TabsTrigger value={PICKER_MODE.YEAR}>Year</TabsTrigger>
                )}
              </TabsList>
            )}
            <TabsContent value={PICKER_MODE.DATE} className="m-0">
              <DateRangeView
                range={normalizedRange}
                onRangeChange={handleRangeChange}
                minDate={minDate}
                maxDate={maxDate}
                onClose={closeHandler}
              />
            </TabsContent>
            <TabsContent value={PICKER_MODE.WEEK} className="m-0">
              <WeekRangeView
                range={normalizedRange}
                onRangeChange={handleRangeChange}
                minDate={minDate}
                maxDate={maxDate}
                onClose={closeHandler}
                autoScroll={autoScroll}
              />
            </TabsContent>
            <TabsContent value={PICKER_MODE.MONTH} className="m-0">
              <MonthRangeView
                range={normalizedRange}
                onRangeChange={handleRangeChange}
                minDate={minDate}
                maxDate={maxDate}
                onClose={closeHandler}
                autoScroll={autoScroll}
              />
            </TabsContent>
            <TabsContent value={PICKER_MODE.YEAR} className="m-0">
              <YearRangeView
                range={normalizedRange}
                onRangeChange={handleRangeChange}
                minDate={minDate}
                maxDate={maxDate}
                onClose={closeHandler}
                autoScroll={autoScroll}
              />
            </TabsContent>
          </Tabs>

          {/* Action buttons */}
          {showActions && (
            <div className="mt-2 flex items-center justify-end gap-1.5 border-t pt-3">
              <Button type="button" variant="outline" size="sm" onClick={onReset}>
                Reset
              </Button>
              <Button type="button" variant="default" size="sm" onClick={onConfirm}>
                Apply
              </Button>
            </div>
          )}
        </div>

        {/* Presets sidebar */}
        {showPresets && (
          <div className="relative max-sm:order-1 max-sm:border-t sm:w-34">
            <div className="flex h-full max-h-[400px] flex-col border-border border-l">
              <div className="overflow-y-auto py-2">
                <div className="flex flex-col gap-0.5 px-2">
                  {modePresets.map((preset) => (
                    <Button
                      key={preset.name}
                      type="button"
                      variant="ghost"
                      className={`h-8 w-full justify-start ${
                        selectedPreset === preset.name ? 'bg-accent' : ''
                      }`}
                      onClick={() => handlePresetClick(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PopoverContent>
  );
}

// Compound exports
DateRangePicker.Trigger = DateRangePickerTrigger;
DateRangePicker.Content = DateRangePickerContent;

DateRangePicker.displayName = 'DateRangePicker';
DateRangePickerTrigger.displayName = 'DateRangePicker.Trigger';
DateRangePickerContent.displayName = 'DateRangePicker.Content';

export { DateRangePicker, DateRangePickerTrigger, DateRangePickerContent };
export {
  DEFAULT_PRESETS,
  DATE_MODE_PRESETS,
  WEEK_MODE_PRESETS,
  MONTH_MODE_PRESETS,
  YEAR_MODE_PRESETS,
} from '../presets';
export type {
  DateRange,
  Preset,
  DateRangePickerChangeMeta,
  DateRangePickerGranularity,
  DateRangePickerRef,
} from '../types';
