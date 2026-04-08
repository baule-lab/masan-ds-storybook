import type { Meta, StoryObj } from '@storybook/react-vite';
import { toNumber, toPercentage, fromPercentage } from '@masan-group/utils';
import { LabelValue } from '@masan-group/shared-ui/label-value';

/**
 * Number conversion utility functions.
 */
const meta = {
  title: 'Utils/number',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Number conversion and percentage utility functions.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic usage with strings
 */
export const BasicUsage: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toNumber('123')">{toNumber('123')}</LabelValue>
      <LabelValue label="toNumber('123.45')">{toNumber('123.45')}</LabelValue>
      <LabelValue label="toNumber('-123')">{toNumber('-123')}</LabelValue>
      <LabelValue label="toNumber('0')">{toNumber('0')}</LabelValue>
      <LabelValue label="toNumber('1234567890')">{toNumber('1234567890')}</LabelValue>
    </div>
  ),
};

/**
 * With numbers
 */
export const WithNumbers: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toNumber(123)">{toNumber(123)}</LabelValue>
      <LabelValue label="toNumber(123.45)">{toNumber(123.45)}</LabelValue>
      <LabelValue label="toNumber(-123)">{toNumber(-123)}</LabelValue>
      <LabelValue label="toNumber(0)">{toNumber(0)}</LabelValue>
      <LabelValue label="toNumber(Infinity)">{toNumber(Number.POSITIVE_INFINITY)}</LabelValue>
    </div>
  ),
};

/**
 * Edge cases with invalid values
 */
export const EdgeCases: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toNumber(null)">{toNumber(null)}</LabelValue>
      <LabelValue label="toNumber(undefined)">{toNumber(undefined)}</LabelValue>
      <LabelValue label="toNumber('')">{toNumber('')}</LabelValue>
      <LabelValue label="toNumber('abc')">{toNumber('abc')}</LabelValue>
      <LabelValue label="toNumber('123abc')">{toNumber('123abc')}</LabelValue>
      <LabelValue label="toNumber('12.34.56')">{toNumber('12.34.56')}</LabelValue>
      <LabelValue label="toNumber(' 123 ')}">{toNumber(' 123 ')}</LabelValue>
    </div>
  ),
};

/**
 * Real-world examples
 */
export const RealWorldExamples: Story = {
  render: () => {
    const examples = [
      { input: '1234.56', description: 'Price' },
      { input: '42', description: 'Quantity' },
      { input: '-10', description: 'Temperature' },
      { input: '0', description: 'Zero value' },
      { input: null, description: 'Null input' },
      { input: undefined, description: 'Undefined input' },
      { input: '', description: 'Empty string' },
    ];

    return (
      <div className="w-[600px] space-y-4">
        {examples.map((example) => (
          <div key={example.description} className="rounded-lg border bg-muted p-4">
            <div className="space-y-2">
              <LabelValue label={example.description}>
                <span className="font-mono">
                  {example.input !== null && example.input !== undefined
                    ? `"${example.input}"`
                    : String(example.input)}
                  {' → '}
                  {toNumber(example.input)}
                </span>
              </LabelValue>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Comparison with Number() constructor
 */
export const Comparison: Story = {
  render: () => {
    const testValues = ['123', '123.45', 'abc', '', null, undefined, '0', '-123'];

    return (
      <div className="w-[600px] space-y-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Input</th>
              <th className="p-2 text-left">toNumber()</th>
              <th className="p-2 text-left">Number()</th>
            </tr>
          </thead>
          <tbody>
            {testValues.map((val) => (
              <tr key={String(val)} className="border-b">
                <td className="p-2 font-mono text-sm">
                  {val === null || val === undefined ? String(val) : `"${val}"`}
                </td>
                <td className="p-2 font-mono text-sm">{toNumber(val)}</td>
                <td className="p-2 font-mono text-sm">
                  {Number(val) || (Number(val) === 0 ? '0' : 'NaN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="rounded-lg border bg-muted p-4 text-sm">
          <p className="font-semibold">Note:</p>
          <p>
            toNumber() returns 0 on error, while Number() returns NaN. This makes toNumber() safer
            for calculations where you want a default value.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * toPercentage - Convert a number to a percentage
 */
export const ToPercentage: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toPercentage(0.1)">{toPercentage(0.1)}</LabelValue>
      <LabelValue label="toPercentage(0.1234567890, 2)">{toPercentage(0.123456789, 2)}</LabelValue>
      <LabelValue label="toPercentage(1)">{toPercentage(1)}</LabelValue>
      <LabelValue label="toPercentage(10, 2)">{toPercentage(10, 2)}</LabelValue>
      <LabelValue label="toPercentage(0.5)">{toPercentage(0.5)}</LabelValue>
      <LabelValue label="toPercentage(0.75, 1)">{toPercentage(0.75, 1)}</LabelValue>
      <LabelValue label="toPercentage(0.333, 4)">{toPercentage(0.333, 4)}</LabelValue>
    </div>
  ),
};

/**
 * toPercentage - With different precision values
 */
export const ToPercentagePrecision: Story = {
  render: () => {
    const testValue = 0.123456789;
    const precisions = [0, 1, 2, 3, 4, 5];

    return (
      <div className="w-[600px] space-y-4">
        <div className="rounded-lg border bg-muted p-4">
          <p className="mb-2 font-semibold">Input: {testValue}</p>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Precision</th>
              <th className="p-2 text-left">Result</th>
              <th className="p-2 text-left">Code</th>
            </tr>
          </thead>
          <tbody>
            {precisions.map((precision) => (
              <tr key={precision} className="border-b">
                <td className="p-2 font-mono text-sm">{precision}</td>
                <td className="p-2 font-mono text-sm">{toPercentage(testValue, precision)}</td>
                <td className="p-2 font-mono text-sm">
                  toPercentage({testValue}, {precision})
                </td>
              </tr>
            ))}
            <tr className="border-b">
              <td className="p-2 font-mono text-sm">(default: 2)</td>
              <td className="p-2 font-mono text-sm">{toPercentage(testValue)}</td>
              <td className="p-2 font-mono text-sm">toPercentage({testValue})</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
};

/**
 * fromPercentage - Convert a percentage to a number
 */
export const FromPercentage: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="fromPercentage(10)">{fromPercentage(10)}</LabelValue>
      <LabelValue label="fromPercentage(100)">{fromPercentage(100)}</LabelValue>
      <LabelValue label="fromPercentage(100, 2)">{fromPercentage(100, 2)}</LabelValue>
      <LabelValue label="fromPercentage(100.1234567890, 4)">
        {fromPercentage(100.123456789, 4)}
      </LabelValue>
      <LabelValue label="fromPercentage(50)">{fromPercentage(50)}</LabelValue>
      <LabelValue label="fromPercentage(25.5, 3)">{fromPercentage(25.5, 3)}</LabelValue>
      <LabelValue label="fromPercentage(0)">{fromPercentage(0)}</LabelValue>
    </div>
  ),
};

/**
 * fromPercentage - With different precision values
 */
export const FromPercentagePrecision: Story = {
  render: () => {
    const testValue = 123.456789;
    const precisions = [0, 1, 2, 3, 4, 5];

    return (
      <div className="w-[600px] space-y-4">
        <div className="rounded-lg border bg-muted p-4">
          <p className="mb-2 font-semibold">Input: {testValue}%</p>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Precision</th>
              <th className="p-2 text-left">Result</th>
              <th className="p-2 text-left">Code</th>
            </tr>
          </thead>
          <tbody>
            {precisions.map((precision) => (
              <tr key={precision} className="border-b">
                <td className="p-2 font-mono text-sm">{precision}</td>
                <td className="p-2 font-mono text-sm">{fromPercentage(testValue, precision)}</td>
                <td className="p-2 font-mono text-sm">
                  fromPercentage({testValue}, {precision})
                </td>
              </tr>
            ))}
            <tr className="border-b">
              <td className="p-2 font-mono text-sm">(default: 2)</td>
              <td className="p-2 font-mono text-sm">{fromPercentage(testValue)}</td>
              <td className="p-2 font-mono text-sm">fromPercentage({testValue})</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
};

/**
 * Percentage conversion edge cases
 */
export const PercentageEdgeCases: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toPercentage(null)">{toPercentage(null)}</LabelValue>
      <LabelValue label="toPercentage(undefined)">{toPercentage(undefined)}</LabelValue>
      <LabelValue label="toPercentage('0.5')">{toPercentage('0.5')}</LabelValue>
      <LabelValue label="toPercentage('10')">{toPercentage('10')}</LabelValue>
      <LabelValue label="fromPercentage(null)">{fromPercentage(null)}</LabelValue>
      <LabelValue label="fromPercentage(undefined)">{fromPercentage(undefined)}</LabelValue>
      <LabelValue label="fromPercentage('50')">{fromPercentage('50')}</LabelValue>
      <LabelValue label="fromPercentage('100.5')">{fromPercentage('100.5')}</LabelValue>
    </div>
  ),
};

/**
 * Round-trip conversion examples
 */
export const RoundTripConversion: Story = {
  render: () => {
    const testValues = [0.1, 0.25, 0.5, 0.75, 1, 0.123, 0.456789];

    return (
      <div className="w-[700px] space-y-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Original</th>
              <th className="p-2 text-left">toPercentage()</th>
              <th className="p-2 text-left">fromPercentage()</th>
              <th className="p-2 text-left">Round-trip</th>
            </tr>
          </thead>
          <tbody>
            {testValues.map((val) => {
              const percentage = toPercentage(val);
              const backToNumber = fromPercentage(percentage);
              return (
                <tr key={val} className="border-b">
                  <td className="p-2 font-mono text-sm">{val}</td>
                  <td className="p-2 font-mono text-sm">{percentage}</td>
                  <td className="p-2 font-mono text-sm">{backToNumber}</td>
                  <td className="p-2 font-mono text-sm">
                    {val === backToNumber ? '✓ Match' : `✗ Diff: ${Math.abs(val - backToNumber)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="rounded-lg border bg-muted p-4 text-sm">
          <p className="font-semibold">Note:</p>
          <p>
            Round-trip conversions may have slight precision differences due to floating-point
            arithmetic and rounding. Use appropriate precision values to minimize these differences.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Real-world percentage examples
 */
export const RealWorldPercentageExamples: Story = {
  render: () => {
    const examples = [
      { value: 0.1, description: '10% discount rate' },
      { value: 0.15, description: '15% tax rate' },
      { value: 0.25, description: '25% profit margin' },
      { value: 0.5, description: '50% completion' },
      { value: 0.75, description: '75% capacity' },
      { value: 1, description: '100% full' },
      { value: 0.1234, description: '12.34% growth rate' },
    ];

    return (
      <div className="w-[600px] space-y-4">
        {examples.map((example) => (
          <div key={example.description} className="rounded-lg border bg-muted p-4">
            <div className="space-y-2">
              <LabelValue label={example.description}>
                <div className="space-y-1">
                  <span className="font-mono text-sm">
                    Value: {example.value} → Percentage: {toPercentage(example.value)}%
                  </span>
                  <span className="block font-mono text-sm">
                    Percentage: {toPercentage(example.value)}% → Value:{' '}
                    {fromPercentage(toPercentage(example.value))}
                  </span>
                </div>
              </LabelValue>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
