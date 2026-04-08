import {
  addMonths,
  addWeeks,
  addYears,
  endOfMonth,
  endOfYear,
  endOfWeek,
  startOfMonth,
  startOfYear,
  startOfWeek,
} from 'date-fns';
import type { Preset } from './types';

/**
 * Generate preset date ranges (future-oriented for forecasting)
 */
export function generatePresets(): Preset[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const next7End = new Date(today);
  next7End.setDate(next7End.getDate() + 6);

  const next30End = new Date(today);
  next30End.setDate(next30End.getDate() + 29);

  const thisMonthEnd = endOfMonth(today);

  const nextMonthStart = startOfMonth(addMonths(today, 1));
  const nextMonthEnd = endOfMonth(addMonths(today, 1));

  const thisYearEnd = endOfYear(today);

  const nextYearStart = startOfYear(addYears(today, 1));
  const nextYearEnd = endOfYear(addYears(today, 1));

  return [
    { name: 'today', label: 'Today', range: { from: today, to: today } },
    {
      name: 'tomorrow',
      label: 'Tomorrow',
      range: { from: tomorrow, to: tomorrow },
    },
    {
      name: 'next7',
      label: 'Next 7 days',
      range: { from: today, to: next7End },
    },
    {
      name: 'next30',
      label: 'Next 30 days',
      range: { from: today, to: next30End },
    },
    {
      name: 'restOfMonth',
      label: 'Rest of month',
      range: { from: today, to: thisMonthEnd },
    },
    {
      name: 'nextMonth',
      label: 'Next month',
      range: { from: nextMonthStart, to: nextMonthEnd },
    },
    {
      name: 'restOfYear',
      label: 'Rest of year',
      range: { from: today, to: thisYearEnd },
    },
    {
      name: 'nextYear',
      label: 'Next year',
      range: { from: nextYearStart, to: nextYearEnd },
    },
  ];
}

export const DEFAULT_PRESETS = generatePresets();

/**
 * Generate presets for Date mode (day granularity)
 */
export function generateDatePresets(): Preset[] {
  return generatePresets();
}

/**
 * Generate presets for Week mode (future-oriented for forecasting)
 * Uses ISO 8601 week standard: weeks start on Monday
 */
export function generateWeekPresets(): Preset[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ISO week starts on Monday (weekStartsOn: 1)
  const weekStartsOn = 1;

  // This week: current ISO week
  const thisWeekStart = startOfWeek(today, { weekStartsOn });
  const thisWeekEnd = endOfWeek(today, { weekStartsOn });

  // Next week: upcoming ISO week
  const nextWeekStart = startOfWeek(addWeeks(today, 1), { weekStartsOn });
  const nextWeekEnd = endOfWeek(addWeeks(today, 1), { weekStartsOn });

  // Next 4 weeks: from start of current week to end of week 4 weeks ahead
  const next4WeeksStart = startOfWeek(today, { weekStartsOn });
  const next4WeeksEnd = endOfWeek(addWeeks(today, 3), { weekStartsOn });

  // Next 12 weeks: from start of current week to end of week 12 weeks ahead
  const next12WeeksStart = startOfWeek(today, { weekStartsOn });
  const next12WeeksEnd = endOfWeek(addWeeks(today, 11), { weekStartsOn });

  return [
    { name: 'thisWeek', label: 'This week', range: { from: thisWeekStart, to: thisWeekEnd } },
    { name: 'nextWeek', label: 'Next week', range: { from: nextWeekStart, to: nextWeekEnd } },
    {
      name: 'next4Weeks',
      label: 'Next 4 weeks',
      range: { from: next4WeeksStart, to: next4WeeksEnd },
    },
    {
      name: 'next12Weeks',
      label: 'Next 12 weeks',
      range: { from: next12WeeksStart, to: next12WeeksEnd },
    },
  ];
}

/**
 * Generate presets for Month mode (future-oriented for forecasting)
 */
export function generateMonthPresets(): Preset[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisMonthStart = startOfMonth(today);
  const thisMonthEnd = endOfMonth(today);

  const nextMonthStart = startOfMonth(addMonths(today, 1));
  const nextMonthEnd = endOfMonth(addMonths(today, 1));

  const next3MonthsEnd = endOfMonth(addMonths(today, 2));
  const next6MonthsEnd = endOfMonth(addMonths(today, 5));
  const next12MonthsEnd = endOfMonth(addMonths(today, 11));

  const thisYearEnd = endOfYear(today);

  return [
    { name: 'thisMonth', label: 'This month', range: { from: thisMonthStart, to: thisMonthEnd } },
    { name: 'nextMonth', label: 'Next month', range: { from: nextMonthStart, to: nextMonthEnd } },
    {
      name: 'next3Months',
      label: 'Next 3 months',
      range: { from: thisMonthStart, to: next3MonthsEnd },
    },
    {
      name: 'next6Months',
      label: 'Next 6 months',
      range: { from: thisMonthStart, to: next6MonthsEnd },
    },
    {
      name: 'next12Months',
      label: 'Next 12 months',
      range: { from: thisMonthStart, to: next12MonthsEnd },
    },
    { name: 'restOfYear', label: 'Rest of year', range: { from: thisMonthStart, to: thisYearEnd } },
  ];
}

/**
 * Generate presets for Year mode (future-oriented for forecasting)
 */
export function generateYearPresets(): Preset[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisYearStart = startOfYear(today);
  const thisYearEnd = endOfYear(today);

  const nextYearStart = startOfYear(addYears(today, 1));
  const nextYearEnd = endOfYear(addYears(today, 1));

  const next3YearsEnd = endOfYear(addYears(today, 2));
  const next5YearsEnd = endOfYear(addYears(today, 4));

  return [
    { name: 'thisYear', label: 'This year', range: { from: thisYearStart, to: thisYearEnd } },
    { name: 'nextYear', label: 'Next year', range: { from: nextYearStart, to: nextYearEnd } },
    {
      name: 'next3Years',
      label: 'Next 3 years',
      range: { from: thisYearStart, to: next3YearsEnd },
    },
    {
      name: 'next5Years',
      label: 'Next 5 years',
      range: { from: thisYearStart, to: next5YearsEnd },
    },
  ];
}

export const DATE_MODE_PRESETS = generateDatePresets();
export const WEEK_MODE_PRESETS = generateWeekPresets();
export const MONTH_MODE_PRESETS = generateMonthPresets();
export const YEAR_MODE_PRESETS = generateYearPresets();

/**
 * Single date presets for DatePicker
 */
export type SingleDatePreset = {
  name: string;
  label: string;
  date: Date;
};

export function generateSingleDatePresets(): SingleDatePreset[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return [
    { name: 'today', label: 'Today', date: today },
    { name: 'tomorrow', label: 'Tomorrow', date: tomorrow },
    { name: 'yesterday', label: 'Yesterday', date: yesterday },
    { name: 'nextWeek', label: 'Next Week', date: nextWeek },
    { name: 'nextMonth', label: 'Next Month', date: nextMonth },
    { name: 'startOfWeek', label: 'Start of Week', date: startOfWeek },
    { name: 'endOfWeek', label: 'End of Week', date: endOfWeek },
    { name: 'startOfMonth', label: 'Start of Month', date: startOfMonth },
    { name: 'endOfMonth', label: 'End of Month', date: endOfMonth },
  ];
}

export const DEFAULT_SINGLE_DATE_PRESETS = generateSingleDatePresets();
