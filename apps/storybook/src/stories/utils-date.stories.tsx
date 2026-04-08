import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  calculateNumForecastPeriods,
  formatDate,
  getDateRangeLabel,
  buildAlignedRange,
} from '@masan-group/utils';
import { toISOWithTimezone, toISOString, getStartDate, getEndDate } from '@masan-group/utils/date';
import { TIME_GRANULARITY } from '@masan-group/types/common';
import { LabelValue } from '@masan-group/shared-ui/label-value';

/**
 * Date utility functions from @masan-group/utils.
 */
const meta = {
  title: 'Utils/date',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Date utility functions for formatting, conversion, and date range calculations with time granularity support.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/* -----------------------------
   toISOString
--------------------------------*/

/**
 * Basic usage - Convert date to ISO string (UTC)
 */
export const ToISOString: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toISOString('2024-01-01')">{toISOString('2024-01-01')}</LabelValue>
      <LabelValue label="toISOString(new Date('2024-01-15T10:30:00Z'))">
        {toISOString(new Date('2024-01-15T10:30:00Z'))}
      </LabelValue>
      <LabelValue label="toISOString(new Date('2024-12-25'))">
        {toISOString(new Date('2024-12-25'))}
      </LabelValue>
      <LabelValue label="toISOString(undefined)">
        {toISOString(undefined) || '(empty string)'}
      </LabelValue>
    </div>
  ),
};

/**
 * Edge cases for toISOString
 */
export const ToISOStringEdgeCases: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toISOString(null)">
        {toISOString(null as unknown as string) || '(empty string)'}
      </LabelValue>
      <LabelValue label="toISOString('')">{toISOString('') || '(empty string)'}</LabelValue>
      <LabelValue label="toISOString('2024-01-01T00:00:00.000Z')">
        {toISOString('2024-01-01T00:00:00.000Z')}
      </LabelValue>
    </div>
  ),
};

/* -----------------------------
   toISOWithTimezone
--------------------------------*/

/**
 * Basic usage - Convert date to ISO string with local timezone offset
 */
export const ToISOWithTimezone: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="toISOWithTimezone('2024-01-15')">
        {toISOWithTimezone('2024-01-15')}
      </LabelValue>
      <LabelValue label="toISOWithTimezone(new Date('2024-01-15T10:30:00'))">
        {toISOWithTimezone(new Date('2024-01-15T10:30:00'))}
      </LabelValue>
      <LabelValue label="toISOWithTimezone(new Date('2024-12-25T14:45:30.123'))">
        {toISOWithTimezone(new Date('2024-12-25T14:45:30.123'))}
      </LabelValue>
      <LabelValue label="toISOWithTimezone(undefined)">
        {toISOWithTimezone(undefined) || '(empty string)'}
      </LabelValue>
    </div>
  ),
};

/**
 * Comparison: toISOString vs toISOWithTimezone
 */
export const ISOStringComparison: Story = {
  render: () => {
    const testDate = new Date('2024-01-15T10:30:00');
    return (
      <div className="w-[600px] space-y-4">
        <div className="rounded-lg border bg-muted p-4">
          <p className="mb-2 font-semibold">Input: {testDate.toString()}</p>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Function</th>
              <th className="p-2 text-left">Output</th>
              <th className="p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2 font-mono text-sm">toISOString()</td>
              <td className="p-2 font-mono text-sm">{toISOString(testDate)}</td>
              <td className="p-2 text-sm">UTC timezone (always ends with Z)</td>
            </tr>
            <tr className="border-b">
              <td className="p-2 font-mono text-sm">toISOWithTimezone()</td>
              <td className="p-2 font-mono text-sm">{toISOWithTimezone(testDate)}</td>
              <td className="p-2 text-sm">Local timezone offset (e.g., -08:00)</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
};

/* -----------------------------
   formatDate
--------------------------------*/

/**
 * Basic usage - Format date with date-fns patterns
 */
export const FormatDate: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="formatDate('2024-01-01')">{formatDate('2024-01-01')}</LabelValue>
      <LabelValue label="formatDate('2024-01-01', 'MMM dd, yyyy')">
        {formatDate('2024-01-01', 'MMM dd, yyyy')}
      </LabelValue>
      <LabelValue label="formatDate(new Date('2024-12-25T14:30:00'))">
        {formatDate(new Date('2024-12-25T14:30:00'))}
      </LabelValue>
      <LabelValue label="formatDate('2024-06-15', 'MMM dd, yyyy HH:mm')">
        {formatDate('2024-06-15', 'MMM dd, yyyy HH:mm')}
      </LabelValue>
    </div>
  ),
};

/**
 * Format date with different patterns
 */
export const FormatDatePatterns: Story = {
  render: () => {
    const date = '2024-12-30T14:30:00Z';
    const formats = [
      { pattern: 'MMM dd, yyyy HH:mm', description: 'Default format' },
      { pattern: 'MMM dd, yyyy', description: 'Date only' },
      { pattern: 'yyyy-MM-dd', description: 'ISO date' },
      { pattern: 'dd/MM/yyyy', description: 'European format' },
      { pattern: 'MM/dd/yyyy', description: 'US format' },
      { pattern: 'EEEE, MMMM dd, yyyy', description: 'Long format' },
    ];

    return (
      <div className="w-[600px] space-y-4">
        <div className="rounded-lg border bg-muted p-4">
          <p className="font-semibold">Input: {date}</p>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Pattern</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Output</th>
            </tr>
          </thead>
          <tbody>
            {formats.map((format) => (
              <tr key={format.pattern} className="border-b">
                <td className="p-2 font-mono text-sm">{format.pattern}</td>
                <td className="p-2 text-sm">{format.description}</td>
                <td className="p-2 font-mono text-sm">{formatDate(date, format.pattern)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};

/**
 * Edge cases for formatDate
 */
export const FormatDateEdgeCases: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="formatDate(undefined)">
        {formatDate(undefined as unknown as string) || '(empty string)'}
      </LabelValue>
      <LabelValue label="formatDate(null)">
        {formatDate(null as unknown as string) || '(empty string)'}
      </LabelValue>
      <LabelValue label="formatDate('')">{formatDate('') || '(empty string)'}</LabelValue>
    </div>
  ),
};

/* -----------------------------
   calculateNumForecastPeriods
--------------------------------*/

/**
 * Basic usage - Calculate forecast periods for different granularities
 */
export const CalculateNumForecastPeriods: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="Week: 2024-01-01 to 2024-01-15">
        {calculateNumForecastPeriods('2024-01-01', '2024-01-15', TIME_GRANULARITY.WEEK)} weeks
      </LabelValue>
      <LabelValue label="Month: 2024-01-01 to 2024-03-01">
        {calculateNumForecastPeriods('2024-01-01', '2024-03-01', TIME_GRANULARITY.MONTH)} months
      </LabelValue>
      <LabelValue label="Year: 2024-01-01 to 2026-01-01">
        {calculateNumForecastPeriods('2024-01-01', '2026-01-01', TIME_GRANULARITY.YEAR)} years
      </LabelValue>
    </div>
  ),
};

/**
 * Calculate periods with different date ranges
 */
export const CalculatePeriodsExamples: Story = {
  render: () => {
    const examples = [
      {
        start: '2024-01-01',
        end: '2024-01-08',
        granularity: TIME_GRANULARITY.WEEK,
        label: '1 week range',
      },
      {
        start: '2024-01-01',
        end: '2024-01-22',
        granularity: TIME_GRANULARITY.WEEK,
        label: '3 weeks range',
      },
      {
        start: '2024-01-01',
        end: '2024-04-01',
        granularity: TIME_GRANULARITY.MONTH,
        label: '3 months range',
      },
      {
        start: '2024-01-01',
        end: '2024-12-31',
        granularity: TIME_GRANULARITY.MONTH,
        label: '12 months range',
      },
      {
        start: '2024-01-01',
        end: '2025-01-01',
        granularity: TIME_GRANULARITY.YEAR,
        label: '1 year range',
      },
      {
        start: '2024-01-01',
        end: '2027-01-01',
        granularity: TIME_GRANULARITY.YEAR,
        label: '3 years range',
      },
    ];

    return (
      <div className="w-[600px] space-y-4">
        {examples.map((example) => (
          <div key={example.label} className="rounded-lg border bg-muted p-4">
            <div className="space-y-2">
              <LabelValue label={example.label}>
                <span className="font-mono text-sm">
                  {example.start} to {example.end} ({example.granularity}) ={' '}
                  {calculateNumForecastPeriods(example.start, example.end, example.granularity)}{' '}
                  {example.granularity}
                  {calculateNumForecastPeriods(example.start, example.end, example.granularity) !==
                  1
                    ? 's'
                    : ''}
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
 * Edge cases for calculateNumForecastPeriods
 */
export const CalculatePeriodsEdgeCases: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="Undefined start date">
        {calculateNumForecastPeriods(undefined, '2024-12-31', TIME_GRANULARITY.MONTH)} (defaults to
        6)
      </LabelValue>
      <LabelValue label="Undefined end date">
        {calculateNumForecastPeriods('2024-01-01', undefined, TIME_GRANULARITY.MONTH)} (defaults to
        6)
      </LabelValue>
      <LabelValue label="Invalid range (start > end)">
        {calculateNumForecastPeriods('2025-06-15', '2024-03-10', TIME_GRANULARITY.MONTH)} (defaults
        to 6)
      </LabelValue>
      <LabelValue label="Same date">
        {calculateNumForecastPeriods('2024-07-20', '2024-07-20', TIME_GRANULARITY.MONTH)} (defaults
        to 6)
      </LabelValue>
    </div>
  ),
};

/* -----------------------------
   getDateRangeLabel
--------------------------------*/

/**
 * Basic usage - Get human-readable date range labels
 */
export const GetDateRangeLabel: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="Week range">
        {getDateRangeLabel('2024-01-01', '2024-01-08', TIME_GRANULARITY.WEEK)}
      </LabelValue>
      <LabelValue label="Month range">
        {getDateRangeLabel('2024-01-01', '2024-03-01', TIME_GRANULARITY.MONTH)}
      </LabelValue>
      <LabelValue label="Year range">
        {getDateRangeLabel('2024-01-01', '2026-01-01', TIME_GRANULARITY.YEAR)}
      </LabelValue>
    </div>
  ),
};

/**
 * Date range labels with different inputs
 */
export const DateRangeLabelExamples: Story = {
  render: () => {
    const examples = [
      {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-15'),
        granularity: TIME_GRANULARITY.WEEK,
      },
      {
        start: '2024-01-01',
        end: '2024-04-01',
        granularity: TIME_GRANULARITY.MONTH,
      },
      {
        start: new Date('2024-01-01'),
        end: new Date('2027-01-01'),
        granularity: TIME_GRANULARITY.YEAR,
      },
    ];

    return (
      <div className="w-[600px] space-y-4">
        {examples.map((example, idx) => (
          <div key={idx} className="rounded-lg border bg-muted p-4">
            <div className="space-y-2">
              <LabelValue label={`${example.granularity} range`}>
                <span className="font-mono text-sm">
                  {getDateRangeLabel(example.start, example.end, example.granularity)}
                </span>
              </LabelValue>
            </div>
          </div>
        ))}
      </div>
    );
  },
};

/* -----------------------------
   buildAlignedRange
--------------------------------*/

/**
 * Basic usage - Build aligned date ranges
 */
export const BuildAlignedRange: Story = {
  render: () => {
    const weekRange = buildAlignedRange('2024-01-15', '2024-01-20', TIME_GRANULARITY.WEEK);
    const monthRange = buildAlignedRange('2024-01-15', '2024-01-25', TIME_GRANULARITY.MONTH);
    const yearRange = buildAlignedRange('2024-06-15', '2024-08-20', TIME_GRANULARITY.YEAR);

    return (
      <div className="w-[600px] space-y-4">
        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Week Alignment</h3>
          <div className="space-y-2">
            <LabelValue label="Input: 2024-01-15 to 2024-01-20">
              <div className="space-y-1">
                <div className="font-mono text-sm">
                  Start: {weekRange.start_date} (Monday 00:00:00 UTC)
                </div>
                <div className="font-mono text-sm">
                  End: {weekRange.end_date} (Sunday 23:59:59 UTC)
                </div>
              </div>
            </LabelValue>
          </div>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Month Alignment</h3>
          <div className="space-y-2">
            <LabelValue label="Input: 2024-01-15 to 2024-01-25">
              <div className="space-y-1">
                <div className="font-mono text-sm">
                  Start: {monthRange.start_date} (1st day 00:00:00 UTC)
                </div>
                <div className="font-mono text-sm">
                  End: {monthRange.end_date} (Last day 23:59:59 UTC)
                </div>
              </div>
            </LabelValue>
          </div>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Year Alignment</h3>
          <div className="space-y-2">
            <LabelValue label="Input: 2024-06-15 to 2024-08-20">
              <div className="space-y-1">
                <div className="font-mono text-sm">
                  Start: {yearRange.start_date} (Jan 1 00:00:00 UTC)
                </div>
                <div className="font-mono text-sm">
                  End: {yearRange.end_date} (Dec 31 23:59:59 UTC)
                </div>
              </div>
            </LabelValue>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Aligned ranges with different dates
 */
export const AlignedRangeExamples: Story = {
  render: () => {
    const examples = [
      {
        start: '2024-01-10',
        end: '2024-01-18',
        granularity: TIME_GRANULARITY.WEEK,
        description: 'Week alignment (aligns to Monday-Sunday)',
      },
      {
        start: '2024-01-15',
        end: '2024-02-20',
        granularity: TIME_GRANULARITY.MONTH,
        description: 'Month alignment (aligns to month boundaries)',
      },
      {
        start: '2024-06-15',
        end: '2024-09-20',
        granularity: TIME_GRANULARITY.YEAR,
        description: 'Year alignment (aligns to year boundaries)',
      },
    ];

    return (
      <div className="w-[700px] space-y-4">
        {examples.map((example) => {
          const range = buildAlignedRange(example.start, example.end, example.granularity);
          return (
            <div key={example.description} className="rounded-lg border bg-muted p-4">
              <h3 className="mb-3 font-semibold">{example.description}</h3>
              <div className="space-y-2">
                <LabelValue label="Input range">
                  <span className="font-mono text-sm">
                    {example.start} to {example.end}
                  </span>
                </LabelValue>
                <LabelValue label="Aligned range">
                  <div className="space-y-1">
                    <div className="font-mono text-sm">Start: {range.start_date}</div>
                    <div className="font-mono text-sm">End: {range.end_date}</div>
                  </div>
                </LabelValue>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

/* -----------------------------
   getStartDate
--------------------------------*/

/**
 * Basic usage - Get start date for different granularities
 */
export const GetStartDate: Story = {
  render: () => {
    const testDate = new Date('2024-01-15T14:30:00');
    return (
      <div className="w-96 space-y-4">
        <LabelValue label="Input date">
          <span className="font-mono text-sm">{testDate.toString()}</span>
        </LabelValue>
        <LabelValue label="getStartDate(date, 'day')">
          <span className="font-mono text-sm">{getStartDate(testDate, 'day').toString()}</span>
        </LabelValue>
        <LabelValue label="getStartDate(date, 'week')">
          <span className="font-mono text-sm">{getStartDate(testDate, 'week').toString()}</span>
        </LabelValue>
        <LabelValue label="getStartDate(date, 'month')">
          <span className="font-mono text-sm">{getStartDate(testDate, 'month').toString()}</span>
        </LabelValue>
        <LabelValue label="getStartDate(date, 'year')">
          <span className="font-mono text-sm">{getStartDate(testDate, 'year').toString()}</span>
        </LabelValue>
      </div>
    );
  },
};

/**
 * GetStartDate with different dates
 */
export const GetStartDateExamples: Story = {
  render: () => {
    const examples = [
      { date: '2024-01-15T14:30:00', label: 'Mid-month date' },
      { date: '2024-12-31T23:59:59', label: 'Year end' },
      { date: '2024-06-01T00:00:00', label: 'Month start' },
      { date: '2024-03-20T12:00:00', label: 'Mid-week date' },
    ];

    return (
      <div className="w-[700px] space-y-4">
        {examples.map((example) => {
          const date = new Date(example.date);
          return (
            <div key={example.label} className="rounded-lg border bg-muted p-4">
              <h3 className="mb-3 font-semibold">{example.label}</h3>
              <div className="space-y-2">
                <LabelValue label="Input">
                  <span className="font-mono text-sm">{date.toString()}</span>
                </LabelValue>
                <div className="grid grid-cols-2 gap-2">
                  <LabelValue label="Day start">
                    <span className="font-mono text-sm">
                      {formatDate(getStartDate(date, 'day'), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </LabelValue>
                  <LabelValue label="Week start">
                    <span className="font-mono text-sm">
                      {formatDate(getStartDate(date, 'week'), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </LabelValue>
                  <LabelValue label="Month start">
                    <span className="font-mono text-sm">
                      {formatDate(getStartDate(date, 'month'), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </LabelValue>
                  <LabelValue label="Year start">
                    <span className="font-mono text-sm">
                      {formatDate(getStartDate(date, 'year'), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </LabelValue>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

/* -----------------------------
   getEndDate
--------------------------------*/

/**
 * Basic usage - Get end date for different granularities
 */
export const GetEndDate: Story = {
  render: () => {
    const testDate = new Date('2024-01-15T14:30:00');
    return (
      <div className="w-96 space-y-4">
        <LabelValue label="Input date">
          <span className="font-mono text-sm">{testDate.toString()}</span>
        </LabelValue>
        <LabelValue label="getEndDate(date, 'day')">
          <span className="font-mono text-sm">{getEndDate(testDate, 'day').toString()}</span>
        </LabelValue>
        <LabelValue label="getEndDate(date, 'week')">
          <span className="font-mono text-sm">{getEndDate(testDate, 'week').toString()}</span>
        </LabelValue>
        <LabelValue label="getEndDate(date, 'month')">
          <span className="font-mono text-sm">{getEndDate(testDate, 'month').toString()}</span>
        </LabelValue>
        <LabelValue label="getEndDate(date, 'year')">
          <span className="font-mono text-sm">{getEndDate(testDate, 'year').toString()}</span>
        </LabelValue>
      </div>
    );
  },
};

/**
 * GetEndDate with different dates
 */
export const GetEndDateExamples: Story = {
  render: () => {
    const examples = [
      { date: '2024-01-15T14:30:00', label: 'Mid-month date' },
      { date: '2024-12-31T23:59:59', label: 'Year end' },
      { date: '2024-06-01T00:00:00', label: 'Month start' },
      { date: '2024-03-20T12:00:00', label: 'Mid-week date' },
    ];

    return (
      <div className="w-[700px] space-y-4">
        {examples.map((example) => {
          const date = new Date(example.date);
          return (
            <div key={example.label} className="rounded-lg border bg-muted p-4">
              <h3 className="mb-3 font-semibold">{example.label}</h3>
              <div className="space-y-2">
                <LabelValue label="Input">
                  <span className="font-mono text-sm">{date.toString()}</span>
                </LabelValue>
                <div className="grid grid-cols-2 gap-2">
                  <LabelValue label="Day end">
                    <span className="font-mono text-sm">
                      {formatDate(getEndDate(date, 'day'), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </LabelValue>
                  <LabelValue label="Week end">
                    <span className="font-mono text-sm">
                      {formatDate(getEndDate(date, 'week'), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </LabelValue>
                  <LabelValue label="Month end">
                    <span className="font-mono text-sm">
                      {formatDate(getEndDate(date, 'month'), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </LabelValue>
                  <LabelValue label="Year end">
                    <span className="font-mono text-sm">
                      {formatDate(getEndDate(date, 'year'), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </LabelValue>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

/**
 * Comparison - Start vs End dates
 */
export const StartEndDateComparison: Story = {
  render: () => {
    const testDate = new Date('2024-01-15T14:30:00');
    const granularities: Array<'day' | 'week' | 'month' | 'year'> = [
      'day',
      'week',
      'month',
      'year',
    ];

    return (
      <div className="w-[700px] space-y-4">
        <div className="rounded-lg border bg-muted p-4">
          <p className="mb-2 font-semibold">Input: {testDate.toString()}</p>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Granularity</th>
              <th className="p-2 text-left">Start Date</th>
              <th className="p-2 text-left">End Date</th>
              <th className="p-2 text-left">ISO Format</th>
            </tr>
          </thead>
          <tbody>
            {granularities.map((granularity) => {
              const start = getStartDate(testDate, granularity);
              const end = getEndDate(testDate, granularity);
              return (
                <tr key={granularity} className="border-b">
                  <td className="p-2 font-mono text-sm capitalize">{granularity}</td>
                  <td className="p-2 font-mono text-sm">
                    {formatDate(start, 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="p-2 font-mono text-sm">{formatDate(end, 'MMM dd, yyyy HH:mm')}</td>
                  <td className="p-2 font-mono text-xs">
                    {toISOString(start)} → {toISOString(end)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  },
};

/**
 * Edge cases for getStartDate and getEndDate
 */
export const StartEndDateEdgeCases: Story = {
  render: () => {
    return (
      <div className="w-96 space-y-4">
        <LabelValue label="getStartDate('2024-01-15', 'day')">
          <span className="font-mono text-sm">
            {formatDate(getStartDate('2024-01-15', 'day'), 'MMM dd, yyyy HH:mm')}
          </span>
        </LabelValue>
        <LabelValue label="getEndDate('2024-01-15', 'day')">
          <span className="font-mono text-sm">
            {formatDate(getEndDate('2024-01-15', 'day'), 'MMM dd, yyyy HH:mm')}
          </span>
        </LabelValue>
        <LabelValue label="getStartDate(new Date(), 'week')">
          <span className="font-mono text-sm">
            {formatDate(getStartDate(new Date(), 'week'), 'MMM dd, yyyy HH:mm')}
          </span>
        </LabelValue>
        <LabelValue label="getEndDate(new Date(), 'week')">
          <span className="font-mono text-sm">
            {formatDate(getEndDate(new Date(), 'week'), 'MMM dd, yyyy HH:mm')}
          </span>
        </LabelValue>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm">
          <p className="font-semibold text-destructive">Error Handling:</p>
          <p className="mt-1">
            Both functions throw an error if date is undefined or null. Always provide a valid date.
          </p>
        </div>
      </div>
    );
  },
};

/* -----------------------------
   Real-world examples
--------------------------------*/

/**
 * Real-world usage examples combining multiple functions
 */
export const RealWorldExamples: Story = {
  render: () => {
    const forecastStart = '2024-01-15';
    const forecastEnd = '2024-04-15';
    const granularity = TIME_GRANULARITY.MONTH;

    const numPeriods = calculateNumForecastPeriods(forecastStart, forecastEnd, granularity);
    const alignedRange = buildAlignedRange(forecastStart, forecastEnd, granularity);
    const rangeLabel = getDateRangeLabel(forecastStart, forecastEnd, granularity);

    return (
      <div className="w-[700px] space-y-4">
        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Forecast Period Calculation</h3>
          <div className="space-y-2">
            <LabelValue label="Input">
              <span className="font-mono text-sm">
                {forecastStart} to {forecastEnd} ({granularity})
              </span>
            </LabelValue>
            <LabelValue label="Number of periods">
              <span className="font-mono text-sm">
                {numPeriods} {granularity}s
              </span>
            </LabelValue>
            <LabelValue label="Human-readable label">
              <span className="font-mono text-sm">{rangeLabel}</span>
            </LabelValue>
            <LabelValue label="Aligned range (for API)">
              <div className="space-y-1">
                <div className="font-mono text-sm">start_date: {alignedRange.start_date}</div>
                <div className="font-mono text-sm">end_date: {alignedRange.end_date}</div>
              </div>
            </LabelValue>
          </div>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Date Formatting Examples</h3>
          <div className="space-y-2">
            <LabelValue label="ISO String (UTC)">
              <span className="font-mono text-sm">{toISOString(new Date(forecastStart))}</span>
            </LabelValue>
            <LabelValue label="ISO String (with timezone)">
              <span className="font-mono text-sm">
                {toISOWithTimezone(new Date(forecastStart))}
              </span>
            </LabelValue>
            <LabelValue label="Formatted date">
              <span className="font-mono text-sm">{formatDate(forecastStart, 'MMM dd, yyyy')}</span>
            </LabelValue>
            <LabelValue label="Formatted date with time">
              <span className="font-mono text-sm">
                {formatDate(new Date(), 'MMM dd, yyyy HH:mm')}
              </span>
            </LabelValue>
          </div>
        </div>
      </div>
    );
  },
};
