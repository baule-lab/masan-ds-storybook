import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@masan-group/shared-ui/label';
import { MonthPicker } from '@masan-group/shared-ui/date-picker';
import { useState } from 'react';
import { action } from 'storybook/actions';

/**
 * A month picker component that allows selecting a single month.
 * Features include custom year labels, date restrictions, and disabled dates.
 */
const meta = {
  title: 'Custom Components/MonthPicker',
  component: MonthPicker,
  tags: ['autodocs'],
  argTypes: {
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
} satisfies Meta<typeof MonthPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic month picker with default settings
 */
export const Default: Story = {
  render: (args) => {
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
    return (
      <div className="space-y-4">
        <Label>Select Month</Label>
        <MonthPicker
          {...args}
          selectedMonth={selectedMonth}
          onMonthSelect={(date) => {
            setSelectedMonth(date);
            action('month selected')(date);
          }}
        />
        {selectedMonth && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Selected Month:</p>
            <p className="text-muted-foreground text-sm">
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month picker with initial month selected
 */
export const WithInitialMonth: Story = {
  render: (args) => {
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date(2025, 5)); // June 2025
    return (
      <div className="space-y-4">
        <Label>Birth Month</Label>
        <MonthPicker
          {...args}
          selectedMonth={selectedMonth}
          onMonthSelect={(date) => {
            setSelectedMonth(date);
            action('month selected')(date);
          }}
        />
        <div className="mt-4 rounded-md border p-4">
          <p className="font-medium text-sm">Selected Month:</p>
          <p className="text-muted-foreground text-sm">
            {selectedMonth?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Month picker with date restrictions
 */
export const WithMinMaxDates: Story = {
  render: (args) => {
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
    const minDate = new Date(2024, 0); // January 2024
    const maxDate = new Date(2025, 11); // December 2025

    return (
      <div className="space-y-4">
        <Label>Select Month (2024 - 2025 only)</Label>
        <MonthPicker
          {...args}
          selectedMonth={selectedMonth}
          minDate={minDate}
          maxDate={maxDate}
          onMonthSelect={(date) => {
            setSelectedMonth(date);
            action('month selected')(date);
          }}
        />
        {selectedMonth && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Selected Month:</p>
            <p className="text-muted-foreground text-sm">
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month picker with disabled dates
 */
export const WithDisabledDates: Story = {
  render: (args) => {
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
    const disabledDates = [
      new Date(2025, 0), // January 2025
      new Date(2025, 3), // April 2025
      new Date(2025, 6), // July 2025
      new Date(2025, 9), // October 2025
    ];

    return (
      <div className="space-y-4">
        <Label>Select Month (Q1, Q2, Q3, Q4 months disabled)</Label>
        <MonthPicker
          {...args}
          selectedMonth={selectedMonth}
          disabledDates={disabledDates}
          onMonthSelect={(date) => {
            setSelectedMonth(date);
            action('month selected')(date);
          }}
        />
        {selectedMonth && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Selected Month:</p>
            <p className="text-muted-foreground text-sm">
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month picker with custom labels (Vietnamese)
 */
export const WithCustomCallbacks: Story = {
  render: (args) => {
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
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
        <Label>Chọn tháng</Label>
        <MonthPicker
          {...args}
          selectedMonth={selectedMonth}
          callbacks={{
            yearLabel: (year) => `Năm ${year}`,
            monthLabel: (month) => `T${month.number + 1}`,
          }}
          onMonthSelect={(date) => {
            setSelectedMonth(date);
            action('month selected')(date);
          }}
        />
        {selectedMonth && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Tháng đã chọn:</p>
            <p className="text-muted-foreground text-sm">
              {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month picker with custom variants
 */
export const WithCustomVariants: Story = {
  render: (args) => {
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
    return (
      <div className="space-y-4">
        <Label>Select Month (Custom Styling)</Label>
        <MonthPicker
          {...args}
          selectedMonth={selectedMonth}
          variant={{
            calendar: {
              main: 'outline',
              selected: 'default',
            },
            chevrons: 'ghost',
          }}
          onMonthSelect={(date) => {
            setSelectedMonth(date);
            action('month selected')(date);
          }}
        />
        {selectedMonth && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Selected Month:</p>
            <p className="text-muted-foreground text-sm">
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month picker with year navigation callbacks
 */
export const WithYearNavigation: Story = {
  render: (args) => {
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
    return (
      <div className="space-y-4">
        <Label>Select Month</Label>
        <MonthPicker
          {...args}
          selectedMonth={selectedMonth}
          onMonthSelect={(date) => {
            setSelectedMonth(date);
            action('month selected')(date);
          }}
          onYearForward={() => {
            action('year forward clicked')();
          }}
          onYearBackward={() => {
            action('year backward clicked')();
          }}
        />
        {selectedMonth && (
          <div className="mt-4 rounded-md border p-4">
            <p className="font-medium text-sm">Selected Month:</p>
            <p className="text-muted-foreground text-sm">
              {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month picker in a form layout
 */
export const InFormLayout: Story = {
  render: () => {
    const [startMonth, setStartMonth] = useState<Date | undefined>(undefined);
    const [endMonth, setEndMonth] = useState<Date | undefined>(undefined);

    return (
      <div className="w-full max-w-2xl space-y-6 rounded-lg border p-6">
        <h3 className="font-semibold text-lg">Project Timeline</h3>

        <div className="space-y-4">
          <Label>Start Month</Label>
          <MonthPicker
            selectedMonth={startMonth}
            onMonthSelect={(date) => {
              setStartMonth(date);
              action('start month selected')(date);
            }}
          />
          {startMonth && (
            <p className="text-muted-foreground text-sm">
              Start: {startMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label>End Month</Label>
          <MonthPicker
            selectedMonth={endMonth}
            minDate={startMonth || undefined}
            onMonthSelect={(date) => {
              setEndMonth(date);
              action('end month selected')(date);
            }}
          />
          {endMonth && (
            <p className="text-muted-foreground text-sm">
              End: {endMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>

        {startMonth && endMonth && (
          <div className="rounded-md border p-4">
            <p className="font-medium text-sm">Duration:</p>
            <p className="text-muted-foreground text-sm">
              {startMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} -
              {endMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}

        <button
          type="button"
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm hover:bg-primary/90"
          onClick={() => {
            action('form submitted')({ startMonth, endMonth });
          }}
        >
          Create Project
        </button>
      </div>
    );
  },
};

/**
 * Month picker for selecting current year
 */
export const CurrentYear: Story = {
  render: (args) => {
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(new Date());
    const currentYear = new Date().getFullYear();
    const minDate = new Date(currentYear, 0); // January of current year
    const maxDate = new Date(currentYear, 11); // December of current year

    return (
      <div className="space-y-4">
        <Label>Select Month in {currentYear}</Label>
        <MonthPicker
          {...args}
          selectedMonth={selectedMonth}
          minDate={minDate}
          maxDate={maxDate}
          onMonthSelect={(date) => {
            setSelectedMonth(date);
            action('month selected')(date);
          }}
        />
        <div className="mt-4 rounded-md border p-4">
          <p className="font-medium text-sm">Selected Month:</p>
          <p className="text-muted-foreground text-sm">
            {selectedMonth?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Multiple month pickers for comparison
 */
export const MultipleMonthPickers: Story = {
  render: () => {
    const [month1, setMonth1] = useState<Date | undefined>(new Date(2025, 0));
    const [month2, setMonth2] = useState<Date | undefined>(new Date(2025, 5));

    return (
      <div className="space-y-6">
        <h3 className="font-semibold text-lg">Compare Two Months</h3>

        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            <Label>Month 1</Label>
            <MonthPicker
              selectedMonth={month1}
              onMonthSelect={(date) => {
                setMonth1(date);
                action('month 1 selected')(date);
              }}
            />
          </div>

          <div className="flex-1 space-y-4">
            <Label>Month 2</Label>
            <MonthPicker
              selectedMonth={month2}
              onMonthSelect={(date) => {
                setMonth2(date);
                action('month 2 selected')(date);
              }}
            />
          </div>
        </div>

        {month1 && month2 && (
          <div className="rounded-md border p-4">
            <p className="font-medium text-sm">Comparison:</p>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs">Month 1</p>
                <p className="text-sm">
                  {month1.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Month 2</p>
                <p className="text-sm">
                  {month2.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Month picker for subscription billing
 */
export const BillingCycle: Story = {
  render: (args) => {
    const [billingMonth, setBillingMonth] = useState<Date | undefined>(new Date());
    // Can only select current month or future months
    const minDate = new Date();
    minDate.setDate(1);

    return (
      <div className="w-80 space-y-4 rounded-lg border p-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Subscription Settings</h3>
          <p className="text-muted-foreground text-sm">Choose when your billing cycle starts</p>
        </div>

        <div className="space-y-4">
          <Label>Billing Start Month</Label>
          <MonthPicker
            {...args}
            selectedMonth={billingMonth}
            minDate={minDate}
            onMonthSelect={(date) => {
              setBillingMonth(date);
              action('billing month selected')(date);
            }}
          />
        </div>

        {billingMonth && (
          <div className="rounded-md bg-muted p-4">
            <p className="font-medium text-sm">Next Billing Date:</p>
            <p className="text-muted-foreground text-sm">
              {billingMonth.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        )}

        <button
          type="button"
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm hover:bg-primary/90"
          onClick={() => {
            action('subscription updated')({ billingMonth });
          }}
        >
          Update Billing
        </button>
      </div>
    );
  },
};
