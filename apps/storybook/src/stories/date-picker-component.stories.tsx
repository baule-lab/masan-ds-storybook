import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from '@masan-group/shared-ui/date-picker';
import { Label } from '@masan-group/shared-ui/label';
import { useState } from 'react';
import { action } from 'storybook/actions';

/**
 * A date picker component that combines a button with a calendar popover.
 * Provides an easy-to-use interface for date selection.
 */
const meta = {
  title: 'Custom Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no date is selected',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic date picker with default settings
 */
export const Default: Story = {
  args: {
    placeholder: 'Pick a date',
    selected: undefined,
    onSelect: () => {},
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <div className="w-80 space-y-3">
        <Label>Select Date</Label>
        <DatePicker
          {...args}
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            action('date selected')(newDate);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {date ? date.toLocaleDateString() : 'None'}
        </p>
      </div>
    );
  },
};

/**
 * Date picker with initial date
 */
export const WithInitialDate: Story = {
  args: {
    placeholder: 'Pick a date',
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date('2025-01-15'));
    return (
      <div className="w-80 space-y-3">
        <Label>Birth Date</Label>
        <DatePicker
          {...args}
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            action('date selected')(newDate);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {date ? date.toLocaleDateString() : 'None'}
        </p>
      </div>
    );
  },
};

/**
 * Date picker with custom placeholder
 */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Choose your appointment date',
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    return (
      <div className="w-80 space-y-3">
        <Label>Appointment Date</Label>
        <DatePicker
          {...args}
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            action('date selected')(newDate);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {date ? date.toLocaleDateString() : 'None'}
        </p>
      </div>
    );
  },
};

/**
 * Multiple date pickers in a form
 */
export const MultipleDatePickers: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    return (
      <div className="w-96 space-y-6">
        <div className="space-y-3">
          <Label>Start Date</Label>
          <DatePicker
            placeholder="Select start date"
            selected={startDate}
            onSelect={(date) => {
              setStartDate(date);
              action('start date selected')(date);
            }}
          />
        </div>

        <div className="space-y-3">
          <Label>End Date</Label>
          <DatePicker
            placeholder="Select end date"
            selected={endDate}
            onSelect={(date) => {
              setEndDate(date);
              action('end date selected')(date);
            }}
          />
        </div>

        <div className="rounded-md border p-4">
          <p className="font-medium text-sm">Date Range:</p>
          <p className="text-muted-foreground text-sm">
            {startDate ? startDate.toLocaleDateString() : 'Not set'} -
            {endDate ? endDate.toLocaleDateString() : 'Not set'}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Date picker in a form layout
 */
export const InFormLayout: Story = {
  render: () => {
    const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
    const [joinDate, setJoinDate] = useState<Date | undefined>(new Date());

    return (
      <div className="w-96 space-y-6 rounded-lg border p-6">
        <h3 className="font-semibold text-lg">Employee Information</h3>

        <div className="space-y-3">
          <Label htmlFor="birth-date">Date of Birth</Label>
          <DatePicker
            placeholder="Select birth date"
            selected={birthDate}
            onSelect={(date) => {
              setBirthDate(date);
              action('birth date selected')(date);
            }}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="join-date">Join Date</Label>
          <DatePicker
            placeholder="Select join date"
            selected={joinDate}
            onSelect={(date) => {
              setJoinDate(date);
              action('join date selected')(date);
            }}
          />
        </div>

        <button
          type="button"
          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm hover:bg-primary/90"
          onClick={() => {
            action('form submitted')({ birthDate, joinDate });
          }}
        >
          Submit
        </button>
      </div>
    );
  },
};

/**
 * Date picker with today's date
 */
export const WithTodayDate: Story = {
  args: {
    placeholder: 'Pick a date',
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="w-80 space-y-3">
        <Label>Today's Date</Label>
        <DatePicker
          {...args}
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            action('date selected')(newDate);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {date ? date.toLocaleDateString() : 'None'}
        </p>
      </div>
    );
  },
};

/**
 * Date picker with clear functionality
 */
export const WithClearButton: Story = {
  args: {
    placeholder: 'Pick a date',
  },
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="w-80 space-y-3">
        <Label>Event Date</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <DatePicker
              {...args}
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                action('date selected')(newDate);
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setDate(undefined);
              action('date cleared')();
            }}
            className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          >
            Clear
          </button>
        </div>
        <p className="text-muted-foreground text-sm">
          Selected: {date ? date.toLocaleDateString() : 'None'}
        </p>
      </div>
    );
  },
};
