// External
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

// Workspace
import { AsyncWrapper } from '@masan-group/shared-ui/async-wrapper';
import { Button } from '@masan-group/shared-ui/button';
import { Card } from '@masan-group/shared-ui/card';
import { CardContent } from '@masan-group/shared-ui/card';

/**
 * A component that handles loading and empty states for async data with customizable components.
 */
const meta = {
  title: 'Custom Components/AsyncWrapper',
  component: AsyncWrapper,
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Whether the data is currently loading',
    },
    empty: {
      control: 'boolean',
      description: 'Whether the data is empty',
    },
    hideEmpty: {
      control: 'boolean',
      description: 'Hide empty state (render nothing) when empty is true',
    },
    loadingComponent: {
      control: false,
      description: 'Custom loading component to display',
    },
    emptyComponent: {
      control: false,
      description: 'Custom empty component to display',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AsyncWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default loading state with default loading component
 */
export const Loading: Story = {
  args: {
    loading: true,
    empty: false,
    children: <div>Content that will not be shown while loading</div>,
  },
};

/**
 * Default empty state with default empty component
 */
export const Empty: Story = {
  args: {
    loading: false,
    empty: true,
    children: <div>Content that will not be shown when empty</div>,
  },
};

/**
 * Content is displayed when not loading and not empty
 */
export const WithContent: Story = {
  args: {
    loading: false,
    empty: false,
    children: (
      <Card className="w-96">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Data Loaded</h3>
            <p className="text-muted-foreground text-sm">
              This is the content that displays when data is loaded and not empty.
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    ),
  },
};

/**
 * Custom loading component
 */
export const CustomLoading: Story = {
  args: {
    loading: true,
    empty: false,
    loadingComponent: (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="font-medium text-primary">Fetching data...</p>
      </div>
    ),
    children: <div>Content</div>,
  },
};

/**
 * Custom empty component
 */
export const CustomEmpty: Story = {
  args: {
    loading: false,
    empty: true,
    emptyComponent: (
      <Card className="w-96">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="rounded-full bg-muted p-4">
            <svg
              className="h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">No Items Found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your filters or add a new item.
            </p>
          </div>
          <Button>Add New Item</Button>
        </CardContent>
      </Card>
    ),
    children: <div>Content</div>,
  },
};

/**
 * Hide empty state (render nothing)
 */
export const HideEmpty: Story = {
  args: {
    loading: false,
    empty: true,
    hideEmpty: true,
    children: <div>Content</div>,
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="rounded-md border p-4">
        <p className="mb-2 font-medium text-sm">Empty state is hidden (hideEmpty=true):</p>
        <AsyncWrapper {...args} />
      </div>
      <div className="rounded-md border p-4">
        <p className="mb-2 font-medium text-sm">Empty state is shown (hideEmpty=false):</p>
        <AsyncWrapper {...args} hideEmpty={false} />
      </div>
    </div>
  ),
};

/**
 * Interactive example with state management
 */
export const Interactive: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [items, setItems] = useState<string[]>([]);

    const handleLoadData = () => {
      setLoading(true);
      setTimeout(() => {
        setItems(['Item 1', 'Item 2', 'Item 3']);
        setLoading(false);
        setEmpty(false);
      }, 1500);
    };

    const handleLoadEmpty = () => {
      setLoading(true);
      setTimeout(() => {
        setItems([]);
        setLoading(false);
        setEmpty(true);
      }, 1500);
    };

    const handleClear = () => {
      setItems([]);
      setEmpty(true);
    };

    return (
      <Card className="w-96">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={handleLoadData} disabled={loading} size="sm">
                Load Data
              </Button>
              <Button onClick={handleLoadEmpty} disabled={loading} size="sm" variant="outline">
                Load Empty
              </Button>
              <Button
                onClick={handleClear}
                disabled={loading || items.length === 0}
                size="sm"
                variant="outline"
              >
                Clear
              </Button>
            </div>
            <div className="min-h-[200px] rounded-md border">
              <AsyncWrapper loading={loading} empty={empty}>
                <div className="p-4">
                  <h3 className="mb-2 font-semibold">Items:</h3>
                  <ul className="list-inside list-disc space-y-1">
                    {items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </AsyncWrapper>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
};

/**
 * Real-world example: Table with async data
 */
export const TableExample: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);
    const [data, setData] = useState<Array<{ id: number; name: string; status: string }>>([]);

    const loadData = () => {
      setLoading(true);
      setTimeout(() => {
        setData([
          { id: 1, name: 'Product A', status: 'Active' },
          { id: 2, name: 'Product B', status: 'Pending' },
          { id: 3, name: 'Product C', status: 'Active' },
        ]);
        setLoading(false);
        setEmpty(false);
      }, 1000);
    };

    const clearData = () => {
      setData([]);
      setEmpty(true);
    };

    return (
      <div className="w-full max-w-2xl space-y-4">
        <div className="flex gap-2">
          <Button onClick={loadData} disabled={loading} size="sm">
            Load Products
          </Button>
          <Button
            onClick={clearData}
            disabled={loading || data.length === 0}
            size="sm"
            variant="outline"
          >
            Clear
          </Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <AsyncWrapper loading={loading} empty={empty}>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-4">{item.id}</td>
                      <td className="p-4">{item.name}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-primary text-xs">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AsyncWrapper>
          </CardContent>
        </Card>
      </div>
    );
  },
};
