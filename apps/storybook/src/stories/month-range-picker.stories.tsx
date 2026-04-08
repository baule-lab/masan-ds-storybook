import type { Meta, StoryObj } from '@storybook/react-vite';
import { MonthRangePicker } from '@masan-group/shared-ui/date-picker';
import { Label } from '@masan-group/shared-ui/label';
import { useState } from 'react';
import { action } from 'storybook/actions';

/**
 * A month range picker component that allows selecting a range of months.
 * Features include quick selectors, custom year labels, and date restrictions.
 */
const meta = {
  title: 'Custom Components/MonthRangePicker',
  component: MonthRangePicker,
  tags: ['autodocs'],
  argTypes: {
    showQuickSelectors: {
      control: 'boolean',
      description: 'Show or hide quick selector buttons',
    },
    minDate: {
      control: 'date',
      description: 'Minimum selectable date',
    },
    maxDate: {
      control: 'date',
      description: 'Maximum selectable date',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MonthRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic month range picker with default settings
 */
export const Default: Story = {
  args: {
    showQuickSelectors: true,
  },
  render: (args) => {
    const [range, setRange] = useState<{ start: Date; end: Date } | undefined>(undefined);
    return (
      <div className="space-y-4">
        <Label>Select Month Range</Label>
        <MonthRangePicker
          {...args}
          selectedMonthRange={range}
          onMonthRangeSelect={(newRange) => {
            setRange(newRange);
            action('month range selected')(newRange);
          }}
          onStartMonthSelect={(date) => {
            action('start month selected')(date);
          }}
        />
        {range && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Selected Range:</p>
            <p className="text-muted-foreground text-sm">
              {range.start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
              {range.end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month range picker with initial range
 */
export const WithInitialRange: Story = {
  args: {
    showQuickSelectors: true,
  },
  render: (args) => {
    const [range, setRange] = useState<{ start: Date; end: Date }>({
      start: new Date(2025, 0), // January 2025
      end: new Date(2025, 5), // June 2025
    });
    return (
      <div className="space-y-4">
        <Label>Project Timeline</Label>
        <MonthRangePicker
          {...args}
          selectedMonthRange={range}
          onMonthRangeSelect={(newRange) => {
            setRange(newRange);
            action('month range selected')(newRange);
          }}
          onStartMonthSelect={(date) => {
            action('start month selected')(date);
          }}
        />
        <div className="mt-4 rounded-md border p-4">
          <p className="font-medium text-sm">Selected Range:</p>
          <p className="text-muted-foreground text-sm">
            {range.start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
            {range.end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Month range picker with date restrictions
 */
export const WithMinMaxDates: Story = {
  args: {
    showQuickSelectors: true,
  },
  render: (args) => {
    const [range, setRange] = useState<{ start: Date; end: Date } | undefined>(undefined);
    const minDate = new Date(2024, 0); // January 2024
    const maxDate = new Date(2026, 11); // December 2026

    return (
      <div className="space-y-4">
        <Label>Select Range (2024 - 2026 only)</Label>
        <MonthRangePicker
          {...args}
          selectedMonthRange={range}
          minDate={minDate}
          maxDate={maxDate}
          onMonthRangeSelect={(newRange) => {
            setRange(newRange);
            action('month range selected')(newRange);
          }}
          onStartMonthSelect={(date) => {
            action('start month selected')(date);
          }}
        />
        {range && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Selected Range:</p>
            <p className="text-muted-foreground text-sm">
              {range.start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
              {range.end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month range picker without quick selectors
 */
export const WithoutQuickSelectors: Story = {
  args: {
    showQuickSelectors: false,
  },
  render: (args) => {
    const [range, setRange] = useState<{ start: Date; end: Date } | undefined>(undefined);
    return (
      <div className="space-y-4">
        <Label>Select Month Range (No Quick Selectors)</Label>
        <MonthRangePicker
          {...args}
          selectedMonthRange={range}
          onMonthRangeSelect={(newRange) => {
            setRange(newRange);
            action('month range selected')(newRange);
          }}
          onStartMonthSelect={(date) => {
            action('start month selected')(date);
          }}
        />
        {range && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Selected Range:</p>
            <p className="text-muted-foreground text-sm">
              {range.start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
              {range.end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month range picker with custom quick selectors
 */
export const WithCustomQuickSelectors: Story = {
  args: {
    showQuickSelectors: true,
  },
  render: (args) => {
    const [range, setRange] = useState<{ start: Date; end: Date } | undefined>(undefined);
    const customQuickSelectors = [
      {
        label: 'Q1 2025',
        startMonth: new Date(2025, 0), // January
        endMonth: new Date(2025, 2), // March
        variant: 'default' as const,
      },
      {
        label: 'Q2 2025',
        startMonth: new Date(2025, 3), // April
        endMonth: new Date(2025, 5), // June
        variant: 'default' as const,
      },
      {
        label: 'Q3 2025',
        startMonth: new Date(2025, 6), // July
        endMonth: new Date(2025, 8), // September
        variant: 'default' as const,
      },
      {
        label: 'Q4 2025',
        startMonth: new Date(2025, 9), // October
        endMonth: new Date(2025, 11), // December
        variant: 'default' as const,
      },
      {
        label: 'Full Year 2025',
        startMonth: new Date(2025, 0),
        endMonth: new Date(2025, 11),
        variant: 'secondary' as const,
      },
    ];

    return (
      <div className="space-y-4">
        <Label>Select Quarter</Label>
        <MonthRangePicker
          {...args}
          selectedMonthRange={range}
          quickSelectors={customQuickSelectors}
          onMonthRangeSelect={(newRange) => {
            setRange(newRange);
            action('month range selected')(newRange);
          }}
          onStartMonthSelect={(date) => {
            action('start month selected')(date);
          }}
        />
        {range && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Selected Range:</p>
            <p className="text-muted-foreground text-sm">
              {range.start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
              {range.end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month range picker with custom labels
 */
export const WithCustomCallbacks: Story = {
  args: {
    showQuickSelectors: true,
  },
  render: (args) => {
    const [range, setRange] = useState<{ start: Date; end: Date } | undefined>(undefined);
    const monthNames = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];

    return (
      <div className="space-y-4">
        <Label>Chọn khoảng thời gian</Label>
        <MonthRangePicker
          {...args}
          selectedMonthRange={range}
          callbacks={{
            yearLabel: (year) => `Năm ${year}`,
            monthLabel: (month) => monthNames[month.number].replace('Tháng ', 'T'),
          }}
          onMonthRangeSelect={(newRange) => {
            setRange(newRange);
            action('month range selected')(newRange);
          }}
          onStartMonthSelect={(date) => {
            action('start month selected')(date);
          }}
        />
        {range && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Khoảng thời gian đã chọn:</p>
            <p className="text-muted-foreground text-sm">
              {monthNames[range.start.getMonth()]} {range.start.getFullYear()} -
              {monthNames[range.end.getMonth()]} {range.end.getFullYear()}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month range picker with custom variants
 */
export const WithCustomVariants: Story = {
  args: {
    showQuickSelectors: true,
  },
  render: (args) => {
    const [range, setRange] = useState<{ start: Date; end: Date } | undefined>(undefined);
    return (
      <div className="space-y-4">
        <Label>Select Month Range (Custom Styling)</Label>
        <MonthRangePicker
          {...args}
          selectedMonthRange={range}
          variant={{
            calendar: {
              main: 'outline',
              selected: 'default',
            },
            chevrons: 'ghost',
          }}
          onMonthRangeSelect={(newRange) => {
            setRange(newRange);
            action('month range selected')(newRange);
          }}
          onStartMonthSelect={(date) => {
            action('start month selected')(date);
          }}
        />
        {range && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Selected Range:</p>
            <p className="text-muted-foreground text-sm">
              {range.start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
              {range.end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month range picker in a form layout
 */
export const InFormLayout: Story = {
  render: () => {
    const [fiscalYear, setFiscalYear] = useState<{ start: Date; end: Date } | undefined>(undefined);
    const [reportingPeriod, setReportingPeriod] = useState<{ start: Date; end: Date } | undefined>(
      undefined
    );

    return (
      <div className="w-full max-w-4xl space-y-8 rounded-lg border p-6">
        <h3 className="font-semibold text-lg">Financial Period Selection</h3>

        <div className="space-y-4">
          <Label>Fiscal Year</Label>
          <MonthRangePicker
            selectedMonthRange={fiscalYear}
            showQuickSelectors={true}
            onMonthRangeSelect={(newRange) => {
              setFiscalYear(newRange);
              action('fiscal year selected')(newRange);
            }}
            onStartMonthSelect={(date) => {
              action('fiscal year start selected')(date);
            }}
          />
          {fiscalYear && (
            <p className="text-muted-foreground text-sm">
              Fiscal Year:
              {fiscalYear.start.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
              - {fiscalYear.end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label>Reporting Period</Label>
          <MonthRangePicker
            selectedMonthRange={reportingPeriod}
            showQuickSelectors={false}
            onMonthRangeSelect={(newRange) => {
              setReportingPeriod(newRange);
              action('reporting period selected')(newRange);
            }}
            onStartMonthSelect={(date) => {
              action('reporting period start selected')(date);
            }}
          />
          {reportingPeriod && (
            <p className="text-muted-foreground text-sm">
              Reporting Period:
              {reportingPeriod.start.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
              -
              {reportingPeriod.end.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        <button
          type="button"
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm hover:bg-primary/90"
          onClick={() => {
            action('form submitted')({ fiscalYear, reportingPeriod });
          }}
        >
          Generate Report
        </button>
      </div>
    );
  },
};

/**
 * Month range picker with year navigation callbacks
 */
export const WithYearNavigation: Story = {
  args: {
    showQuickSelectors: true,
  },
  render: (args) => {
    const [range, setRange] = useState<{ start: Date; end: Date } | undefined>(undefined);
    return (
      <div className="space-y-4">
        <Label>Select Month Range</Label>
        <MonthRangePicker
          {...args}
          selectedMonthRange={range}
          onMonthRangeSelect={(newRange) => {
            setRange(newRange);
            action('month range selected')(newRange);
          }}
          onStartMonthSelect={(date) => {
            action('start month selected')(date);
          }}
          onYearForward={() => {
            action('year forward clicked')();
          }}
          onYearBackward={() => {
            action('year backward clicked')();
          }}
        />
        {range && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Selected Range:</p>
            <p className="text-muted-foreground text-sm">
              {range.start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
              {range.end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    );
  },
};
