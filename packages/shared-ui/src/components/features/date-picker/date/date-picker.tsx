import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../../../ui/actions/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/overlays/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/actions/tabs';

import { DateView } from './date-view';
import { WeekView } from '../week/week-view';
import { MonthView } from '../month/month-view';
import { YearView } from '../year/year-view';
import { DEFAULT_SINGLE_DATE_PRESETS } from '../presets';
import { PICKER_MODE } from '../types';
import type { DateValue, PickerMode, DatePickerContextValue, SingleDatePreset } from '../types';
import { useControlledState } from '../../../../hooks/use-controlled-state';

type DatePickerProps = {
  /**
   * Controlled value. When provided, component is controlled.
   */
  value?: DateValue;
  /**
   * Default value for uncontrolled mode.
   */
  defaultValue?: DateValue;
  /**
   * Callback when date changes.
   */
  onChange?: (date: DateValue) => void;
  /**
   * Output format for onChange callback
   * - 'date': Returns Date object (default)
   * - 'iso': Returns ISO string
   */
  outputFormat?: 'date' | 'iso';
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  defaultMode?: PickerMode;
  /**
   * Show preset buttons (Today, Tomorrow, etc.)
   */
  showPresets?: boolean;
  /**
   * Custom presets. If not provided, uses default single date presets.
   */
  presets?: SingleDatePreset[];
  /**
   * Show Cancel/Confirm action buttons
   */
  showActions?: boolean;
  /**
   * Hide year/month select dropdowns in Date view
   */
  hideYearSelect?: boolean;
  children?: React.ReactNode;
  /**
   * Error state from form validation
   */
  'aria-invalid'?: boolean;
  disabled?: boolean;
  className?: string;
};

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

function useDatePickerContext() {
  const context = React.useContext(DatePickerContext);
  if (!context) {
    throw new Error('DatePicker compound components must be used within DatePicker');
  }
  return context;
}

// Root component
function DatePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  outputFormat = 'date',
  placeholder = 'Pick a date',
  minDate,
  maxDate,
  defaultMode = PICKER_MODE.DATE,
  showPresets = true,
  presets = DEFAULT_SINGLE_DATE_PRESETS,
  showActions = false,
  hideYearSelect = false,
  children,
  disabled,
  'aria-invalid': ariaInvalid,
  className,
}: DatePickerProps) {
  const [value, setValue] = useControlledState<DateValue>({
    value: controlledValue,
    defaultValue,
    onChange: (date) => {
      if (!onChange) return;

      // Convert to ISO string if outputFormat is 'iso'
      if (outputFormat === 'iso' && date instanceof Date) {
        onChange(date.toISOString());
      } else {
        onChange(date);
      }
    },
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const [mode, setMode] = React.useState<PickerMode>(defaultMode);

  // Temp value for when showActions is true (only commit on confirm)
  const [tempValue, setTempValue] = React.useState<DateValue>(value);

  // Sync tempValue when value changes or popup opens
  React.useEffect(() => {
    if (isOpen) {
      setTempValue(value);
    }
  }, [isOpen, value]);

  const handleConfirm = () => {
    setValue(tempValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (disabled) {
      return;
    }
    if (showActions) {
      // When actions are enabled, only allow opening
      if (open) {
        setIsOpen(true);
      }
      // Prevent closing - only Cancel/Confirm can close
    } else {
      setIsOpen(open);
    }
  };

  const contextValue: DatePickerContextValue = {
    value: showActions ? tempValue : value,
    onChange: showActions ? setTempValue : setValue,
    mode,
    onModeChange: setMode,
    isOpen,
    onOpenChange: setIsOpen,
    placeholder,
    ariaInvalid,
    disabled,
  };

  return (
    <DatePickerContext.Provider value={contextValue}>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        {children ?? (
          <>
            <DatePickerTrigger className={className} />
            <DatePickerContent
              minDate={minDate}
              maxDate={maxDate}
              showPresets={showPresets}
              presets={presets}
              showActions={showActions}
              hideYearSelect={hideYearSelect}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              disabled={disabled}
            />
          </>
        )}
      </Popover>
    </DatePickerContext.Provider>
  );
}

// Trigger component
type DatePickerTriggerProps = {
  className?: string;
  size?: 'default' | 'sm' | 'xs' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  /**
   * Error state from form validation
   */
  'aria-invalid'?: boolean;
};

function DatePickerTrigger({
  className,
  size = 'xs',
  variant = 'outline',
  'aria-invalid': ariaInvalidProp,
}: DatePickerTriggerProps) {
  const {
    value,
    placeholder,
    ariaInvalid: ariaInvalidContext,
    disabled: disabledContext,
  } = useDatePickerContext();
  const ariaInvalid = ariaInvalidProp ?? ariaInvalidContext;

  const formatDisplay = (date: DateValue) => {
    if (!date) return placeholder;
    return format(date, 'MMM d, yyyy');
  };

  return (
    <PopoverTrigger disabled={disabledContext}>
      <Button
        type="button"
        size={size}
        variant={variant}
        data-empty={!value}
        aria-invalid={ariaInvalid}
        disabled={disabledContext}
        className={`w-full justify-start text-start font-normal aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[empty=true]:text-muted-foreground dark:aria-invalid:ring-destructive/40 ${
          className || ''
        }`}
      >
        {formatDisplay(value)}
        <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

// Content component
type DatePickerContentProps = {
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  showPresets?: boolean;
  presets?: SingleDatePreset[];
  showActions?: boolean;
  hideYearSelect?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  disabled?: boolean;
};

function DatePickerContent({
  minDate,
  maxDate,
  className,
  showPresets = false,
  presets = DEFAULT_SINGLE_DATE_PRESETS,
  showActions = false,
  hideYearSelect = false,
  onConfirm,
  onCancel,
  disabled: disabledProp,
}: DatePickerContentProps) {
  const {
    value,
    onChange,
    mode,
    onModeChange,
    onOpenChange,
    disabled: disabledContext,
  } = useDatePickerContext();
  const disabled = disabledProp ?? disabledContext;

  const handleClose = () => {
    if (!showActions) {
      onOpenChange(false);
    }
  };

  const handlePresetClick = (preset: SingleDatePreset) => {
    if (disabled) return;
    onChange(preset.date);
    if (!showActions) {
      onOpenChange(false);
    }
  };

  return (
    <PopoverContent className={`w-auto bg-popover p-2 ${className || ''}`}>
      <div className="flex gap-2">
        {/* Main content */}
        <div className="flex-1">
          <Tabs value={mode} onValueChange={(value) => onModeChange(value as PickerMode)}>
            <TabsList className="w-full">
              <TabsTrigger value={PICKER_MODE.DATE}>Date</TabsTrigger>
              <TabsTrigger value={PICKER_MODE.WEEK}>Week</TabsTrigger>
              <TabsTrigger value={PICKER_MODE.MONTH}>Month</TabsTrigger>
              <TabsTrigger value={PICKER_MODE.YEAR}>Year</TabsTrigger>
            </TabsList>
            <TabsContent value={PICKER_MODE.DATE} className="m-0">
              <DateView
                value={value}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                hideYearSelect={hideYearSelect}
                onClose={showActions ? undefined : handleClose}
              />
            </TabsContent>
            <TabsContent value={PICKER_MODE.WEEK} className="m-0">
              <WeekView
                value={value}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                onClose={showActions ? undefined : handleClose}
              />
            </TabsContent>
            <TabsContent value={PICKER_MODE.MONTH} className="m-0">
              <MonthView
                value={value}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                onClose={showActions ? undefined : handleClose}
              />
            </TabsContent>
            <TabsContent value={PICKER_MODE.YEAR} className="m-0">
              <YearView
                value={value}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                onClose={showActions ? undefined : handleClose}
              />
            </TabsContent>
          </Tabs>

          {/* Action buttons */}
          {showActions && (
            <div className="mt-2 flex gap-2 border-t pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="flex-1"
                onClick={onConfirm}
              >
                Confirm
              </Button>
            </div>
          )}
        </div>

        {/* Presets sidebar */}
        {showPresets && (
          <div className="flex w-[140px] flex-col gap-1 border-l pl-2">
            <div className="mb-1 font-medium text-muted-foreground text-xs">Quick Select</div>
            {presets.map((preset) => (
              <Button
                key={preset.name}
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 justify-start text-xs"
                disabled={disabled}
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </PopoverContent>
  );
}

// Compound exports
DatePicker.Trigger = DatePickerTrigger;
DatePicker.Content = DatePickerContent;

DatePicker.displayName = 'DatePicker';
DatePickerTrigger.displayName = 'DatePicker.Trigger';
DatePickerContent.displayName = 'DatePicker.Content';

export { DatePicker, DatePickerTrigger, DatePickerContent };
export { formatDateToUTCString, parseUTCString, toUTCDate } from '../utils';
export { DEFAULT_SINGLE_DATE_PRESETS } from '../presets';
export { PICKER_MODE } from '../types';
export type { DateValue, PickerMode, SingleDatePreset } from '../types';
