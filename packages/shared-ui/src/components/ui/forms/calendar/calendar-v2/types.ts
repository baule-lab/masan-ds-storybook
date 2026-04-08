import type * as React from 'react';
import type { DateValue, DateRange } from '../../../../features/date-picker/types';

export type { DateValue, DateRange };

export type CalendarMode = 'year' | 'month' | 'week' | 'day';
export type CalendarSelectionType = 'range' | 'multiple' | 'single';

export type CalendarPreset = {
  value: string; // YYYY-MM-DD date string
  label: string;
};

export type CalendarValueMap = {
  single: DateValue;
  multiple: DateValue[];
  range: DateRange;
};

export type InternalView = 'primary' | 'month-grid' | 'year-grid';

export type CalendarProps<T extends CalendarSelectionType = 'single'> = {
  mode?: CalendarMode;
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
  presets?: CalendarPreset[];
};

export type ViewSharedProps = {
  navDate: Date;
  onNavDateChange: (date: Date) => void;
  onDrillUp?: () => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  readOnly?: boolean;
  locale?: string;
};
