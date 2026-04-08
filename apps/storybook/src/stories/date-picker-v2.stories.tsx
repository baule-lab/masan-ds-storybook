import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DatePickerV2, DateRangePickerV2 } from '@masan-group/shared-ui/date-picker-v2';

/**
 * Enhanced date picker built on CalendarV2 with popover trigger,
 * optional Apply button, and preset support.
 */
const meta = {
  title: 'Custom Components/DatePickerV2',
  component: DatePickerV2,
  tags: ['autodocs'],
} satisfies Meta<typeof DatePickerV2>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Basic single date selection. */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<Date | string | undefined>(undefined);
    return <DatePickerV2 value={value} onChange={setValue} placeholder="Pick a date" />;
  },
};

/** With Apply button — changes only commit on click. */
export const WithApplyButton: Story = {
  render: () => {
    const [value, setValue] = useState<Date | string | undefined>(undefined);
    return (
      <DatePickerV2 value={value} onChange={setValue} placeholder="Pick a date" hasApplyButton />
    );
  },
};

/** Date range picker for selecting from/to dates. */
export const RangePicker: Story = {
  render: () => {
    const [value, setValue] = useState<{ from?: Date | string; to?: Date | string }>({});
    return (
      <DateRangePickerV2
        value={value}
        onChange={setValue}
        placeholderFrom="Start date"
        placeholderTo="End date"
      />
    );
  },
};

/** Range picker with Apply button. */
export const RangeWithApply: Story = {
  render: () => {
    const [value, setValue] = useState<{ from?: Date | string; to?: Date | string }>({});
    return <DateRangePickerV2 value={value} onChange={setValue} hasApplyButton />;
  },
};
