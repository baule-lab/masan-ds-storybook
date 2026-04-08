import type { Meta, StoryObj } from '@storybook/react-vite';
import { uniqArrayOfObjectByKey } from '@masan-group/utils';
import { LabelValue } from '@masan-group/shared-ui/label-value';

/**
 * Utility function to get unique array of objects by a specific key.
 */
const meta = {
  title: 'Utils/uniqArrayOfObjectByKey',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Returns an array of unique objects based on a specified key, keeping only the first occurrence of each unique key value.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic usage with id key
 */
export const BasicUsage: Story = {
  render: () => {
    const array = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 1, name: 'John' },
      { id: 3, name: 'Bob' },
    ];
    const result = uniqArrayOfObjectByKey(array, 'id');

    return (
      <div className="w-96 space-y-4">
        <LabelValue label="Original array">
          <pre className="text-sm">{JSON.stringify(array, null, 2)}</pre>
        </LabelValue>
        <LabelValue label="After uniqArrayOfObjectByKey(array, 'id')">
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </LabelValue>
      </div>
    );
  },
};

/**
 * Using name as the unique key
 */
export const ByName: Story = {
  render: () => {
    const array = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'John' },
      { id: 4, name: 'Jane' },
    ];
    const result = uniqArrayOfObjectByKey(array, 'name');

    return (
      <div className="w-96 space-y-4">
        <LabelValue label="Original array">
          <pre className="text-sm">{JSON.stringify(array, null, 2)}</pre>
        </LabelValue>
        <LabelValue label="After uniqArrayOfObjectByKey(array, 'name')">
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </LabelValue>
      </div>
    );
  },
};

/**
 * With complex objects containing multiple properties
 */
export const WithComplexObjects: Story = {
  render: () => {
    const array = [
      { id: 1, name: 'John', email: 'john@example.com', role: 'admin' },
      { id: 2, name: 'Jane', email: 'jane@example.com', role: 'user' },
      { id: 1, name: 'John Updated', email: 'john.new@example.com', role: 'admin' },
      { id: 3, name: 'Bob', email: 'bob@example.com', role: 'user' },
    ];
    const result = uniqArrayOfObjectByKey(array, 'id');

    return (
      <div className="w-96 space-y-4">
        <LabelValue label="Original array (4 items)">
          <pre className="text-sm">{JSON.stringify(array, null, 2)}</pre>
        </LabelValue>
        <LabelValue label="After uniqArrayOfObjectByKey(array, 'id') (3 unique items)">
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </LabelValue>
        <p className="text-muted-foreground text-sm">
          Note: The first occurrence of id=1 is kept, the second one is removed.
        </p>
      </div>
    );
  },
};

/**
 * With nested object keys
 */
export const WithNestedKeys: Story = {
  render: () => {
    const array = [
      { user: { id: 1 }, name: 'John' },
      { user: { id: 2 }, name: 'Jane' },
      { user: { id: 1 }, name: 'John Duplicate' },
    ];
    const result = uniqArrayOfObjectByKey(array, 'user');

    return (
      <div className="w-96 space-y-4">
        <LabelValue label="Original array">
          <pre className="text-sm">{JSON.stringify(array, null, 2)}</pre>
        </LabelValue>
        <LabelValue label="After uniqArrayOfObjectByKey(array, 'user')">
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </LabelValue>
      </div>
    );
  },
};

/**
 * Edge cases: empty array, single item, all unique, all duplicates
 */
export const EdgeCases: Story = {
  render: () => {
    const emptyArray: { id: number; name: string }[] = [];
    const singleItem = [{ id: 1, name: 'John' }];
    const allUnique = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' },
    ];
    const allDuplicates = [
      { id: 1, name: 'John' },
      { id: 1, name: 'Jane' },
      { id: 1, name: 'Bob' },
    ];

    return (
      <div className="w-96 space-y-4">
        <LabelValue label="Empty array">
          <pre className="text-sm">
            {JSON.stringify(uniqArrayOfObjectByKey(emptyArray, 'id'), null, 2)}
          </pre>
        </LabelValue>
        <LabelValue label="Single item">
          <pre className="text-sm">
            {JSON.stringify(uniqArrayOfObjectByKey(singleItem, 'id'), null, 2)}
          </pre>
        </LabelValue>
        <LabelValue label="All unique (no duplicates)">
          <pre className="text-sm">
            {JSON.stringify(uniqArrayOfObjectByKey(allUnique, 'id'), null, 2)}
          </pre>
        </LabelValue>
        <LabelValue label="All duplicates (same id)">
          <pre className="text-sm">
            {JSON.stringify(uniqArrayOfObjectByKey(allDuplicates, 'id'), null, 2)}
          </pre>
        </LabelValue>
      </div>
    );
  },
};

/**
 * Real-world example: Removing duplicate user roles
 */
export const RealWorldExample: Story = {
  render: () => {
    // Simulating user roles with duplicates
    const userRoles = [
      { userId: 1, roleId: 1, roleName: 'Admin' },
      { userId: 2, roleId: 2, roleName: 'User' },
      { userId: 1, roleId: 1, roleName: 'Admin' }, // Duplicate
      { userId: 3, roleId: 2, roleName: 'User' },
      { userId: 2, roleId: 3, roleName: 'Moderator' },
    ];

    const uniqueByUserId = uniqArrayOfObjectByKey(userRoles, 'userId');
    const uniqueByRoleId = uniqArrayOfObjectByKey(userRoles, 'roleId');

    return (
      <div className="w-96 space-y-4">
        <div>
          <h3 className="mb-2 font-semibold text-lg">User Roles (with duplicates)</h3>
          <div className="rounded-lg border bg-muted p-4">
            <LabelValue label="Original (5 items)">
              <pre className="text-sm">{JSON.stringify(userRoles, null, 2)}</pre>
            </LabelValue>
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-lg">Unique by User ID</h3>
          <div className="rounded-lg border bg-muted p-4">
            <LabelValue label={`Result (${uniqueByUserId.length} unique users)`}>
              <pre className="text-sm">{JSON.stringify(uniqueByUserId, null, 2)}</pre>
            </LabelValue>
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-lg">Unique by Role ID</h3>
          <div className="rounded-lg border bg-muted p-4">
            <LabelValue label={`Result (${uniqueByRoleId.length} unique roles)`}>
              <pre className="text-sm">{JSON.stringify(uniqueByRoleId, null, 2)}</pre>
            </LabelValue>
          </div>
        </div>
      </div>
    );
  },
};
