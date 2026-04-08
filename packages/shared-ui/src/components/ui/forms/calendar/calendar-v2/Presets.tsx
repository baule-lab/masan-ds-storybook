import { cn } from '../../../../../lib/utils';
import { parsePresetValue, formatToPresetValue, toDateOrUndefined } from './utils';
import type { CalendarPreset, CalendarSelectionType, DateValue, DateRange } from './types';

type PresetsProps = {
  presets: CalendarPreset[];
  selectionType: CalendarSelectionType;
  value?: DateValue | DateValue[] | DateRange;
  onChange?: (value: DateValue | DateValue[] | DateRange) => void;
  disabled?: boolean;
};

function getActivePresetValues(
  selectionType: CalendarSelectionType,
  value?: DateValue | DateValue[] | DateRange
): string[] {
  if (selectionType === 'range') {
    const range = value as DateRange | undefined;
    const result: string[] = [];
    const from = toDateOrUndefined(range?.from);
    const to = toDateOrUndefined(range?.to);
    if (from) result.push(formatToPresetValue(from));
    if (to) result.push(formatToPresetValue(to));
    return result;
  }
  if (selectionType === 'multiple') {
    const dates = (value as DateValue[] | undefined) ?? [];
    return dates
      .map((d) => toDateOrUndefined(d))
      .filter((d): d is Date => d != null)
      .map(formatToPresetValue);
  }
  const single = toDateOrUndefined(value as DateValue);
  return single ? [formatToPresetValue(single)] : [];
}

export function Presets({ presets, selectionType, value, onChange, disabled }: PresetsProps) {
  const activeValues = getActivePresetValues(selectionType, value);

  const handlePresetClick = (preset: CalendarPreset) => {
    if (disabled) return;
    const date = parsePresetValue(preset.value);

    if (selectionType === 'single') {
      const isActive = activeValues.includes(preset.value);
      onChange?.(isActive ? undefined : date);
    } else if (selectionType === 'multiple') {
      const current = (value as DateValue[] | undefined) ?? [];
      const isActive = activeValues.includes(preset.value);
      if (isActive) {
        onChange?.(
          current.filter((d) => {
            const parsed = toDateOrUndefined(d);
            return parsed ? formatToPresetValue(parsed) !== preset.value : true;
          })
        );
      } else {
        onChange?.([...current, date]);
      }
    } else {
      // range: set as from, or complete the range
      const range = (value as DateRange | undefined) ?? { from: undefined, to: undefined };
      const from = toDateOrUndefined(range.from);
      const to = toDateOrUndefined(range.to);
      if (!from || (from && to)) {
        onChange?.({ from: date, to: undefined });
      } else {
        const start = date < from ? date : from;
        const end = date < from ? from : date;
        onChange?.({ from: start, to: end });
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 border-r p-2 pr-3">
      {presets.map((preset) => {
        const isActive = activeValues.includes(preset.value);
        return (
          <button
            key={preset.value}
            type="button"
            disabled={disabled}
            onClick={() => handlePresetClick(preset)}
            className={cn(
              'rounded-md px-3 py-1.5 text-left text-sm transition-colors',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

Presets.displayName = 'Presets';
