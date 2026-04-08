import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';

import { DateRangePicker, PICKER_MODE } from '@masan-group/shared-ui/date-picker';
import type { DateRange, DateValue } from '@masan-group/shared-ui/date-picker';

// Helper to safely format DateValue (Date | string | undefined) for display
const formatDateValue = (value: DateValue): string => {
  if (!value) return 'Not selected';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === 'string') return new Date(value).toLocaleDateString();
  return 'Not selected';
};

const formatDateValueWithOptions = (
  value: DateValue,
  locale: string,
  options: Intl.DateTimeFormatOptions
): string => {
  if (!value) return 'Not selected';
  if (value instanceof Date) return value.toLocaleDateString(locale, options);
  if (typeof value === 'string') return new Date(value).toLocaleDateString(locale, options);
  return 'Not selected';
};

const getYear = (value: DateValue): number | null => {
  if (!value) return null;
  if (value instanceof Date) return value.getFullYear();
  if (typeof value === 'string') return new Date(value).getFullYear();
  return null;
};

/**
 * DateRangePicker with compound pattern - supports Date, Month, and Year range selection through tabs.
 */
const meta = {
  title: 'Custom Components/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    defaultMode: {
      control: 'select',
      options: [PICKER_MODE.DATE, PICKER_MODE.WEEK, PICKER_MODE.MONTH, PICKER_MODE.YEAR],
      description: 'Default mode when opening picker',
    },
    outputFormat: {
      control: 'select',
      options: ['date', 'iso'],
      description:
        'Output format for onChange callback - "date" returns Date objects, "iso" returns ISO strings',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Controlled DateRangePicker with Date mode
 */
export const ControlledDate: Story = {
  args: {
    defaultMode: PICKER_MODE.DATE,
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range changed')({ range: newRange, meta });
            }}
            placeholderFrom="Start date"
            placeholderTo="End date"
          />
        </div>
        <div className="text-sm">
          <p>
            <strong>From:</strong> {formatDateValue(range.from)}
          </p>
          <p>
            <strong>To:</strong> {formatDateValue(range.to)}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * DateRangePicker with Week mode
 */
export const ControlledWeek: Story = {
  args: {
    defaultMode: PICKER_MODE.WEEK,
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range changed')({ range: newRange, meta });
            }}
            placeholderFrom="Start week"
            placeholderTo="End week"
          />
        </div>
        <div className="text-sm">
          <p>
            <strong>From:</strong>{' '}
            {formatDateValueWithOptions(range.from, 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p>
            <strong>To:</strong>{' '}
            {formatDateValueWithOptions(range.to, 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * DateRangePicker with Month mode
 */
export const ControlledMonth: Story = {
  args: {
    defaultMode: PICKER_MODE.MONTH,
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range changed')({ range: newRange, meta });
            }}
            placeholderFrom="Start month"
            placeholderTo="End month"
          />
        </div>
        <div className="text-sm">
          <p>
            <strong>From:</strong>{' '}
            {formatDateValueWithOptions(range.from, 'en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
          <p>
            <strong>To:</strong>{' '}
            {formatDateValueWithOptions(range.to, 'en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * DateRangePicker with Year mode
 */
export const ControlledYear: Story = {
  args: {
    defaultMode: PICKER_MODE.YEAR,
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range changed')({ range: newRange, meta });
            }}
            placeholderFrom="Start year"
            placeholderTo="End year"
          />
        </div>
        <div className="text-sm">
          <p>
            <strong>From:</strong> {getYear(range.from) || 'Not selected'}
          </p>
          <p>
            <strong>To:</strong> {getYear(range.to) || 'Not selected'}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Uncontrolled DateRangePicker
 */
export const Uncontrolled: Story = {
  args: {
    defaultMode: PICKER_MODE.DATE,
  },
  render: (args) => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return (
      <div className="w-[400px]">
        <DateRangePicker
          {...args}
          defaultValue={{ from: today, to: nextWeek }}
          onChange={(newRange, meta) => {
            action('range changed')({ range: newRange, meta });
          }}
          placeholderFrom="Start date"
          placeholderTo="End date"
        />
      </div>
    );
  },
};

/**
 * DateRangePicker with min/max constraints
 */
export const WithConstraints: Story = {
  args: {
    defaultMode: PICKER_MODE.DATE,
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });
    const minDate = new Date(2023, 0, 1); // Jan 1, 2023
    const maxDate = new Date(2025, 11, 31); // Dec 31, 2025

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">Min: Jan 1, 2023 | Max: Dec 31, 2025</p>
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range changed')({ range: newRange, meta });
            }}
            minDate={minDate}
            maxDate={maxDate}
            placeholderFrom="Start date"
            placeholderTo="End date"
          />
        </div>
        <div className="text-sm">
          <p>
            <strong>From:</strong> {formatDateValue(range.from)}
          </p>
          <p>
            <strong>To:</strong> {formatDateValue(range.to)}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Custom compound pattern usage
 */
export const CustomCompound: Story = {
  args: {
    defaultMode: PICKER_MODE.MONTH,
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range changed')({ range: newRange, meta });
            }}
            placeholderFrom="Start"
            placeholderTo="End"
          >
            <DateRangePicker.Trigger variant="outline" size="sm" className="w-full" />
            <DateRangePicker.Content />
          </DateRangePicker>
        </div>
        <div className="text-sm">
          <p>
            <strong>From:</strong>{' '}
            {formatDateValueWithOptions(range.from, 'en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
          <p>
            <strong>To:</strong>{' '}
            {formatDateValueWithOptions(range.to, 'en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * DateRangePicker with presets (no action buttons)
 * Presets include: Today, Yesterday, Last 7 days, Last 30 days,
 * Month to date, Last month, Year to date, Last year
 */
export const WithPresets: Story = {
  args: {
    defaultMode: PICKER_MODE.DATE,
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Quick date range selection with preset buttons. Selection applies immediately without
          confirmation.
        </p>
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range changed')({ range: newRange, meta });
            }}
            showPresets={true}
            placeholderFrom="Start date"
            placeholderTo="End date"
          />
        </div>
        <div className="text-sm">
          <p>
            <strong>From:</strong> {formatDateValue(range.from)}
          </p>
          <p>
            <strong>To:</strong> {formatDateValue(range.to)}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * DateRangePicker with Cancel/Confirm actions
 */
export const WithActions: Story = {
  args: {
    defaultMode: PICKER_MODE.DATE,
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range confirmed')({ range: newRange, meta });
            }}
            showActions={true}
            placeholderFrom="Start date"
            placeholderTo="End date"
          />
        </div>
        <div className="text-sm">
          <p>
            <strong>From:</strong> {formatDateValue(range.from)}
          </p>
          <p>
            <strong>To:</strong> {formatDateValue(range.to)}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * DateRangePicker with presets AND actions (Apply/Reset buttons)
 * Features:
 * - Preset buttons with active state highlighting
 * - Reset button returns to default preset (Last 7 days)
 * - Apply button commits the selection
 * - Automatic preset detection when dates match a preset range
 */
export const WithPresetsAndActions: Story = {
  args: {
    defaultMode: PICKER_MODE.DATE,
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Try selecting a preset or manually picking dates. The preset highlights when active. Click
          Reset to return to "Last 7 days".
        </p>
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range confirmed')({ range: newRange, meta });
            }}
            showPresets={true}
            showActions={true}
            placeholderFrom="Start date"
            placeholderTo="End date"
          />
        </div>
        <div className="text-sm">
          <p>
            <strong>From:</strong> {formatDateValue(range.from)}
          </p>
          <p>
            <strong>To:</strong> {formatDateValue(range.to)}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * DateRangePicker with custom presets
 */
export const WithCustomPresets: Story = {
  args: {
    defaultMode: PICKER_MODE.DATE,
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    const customPresets = [
      {
        name: 'q1',
        label: 'Q1 2024',
        range: {
          from: new Date(2024, 0, 1),
          to: new Date(2024, 2, 31),
        },
      },
      {
        name: 'q2',
        label: 'Q2 2024',
        range: {
          from: new Date(2024, 3, 1),
          to: new Date(2024, 5, 30),
        },
      },
      {
        name: 'h1',
        label: 'H1 2024',
        range: {
          from: new Date(2024, 0, 1),
          to: new Date(2024, 5, 30),
        },
      },
      {
        name: 'ytd',
        label: 'Year to Date',
        range: {
          from: new Date(2024, 0, 1),
          to: new Date(),
        },
      },
    ];

    return (
      <div className="space-y-4">
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range changed')({ range: newRange, meta });
            }}
            showPresets={true}
            presets={customPresets}
            placeholderFrom="Start date"
            placeholderTo="End date"
          />
        </div>
        <div className="text-sm">
          <p>
            <strong>From:</strong> {formatDateValue(range.from)}
          </p>
          <p>
            <strong>To:</strong> {formatDateValue(range.to)}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Test: Cancel should not apply changes
 */
export const ShouldCancelChanges: Story = {
  args: {
    defaultMode: PICKER_MODE.DATE,
  },
  render: (args) => {
    const initialRange: DateRange = {
      from: new Date(2024, 0, 1),
      to: new Date(2024, 0, 7),
    };
    const [range, setRange] = useState<DateRange>(initialRange);

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-xs">
          Initial: Jan 1, 2024 - Jan 7, 2024. Try changing and clicking Cancel.
        </p>
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range confirmed')({ range: newRange, meta });
            }}
            showActions={true}
            placeholderFrom="Start date"
            placeholderTo="End date"
          />
        </div>
        <div className="text-sm">
          <p>
            <strong>Current From:</strong>
            {formatDateValue(range.from)}
          </p>
          <p>
            <strong>Current To:</strong> {formatDateValue(range.to)}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * DateRangePicker with ISO string output format
 * Perfect for forms that need ISO strings for API submission
 */
export const WithISOStringOutput: Story = {
  args: {
    defaultMode: PICKER_MODE.WEEK,
  },
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Using <code className="rounded bg-muted px-1 py-0.5">outputFormat="iso"</code> to get ISO
          strings directly
        </p>
        <div className="w-[400px]">
          <DateRangePicker
            {...args}
            value={range}
            outputFormat="iso"
            onChange={(newRange, meta) => {
              setRange(newRange);
              action('range changed (ISO)')({ range: newRange, meta });
            }}
            placeholderFrom="Start date"
            placeholderTo="End date"
          />
        </div>
        <div className="space-y-2 text-sm">
          <div className="rounded bg-muted p-3">
            <p className="mb-2 font-semibold">Output (ISO Strings):</p>
            <p className="font-mono text-xs">
              <strong>from:</strong> {String(range.from || 'undefined')}
            </p>
            <p className="font-mono text-xs">
              <strong>to:</strong> {String(range.to || 'undefined')}
            </p>
          </div>
          <div className="rounded bg-muted p-3">
            <p className="mb-2 font-semibold">Formatted Display:</p>
            <p>
              <strong>From:</strong> {formatDateValue(range.from)}
            </p>
            <p>
              <strong>To:</strong> {formatDateValue(range.to)}
            </p>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Comprehensive preset demo with all modes
 * Shows how presets work with Date, Week, Month, and Year modes
 */
export const PresetsAllModes: Story = {
  args: {
    defaultMode: PICKER_MODE.DATE,
  },
  render: (args) => {
    const [dateRange, setDateRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });
    const [weekRange, setWeekRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });
    const [monthRange, setMonthRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });
    const [yearRange, setYearRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="flex w-[600px] flex-col gap-6">
        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-semibold text-sm">Date Range with Presets</h3>
          <p className="mb-3 text-muted-foreground text-xs">
            Includes: Today, Yesterday, Last 7 days, Last 30 days, Month to date, Last month, Year
            to date, Last year
          </p>
          <DateRangePicker
            {...args}
            value={dateRange}
            onChange={(newRange, meta) => {
              setDateRange(newRange);
              action('date range changed')({ range: newRange, meta });
            }}
            defaultMode={PICKER_MODE.DATE}
            showPresets={true}
            showActions={true}
            placeholderFrom="Start date"
            placeholderTo="End date"
          />
          <div className="mt-2 text-xs">
            <p>
              <strong>Selected:</strong> {formatDateValue(dateRange.from)} -{' '}
              {formatDateValue(dateRange.to)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-semibold text-sm">Week Range with Presets</h3>
          <DateRangePicker
            {...args}
            value={weekRange}
            onChange={(newRange, meta) => {
              setWeekRange(newRange);
              action('week range changed')({ range: newRange, meta });
            }}
            defaultMode={PICKER_MODE.WEEK}
            showPresets={true}
            showActions={true}
            placeholderFrom="Start week"
            placeholderTo="End week"
          />
          <div className="mt-2 text-xs">
            <p>
              <strong>Selected:</strong> {formatDateValue(weekRange.from)} -{' '}
              {formatDateValue(weekRange.to)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-semibold text-sm">Month Range with Presets</h3>
          <DateRangePicker
            {...args}
            value={monthRange}
            onChange={(newRange, meta) => {
              setMonthRange(newRange);
              action('month range changed')({ range: newRange, meta });
            }}
            defaultMode={PICKER_MODE.MONTH}
            showPresets={true}
            showActions={true}
            placeholderFrom="Start month"
            placeholderTo="End month"
          />
          <div className="mt-2 text-xs">
            <p>
              <strong>Selected:</strong>{' '}
              {formatDateValueWithOptions(monthRange.from, 'en-US', {
                year: 'numeric',
                month: 'long',
              })}{' '}
              -{' '}
              {formatDateValueWithOptions(monthRange.to, 'en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-semibold text-sm">Year Range with Presets</h3>
          <DateRangePicker
            {...args}
            value={yearRange}
            onChange={(newRange, meta) => {
              setYearRange(newRange);
              action('year range changed')({ range: newRange, meta });
            }}
            defaultMode={PICKER_MODE.YEAR}
            showPresets={true}
            showActions={true}
            placeholderFrom="Start year"
            placeholderTo="End year"
          />
          <div className="mt-2 text-xs">
            <p>
              <strong>Selected:</strong> {getYear(yearRange.from) || 'Not selected'} -{' '}
              {getYear(yearRange.to) || 'Not selected'}
            </p>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Multiple DateRangePickers on same screen
 */
export const MultipleRangePickers: Story = {
  args: {
    defaultMode: PICKER_MODE.DATE,
  },
  render: (args) => {
    const [dateRange, setDateRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });
    const [weekRange, setWeekRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });
    const [monthRange, setMonthRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });
    const [yearRange, setYearRange] = useState<DateRange>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="flex w-[500px] flex-col gap-4">
        <div>
          <label className="mb-2 block font-medium text-sm">Date Range</label>
          <DateRangePicker
            {...args}
            value={dateRange}
            onChange={(newRange, meta) => {
              setDateRange(newRange);
              action('date range changed')({ range: newRange, meta });
            }}
            defaultMode={PICKER_MODE.DATE}
            placeholderFrom="Start date"
            placeholderTo="End date"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-sm">Week Range</label>
          <DateRangePicker
            {...args}
            value={weekRange}
            onChange={(newRange, meta) => {
              setWeekRange(newRange);
              action('week range changed')({ range: newRange, meta });
            }}
            defaultMode={PICKER_MODE.WEEK}
            placeholderFrom="Start week"
            placeholderTo="End week"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-sm">Month Range</label>
          <DateRangePicker
            {...args}
            value={monthRange}
            onChange={(newRange, meta) => {
              setMonthRange(newRange);
              action('month range changed')({ range: newRange, meta });
            }}
            defaultMode={PICKER_MODE.MONTH}
            placeholderFrom="Start month"
            placeholderTo="End month"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-sm">Year Range</label>
          <DateRangePicker
            {...args}
            value={yearRange}
            onChange={(newRange, meta) => {
              setYearRange(newRange);
              action('year range changed')({ range: newRange, meta });
            }}
            defaultMode={PICKER_MODE.YEAR}
            placeholderFrom="Start year"
            placeholderTo="End year"
          />
        </div>
      </div>
    );
  },
};
