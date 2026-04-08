import type { Meta, StoryObj } from '@storybook/react-vite';
import { standardizeObject } from '@masan-group/utils';

/**
 * Utility function to standardize objects by removing undefined, null, empty string, empty array, and empty object values.
 * Recursively processes nested objects and arrays.
 */
const meta = {
  title: 'Utils/standardizeObject',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Removes undefined, null, empty string, empty array, and empty object values from an object. Recursively processes nested objects and arrays.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic usage with various empty values
 */
export const BasicUsage: Story = {
  render: () => {
    const obj = {
      a: 1,
      b: undefined,
      c: '',
      d: [],
      e: {},
      f: null,
      g: 'valid',
      h: [1, 2, 3],
      i: { key: 'value' },
    };

    const standardized = standardizeObject(obj);

    return (
      <div className="w-[600px] space-y-6">
        <div>
          <h3 className="mb-4 font-semibold text-lg">Original Object</h3>
          <pre className="rounded-lg border bg-muted p-4 text-sm">
            {JSON.stringify(obj, null, 2)}
          </pre>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-lg">Standardized Object</h3>
          <pre className="rounded-lg border bg-muted p-4 text-sm">
            {JSON.stringify(standardized, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

/**
 * With nested objects - demonstrates recursive cleaning
 */
export const WithNestedObjects: Story = {
  render: () => {
    const obj = {
      name: 'John Doe',
      email: '',
      address: {
        street: '123 Main St',
        city: '',
        zip: null,
        country: {
          code: 'US',
          name: '',
          region: undefined,
        },
      },
      tags: [],
      metadata: {
        created: '2024-01-01',
        updated: '',
        author: {
          id: 123,
          name: '',
          profile: {},
        },
      },
      active: true,
    };

    const standardized = standardizeObject(obj);

    return (
      <div className="w-[600px] space-y-6">
        <div>
          <h3 className="mb-4 font-semibold text-lg">Original Object (Nested)</h3>
          <pre className="rounded-lg border bg-muted p-4 text-sm">
            {JSON.stringify(obj, null, 2)}
          </pre>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-lg">Standardized Object</h3>
          <pre className="rounded-lg border bg-muted p-4 text-sm">
            {JSON.stringify(standardized, null, 2)}
          </pre>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="font-medium text-blue-900 text-sm">
            Notice: Empty nested objects are removed recursively. The 'metadata.author.profile'
            empty object and entire 'address.country' object (after cleaning) are removed.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * With arrays containing values
 */
export const WithArrays: Story = {
  render: () => {
    const obj = {
      emptyArray: [],
      filledArray: [1, 2, 3],
      emptyString: '',
      validString: 'hello',
      number: 0,
      boolean: false,
    };

    const standardized = standardizeObject(obj);

    return (
      <div className="w-[600px] space-y-6">
        <div>
          <h3 className="mb-4 font-semibold text-lg">Original Object</h3>
          <pre className="rounded-lg border bg-muted p-4 text-sm">
            {JSON.stringify(obj, null, 2)}
          </pre>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-lg">Standardized Object</h3>
          <pre className="rounded-lg border bg-muted p-4 text-sm">
            {JSON.stringify(standardized, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
};

/**
 * With arrays of objects - demonstrates recursive cleaning within arrays
 */
export const WithArraysOfObjects: Story = {
  render: () => {
    const obj = {
      users: [
        { id: 1, name: 'Alice', email: '', metadata: {} },
        { id: 2, name: '', email: '', metadata: {} },
        { id: 3, name: 'Bob', email: 'bob@example.com', metadata: { role: 'admin' } },
      ],
      products: [
        { sku: 'ABC', price: 10, description: '', tags: [] },
        { sku: '', price: null, description: '', tags: [] },
        { sku: 'XYZ', price: 20, description: 'Product XYZ', tags: ['new'] },
      ],
      emptyUsers: [
        { name: '', email: '' },
        { name: '', email: '' },
      ],
    };

    const standardized = standardizeObject(obj);

    return (
      <div className="w-[600px] space-y-6">
        <div>
          <h3 className="mb-4 font-semibold text-lg">Original Object (Arrays of Objects)</h3>
          <pre className="rounded-lg border bg-muted p-4 text-sm">
            {JSON.stringify(obj, null, 2)}
          </pre>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-lg">Standardized Object</h3>
          <pre className="rounded-lg border bg-muted p-4 text-sm">
            {JSON.stringify(standardized, null, 2)}
          </pre>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="font-medium text-blue-900 text-sm">
            Notice: Objects within arrays are cleaned recursively. Empty objects after cleaning are
            removed from arrays. The 'emptyUsers' array becomes empty and is removed entirely.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Real-world example: Form data cleanup
 */
export const FormDataCleanup: Story = {
  render: () => {
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: '',
      phone: undefined,
      address: {
        street: '',
        city: 'New York',
        zip: null,
        coordinates: {
          lat: undefined,
          lng: undefined,
        },
      },
      interests: [],
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: undefined,
        },
        privacy: {},
      },
      age: 30,
      newsletter: false,
      socialProfiles: [
        { platform: 'twitter', url: 'https://twitter.com/john' },
        { platform: '', url: '' },
        { platform: 'linkedin', url: '' },
      ],
    };

    const cleaned = standardizeObject(formData);

    return (
      <div className="w-[600px] space-y-6">
        <div>
          <h3 className="mb-4 font-semibold text-lg">Form Data (Before)</h3>
          <pre className="rounded-lg border bg-muted p-4 text-sm">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-lg">Cleaned Form Data (After)</h3>
          <pre className="rounded-lg border bg-muted p-4 text-sm">
            {JSON.stringify(cleaned, null, 2)}
          </pre>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="font-medium text-green-900 text-sm">
            Perfect for API requests: Removes all empty/undefined values before sending to backend,
            including deep nested structures and arrays of objects.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Edge cases
 */
export const EdgeCases: Story = {
  render: () => {
    const testCases = [
      {
        name: 'All empty values',
        obj: { a: undefined, b: null, c: '', d: [], e: {} },
      },
      {
        name: 'All valid values',
        obj: { a: 1, b: 'hello', c: [1, 2], d: { key: 'value' } },
      },
      {
        name: 'Empty object',
        obj: {},
      },
      {
        name: 'Mixed with zero and false',
        obj: { a: 0, b: false, c: '', d: null },
      },
      {
        name: 'Deeply nested with only empty values',
        obj: {
          level1: {
            level2: {
              level3: {
                value: '',
                data: null,
              },
            },
          },
        },
      },
      {
        name: 'Array with all empty objects',
        obj: {
          items: [{}, { a: '' }, { b: null, c: undefined }],
        },
      },
      {
        name: 'Mixed nested arrays and objects',
        obj: {
          data: [
            { id: 1, meta: { tags: [], info: {} } },
            { id: 2, meta: { tags: ['valid'], info: { count: 5 } } },
          ],
        },
      },
    ];

    return (
      <div className="w-[600px] space-y-6">
        {testCases.map((testCase) => (
          <div key={testCase.name}>
            <h3 className="mb-4 font-semibold text-lg">{testCase.name}</h3>
            <div className="mb-2">
              <span className="font-medium text-sm">Original: </span>
              <pre className="mt-1 rounded-lg border bg-muted p-4 text-sm">
                {JSON.stringify(testCase.obj, null, 2)}
              </pre>
            </div>
            <div>
              <span className="font-medium text-sm">Standardized: </span>
              <pre className="mt-1 rounded-lg border bg-muted p-4 text-sm">
                {JSON.stringify(standardizeObject(testCase.obj), null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
