import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput } from '@masan-group/shared-ui/number-input';
import { Label } from '@masan-group/shared-ui/label';
import { DollarSign, Percent } from 'lucide-react';
import { useState } from 'react';
import { action } from 'storybook/actions';

/**
 * A number input component with formatting options like thousand separators,
 * decimal places, prefix/suffix, and min/max validation.
 */
const meta = {
  title: 'Custom Components/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {
    thousandSeparator: {
      control: 'select',
      options: [true, false, ',', '.'],
      description: 'Thousand separator character',
    },
    decimalScale: {
      control: 'number',
      description: 'Number of decimal places',
    },
    allowDecimal: {
      control: 'boolean',
      description: 'Allow decimal places',
    },
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    stepper: {
      control: 'number',
      description: 'Step value for increment/decrement',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NumberInput>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic number input with default settings
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter a number',
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>(undefined);
    return (
      <div className="flex w-80 flex-col gap-3">
        <Label htmlFor="number">Amount</Label>
        <NumberInput
          {...args}
          id="number"
          value={value}
          onChange={(val) => {
            setValue(val as number | undefined);
            action('value changed')(val);
          }}
        />
        <p className="text-muted-foreground text-sm">Value: {value ?? 'undefined'}</p>
      </div>
    );
  },
};

/**
 * Number input with thousand separator
 */
export const WithThousandSeparator: Story = {
  args: {
    thousandSeparator: ',',
    placeholder: '0',
    defaultValue: 1000000,
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>(args.defaultValue);
    return (
      <div className="flex w-80 flex-col gap-3">
        <Label htmlFor="number">Population</Label>
        <NumberInput
          {...args}
          id="number"
          value={value}
          onChange={(val) => {
            setValue(val as number | undefined);
            action('value changed')(val);
          }}
        />
        <p className="text-muted-foreground text-sm">Value: {value?.toLocaleString()}</p>
      </div>
    );
  },
};

/**
 * Number input with decimal places
 */
export const WithDecimal: Story = {
  args: {
    thousandSeparator: ',',
    allowDecimal: true,
    decimalScale: 2,
    fixedDecimalScale: true,
    placeholder: '0.00',
    defaultValue: 99.99,
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>(args.defaultValue);
    return (
      <div className="flex w-80 flex-col gap-3">
        <Label htmlFor="number">Price</Label>
        <NumberInput
          {...args}
          id="number"
          value={value}
          onChange={(val) => {
            setValue(val as number | undefined);
            action('value changed')(val);
          }}
        />
        <p className="text-muted-foreground text-sm">Value: ${Number(value || 0)?.toFixed(2)}</p>
      </div>
    );
  },
};

/**
 * Number input with prefix (currency)
 */
export const WithPrefix: Story = {
  args: {
    prefix: '$',
    thousandSeparator: ',',
    allowDecimal: true,
    decimalScale: 2,
    fixedDecimalScale: true,
    placeholder: '0.00',
    defaultValue: 1234.56,
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>(args.defaultValue);
    return (
      <div className="flex w-80 flex-col gap-3">
        <Label htmlFor="number">Salary</Label>
        <NumberInput
          {...args}
          id="number"
          value={value}
          onChange={(val) => {
            setValue(val as number | undefined);
            action('value changed')(val);
          }}
        />
        <p className="text-muted-foreground text-sm">Value: ${Number(value || 0)?.toFixed(2)}</p>
      </div>
    );
  },
};

/**
 * Number input with suffix (percentage)
 */
export const WithSuffix: Story = {
  args: {
    suffix: '%',
    allowDecimal: true,
    decimalScale: 1,
    fixedDecimalScale: true,
    placeholder: '0.0',
    defaultValue: 15.5,
    min: 0,
    max: 100,
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>(args.defaultValue);
    return (
      <div className="flex w-80 flex-col gap-3">
        <Label htmlFor="number">Discount Rate</Label>
        <NumberInput
          {...args}
          id="number"
          value={value}
          onChange={(val) => {
            setValue(val as number | undefined);
            action('value changed')(val);
          }}
        />
        <p className="text-muted-foreground text-sm">Value: {value}%</p>
      </div>
    );
  },
};

/**
 * Number input with suffix icon
 */
export const WithSuffixIcon: Story = {
  args: {
    prefix: '$',
    thousandSeparator: ',',
    allowDecimal: true,
    decimalScale: 2,
    fixedDecimalScale: true,
    placeholder: '0.00',
    defaultValue: 5000,
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>(args.defaultValue);
    return (
      <div className="flex w-80 flex-col gap-3">
        <Label htmlFor="number">Budget</Label>
        <NumberInput
          {...args}
          id="number"
          value={value}
          suffixIcon={<DollarSign className="h-4 w-4" />}
          onChange={(val) => {
            setValue(val as number | undefined);
            action('value changed')(val);
          }}
        />
        <p className="text-muted-foreground text-sm">Value: ${Number(value || 0)?.toFixed(2)}</p>
      </div>
    );
  },
};

/**
 * Number input with min/max validation
 */
export const WithMinMax: Story = {
  args: {
    min: 0,
    max: 100,
    placeholder: '0-100',
    defaultValue: 50,
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>(args.defaultValue);
    return (
      <div className="flex w-80 flex-col gap-3">
        <Label htmlFor="number">Score (0-100)</Label>
        <NumberInput
          {...args}
          id="number"
          value={value}
          suffixIcon={<Percent className="h-4 w-4" />}
          onChange={(val) => {
            setValue(val as number | undefined);
            action('value changed')(val);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Value: {value} (min: {args.min}, max: {args.max})
        </p>
      </div>
    );
  },
};

/**
 * Number input with negative values allowed
 */
export const WithNegative: Story = {
  args: {
    thousandSeparator: ',',
    allowDecimal: true,
    decimalScale: 2,
    fixedDecimalScale: true,
    placeholder: '0.00',
    defaultValue: -500.25,
    min: Number.NEGATIVE_INFINITY,
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>(args.defaultValue);
    return (
      <div className="flex w-80 flex-col gap-3">
        <Label htmlFor="number">Balance</Label>
        <NumberInput
          {...args}
          id="number"
          value={value}
          onChange={(val) => {
            setValue(val as number | undefined);
            action('value changed')(val);
          }}
        />
        <p className="text-muted-foreground text-sm">Value: {value?.toFixed(2)}</p>
      </div>
    );
  },
};

/**
 * Number input with prefix icon
 */
export const WithPrefixIcon: Story = {
  args: {
    thousandSeparator: ',',
    allowDecimal: true,
    decimalScale: 2,
    fixedDecimalScale: true,
    placeholder: '0.00',
    defaultValue: 2500.75,
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>(args.defaultValue);
    return (
      <div className="flex w-80 flex-col gap-3">
        <Label htmlFor="number">Amount</Label>
        <NumberInput
          {...args}
          id="number"
          value={value}
          prefixIcon={<DollarSign className="h-4 w-4" />}
          onChange={(val) => {
            setValue(val as number | undefined);
            action('value changed')(val);
          }}
        />
        <p className="text-muted-foreground text-sm">Value: ${Number(value || 0)?.toFixed(2)}</p>
      </div>
    );
  },
};

/**
 * Number input without decimal (integer only)
 */
export const IntegerOnly: Story = {
  args: {
    thousandSeparator: ',',
    allowDecimal: false,
    placeholder: '0',
    defaultValue: 1000,
  },
  render: (args) => {
    const [value, setValue] = useState<number | undefined>(args.defaultValue);
    return (
      <div className="flex w-80 flex-col gap-3">
        <Label htmlFor="number">Quantity (Integer Only)</Label>
        <NumberInput
          {...args}
          id="number"
          value={value}
          onChange={(val) => {
            setValue(val as number | undefined);
            action('value changed')(val);
          }}
        />
        <p className="text-muted-foreground text-sm">Value: {value} (decimals not allowed)</p>
      </div>
    );
  },
};

/**
 * Disabled number input
 */
export const Disabled: Story = {
  args: {
    prefix: '$',
    thousandSeparator: ',',
    allowDecimal: true,
    decimalScale: 2,
    fixedDecimalScale: true,
    defaultValue: 1000,
    disabled: true,
  },
  render: (args) => (
    <div className="flex w-80 flex-col gap-3">
      <Label htmlFor="number">Locked Amount</Label>
      <NumberInput {...args} id="number" />
    </div>
  ),
};
