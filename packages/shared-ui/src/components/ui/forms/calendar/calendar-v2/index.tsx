import * as React from 'react';
import { addMonths } from 'date-fns';
import { cn } from '../../../../../lib/utils';
import { toDateOrUndefined } from './utils';
import { Presets } from './Presets';
import { DayView } from './views/DayView';
import { WeekView } from './views/WeekView';
import { MonthGridView } from './views/MonthGridView';
import { YearGridView } from './views/YearGridView';
import type {
  CalendarSelectionType,
  CalendarValueMap,
  InternalView,
  DateValue,
  DateRange,
} from './types';

export type { CalendarPreset, CalendarMode, CalendarSelectionType } from './types';

export type CalendarV2Props<T extends CalendarSelectionType = 'single'> = {
  mode?: 'year' | 'month' | 'week' | 'day';
  type?: T;
  value?: CalendarValueMap[T];
  onChange?: (value: CalendarValueMap[T]) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onFocus?: () => void;
  onBlur?: () => void;
  locale?: string;
  renderActions?: () => React.ReactNode;
  presets?: { value: string; label: string }[];
};

// All single-calendar views share this width. The range-day view is double.
const CALENDAR_WIDTH = 248;
const RANGE_DAY_WIDTH = CALENDAR_WIDTH * 2 + 16; // 16px gap between the two months

function getInitialNavDate(value?: DateValue | DateValue[] | DateRange): Date {
  if (!value) return new Date();
  if (Array.isArray(value)) {
    const first = toDateOrUndefined(value[0] as DateValue);
    return first ?? new Date();
  }
  if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
    const range = value as DateRange;
    return toDateOrUndefined(range.from) ?? toDateOrUndefined(range.to) ?? new Date();
  }
  return toDateOrUndefined(value as DateValue) ?? new Date();
}

export function CalendarV2<T extends CalendarSelectionType = 'single'>({
  mode = 'day',
  type,
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  readOnly,
  className,
  style,
  onFocus,
  onBlur,
  locale,
  renderActions,
  presets,
}: CalendarV2Props<T>) {
  const selectionType: CalendarSelectionType = type ?? 'single';
  const isRangeDay = mode === 'day' && selectionType === 'range';

  const [navDate, setNavDate] = React.useState<Date>(() => getInitialNavDate(value));
  const [internalView, setInternalView] = React.useState<InternalView>('primary');

  // Right-panel nav date — only used when mode=day and selectionType=range.
  const [rightNavDate, setRightNavDate] = React.useState<Date>(() => addMonths(navDate, 1));

  // Holds the callback to run when the drill-up completes (month is selected in
  // the month-grid). Updated each time a drill-up starts so it routes the result
  // to the correct panel (left or right).
  const onDrillCompleteRef = React.useRef<(date: Date) => void>((date) => setNavDate(date));

  React.useEffect(() => {
    setInternalView('primary');
  }, [mode]);

  const sharedViewProps = {
    navDate,
    onNavDateChange: setNavDate,
    minDate,
    maxDate,
    disabled,
    readOnly,
    locale,
  };

  const valueAsUnion = value as DateValue | DateValue[] | DateRange | undefined;
  const onChangeAsUnion = onChange as
    | ((v: DateValue | DateValue[] | DateRange) => void)
    | undefined;

  /** Extract a single representative Date from any value shape — used for nav-only drill steps. */
  function extractFirstDate(v: DateValue | DateValue[] | DateRange | undefined): Date | undefined {
    if (!v) return undefined;
    if (v instanceof Date) return v;
    if (typeof v === 'string') return toDateOrUndefined(v);
    if (Array.isArray(v)) return toDateOrUndefined(v[0] as DateValue);
    const range = v as DateRange;
    return toDateOrUndefined(range.from) ?? toDateOrUndefined(range.to);
  }

  function renderView() {
    if (mode === 'year') {
      return (
        <YearGridView
          {...sharedViewProps}
          selectionType={selectionType}
          value={valueAsUnion}
          onChange={onChangeAsUnion}
        />
      );
    }

    if (mode === 'month') {
      if (internalView === 'year-grid') {
        return (
          <YearGridView
            {...sharedViewProps}
            selectionType={selectionType}
            value={undefined}
            onChange={(v) => {
              const date = extractFirstDate(v);
              if (date) setNavDate(new Date(date.getFullYear(), navDate.getMonth(), 1));
              setInternalView('primary');
            }}
          />
        );
      }
      return (
        <MonthGridView
          {...sharedViewProps}
          selectionType={selectionType}
          value={valueAsUnion}
          onChange={onChangeAsUnion}
          onDrillUp={() => setInternalView('year-grid')}
          onMonthSelect={(date) => {
            setNavDate(date);
            setInternalView('primary');
          }}
        />
      );
    }

    if (mode === 'week') {
      if (internalView === 'year-grid') {
        return (
          <YearGridView
            {...sharedViewProps}
            selectionType={selectionType}
            value={undefined}
            onChange={(v) => {
              const date = extractFirstDate(v);
              if (date) setNavDate(new Date(date.getFullYear(), navDate.getMonth(), 1));
              setInternalView('month-grid');
            }}
          />
        );
      }
      if (internalView === 'month-grid') {
        return (
          <MonthGridView
            {...sharedViewProps}
            selectionType={selectionType}
            value={undefined}
            onChange={undefined}
            onDrillUp={() => setInternalView('year-grid')}
            onMonthSelect={(date) => {
              setNavDate(date);
              setInternalView('primary');
            }}
          />
        );
      }
      return (
        <WeekView
          {...sharedViewProps}
          selectionType={selectionType}
          value={valueAsUnion}
          onChange={onChangeAsUnion}
          onDrillUp={() => setInternalView('month-grid')}
        />
      );
    }

    // Day mode
    if (internalView === 'year-grid') {
      return (
        <YearGridView
          {...sharedViewProps}
          selectionType={selectionType}
          value={undefined}
          onChange={(v) => {
            const date = extractFirstDate(v);
            if (date) setNavDate(new Date(date.getFullYear(), navDate.getMonth(), 1));
            setInternalView('month-grid');
          }}
        />
      );
    }
    if (internalView === 'month-grid') {
      return (
        <MonthGridView
          {...sharedViewProps}
          selectionType={selectionType}
          value={undefined}
          onChange={undefined}
          onDrillUp={() => setInternalView('year-grid')}
          onMonthSelect={(date) => {
            // Route the selected month to whichever panel initiated the drill-up.
            onDrillCompleteRef.current(date);
            setInternalView('primary');
          }}
        />
      );
    }
    return (
      <DayView
        {...sharedViewProps}
        selectionType={selectionType}
        value={valueAsUnion}
        onChange={onChangeAsUnion}
        // Left-panel drill-up: routes result back to left panel (navDate).
        onDrillUp={() => {
          onDrillCompleteRef.current = (date) => setNavDate(date);
          setInternalView('month-grid');
        }}
        // Right-panel drill-up (range day only): saves left nav, switches the
        // shared navDate to the right panel's month so the month-grid starts
        // at the correct year, then routes result back to right panel.
        {...(isRangeDay && {
          rightNavDate,
          onRightNavDateChange: setRightNavDate,
          onDrillUpRight: () => {
            const savedLeft = navDate;
            onDrillCompleteRef.current = (date) => {
              setRightNavDate(date);
              setNavDate(savedLeft);
            };
            setNavDate(rightNavDate);
            setInternalView('month-grid');
          },
        })}
      />
    );
  }

  const hasPresets = presets && presets.length > 0;
  const calendarWidth = isRangeDay ? RANGE_DAY_WIDTH : CALENDAR_WIDTH;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: onFocus/onBlur bubble from interactive children
    <div
      data-slot="calendar-v2"
      className={cn('inline-flex rounded-lg border bg-background shadow-sm', className)}
      style={style}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {hasPresets && (
        <Presets
          presets={presets}
          selectionType={selectionType}
          value={valueAsUnion}
          onChange={onChangeAsUnion}
          disabled={disabled}
        />
      )}

      <div className="flex flex-col" style={{ width: calendarWidth }}>
        <div className="flex-1">{renderView()}</div>
        {renderActions && <div className="border-t px-3 py-2">{renderActions()}</div>}
      </div>
    </div>
  );
}

CalendarV2.displayName = 'CalendarV2';
