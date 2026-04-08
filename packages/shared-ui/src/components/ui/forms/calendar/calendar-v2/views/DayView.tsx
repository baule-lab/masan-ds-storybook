/**
 * DayView — custom day calendar built directly on react-day-picker v9.
 *
 * Key design decisions:
 * - Does NOT wrap Calendar v1 so we have full control over component overrides.
 * - Uses a React context to pass `onDrillUp` into the stable `CaptionLabel`
 *   override, avoiding the remount issue caused by inline component definitions.
 * - Range type renders two isolated panels: left picks `from`, right picks `to`.
 *   Each panel navigates independently and shares range-highlight modifiers.
 */

import * as React from 'react';
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type CaptionLabelProps,
} from 'react-day-picker';
import { addMonths } from 'date-fns'; // used for fallback rightNavDate only
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button, buttonVariants } from '../../../../actions/button';
import { cn } from '../../../../../../lib/utils';
import { toDateOrUndefined } from '../utils';
import type { CalendarSelectionType, DateValue, DateRange, ViewSharedProps } from '../types';

// ─────────────────────────────────────────────────────────────
// Context — lets the stable CaptionLabel access onDrillUp
// ─────────────────────────────────────────────────────────────

const DrillUpContext = React.createContext<(() => void) | undefined>(undefined);

// ─────────────────────────────────────────────────────────────
// Stable component overrides (defined outside — never remounted)
// ─────────────────────────────────────────────────────────────

const defaultClassNames = getDefaultClassNames();

/** Replaces the plain <span> with a clickable button that triggers drill-up. */
function DrillableCaptionLabel({ children, ...props }: CaptionLabelProps) {
  const onDrillUp = React.useContext(DrillUpContext);
  return (
    <button
      type="button"
      onClick={onDrillUp}
      className={cn(
        'select-none rounded px-1 font-medium text-sm',
        onDrillUp && 'cursor-pointer hover:bg-accent hover:text-accent-foreground',
        !onDrillUp && 'cursor-default'
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/** Chevron used for prev/next navigation buttons. */
function DayViewChevron({
  orientation,
  className,
}: {
  orientation?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}) {
  if (orientation === 'left') return <ChevronLeftIcon className={cn('size-4', className)} />;
  return <ChevronRightIcon className={cn('size-4', className)} />;
}

/** Day button with selection/range highlighting — mirrors Calendar v1 styling. */
function DayViewDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const focusRef = (el: HTMLButtonElement | null) => {
    if (modifiers.focused && el) el.focus();
  };

  return (
    <Button
      ref={focusRef}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none',
        'data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md',
        'data-[range-end=true]:rounded-r-md data-[range-start=true]:rounded-l-md',
        'data-[range-end=true]:bg-primary data-[range-middle=true]:bg-accent data-[range-start=true]:bg-primary data-[selected-single=true]:bg-primary',
        'data-[range-end=true]:text-primary-foreground data-[range-middle=true]:text-accent-foreground data-[range-start=true]:text-primary-foreground data-[selected-single=true]:text-primary-foreground',
        'group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50',
        'dark:hover:text-accent-foreground [&>span]:text-xs [&>span]:opacity-70',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Shared DayPicker classNames — matches Calendar v1 styling
// ─────────────────────────────────────────────────────────────

const DAY_PICKER_CLASS_NAMES = {
  root: cn('w-full', defaultClassNames.root),
  months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
  month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
  // pointer-events-none on the nav container so it doesn't block clicks on the
  // caption label underneath; individual buttons restore pointer-events-auto.
  nav: cn(
    'pointer-events-none absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
    defaultClassNames.nav
  ),
  button_previous: cn(
    buttonVariants({ variant: 'ghost' }),
    'pointer-events-auto size-(--cell-size) select-none p-0 aria-disabled:opacity-50',
    defaultClassNames.button_previous
  ),
  button_next: cn(
    buttonVariants({ variant: 'ghost' }),
    'pointer-events-auto size-(--cell-size) select-none p-0 aria-disabled:opacity-50',
    defaultClassNames.button_next
  ),
  month_caption: cn(
    'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
    defaultClassNames.month_caption
  ),
  caption_label: cn('select-none font-medium text-sm', defaultClassNames.caption_label),
  table: 'w-full border-collapse',
  weekdays: cn('flex', defaultClassNames.weekdays),
  weekday: cn(
    'flex-1 select-none rounded-md font-normal text-[0.8rem] text-muted-foreground',
    defaultClassNames.weekday
  ),
  week: cn('mt-2 flex w-full', defaultClassNames.week),
  day: cn(
    'group/day relative aspect-square h-full w-full select-none p-0 text-center',
    '[&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md',
    defaultClassNames.day
  ),
  range_start: cn('rounded-l-md bg-accent', defaultClassNames.range_start),
  range_middle: cn('rounded-none', defaultClassNames.range_middle),
  range_end: cn('rounded-r-md bg-accent', defaultClassNames.range_end),
  today: cn(
    'rounded-md bg-accent text-accent-foreground data-[selected=true]:rounded-none',
    defaultClassNames.today
  ),
  outside: cn(
    'text-muted-foreground aria-selected:text-muted-foreground',
    defaultClassNames.outside
  ),
  disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
  hidden: cn('invisible', defaultClassNames.hidden),
} as const;

const DAY_PICKER_COMPONENTS = {
  CaptionLabel: DrillableCaptionLabel,
  Chevron: DayViewChevron,
  DayButton: DayViewDayButton,
} as const;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

type DayViewProps = ViewSharedProps & {
  selectionType: CalendarSelectionType;
  value?: DateValue | DateValue[] | DateRange;
  onChange?: (value: DateValue | DateValue[] | DateRange) => void;
  // range day-mode only — lifted to CalendarV2 for drill-up routing
  rightNavDate?: Date;
  onRightNavDateChange?: (date: Date) => void;
  onDrillUpRight?: () => void;
};

function toDateArray(value?: DateValue[]): Date[] | undefined {
  if (!value) return undefined;
  const dates = value.map((v) => toDateOrUndefined(v)).filter((d): d is Date => d != null);
  return dates.length > 0 ? dates : undefined;
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Build the disabled matcher — avoids passing `disabled: []` to DayPicker. */
function buildDisabled(
  isDisabled?: boolean,
  minDate?: Date,
  maxDate?: Date
): true | Array<{ before: Date } | { after: Date }> | undefined {
  if (isDisabled) return true;
  const matchers: Array<{ before: Date } | { after: Date }> = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];
  return matchers.length > 0 ? matchers : undefined;
}

// ─────────────────────────────────────────────────────────────
// DayView
// ─────────────────────────────────────────────────────────────

export function DayView({
  navDate,
  onNavDateChange,
  onDrillUp,
  selectionType,
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  readOnly,
  rightNavDate: rightNavDateProp,
  onRightNavDateChange,
  onDrillUpRight,
}: DayViewProps) {
  const effectiveOnChange = readOnly ? undefined : onChange;
  const disabledMatcher = buildDisabled(disabled, minDate, maxDate);

  // Fallback right-panel nav when CalendarV2 doesn't supply it (standalone use).
  const [fallbackRightNavDate, setFallbackRightNavDate] = React.useState<Date>(() =>
    addMonths(navDate, 1)
  );
  const rightNavDate = rightNavDateProp ?? fallbackRightNavDate;
  const setRightNavDate = onRightNavDateChange ?? setFallbackRightNavDate;

  const sharedDayPickerProps = {
    showOutsideDays: true,
    className: cn(
      'group/calendar bg-background p-3 [--cell-size:--spacing(7)]',
      String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
      String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`
    ),
    classNames: DAY_PICKER_CLASS_NAMES,
    components: DAY_PICKER_COMPONENTS,
    ...(disabledMatcher !== undefined ? { disabled: disabledMatcher } : {}),
  };

  const commonProps = {
    ...sharedDayPickerProps,
    month: navDate,
    onMonthChange: onNavDateChange,
  } as const;

  if (selectionType === 'single') {
    const selected = toDateOrUndefined(value as DateValue);

    const handleSelect = (date?: Date) => {
      if (!date) {
        effectiveOnChange?.(undefined);
        return;
      }
      // Click again to deselect
      if (selected && isSameDate(date, selected)) {
        effectiveOnChange?.(undefined);
        return;
      }
      effectiveOnChange?.(date);
    };

    return (
      <DrillUpContext.Provider value={onDrillUp}>
        <DayPicker mode="single" selected={selected} onSelect={handleSelect} {...commonProps} />
      </DrillUpContext.Provider>
    );
  }

  if (selectionType === 'multiple') {
    const selected = toDateArray(value as DateValue[] | undefined);

    const handleSelect = (dates?: Date[]) => {
      effectiveOnChange?.(dates ?? []);
    };

    return (
      <DrillUpContext.Provider value={onDrillUp}>
        <DayPicker mode="multiple" selected={selected} onSelect={handleSelect} {...commonProps} />
      </DrillUpContext.Provider>
    );
  }

  // ── Range: two isolated panels ────────────────────────────
  // Left panel picks `from`, right panel picks `to`.
  // Each navigates independently; both share range-highlight modifiers.
  const rangeValue = value as DateRange | undefined;
  const from = toDateOrUndefined(rangeValue?.from);
  const to = toDateOrUndefined(rangeValue?.to);

  // Right panel must disable all dates before `from` (end >= start constraint).
  // Use the later of `from` and `minDate` as the effective lower bound.
  const rightEffectiveMin =
    from != null && minDate != null
      ? from.getTime() > minDate.getTime()
        ? from
        : minDate
      : (from ?? minDate);
  const rightDisabledMatcher = buildDisabled(disabled, rightEffectiveMin, maxDate);

  const rangeModifiers = {
    range_start: from ? [from] : [],
    range_end: to ? [to] : [],
    range_middle:
      from != null && to != null && from.getTime() <= to.getTime()
        ? { after: from, before: to }
        : [],
  };

  const handleFromSelect = (date?: Date) => {
    if (!date) {
      effectiveOnChange?.({ from: undefined, to: rangeValue?.to });
      return;
    }
    if (from && isSameDate(date, from)) {
      effectiveOnChange?.({ from: undefined, to: rangeValue?.to });
      return;
    }
    // Clear `to` when the new `from` would make it an invalid range.
    const existingTo = toDateOrUndefined(rangeValue?.to);
    const newTo =
      existingTo != null && existingTo.getTime() >= date.getTime() ? rangeValue?.to : undefined;
    effectiveOnChange?.({ from: date, to: newTo });
  };

  const handleToSelect = (date?: Date) => {
    if (!date) {
      effectiveOnChange?.({ from: rangeValue?.from, to: undefined });
      return;
    }
    if (to && isSameDate(date, to)) {
      effectiveOnChange?.({ from: rangeValue?.from, to: undefined });
      return;
    }
    effectiveOnChange?.({ from: rangeValue?.from, to: date });
  };

  return (
    <div className="flex divide-x">
      {/* Left panel — picks `from`. Drill-up routes to left nav. */}
      <DrillUpContext.Provider value={onDrillUp}>
        <DayPicker
          mode="single"
          selected={from}
          onSelect={handleFromSelect}
          modifiers={rangeModifiers}
          {...sharedDayPickerProps}
          month={navDate}
          onMonthChange={onNavDateChange}
        />
      </DrillUpContext.Provider>
      {/* Right panel — picks `to`. Drill-up routes to right nav. */}
      <DrillUpContext.Provider value={onDrillUpRight}>
        <DayPicker
          mode="single"
          selected={to}
          onSelect={handleToSelect}
          modifiers={rangeModifiers}
          {...sharedDayPickerProps}
          month={rightNavDate}
          onMonthChange={setRightNavDate}
          {...(rightDisabledMatcher !== undefined ? { disabled: rightDisabledMatcher } : {})}
        />
      </DrillUpContext.Provider>
    </div>
  );
}

DayView.displayName = 'DayView';
