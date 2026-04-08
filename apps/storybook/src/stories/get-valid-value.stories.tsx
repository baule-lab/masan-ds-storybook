import type { Meta, StoryObj } from '@storybook/react-vite';
import { getValidValue } from '@masan-group/utils';
import { LabelValue } from '@masan-group/shared-ui/label-value';

/**
 * Utility function that returns a fallback value if the input is falsy or undefined,
 * otherwise applies an optional format function.
 *
 * Useful for displaying data that might be null, undefined, or empty with consistent fallback values.
 */
const meta = {
  title: 'Utils/getValidValue',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Returns fallback value if value is falsy (undefined, null, empty string, or false), otherwise applies format function if provided, or returns the value as-is.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic usage with string values
 */
export const BasicString: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="Valid String">{getValidValue('Hello World')}</LabelValue>
      <LabelValue label="Empty String">{getValidValue('')}</LabelValue>
      <LabelValue label="Null Value">{getValidValue(null)}</LabelValue>
      <LabelValue label="Undefined Value">{getValidValue(undefined)}</LabelValue>
    </div>
  ),
};

/**
 * Usage with number values
 */
export const WithNumbers: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="Valid Number">{getValidValue(42)}</LabelValue>
      <LabelValue label="Zero">{getValidValue(0)}</LabelValue>
      <LabelValue label="Null Number">{getValidValue(null)}</LabelValue>
      <LabelValue label="Undefined Number">{getValidValue(undefined)}</LabelValue>
    </div>
  ),
};

/**
 * Usage with custom fallback values
 */
export const WithCustomFallback: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="Default Fallback">{getValidValue(null)}</LabelValue>
      <LabelValue label="Custom Fallback: N/A">{getValidValue(null, undefined, 'N/A')}</LabelValue>
      <LabelValue label="Custom Fallback: Not Set">
        {getValidValue(undefined, undefined, 'Not Set')}
      </LabelValue>
      <LabelValue label="Custom Fallback: Empty">
        {getValidValue('', undefined, 'Empty')}
      </LabelValue>
      <LabelValue label="Valid Value">{getValidValue('John Doe', undefined, 'Unknown')}</LabelValue>
    </div>
  ),
};

/**
 * Usage with format functions
 */
export const WithFormatFunction: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="Formatted Date">
        {getValidValue(new Date('2024-01-15'), (date) =>
          new Date(date as Date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        )}
      </LabelValue>
      <LabelValue label="Formatted Currency">
        {getValidValue(1234.56, (value) =>
          new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
            value as number
          )
        )}
      </LabelValue>
      <LabelValue label="Formatted Percentage">
        {getValidValue(0.15, (value) => `${((value as number) * 100).toFixed(1)}%`)}
      </LabelValue>
      <LabelValue label="Uppercase String">
        {getValidValue('hello world', (value) => (value as string).toUpperCase())}
      </LabelValue>
      <LabelValue label="Null with Format">
        {getValidValue(null, (value) => (value as string).toUpperCase(), 'No value')}
      </LabelValue>
    </div>
  ),
};

/**
 * Usage with date formatting
 */
export const DateFormatting: Story = {
  render: () => {
    const formatDate = (date: unknown) =>
      new Date(date as Date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    return (
      <div className="w-96 space-y-4">
        <LabelValue label="Valid Date">
          {getValidValue(new Date('2024-01-15T10:30:00'), formatDate)}
        </LabelValue>
        <LabelValue label="Null Date">{getValidValue(null, formatDate, 'Date not set')}</LabelValue>
        <LabelValue label="Undefined Date">
          {getValidValue(undefined, formatDate, 'Date not available')}
        </LabelValue>
      </div>
    );
  },
};

/**
 * Usage with currency formatting
 */
export const CurrencyFormatting: Story = {
  render: () => {
    const formatCurrency = (value: unknown) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
        value as number
      );

    return (
      <div className="w-96 space-y-4">
        <LabelValue label="Price">{getValidValue(1234.56, formatCurrency)}</LabelValue>
        <LabelValue label="Discount">{getValidValue(99.99, formatCurrency)}</LabelValue>
        <LabelValue label="Total">{getValidValue(0, formatCurrency)}</LabelValue>
        <LabelValue label="Null Price">{getValidValue(null, formatCurrency, '$0.00')}</LabelValue>
        <LabelValue label="Undefined Price">
          {getValidValue(undefined, formatCurrency, 'Price TBD')}
        </LabelValue>
      </div>
    );
  },
};

/**
 * Usage with boolean values
 */
export const BooleanValues: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="True Value">{getValidValue(true)}</LabelValue>
      <LabelValue label="False Value">{getValidValue(false)}</LabelValue>
      <LabelValue label="Null Boolean">{getValidValue(null)}</LabelValue>
      <LabelValue label="Undefined Boolean">{getValidValue(undefined)}</LabelValue>
      <LabelValue label="False with Custom Fallback">
        {getValidValue(false, undefined, 'Inactive')}
      </LabelValue>
    </div>
  ),
};

/**
 * Real-world example: User profile data
 */
export const RealWorldExample: Story = {
  render: () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: null,
      birthDate: new Date('1990-05-15'),
      salary: 75000,
      department: '',
      status: true,
    };

    const formatDate = (date: unknown) =>
      new Date(date as Date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    const formatCurrency = (value: unknown) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
        value as number
      );

    return (
      <div className="w-96 rounded-lg border p-6">
        <h3 className="mb-4 font-semibold text-lg">User Profile</h3>
        <div className="space-y-4">
          <LabelValue label="Name">{getValidValue(userData.name)}</LabelValue>
          <LabelValue label="Email">{getValidValue(userData.email)}</LabelValue>
          <LabelValue label="Phone">
            {getValidValue(userData.phone, undefined, 'Not provided')}
          </LabelValue>
          <LabelValue label="Birth Date">
            {getValidValue(userData.birthDate, formatDate)}
          </LabelValue>
          <LabelValue label="Salary">{getValidValue(userData.salary, formatCurrency)}</LabelValue>
          <LabelValue label="Department">
            {getValidValue(userData.department, undefined, 'Unassigned')}
          </LabelValue>
          <LabelValue label="Status">
            {getValidValue(userData.status, (value) => (value ? 'Active' : 'Inactive'))}
          </LabelValue>
        </div>
      </div>
    );
  },
};

/**
 * Edge cases and special scenarios
 */
export const EdgeCases: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="Empty String">{getValidValue('')}</LabelValue>
      <LabelValue label="Whitespace String">{getValidValue('   ')}</LabelValue>
      <LabelValue label="Zero Number">{getValidValue(0)}</LabelValue>
      <LabelValue label="Negative Number">{getValidValue(-10)}</LabelValue>
      <LabelValue label="False Boolean">{getValidValue(false)}</LabelValue>
      <LabelValue label="Null">{getValidValue(null)}</LabelValue>
      <LabelValue label="Undefined">{getValidValue(undefined)}</LabelValue>
      <LabelValue label="Zero with Custom Fallback">
        {getValidValue(0, undefined, 'No items')}
      </LabelValue>
      <LabelValue label="Empty String with Custom Fallback">
        {getValidValue('', undefined, 'Empty')}
      </LabelValue>
    </div>
  ),
};

/**
 * Comparison: With and without getValidValue
 */
export const Comparison: Story = {
  render: () => {
    const data = {
      name: 'John Doe',
      email: null,
      phone: undefined,
      age: 0,
    };

    return (
      <div className="w-[600px] space-y-6">
        <div>
          <h3 className="mb-4 font-semibold text-lg">Without getValidValue (Raw Values)</h3>
          <div className="space-y-4">
            <LabelValue label="Name">{String(data.name)}</LabelValue>
            <LabelValue label="Email">{String(data.email)}</LabelValue>
            <LabelValue label="Phone">{String(data.phone)}</LabelValue>
            <LabelValue label="Age">{String(data.age)}</LabelValue>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-lg">With getValidValue</h3>
          <div className="space-y-4">
            <LabelValue label="Name">{getValidValue(data.name)}</LabelValue>
            <LabelValue label="Email">{getValidValue(data.email)}</LabelValue>
            <LabelValue label="Phone">{getValidValue(data.phone)}</LabelValue>
            <LabelValue label="Age">{getValidValue(data.age)}</LabelValue>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-lg">With getValidValue + Custom Fallbacks</h3>
          <div className="space-y-4">
            <LabelValue label="Name">{getValidValue(data.name)}</LabelValue>
            <LabelValue label="Email">
              {getValidValue(data.email, undefined, 'No email')}
            </LabelValue>
            <LabelValue label="Phone">
              {getValidValue(data.phone, undefined, 'No phone')}
            </LabelValue>
            <LabelValue label="Age">
              {getValidValue(data.age, undefined, 'Not specified')}
            </LabelValue>
          </div>
        </div>
      </div>
    );
  },
};
