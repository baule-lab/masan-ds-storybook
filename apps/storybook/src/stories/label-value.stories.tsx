import type { Meta, StoryObj } from '@storybook/react-vite';
import { LabelValue } from '@masan-group/shared-ui/label-value';
import { getValidValue } from '@masan-group/shared-ui';

/**
 * A component that displays a label and value in a consistent format.
 * Useful for displaying key-value pairs in forms, detail views, and data displays.
 */
const meta = {
  title: 'Custom Components/LabelValue',
  component: LabelValue,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label text displayed above the value',
    },
    children: {
      control: 'text',
      description: 'The value content to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the container',
    },
    labelClassName: {
      control: 'text',
      description: 'Additional CSS classes for the label',
    },
    valueClassName: {
      control: 'text',
      description: 'Additional CSS classes for the value container',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof LabelValue>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic label-value pair with string value
 */
export const Default: Story = {
  args: {
    label: 'Name',
    children: 'John Doe',
  },
};

/**
 * Label-value with number value
 */
export const WithNumber: Story = {
  args: {
    label: 'Age',
    children: 25,
  },
};

/**
 * Label-value with empty/null value using getValidValue utility
 */
export const WithEmptyValue: Story = {
  args: {
    label: 'Email',
    children: getValidValue(null),
  },
};

/**
 * Label-value with undefined value using getValidValue utility
 */
export const WithUndefinedValue: Story = {
  args: {
    label: 'Phone',
    children: getValidValue(undefined),
  },
};

/**
 * Label-value with formatted date
 */
export const WithFormattedDate: Story = {
  args: {
    label: 'Created Date',
    children: getValidValue(new Date('2024-01-15'), (date) =>
      new Date(date as Date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    ),
  },
};

/**
 * Label-value with formatted currency
 */
export const WithFormattedCurrency: Story = {
  args: {
    label: 'Price',
    children: getValidValue(1234.56, (value) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)
    ),
  },
};

/**
 * Label-value with custom fallback
 */
export const WithCustomFallback: Story = {
  args: {
    label: 'Status',
    children: getValidValue(null, undefined, 'Not Available'),
  },
};

/**
 * Multiple label-value pairs in a grid layout
 */
export const MultiplePairs: Story = {
  render: () => (
    <div className="grid w-96 grid-cols-2 gap-4">
      <LabelValue label="Name">John Doe</LabelValue>
      <LabelValue label="Age">25</LabelValue>
      <LabelValue label="Email">john.doe@example.com</LabelValue>
      <LabelValue label="Phone">+1 (555) 123-4567</LabelValue>
      <LabelValue label="Status">Active</LabelValue>
      <LabelValue label="Role">Admin</LabelValue>
    </div>
  ),
};

/**
 * Label-value with React node children
 */
export const WithReactNode: Story = {
  args: {
    label: 'Tags',
    children: (
      <div className="flex gap-2">
        <span className="rounded-full bg-primary px-2 py-1 text-primary-foreground text-xs">
          React
        </span>
        <span className="rounded-full bg-primary px-2 py-1 text-primary-foreground text-xs">
          TypeScript
        </span>
        <span className="rounded-full bg-primary px-2 py-1 text-primary-foreground text-xs">
          Storybook
        </span>
      </div>
    ),
  },
};

/**
 * Label-value with long text content
 */
export const WithLongText: Story = {
  args: {
    label: 'Description',
    children:
      'This is a very long description that demonstrates how the LabelValue component handles longer text content. The value container will wrap the text appropriately.',
  },
};

/**
 * Label-value with custom styling
 */
export const WithCustomStyling: Story = {
  args: {
    label: 'Custom Styled',
    children: 'This has custom classes',
    className: 'border-2 border-primary rounded-lg p-4',
    labelClassName: 'text-primary font-bold',
    valueClassName: 'bg-primary/10 text-primary font-semibold',
  },
};

/**
 * Label-value in a card layout
 */
export const InCard: Story = {
  render: () => (
    <div className="w-96 rounded-lg border p-6">
      <h3 className="mb-4 font-semibold text-lg">User Information</h3>
      <div className="space-y-4">
        <LabelValue label="Full Name">John Doe</LabelValue>
        <LabelValue label="Email Address">john.doe@example.com</LabelValue>
        <LabelValue label="Phone Number">+1 (555) 123-4567</LabelValue>
        <LabelValue label="Department">Engineering</LabelValue>
        <LabelValue label="Join Date">
          {getValidValue(new Date('2023-06-15'), (date) =>
            new Date(date as Date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          )}
        </LabelValue>
        <LabelValue label="Salary">
          {getValidValue(75000, (value) =>
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
              value as number
            )
          )}
        </LabelValue>
      </div>
    </div>
  ),
};

/**
 * Label-value with various data types and edge cases
 */
export const EdgeCases: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="String Value">Hello World</LabelValue>
      <LabelValue label="Number Value">42</LabelValue>
      <LabelValue label="Zero Value">0</LabelValue>
      <LabelValue label="Empty String">{getValidValue('')}</LabelValue>
      <LabelValue label="Null Value">{getValidValue(null)}</LabelValue>
      <LabelValue label="Undefined Value">{getValidValue(undefined)}</LabelValue>
      <LabelValue label="False Value">{getValidValue(false)}</LabelValue>
      <LabelValue label="True Value">{getValidValue(true)}</LabelValue>
      <LabelValue label="Custom Fallback">{getValidValue(null, undefined, 'N/A')}</LabelValue>
    </div>
  ),
};
