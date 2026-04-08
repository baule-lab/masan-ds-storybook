// External
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useRef } from 'react';
import { action } from 'storybook/actions';
import { Code, Zap, Database, Server, Globe } from 'lucide-react';

// Workspace
import { MultiSelect } from '@masan-group/shared-ui/multi-select';
import type {
  MultiSelectOption,
  MultiSelectGroup,
  MultiSelectRef,
} from '@masan-group/shared-ui/multi-select';
import { Button } from '@masan-group/shared-ui/button';
import { Label } from '@masan-group/shared-ui/label';

/**
 * A powerful and flexible multi-select component built with shadcn/ui.
 * Supports search, groups, disabled options, badges, icons, and programmatic control.
 */
const meta = {
  title: 'Custom Components/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  argTypes: {
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the entire component',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Close dropdown after each selection',
    },
    deduplicateOptions: {
      control: 'boolean',
      description: 'Automatically remove duplicate option values',
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline'],
      description: 'Button variant style',
    },
    badgeLabelMaxWidth: {
      control: 'text',
      description: 'Maximum width for badge labels (e.g., "120px", "150px")',
    },
    optionLabelMaxWidth: {
      control: 'text',
      description: 'Maximum width for option labels in dropdown (e.g., "200px", "250px")',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

// Sample options for stories
const basicOptions: MultiSelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt' },
];

const optionsWithIcons: MultiSelectOption[] = [
  {
    value: 'frontend',
    label: 'Frontend Development',
    icon: Code,
    style: { badgeColor: '#61DAFB', iconColor: '#282C34' },
  },
  {
    value: 'backend',
    label: 'Backend Development',
    icon: Server,
    style: { badgeColor: '#000000', iconColor: '#FFFFFF' },
  },
  {
    value: 'database',
    label: 'Database',
    icon: Database,
    style: { badgeColor: '#336791', iconColor: '#FFFFFF' },
  },
  {
    value: 'fullstack',
    label: 'Full Stack',
    icon: Zap,
    style: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  },
  {
    value: 'devops',
    label: 'DevOps',
    icon: Globe,
    style: { badgeColor: '#007396', iconColor: '#FFFFFF' },
  },
];

const optionsWithDisabled: MultiSelectOption[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python', disabled: true },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go', disabled: true },
  { value: 'rust', label: 'Rust' },
];

const groupedOptions: MultiSelectGroup[] = [
  {
    heading: 'Frontend Frameworks',
    options: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'angular', label: 'Angular' },
      { value: 'svelte', label: 'Svelte' },
    ],
  },
  {
    heading: 'Backend Frameworks',
    options: [
      { value: 'express', label: 'Express.js' },
      { value: 'nestjs', label: 'NestJS' },
      { value: 'fastapi', label: 'FastAPI' },
      { value: 'spring', label: 'Spring Boot' },
    ],
  },
  {
    heading: 'Database',
    options: [
      { value: 'postgresql', label: 'PostgreSQL' },
      { value: 'mongodb', label: 'MongoDB' },
      { value: 'redis', label: 'Redis' },
    ],
  },
];

/**
 * Basic multi-select with simple options
 */
export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Select technologies...',
    searchable: true,
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="w-80 space-y-3">
        <Label>Select Technologies</Label>
        <MultiSelect
          {...args}
          value={selected}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

/**
 * Multi-select with icons and custom badge styles
 */
export const WithIcons: Story = {
  args: {
    options: optionsWithIcons,
    placeholder: 'Select skills...',
    searchable: true,
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="w-80 space-y-3">
        <Label>Skills Selection</Label>
        <MultiSelect
          {...args}
          value={selected}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected {selected.length} skill{selected.length !== 1 ? 's' : ''}
        </p>
      </div>
    );
  },
};

/**
 * Multi-select with disabled options
 */
export const WithDisabledOptions: Story = {
  args: {
    options: optionsWithDisabled,
    placeholder: 'Select languages...',
    searchable: true,
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="w-80 space-y-3">
        <Label>Programming Languages</Label>
        <MultiSelect
          {...args}
          value={selected}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Some options are disabled and cannot be selected
        </p>
      </div>
    );
  },
};

/**
 * Multi-select with grouped options
 */
export const WithGroups: Story = {
  args: {
    options: groupedOptions,
    placeholder: 'Select technologies...',
    searchable: true,
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="w-80 space-y-3">
        <Label>Tech Stack</Label>
        <MultiSelect
          {...args}
          value={selected}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length} item{selected.length !== 1 ? 's' : ''}
        </p>
      </div>
    );
  },
};

/**
 * Programmatic control using ref
 */
export const WithRefControl: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Controlled via ref...',
    searchable: true,
    onChange: () => {},
  },
  render: (args) => {
    const multiSelectRef = useRef<MultiSelectRef>(null);
    const [selected, setSelected] = useState<string[]>([]);

    const handleReset = () => {
      multiSelectRef.current?.reset();
    };

    const handleClear = () => {
      multiSelectRef.current?.clear();
    };

    const handleSelectAll = () => {
      const allValues = basicOptions.map((option) => option.value);
      multiSelectRef.current?.setSelectedValues(allValues);
    };

    const handleFocus = () => {
      multiSelectRef.current?.focus();
    };

    return (
      <div className="w-80 space-y-4">
        <Label>Programmatic Control</Label>
        <MultiSelect
          {...args}
          ref={multiSelectRef}
          value={selected}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button size="sm" variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button size="sm" variant="outline" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button size="sm" variant="outline" onClick={handleFocus}>
            Focus
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length} item{selected.length !== 1 ? 's' : ''}
        </p>
      </div>
    );
  },
};

// Mock data - simulating a large dataset
const ALL_PRODUCTS: MultiSelectOption[] = Array.from({ length: 100 }, (_, i) => {
  const id = i + 1;
  const brands = ['Coca-Cola', 'Pepsi', 'Sprite', 'Fanta', 'Aquafina'];
  const sizes = ['500ml', '1L', '330ml', '2L'];
  return {
    value: `product_${id}`,
    label: `Product ${id} - ${brands[i % brands.length]} ${sizes[i % sizes.length]}`,
  };
});

const ALL_USERS: MultiSelectOption[] = Array.from({ length: 120 }, (_, i) => {
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
  allOptions: MultiSelectOption[],
  search: string,
  page: number,
  pageSize: number
): { options: MultiSelectOption[]; hasMore: boolean } => {
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
const mockApiCall = async <T,>(data: T, delay = 600): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

/**
 * Multi-select with infinite scroll and async loading
 */
export const WithInfiniteScroll: Story = {
  args: {
    options: [],
    placeholder: 'Select products...',
    searchable: true,
    onChange: () => {},
    loadOptions: async () => ({ options: [], hasMore: false }),
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);

    const loadOptions = async (search: string, page: number) => {
      action('loadOptions')({ search, page });
      const result = paginateOptions(ALL_PRODUCTS, search, page, 20);
      return mockApiCall(result);
    };

    return (
      <div className="w-96 space-y-3">
        <Label>Products (Infinite Scroll)</Label>
        <MultiSelect
          {...args}
          loadOptions={loadOptions}
          debounceMs={300}
          loadingText="Loading products..."
          loadingMoreText="Loading more products..."
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length} product
          {selected.length !== 1 ? 's' : ''}
        </p>
        <p className="text-muted-foreground text-xs">
          Scroll down to load more. Try searching for specific products.
        </p>
      </div>
    );
  },
};

/**
 * Multi-select with infinite scroll - users example
 */
export const WithInfiniteScrollUsers: Story = {
  args: {
    options: [],
    placeholder: 'Select users...',
    searchable: true,
    onChange: () => {},
    loadOptions: async () => ({ options: [], hasMore: false }),
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);

    const loadOptions = async (search: string, page: number) => {
      action('loadOptions')({ search, page });
      const result = paginateOptions(ALL_USERS, search, page, 15);
      return mockApiCall(result, 500);
    };

    return (
      <div className="w-96 space-y-3">
        <Label>Users (Infinite Scroll)</Label>
        <MultiSelect
          {...args}
          loadOptions={loadOptions}
          debounceMs={300}
          loadingText="Loading users..."
          loadingMoreText="Loading more users..."
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length} user{selected.length !== 1 ? 's' : ''}
        </p>
      </div>
    );
  },
};

/**
 * Multi-select with fast debounce infinite scroll
 */
export const WithFastDebounceInfiniteScroll: Story = {
  args: {
    options: [],
    placeholder: 'Select items...',
    searchable: true,
    onChange: () => {},
    loadOptions: async () => ({ options: [], hasMore: false }),
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);

    const loadOptions = async (search: string, page: number) => {
      action('loadOptions')({ search, page });
      const result = paginateOptions(ALL_PRODUCTS, search, page, 20);
      return mockApiCall(result, 300);
    };

    return (
      <div className="w-96 space-y-3">
        <Label>Fast Debounce (100ms)</Label>
        <MultiSelect
          {...args}
          loadOptions={loadOptions}
          debounceMs={100}
          loadingText="Loading..."
          loadingMoreText="Loading more..."
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length} item{selected.length !== 1 ? 's' : ''}
        </p>
        <p className="text-muted-foreground text-xs">
          Debounce is set to 100ms for faster search response.
        </p>
      </div>
    );
  },
};

/**
 * Multi-select with infinite scroll and custom loading texts
 */
export const WithInfiniteScrollCustomText: Story = {
  args: {
    options: [],
    placeholder: 'Chọn sản phẩm...',
    searchable: true,
    onChange: () => {},
    loadOptions: async () => ({ options: [], hasMore: false }),
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);

    const loadOptions = async (search: string, page: number) => {
      action('loadOptions')({ search, page });
      const result = paginateOptions(ALL_PRODUCTS, search, page, 20);
      return mockApiCall(result, 800);
    };

    return (
      <div className="w-96 space-y-3">
        <Label>Sản phẩm (Infinite Scroll)</Label>
        <MultiSelect
          {...args}
          loadOptions={loadOptions}
          debounceMs={300}
          loadingText="Đang tải sản phẩm..."
          loadingMoreText="Đang tải thêm sản phẩm..."
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">Đã chọn: {selected.length} sản phẩm</p>
      </div>
    );
  },
};

// Long label options for LongText demo
const longLabelOptions: MultiSelectOption[] = [
  {
    value: 'item1',
    label: 'Very Long Product Name That Should Be Truncated With Tooltip',
  },
  {
    value: 'item2',
    label: 'Another Extremely Long Label For Testing Truncation Behavior',
  },
  {
    value: 'item3',
    label: 'Short Label',
  },
  {
    value: 'item4',
    label: 'Medium Length Label Here',
  },
  {
    value: 'item5',
    label: 'This Is A Super Duper Extra Long Label That Will Definitely Overflow The Container',
  },
  {
    value: 'item6',
    label: 'Sản phẩm có tên rất dài bằng tiếng Việt để kiểm tra truncation',
  },
];

/**
 * Multi-select with long text labels demonstrating truncation and tooltip behavior.
 * Hover over truncated text to see full label in tooltip.
 */
export const WithLongText: Story = {
  args: {
    options: longLabelOptions,
    placeholder: 'Select items with long labels...',
    searchable: true,
    badgeLabelMaxWidth: '120px',
    optionLabelMaxWidth: '200px',
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="w-96 space-y-3">
        <Label>Long Text Demo</Label>
        <MultiSelect
          {...args}
          value={selected}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {selected.length} item{selected.length !== 1 ? 's' : ''}
        </p>
        <p className="text-muted-foreground text-xs">
          Hover over truncated text to see full label in tooltip.
        </p>
      </div>
    );
  },
};

/**
 * Multi-select with custom maxWidth values for badge and option labels.
 */
export const WithCustomMaxWidth: Story = {
  args: {
    options: longLabelOptions,
    placeholder: 'Custom max widths...',
    searchable: true,
    badgeLabelMaxWidth: '80px',
    optionLabelMaxWidth: '150px',
    onChange: () => {},
  },
  render: (args) => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div className="w-80 space-y-3">
        <Label>Custom MaxWidth (Badge: 80px, Options: 150px)</Label>
        <MultiSelect
          {...args}
          value={selected}
          onChange={(values) => {
            setSelected(values);
            action('value changed')(values);
          }}
        />
        <p className="text-muted-foreground text-sm">Narrower container with smaller max widths.</p>
      </div>
    );
  },
};
