// External
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';

// Workspace
import { AsyncSelect } from '@masan-group/shared-ui/async-select';
import { Label } from '@masan-group/shared-ui/label';
import type { AsyncSelectOption } from '@masan-group/shared-ui/async-select';

/**
 * An async select component with search and infinite scroll for loading large datasets from APIs.
 * Features debounced search, intersection observer for infinite loading, and loading states.
 */
const meta = {
  title: 'Custom Components/AsyncSelect',
  component: AsyncSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AsyncSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

// Mock data - simulating a large dataset
const ALL_PRODUCTS: AsyncSelectOption[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  const brands = ['Coca-Cola', 'Pepsi', 'Sprite', 'Fanta', 'Aquafina'];
  const sizes = ['500ml', '1L', '330ml', '2L'];
  return {
    value: `product_${id}`,
    label: `Product ${id} - ${brands[i % brands.length]} ${sizes[i % sizes.length]}`,
  };
});

const ALL_USERS: AsyncSelectOption[] = Array.from({ length: 120 }, (_, i) => {
  const id = i + 1;
  const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[i % lastNames.length];
  return {
    value: `user_${id}`,
    label: `${firstName} ${lastName} - user${id}@example.com`,
  };
});

// Paginate and filter options - NEVER modify label
const paginateOptions = (
  allOptions: AsyncSelectOption[],
  search: string,
  page: number,
  pageSize: number
): { options: AsyncSelectOption[]; hasMore: boolean } => {
  // Filter by search (case-insensitive)
  const filtered = search
    ? allOptions.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()))
    : allOptions;

  // Paginate
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);

  return {
    options: paginated,
    hasMore: end < filtered.length,
  };
};

// Mock API call with delay
const mockApiCall = async <T,>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

/**
 * Basic async select with infinite scroll
 */
export const Default: Story = {
  args: {
    placeholder: 'Select a product...',
    searchPlaceholder: 'Search products...',
    options: ALL_PRODUCTS,
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-96 space-y-3">
        <Label>Product</Label>
        <AsyncSelect
          {...args}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            action('value changed')(newValue);
          }}
        />
        <p className="text-muted-foreground text-sm">Selected: {value || 'None'}</p>
      </div>
    );
  },
};

/**
 * Async select with search functionality
 */
export const WithSearch: Story = {
  args: {
    placeholder: 'Select a user...',
    searchPlaceholder: 'Search by name or email...',
    options: ALL_USERS,
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-96 space-y-3">
        <Label>User</Label>
        <AsyncSelect
          {...args}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            action('value changed')(newValue);
          }}
        />
        <p className="text-muted-foreground text-sm">Selected: {value || 'None'}</p>
      </div>
    );
  },
};

/**
 * Async select with fast debounce
 */
export const FastDebounce: Story = {
  args: {
    placeholder: 'Select a product...',
    searchPlaceholder: 'Type to search (fast)...',
    options: ALL_PRODUCTS,
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-96 space-y-3">
        <Label>Product (Fast Debounce - 100ms)</Label>
        <AsyncSelect
          {...args}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            action('value changed')(newValue);
          }}
        />
        <p className="text-muted-foreground text-sm">Selected: {value || 'None'}</p>
      </div>
    );
  },
};

const REGIONS: AsyncSelectOption[] = [
  { value: 'north', label: 'North Region' },
  { value: 'south', label: 'South Region' },
  { value: 'central', label: 'Central Region' },
  { value: 'east', label: 'East Region' },
  { value: 'west', label: 'West Region' },
];
/**
 * Async select with limited results (no infinite scroll)
 */
export const LimitedResults: Story = {
  args: {
    placeholder: 'Select a region...',
    searchPlaceholder: 'Search regions...',
    options: REGIONS,
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');

    const loadOptions = async (search: string, page: number) => {
      action('loadOptions')({ search, page });

      // Only return results for page 1
      if (page > 1) {
        return mockApiCall({ options: [], hasMore: false }, 300);
      }

      const filtered = search
        ? REGIONS.filter((r) => r.label.toLowerCase().includes(search.toLowerCase()))
        : REGIONS;

      return mockApiCall({ options: filtered, hasMore: false }, 300);
    };

    return (
      <div className="w-96 space-y-3">
        <Label>Region</Label>
        <AsyncSelect
          {...args}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            action('value changed')(newValue);
          }}
        />
        <p className="text-muted-foreground text-sm">Selected: {value || 'None'}</p>
      </div>
    );
  },
};

/**
 * Disabled async select
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Select a product...',
    searchPlaceholder: 'Search products...',
    disabled: true,
    options: ALL_PRODUCTS,
  },
  render: (args) => {
    return (
      <div className="w-96 space-y-3">
        <Label>Product (Disabled)</Label>
        <AsyncSelect {...args} />
      </div>
    );
  },
};

/**
 * Async select with custom empty and loading text
 */
export const CustomText: Story = {
  args: {
    placeholder: 'Chọn sản phẩm...',
    searchPlaceholder: 'Tìm kiếm sản phẩm...',
    emptyText: 'Không tìm thấy kết quả',
    loadingText: 'Đang tải...',
    options: ALL_PRODUCTS,
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');

    return (
      <div className="w-96 space-y-3">
        <Label>Sản phẩm</Label>
        <AsyncSelect
          {...args}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            action('value changed')(newValue);
          }}
        />
        <p className="text-muted-foreground text-sm">Đã chọn: {value || 'Chưa chọn'}</p>
      </div>
    );
  },
};
