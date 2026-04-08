// External
import type { Meta, StoryObj } from '@storybook/react-vite';
import { User } from 'lucide-react';

// Workspace
import { VirtualizedList } from '@masan-group/shared-ui/virtualized-list';
import { Card, CardContent, CardHeader, CardTitle } from '@masan-group/shared-ui/card';
import { Badge } from '@masan-group/shared-ui/badge';

/**
 * A reusable virtualized list component that efficiently renders large lists
 * by only rendering items visible in the viewport.
 */
const meta = {
  title: 'Custom Components/VirtualizedList',
  component: VirtualizedList,
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: 'number',
      description: 'Height of the list container in pixels',
    },
    maxHeight: {
      control: 'number',
      description: 'Maximum height of the list container in pixels',
    },
    estimateSize: {
      control: 'number',
      description: 'Estimated size of each item in pixels',
    },
    overscan: {
      control: 'number',
      description: 'Number of items to render outside the visible viewport',
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// Sample data types
interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// Sample data generators
const generateUsers = (count: number): UserItem[] => {
  const roles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Engineer'];
  const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales'];
  const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'];

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `${names[i % names.length]} ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    department: departments[i % departments.length],
  }));
};

const generateProducts = (count: number): ProductItem[] => {
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys'];
  const products = ['Product', 'Item', 'Good', 'Merchandise', 'Article'];

  return Array.from({ length: count }, (_, i) => ({
    id: `product-${i + 1}`,
    name: `${products[i % products.length]} ${i + 1}`,
    price: Math.floor(Math.random() * 1000) + 10,
    category: categories[i % categories.length],
    inStock: Math.random() > 0.3,
  }));
};

const smallUserList = generateUsers(10);
const mediumUserList = generateUsers(100);
const largeUserList = generateUsers(1000);
const productList = generateProducts(500);

/**
 * Basic virtualized list with a small dataset
 */
export const Default: Story = {
  args: {} as any,
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User List (10 items)</CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualizedList
            data={smallUserList}
            estimateSize={60}
            height={300}
            renderItem={(item: UserItem, _index, _virtualItem) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b p-4 last:border-b-0"
                // style={{ height: virtualItem.size }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground text-sm">{item.email}</p>
                </div>
                <Badge variant="info" appearance="light">
                  {item.role}
                </Badge>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Virtualized list with a medium dataset (100 items)
 */
export const MediumDataset: Story = {
  args: {} as any,
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User List (100 items)</CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualizedList
            data={mediumUserList}
            estimateSize={60}
            height={400}
            renderItem={(item: UserItem, _index, virtualItem) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b p-4 last:border-b-0"
                // style={{ height: virtualItem.size }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground text-sm">{item.email}</p>
                </div>
                <Badge variant="info" appearance="light">
                  {item.role}
                </Badge>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Virtualized list with a large dataset (1000 items)
 * Demonstrates the performance benefit of virtualization
 */
export const LargeDataset: Story = {
  args: {} as any,
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>User List (1,000 items)</CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualizedList
            data={largeUserList}
            estimateSize={60}
            height={500}
            overscan={5}
            renderItem={(item: UserItem, _index, virtualItem) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b p-4 last:border-b-0"
                style={{ height: virtualItem.size }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground text-sm">{item.email}</p>
                </div>
                <Badge variant="info" appearance="light">
                  {item.role}
                </Badge>
              </div>
            )}
          />
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-sm">
        This list contains 1,000 items but only renders visible items, providing smooth scrolling
        performance.
      </p>
    </div>
  ),
};

/**
 * Custom item rendering with product cards
 */
export const CustomRendering: Story = {
  args: {} as any,
  render: () => (
    <div className="w-full max-w-4xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog (500 items)</CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualizedList
            data={productList}
            estimateSize={100}
            height={500}
            renderItem={(item: ProductItem, _index, virtualItem) => (
              <div
                key={item.id}
                className="border-b p-4 last:border-b-0"
                style={{ height: virtualItem.size }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.name}</p>
                      <Badge variant={item.inStock ? 'success' : 'info'} appearance="light">
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{item.category}</p>
                  </div>
                  <p className="font-semibold">${item.price}</p>
                </div>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Empty state demonstration
 */
export const EmptyState: Story = {
  args: {} as any,
  render: () => (
    <div className="w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Empty List</CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualizedList
            data={[]}
            height={300}
            estimateSize={60}
            renderItem={() => null}
            emptyState={
              <div className="flex flex-col items-center justify-center py-12">
                <User className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="font-medium text-lg text-muted-foreground">No users found</p>
                <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * Different item sizes
 */
export const VariableItemSizes: Story = {
  args: {} as any,
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Variable Item Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualizedList
            data={mediumUserList}
            height={500}
            estimateSize={(index) => {
              // Alternate between small and large items
              return index % 3 === 0 ? 80 : 60;
            }}
            renderItem={(item: UserItem, index, virtualItem) => {
              const isLarge = index % 3 === 0;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 border-b p-4 last:border-b-0 ${
                    isLarge ? 'bg-muted/50' : ''
                  }`}
                  style={{ height: virtualItem.size }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-sm">{item.email}</p>
                    {isLarge && (
                      <p className="mt-1 text-muted-foreground text-xs">{item.department}</p>
                    )}
                  </div>
                  <Badge variant="info" appearance="light">
                    {item.role}
                  </Badge>
                </div>
              );
            }}
          />
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-sm">
        Items alternate between 60px and 80px heights. Every 3rd item is larger.
      </p>
    </div>
  ),
};

/**
 * Compact list with smaller items
 */
export const Compact: Story = {
  args: {} as any,
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Compact List</CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualizedList
            data={mediumUserList}
            estimateSize={40}
            height={300}
            overscan={3}
            renderItem={(item: UserItem, _index, virtualItem) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b px-3 py-2 last:border-b-0"
                style={{ height: virtualItem.size }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-muted-foreground text-xs">{item.email}</p>
                </div>
                <Badge variant="info" appearance="light" className="text-xs">
                  {item.role}
                </Badge>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * List with custom styling and max height
 */
export const CustomStyling: Story = {
  args: {} as any,
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Custom Styled List</CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualizedList
            data={mediumUserList}
            estimateSize={60}
            maxHeight={400}
            className="rounded-lg border"
            renderItem={(item: UserItem, _index, virtualItem) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b p-4 transition-colors last:border-b-0 hover:bg-muted/50"
                style={{ height: virtualItem.size }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground text-sm">{item.email}</p>
                </div>
                <Badge variant="info" appearance="light">
                  {item.role}
                </Badge>
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * List with normalized data
 */
export const WithNormalizedData: Story = {
  args: {} as any,
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>With Normalized Data</CardTitle>
        </CardHeader>
        <CardContent>
          <VirtualizedList
            data={mediumUserList}
            estimateSize={60}
            height={400}
            withNormallizeData={true}
            normallizeDataKey="id"
            renderItem={(item: UserItem, _index, virtualItem) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b p-4 last:border-b-0"
                style={{ height: virtualItem.size }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground text-sm">{item.email}</p>
                </div>
                <Badge variant="info" appearance="light">
                  {item.role}
                </Badge>
              </div>
            )}
          />
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-sm">
        This list uses normalized data for efficient key-based lookups.
      </p>
    </div>
  ),
};
