import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { Cascader, type CascaderOption } from '@masan-group/shared-ui/cascader';
import {
  Tv,
  Smartphone,
  Camera,
  Headphones,
  Watch,
  ShoppingBag,
  Shirt,
  Package,
} from 'lucide-react';

// Sample hierarchical data - Geographic locations
const locationOptions: CascaderOption[] = [
  {
    value: 'vietnam',
    label: 'Vietnam',
    children: [
      {
        value: 'hanoi',
        label: 'Ha Noi',
        children: [
          { value: 'hoankiem', label: 'Hoan Kiem' },
          { value: 'badinh', label: 'Ba Dinh' },
          { value: 'dongda', label: 'Dong Da' },
        ],
      },
      {
        value: 'hcm',
        label: 'Ho Chi Minh',
        children: [
          { value: 'district1', label: 'District 1' },
          { value: 'district3', label: 'District 3' },
          { value: 'binhtan', label: 'Binh Tan' },
        ],
      },
      {
        value: 'danang',
        label: 'Da Nang',
        children: [
          { value: 'haichau', label: 'Hai Chau' },
          { value: 'sontra', label: 'Son Tra' },
        ],
      },
    ],
  },
  {
    value: 'usa',
    label: 'United States',
    children: [
      {
        value: 'california',
        label: 'California',
        children: [
          { value: 'sf', label: 'San Francisco' },
          { value: 'la', label: 'Los Angeles' },
          { value: 'sd', label: 'San Diego' },
        ],
      },
      {
        value: 'newyork',
        label: 'New York',
        children: [
          { value: 'nyc', label: 'New York City' },
          { value: 'buffalo', label: 'Buffalo' },
        ],
      },
    ],
  },
  {
    value: 'japan',
    label: 'Japan',
    children: [
      {
        value: 'tokyo',
        label: 'Tokyo',
        children: [
          { value: 'shibuya', label: 'Shibuya' },
          { value: 'shinjuku', label: 'Shinjuku' },
        ],
      },
      {
        value: 'osaka',
        label: 'Osaka',
        children: [
          { value: 'namba', label: 'Namba' },
          { value: 'umeda', label: 'Umeda' },
        ],
      },
    ],
  },
];

// Sample data with disabled options
const locationWithDisabled: CascaderOption[] = [
  {
    value: 'vietnam',
    label: 'Vietnam',
    children: [
      {
        value: 'hanoi',
        label: 'Ha Noi',
        children: [
          { value: 'hoankiem', label: 'Hoan Kiem' },
          { value: 'badinh', label: 'Ba Dinh', disabled: true },
          { value: 'dongda', label: 'Dong Da' },
        ],
      },
      {
        value: 'hcm',
        label: 'Ho Chi Minh',
        disabled: true,
        children: [
          { value: 'district1', label: 'District 1' },
          { value: 'district3', label: 'District 3' },
        ],
      },
    ],
  },
  {
    value: 'usa',
    label: 'United States',
    children: [
      {
        value: 'california',
        label: 'California',
        children: [
          { value: 'sf', label: 'San Francisco' },
          { value: 'la', label: 'Los Angeles', disabled: true },
        ],
      },
    ],
  },
];

// Sample data with icons for single-panel demo
const categoriesWithIcons: CascaderOption[] = [
  {
    value: 'electronics',
    label: 'Electronics',
    icon: <Tv className="h-5 w-5" />,
    children: [
      { value: 'tvs', label: 'TVs', icon: <Tv className="h-5 w-5" /> },
      { value: 'phones', label: 'Phones', icon: <Smartphone className="h-5 w-5" /> },
      { value: 'cameras', label: 'Cameras', icon: <Camera className="h-5 w-5" /> },
      { value: 'audio', label: 'Audio', icon: <Headphones className="h-5 w-5" /> },
      { value: 'wearables', label: 'Wearables', icon: <Watch className="h-5 w-5" /> },
    ],
  },
  {
    value: 'fashion',
    label: 'Fashion',
    icon: <Shirt className="h-5 w-5" />,
    children: [
      { value: 'mens', label: "Men's", icon: <Shirt className="h-5 w-5" /> },
      { value: 'womens', label: "Women's", icon: <ShoppingBag className="h-5 w-5" /> },
      { value: 'kids', label: 'Kids', icon: <Package className="h-5 w-5" /> },
    ],
  },
  {
    value: 'home',
    label: 'Home & Garden',
    icon: <Package className="h-5 w-5" />,
    children: [
      { value: 'furniture', label: 'Furniture' },
      { value: 'kitchen', label: 'Kitchen' },
      { value: 'garden', label: 'Garden' },
    ],
  },
];

/**
 * A cascading selection component for hierarchical data.
 * Supports multiple levels of nested options with click or hover expansion.
 */
const meta: Meta<typeof Cascader> = {
  title: 'ui/Cascader',
  component: Cascader,
  tags: ['autodocs'],
  argTypes: {
    expandTrigger: {
      control: 'select',
      options: ['click', 'hover'],
      description: 'How to expand child options',
    },
    navigationMode: {
      control: 'select',
      options: ['auto', 'columns', 'single-panel'],
      description: 'Navigation mode: auto (responsive), columns (desktop), single-panel (mobile)',
    },
    breadcrumbMode: {
      control: 'select',
      options: ['full', 'compact'],
      description: 'Breadcrumb display: full path or current item only (single-panel mode only)',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the entire component',
    },
    allowClear: {
      control: 'boolean',
      description: 'Show clear button when value selected',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no value selected',
    },
  },
  args: {
    onChange: fn(),
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Cascader>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default cascader with hierarchical location options.
 * Click to expand each level and select a final option.
 */
export const Default: Story = {
  args: {
    options: locationOptions,
    placeholder: 'Select location',
  },
};

/**
 * Controlled cascader with external state management.
 * The value is managed by React useState.
 */
export const Controlled: Story = {
  args: {
    options: locationOptions,
    placeholder: 'Select location',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['vietnam', 'hcm', 'district1']);
    return (
      <div className="space-y-4">
        <Cascader
          {...args}
          value={value}
          onChange={(newValue, selectedOptions) => {
            setValue(newValue);
            args.onChange?.(newValue, selectedOptions);
          }}
        />
        <p className="text-muted-foreground text-sm">
          Selected: {value.length > 0 ? value.join(' > ') : 'None'}
        </p>
      </div>
    );
  },
};

/**
 * Disabled cascader that cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    options: locationOptions,
    placeholder: 'Select location',
    disabled: true,
  },
};

/**
 * Cascader without the clear button.
 * Once selected, value can only be changed by selecting a new option.
 */
export const WithoutClear: Story = {
  args: {
    options: locationOptions,
    placeholder: 'Select location',
    allowClear: false,
    defaultValue: ['japan', 'tokyo', 'shibuya'],
  },
};

/**
 * Custom display render to format the selected value.
 * Shows custom formatting instead of default "label / label / label".
 */
export const CustomDisplayRender: Story = {
  args: {
    options: locationOptions,
    placeholder: 'Select location',
    defaultValue: ['vietnam', 'hanoi', 'hoankiem'],
    displayRender: (labels: string[], _selectedOptions: CascaderOption[]) => {
      return (
        <span className="flex items-center gap-1">
          <span className="font-medium">{labels[labels.length - 1]}</span>
          <span className="text-muted-foreground text-xs">({labels.slice(0, -1).join(', ')})</span>
        </span>
      );
    },
  },
};

/**
 * Hover to expand child options instead of clicking.
 * Provides faster navigation for experienced users.
 */
export const HoverExpand: Story = {
  args: {
    options: locationOptions,
    placeholder: 'Select location (hover to expand)',
    expandTrigger: 'hover',
  },
};

/**
 * Cascader with some disabled options in the hierarchy.
 * Disabled options cannot be selected or expanded.
 */
export const WithDisabledOptions: Story = {
  args: {
    options: locationWithDisabled,
    placeholder: 'Select location',
  },
};

/**
 * Cascader with custom width styling.
 */
export const CustomWidth: Story = {
  args: {
    options: locationOptions,
    placeholder: 'Select your region',
    className: 'w-[300px]',
  },
};

/**
 * Single-panel navigation mode for mobile-friendly drill-down experience.
 * Shows one level at a time with back button and breadcrumb navigation.
 * Best for touch interfaces and mobile devices.
 */
export const SinglePanelNavigation: Story = {
  args: {
    options: locationOptions,
    navigationMode: 'single-panel',
    placeholder: 'Select location',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Single-panel drill-down navigation with back button and breadcrumb. Ideal for mobile UX where horizontal space is limited.',
      },
    },
  },
};

/**
 * Single-panel mode with icons on each option.
 * Icons provide visual cues for category types.
 */
export const WithIcons: Story = {
  args: {
    options: categoriesWithIcons,
    navigationMode: 'single-panel',
    placeholder: 'Select category',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Single-panel navigation with icons. Each option can have an optional icon for better visual recognition.',
      },
    },
  },
};

/**
 * Compact breadcrumb mode shows only the current level name with back button.
 * Ideal for mobile UX where horizontal space is limited.
 */
export const CompactBreadcrumb: Story = {
  args: {
    options: categoriesWithIcons,
    navigationMode: 'single-panel',
    breadcrumbMode: 'compact',
    placeholder: 'Categories',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Compact breadcrumb mode shows only "[←] Current Item" instead of the full path. Best for mobile where horizontal space is limited.',
      },
    },
  },
};

/**
 * Side-by-side comparison of navigation modes.
 * Columns mode (left) shows all levels simultaneously.
 * Single-panel mode (right) shows one level at a time.
 */
export const NavigationModeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:flex-row">
      <div className="flex-1">
        <h3 className="mb-2 font-medium text-sm">Columns Mode (Desktop)</h3>
        <p className="mb-3 text-muted-foreground text-xs">All levels visible side-by-side</p>
        <Cascader
          options={categoriesWithIcons}
          navigationMode="columns"
          placeholder="Select category"
        />
      </div>
      <div className="flex-1">
        <h3 className="mb-2 font-medium text-sm">Single-Panel Mode (Mobile)</h3>
        <p className="mb-3 text-muted-foreground text-xs">Drill-down with back button</p>
        <Cascader
          options={categoriesWithIcons}
          navigationMode="single-panel"
          placeholder="Select category"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Comparison of the two navigation modes. Use `navigationMode="auto"` (default) to automatically select based on device.',
      },
    },
  },
};
