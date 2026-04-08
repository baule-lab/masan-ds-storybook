import type { Meta, StoryObj } from '@storybook/react-vite';
import { LabelValue } from '@masan-group/shared-ui/label-value';
import {
  CSV_SEPARATOR,
  toCSV,
  fromCSV,
  fromCSVNumbers,
  toCSVParams,
  fromCSVParams,
  toCSVPayload,
} from '@masan-group/utils';

/**
 * CSV (Comma-Separated Values) serialization utilities for API communication.
 * These functions handle conversion between arrays and comma-separated strings
 * for query parameters and API payloads.
 */
const meta = {
  title: 'Utils/csvSerializer',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Centralized CSV (Comma-Separated Values) param serialization/deserialization utilities for API communication. Used by service layer for consistent array-to-CSV conversion.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * CSV_SEPARATOR constant - The default separator used for CSV serialization
 */
export const Separator: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <LabelValue label="CSV_SEPARATOR">{`"${CSV_SEPARATOR}"`}</LabelValue>
    </div>
  ),
};

/**
 * toCSV - Serialize array to comma-separated string
 */
export const ToCSV: Story = {
  render: () => (
    <div className="w-[500px] space-y-4">
      <h3 className="font-semibold">Basic Usage</h3>
      <LabelValue label="toCSV(['a', 'b', 'c'])">{toCSV(['a', 'b', 'c'])}</LabelValue>
      <LabelValue label="toCSV([1, 2, 3])">{toCSV([1, 2, 3])}</LabelValue>
      <LabelValue label="toCSV(['MT', 'GT', 'Horeca'])">{toCSV(['MT', 'GT', 'Horeca'])}</LabelValue>

      <h3 className="mt-6 font-semibold">Edge Cases</h3>
      <LabelValue label="toCSV([])">{String(toCSV([]))}</LabelValue>
      <LabelValue label="toCSV(undefined)">{String(toCSV(undefined))}</LabelValue>
      <LabelValue label="toCSV(null)">{String(toCSV(null))}</LabelValue>

      <h3 className="mt-6 font-semibold">Auto-trimming & Filtering</h3>
      <LabelValue label="toCSV([' a ', ' b ', ' c '])">{toCSV([' a ', ' b ', ' c '])}</LabelValue>
      <LabelValue label="toCSV(['a', '', 'c'])">{toCSV(['a', '', 'c'])}</LabelValue>
      <LabelValue label="toCSV(['', '', ''])">{String(toCSV(['', '', '']))}</LabelValue>

      <h3 className="mt-6 font-semibold">Custom Config</h3>
      <LabelValue label="toCSV(['a', 'b'], { separator: ';' })">
        {toCSV(['a', 'b'], { separator: ';' })}
      </LabelValue>
      <LabelValue label="toCSV([' a ', ' b '], { trimValues: false })">
        {toCSV([' a ', ' b '], { trimValues: false })}
      </LabelValue>
      <LabelValue label="toCSV(['a', '', 'c'], { filterEmpty: false })">
        {toCSV(['a', '', 'c'], { filterEmpty: false })}
      </LabelValue>
    </div>
  ),
};

/**
 * fromCSV - Deserialize comma-separated string to array
 */
export const FromCSV: Story = {
  render: () => (
    <div className="w-[500px] space-y-4">
      <h3 className="font-semibold">Basic Usage</h3>
      <LabelValue label="fromCSV('a,b,c')">{JSON.stringify(fromCSV('a,b,c'))}</LabelValue>
      <LabelValue label="fromCSV('MT,GT,Horeca')">
        {JSON.stringify(fromCSV('MT,GT,Horeca'))}
      </LabelValue>

      <h3 className="mt-6 font-semibold">Edge Cases</h3>
      <LabelValue label="fromCSV('')">{JSON.stringify(fromCSV(''))}</LabelValue>
      <LabelValue label="fromCSV(undefined)">{JSON.stringify(fromCSV(undefined))}</LabelValue>
      <LabelValue label="fromCSV(null)">{JSON.stringify(fromCSV(null))}</LabelValue>
      <LabelValue label="fromCSV('single')">{JSON.stringify(fromCSV('single'))}</LabelValue>

      <h3 className="mt-6 font-semibold">Auto-trimming & Filtering</h3>
      <LabelValue label="fromCSV(' a , b , c ')">
        {JSON.stringify(fromCSV(' a , b , c '))}
      </LabelValue>
      <LabelValue label="fromCSV('a,,c')">{JSON.stringify(fromCSV('a,,c'))}</LabelValue>

      <h3 className="mt-6 font-semibold">Custom Config</h3>
      <LabelValue label="fromCSV('a;b;c', { separator: ';' })">
        {JSON.stringify(fromCSV('a;b;c', { separator: ';' }))}
      </LabelValue>
      <LabelValue label="fromCSV(' a , b ', { trimValues: false })">
        {JSON.stringify(fromCSV(' a , b ', { trimValues: false }))}
      </LabelValue>
      <LabelValue label="fromCSV('a,,c', { filterEmpty: false })">
        {JSON.stringify(fromCSV('a,,c', { filterEmpty: false }))}
      </LabelValue>
    </div>
  ),
};

/**
 * fromCSVNumbers - Deserialize to number array with NaN filtering
 */
export const FromCSVNumbers: Story = {
  render: () => (
    <div className="w-[500px] space-y-4">
      <h3 className="font-semibold">Basic Usage</h3>
      <LabelValue label="fromCSVNumbers('1,2,3')">
        {JSON.stringify(fromCSVNumbers('1,2,3'))}
      </LabelValue>
      <LabelValue label="fromCSVNumbers('100,200,300')">
        {JSON.stringify(fromCSVNumbers('100,200,300'))}
      </LabelValue>

      <h3 className="mt-6 font-semibold">Decimal & Negative Numbers</h3>
      <LabelValue label="fromCSVNumbers('1.5,2.5,3.5')">
        {JSON.stringify(fromCSVNumbers('1.5,2.5,3.5'))}
      </LabelValue>
      <LabelValue label="fromCSVNumbers('-1,2,-3')">
        {JSON.stringify(fromCSVNumbers('-1,2,-3'))}
      </LabelValue>

      <h3 className="mt-6 font-semibold">Auto NaN Filtering</h3>
      <LabelValue label="fromCSVNumbers('1,a,3')">
        {JSON.stringify(fromCSVNumbers('1,a,3'))}
      </LabelValue>
      <LabelValue label="fromCSVNumbers('a,b,c')">
        {JSON.stringify(fromCSVNumbers('a,b,c'))}
      </LabelValue>

      <h3 className="mt-6 font-semibold">Edge Cases</h3>
      <LabelValue label="fromCSVNumbers('')">{JSON.stringify(fromCSVNumbers(''))}</LabelValue>
      <LabelValue label="fromCSVNumbers(undefined)">
        {JSON.stringify(fromCSVNumbers(undefined))}
      </LabelValue>
    </div>
  ),
};

/**
 * toCSVParams - Batch convert filter object fields to CSV
 */
export const ToCSVParams: Story = {
  render: () => {
    const example1 = toCSVParams({
      brand: ['A', 'B'],
      region: ['North', 'South'],
    });

    const example2 = toCSVParams({
      brand: ['A', 'B'],
      empty: [],
    });

    const example3 = toCSVParams({
      brand: ['A', 'B'],
      missing: undefined,
    });

    const example4 = toCSVParams({ ids: [1, 2, 3] });

    return (
      <div className="w-[600px] space-y-6">
        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Convert multiple fields</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{`{ brand: ['A', 'B'], region: ['North', 'South'] }`}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example1, null, 2)}</pre>
          </LabelValue>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Empty arrays excluded</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{`{ brand: ['A', 'B'], empty: [] }`}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example2, null, 2)}</pre>
          </LabelValue>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Undefined values excluded</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{`{ brand: ['A', 'B'], missing: undefined }`}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example3, null, 2)}</pre>
          </LabelValue>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Number arrays</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{'{ ids: [1, 2, 3] }'}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example4, null, 2)}</pre>
          </LabelValue>
        </div>
      </div>
    );
  },
};

/**
 * fromCSVParams - Parse multiple CSV fields from API response
 */
export const FromCSVParams: Story = {
  render: () => {
    const example1 = fromCSVParams({ brand: 'A,B', region: 'North,South' }, [
      'brand',
      'region',
    ] as const);

    const example2 = fromCSVParams({ brand: 'A,B' }, ['brand', 'region'] as const);

    const example3 = fromCSVParams({ a: null, b: undefined, c: 'x,y' }, ['a', 'b', 'c'] as const);

    return (
      <div className="w-[600px] space-y-6">
        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Parse multiple fields</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{`fromCSVParams({ brand: 'A,B', region: 'North,South' }, ['brand', 'region'])`}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example1, null, 2)}</pre>
          </LabelValue>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Missing fields return empty array</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{`fromCSVParams({ brand: 'A,B' }, ['brand', 'region'])`}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example2, null, 2)}</pre>
          </LabelValue>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Null/undefined handling</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{`fromCSVParams({ a: null, b: undefined, c: 'x,y' }, ['a', 'b', 'c'])`}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example3, null, 2)}</pre>
          </LabelValue>
        </div>
      </div>
    );
  },
};

/**
 * toCSVPayload - Recursively convert arrays in nested payload objects
 */
export const ToCSVPayload: Story = {
  render: () => {
    const example1 = toCSVPayload({
      name: 'Test',
      brands: ['A', 'B', 'C'],
    });

    const example2 = toCSVPayload({
      name: 'Test',
      outlet_scope: {
        channel: ['MT', 'GT'],
        region: ['North', 'South'],
        dc: 'DC1',
      },
      product_scope: {
        brand: ['A', 'B'],
        category: 'Food',
      },
    });

    const example3 = toCSVPayload({
      brands: [],
      regions: ['North'],
    });

    const example4 = toCSVPayload({
      a: null,
      b: undefined,
      c: 'test',
    });

    const planItems = [
      { timestamp: '2024-01', value: 100 },
      { timestamp: '2024-02', value: 200 },
    ];
    const example5 = toCSVPayload({
      name: 'Test',
      plan_items: planItems,
    });

    return (
      <div className="w-[700px] space-y-6">
        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Flat string arrays</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{`{ name: 'Test', brands: ['A', 'B', 'C'] }`}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example1, null, 2)}</pre>
          </LabelValue>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Nested objects (recursive)</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{`{
  name: 'Test',
  outlet_scope: {
    channel: ['MT', 'GT'],
    region: ['North', 'South'],
    dc: 'DC1',
  },
  product_scope: {
    brand: ['A', 'B'],
    category: 'Food',
  },
}`}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example2, null, 2)}</pre>
          </LabelValue>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Empty arrays become undefined</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{`{ brands: [], regions: ['North'] }`}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example3, null, 2)}</pre>
          </LabelValue>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Preserves null/undefined/primitives</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{`{ a: null, b: undefined, c: 'test' }`}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example4, null, 2)}</pre>
          </LabelValue>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Preserves complex arrays (objects)</h3>
          <LabelValue label="Input">
            <pre className="text-xs">{`{
  name: 'Test',
  plan_items: [
    { timestamp: '2024-01', value: 100 },
    { timestamp: '2024-02', value: 200 },
  ],
}`}</pre>
          </LabelValue>
          <LabelValue label="Output">
            <pre className="text-xs">{JSON.stringify(example5, null, 2)}</pre>
          </LabelValue>
        </div>
      </div>
    );
  },
};

/**
 * Real-world API usage examples
 */
export const RealWorldExamples: Story = {
  render: () => {
    // Example: Building query params for forecast API
    const forecastFilters = {
      channel: ['MT', 'GT'],
      region: ['North', 'South', 'Central'],
      brand: ['Omachi', 'Kokomi'],
      dc: [],
    };
    const queryParams = toCSVParams(forecastFilters);

    // Example: Parsing API response
    const apiResponse = {
      brand: 'A,B,C',
      region: 'North,South',
      ids: '1,2,3,4,5',
    };
    const parsedBrandRegion = fromCSVParams(apiResponse, ['brand', 'region'] as const);
    const parsedIds = fromCSVNumbers(apiResponse.ids);

    // Example: Submit payload conversion
    const submitPayload = toCSVPayload({
      name: 'Q1 Forecast',
      start_date: '2024-01-01',
      end_date: '2024-03-31',
      outlet_scope: {
        channel: ['MT', 'GT'],
        region: ['North', 'South'],
        province: [],
      },
      product_scope: {
        brand: ['Omachi'],
        category: 'Noodles',
      },
    });

    return (
      <div className="w-[700px] space-y-6">
        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Building Query Params</h3>
          <p className="mb-2 text-muted-foreground text-sm">
            Convert filter selections to API query params
          </p>
          <LabelValue label="Filter State">
            <pre className="text-xs">{JSON.stringify(forecastFilters, null, 2)}</pre>
          </LabelValue>
          <LabelValue label="Query Params (empty arrays excluded)">
            <pre className="text-xs">{JSON.stringify(queryParams, null, 2)}</pre>
          </LabelValue>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Parsing API Response</h3>
          <p className="mb-2 text-muted-foreground text-sm">
            Parse CSV strings from API into arrays
          </p>
          <LabelValue label="API Response">
            <pre className="text-xs">{JSON.stringify(apiResponse, null, 2)}</pre>
          </LabelValue>
          <LabelValue label="Parsed Strings">
            <pre className="text-xs">{JSON.stringify(parsedBrandRegion, null, 2)}</pre>
          </LabelValue>
          <LabelValue label="Parsed Numbers">
            <pre className="text-xs">{JSON.stringify(parsedIds, null, 2)}</pre>
          </LabelValue>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="mb-3 font-semibold">Submit Payload Conversion</h3>
          <p className="mb-2 text-muted-foreground text-sm">
            Convert form data with nested objects for API submission
          </p>
          <LabelValue label="Form Data (arrays)">
            <pre className="text-xs">{`{
  name: 'Q1 Forecast',
  start_date: '2024-01-01',
  end_date: '2024-03-31',
  outlet_scope: {
    channel: ['MT', 'GT'],
    region: ['North', 'South'],
    province: [],
  },
  product_scope: {
    brand: ['Omachi'],
    category: 'Noodles',
  },
}`}</pre>
          </LabelValue>
          <LabelValue label="API Payload (CSV strings)">
            <pre className="text-xs">{JSON.stringify(submitPayload, null, 2)}</pre>
          </LabelValue>
        </div>
      </div>
    );
  },
};
