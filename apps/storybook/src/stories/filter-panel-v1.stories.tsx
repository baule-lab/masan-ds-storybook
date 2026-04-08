// External
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';

// Workspace
import { FilterPanel } from '@masan-group/shared-ui/filter-panel';
import type { FilterPanelProps } from '@masan-group/shared-ui/filter-panel';

/**
 * FilterPanel V1 — A comprehensive filter panel component with main filters and collapsible advanced filters.
 * Supports tabs, selects, multi-select, tree-select, date-picker, and async options.
 *
 * For the newer version with template management and grouped advanced filters, see FilterPanel V2.
 */
const meta = {
  title: 'Custom Components/FilterPanel V1',
  component: FilterPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof FilterPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

// Mock data
const UNIT_OF_MEASURE_OPTIONS = [
  { value: 'case', label: 'cases' },
  { value: 'vnd', label: 'VND' },
];

const TIME_GRANULARITY_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const VIEW_LEVEL_OPTIONS = [
  { value: 'outlet', label: 'Outlet' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'distribution_center', label: 'Distribution Center' },
];

const REGION_OPTIONS = [
  { value: 'all', label: 'All Regions' },
  { value: 'north', label: 'Bắc' },
  { value: 'central', label: 'Trung' },
  { value: 'south', label: 'Nam' },
];

const DC_OPTIONS = [
  { value: 'all', label: 'All DCs' },
  { value: 'dc_hn', label: 'DC Hanoi' },
  { value: 'dc_hcm', label: 'DC Ho Chi Minh' },
  { value: 'dc_dn', label: 'DC Da Nang' },
];

const CHANNEL_OPTIONS = [
  { value: 'all', label: 'All Channels' },
  { value: 'gt', label: 'General Trade' },
  { value: 'mt', label: 'Modern Trade' },
  { value: 'horeca', label: 'HORECA' },
];

/**
 * Basic filter panel with tabs and select
 */
export const Default: Story = {
  args: {
    filters: [],
    values: {},
    onChange: () => {},
  },
  render: () => {
    const [filters, setFilters] = useState({
      unitOfMeasure: 'case',
      timeGranularity: 'month',
      viewLevel: 'distributor',
    });

    const mainFilters: FilterPanelProps['filters'] = [
      {
        key: 'unitOfMeasure',
        label: 'UOM',
        type: 'tabs',
        options: UNIT_OF_MEASURE_OPTIONS,
      },
      {
        key: 'timeGranularity',
        label: 'Time Granularity',
        type: 'tabs',
        options: TIME_GRANULARITY_OPTIONS,
      },
      {
        key: 'viewLevel',
        label: 'View Level',
        type: 'select',
        asyncSelectProps: {
          options: VIEW_LEVEL_OPTIONS,
          placeholder: 'Select view level',
          enableLocalFilter: true,
        },
      },
    ];

    const handleFilterChange = (key: string, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      action('filter changed')({ key, value });
    };

    return (
      <div className="w-full max-w-6xl">
        <FilterPanel filters={mainFilters} values={filters} onChange={handleFilterChange} />
      </div>
    );
  },
};

/**
 * Filter panel with advanced filters
 */
export const WithAdvancedFilters: Story = {
  args: {
    filters: [],
    values: {},
    onChange: () => {},
  },
  render: () => {
    const [filters, setFilters] = useState({
      unitOfMeasure: 'case',
      timeGranularity: 'month',
      viewLevel: 'distributor',
      region: 'all',
      dc: 'all',
      channel: 'all',
    });

    const mainFilters: FilterPanelProps['filters'] = [
      {
        key: 'unitOfMeasure',
        label: 'UOM',
        type: 'tabs',
        options: UNIT_OF_MEASURE_OPTIONS,
      },
      {
        key: 'timeGranularity',
        label: 'Time Granularity',
        type: 'tabs',
        options: TIME_GRANULARITY_OPTIONS,
      },
      {
        key: 'viewLevel',
        label: 'View Level',
        type: 'select',
        asyncSelectProps: {
          options: VIEW_LEVEL_OPTIONS,
          placeholder: 'Select view level',
          enableLocalFilter: true,
        },
      },
    ];

    const advancedFilters: FilterPanelProps['advancedFilters'] = [
      {
        key: 'region',
        label: 'Region',
        type: 'select',
        asyncSelectProps: {
          options: REGION_OPTIONS,
          placeholder: 'Select region',
          enableLocalFilter: true,
        },
      },
      {
        key: 'dc',
        label: 'DC',
        type: 'select',
        asyncSelectProps: {
          options: DC_OPTIONS,
          placeholder: 'Select DC',
          enableLocalFilter: true,
        },
      },
      {
        key: 'channel',
        label: 'Channel',
        type: 'select',
        asyncSelectProps: {
          options: CHANNEL_OPTIONS,
          placeholder: 'Select channel',
          enableLocalFilter: true,
        },
      },
    ];

    const handleFilterChange = (key: string, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      action('filter changed')({ key, value });
    };

    return (
      <div className="w-full max-w-6xl">
        <FilterPanel
          filters={mainFilters}
          advancedFilters={advancedFilters}
          values={filters}
          onChange={handleFilterChange}
          advancedFiltersLabel="Advanced Filters"
          advancedFiltersButton="More Filters"
        />
      </div>
    );
  },
};

/**
 * Filter panel with reset functionality
 */
export const WithReset: Story = {
  args: {
    filters: [],
    values: {},
    onChange: () => {},
  },
  render: () => {
    const defaultFilters = {
      unitOfMeasure: 'case',
      timeGranularity: 'month',
      viewLevel: 'distributor',
      region: 'all',
      dc: 'all',
      channel: 'all',
    };

    const [filters, setFilters] = useState(defaultFilters);

    const mainFilters: FilterPanelProps['filters'] = [
      {
        key: 'unitOfMeasure',
        label: 'UOM',
        type: 'tabs',
        options: UNIT_OF_MEASURE_OPTIONS,
      },
      {
        key: 'timeGranularity',
        label: 'Time Granularity',
        type: 'tabs',
        options: TIME_GRANULARITY_OPTIONS,
      },
      {
        key: 'viewLevel',
        label: 'View Level',
        type: 'select',
        asyncSelectProps: {
          options: VIEW_LEVEL_OPTIONS,
          placeholder: 'Select view level',
          enableLocalFilter: true,
        },
      },
    ];

    const advancedFilters: FilterPanelProps['advancedFilters'] = [
      {
        key: 'region',
        label: 'Region',
        type: 'select',
        asyncSelectProps: {
          options: REGION_OPTIONS,
          placeholder: 'Select region',
          enableLocalFilter: true,
        },
      },
      {
        key: 'dc',
        label: 'DC',
        type: 'select',
        asyncSelectProps: {
          options: DC_OPTIONS,
          placeholder: 'Select DC',
          enableLocalFilter: true,
        },
      },
      {
        key: 'channel',
        label: 'Channel',
        type: 'select',
        asyncSelectProps: {
          options: CHANNEL_OPTIONS,
          placeholder: 'Select channel',
          enableLocalFilter: true,
        },
      },
    ];

    const handleFilterChange = (key: string, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      action('filter changed')({ key, value });
    };

    const handleReset = () => {
      setFilters(defaultFilters);
      action('reset clicked')();
    };

    return (
      <div className="w-full max-w-6xl space-y-4">
        <FilterPanel
          filters={mainFilters}
          advancedFilters={advancedFilters}
          values={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          advancedFiltersLabel="Advanced Filters"
          advancedFiltersButton="More Filters"
          resetLabel="Reset"
        />
        <div className="rounded-md border p-4">
          <p className="mb-2 font-medium text-sm">Current Filter Values:</p>
          <pre className="text-xs">{JSON.stringify(filters, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

/**
 * Filter panel with async options (simulated)
 */
export const WithAsyncOptions: Story = {
  args: {
    filters: [],
    values: {},
    onChange: () => {},
  },
  render: () => {
    const [filters, setFilters] = useState({
      unitOfMeasure: 'case',
      timeGranularity: 'month',
      viewLevel: 'distributor',
      region: 'all',
      product: '',
    });

    const [productOptions, setProductOptions] = useState<{ value: string; label: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Simulate async loading
    const loadProducts = () => {
      setIsLoading(true);
      setTimeout(() => {
        setProductOptions([
          { value: 'prod_1', label: 'Coca-Cola 500ml' },
          { value: 'prod_2', label: 'Pepsi 330ml' },
          { value: 'prod_3', label: 'Sprite 1L' },
          { value: 'prod_4', label: 'Fanta 500ml' },
        ]);
        setIsLoading(false);
      }, 1500);
    };

    const mainFilters: FilterPanelProps['filters'] = [
      {
        key: 'unitOfMeasure',
        label: 'UOM',
        type: 'tabs',
        options: UNIT_OF_MEASURE_OPTIONS,
      },
      {
        key: 'timeGranularity',
        label: 'Time Granularity',
        type: 'tabs',
        options: TIME_GRANULARITY_OPTIONS,
      },
      {
        key: 'viewLevel',
        label: 'View Level',
        type: 'select',
        asyncSelectProps: {
          options: VIEW_LEVEL_OPTIONS,
          placeholder: 'Select view level',
          enableLocalFilter: true,
        },
      },
    ];

    const advancedFilters: FilterPanelProps['advancedFilters'] = [
      {
        key: 'region',
        label: 'Region',
        type: 'select',
        asyncSelectProps: {
          options: REGION_OPTIONS,
          placeholder: 'Select region',
          enableLocalFilter: true,
        },
      },
      {
        key: 'product',
        label: 'Product',
        type: 'select',
        asyncSelectProps: {
          options: productOptions,
          isLoading: isLoading,
          placeholder: 'Select product',
          enableLocalFilter: true,
        },
      },
    ];

    const handleFilterChange = (key: string, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      action('filter changed')({ key, value });
    };

    return (
      <div className="w-full max-w-6xl space-y-4">
        <button
          type="button"
          onClick={loadProducts}
          disabled={isLoading}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? 'Loading Products...' : 'Load Products'}
        </button>
        <FilterPanel
          filters={mainFilters}
          advancedFilters={advancedFilters}
          values={filters}
          onChange={handleFilterChange}
          advancedFiltersLabel="Advanced Filters"
          advancedFiltersButton="More Filters"
        />
      </div>
    );
  },
};

/**
 * Filter panel with custom column layout for advanced filters.
 * Demonstrates using advancedFiltersColumns prop for responsive grid.
 */
export const WithCustomColumns: Story = {
  args: {
    filters: [],
    values: {},
    onChange: () => {},
  },
  render: () => {
    const [filters, setFilters] = useState({
      unitOfMeasure: 'case',
      timeGranularity: 'month',
      region: '',
      dc: '',
      channel: '',
      product: '',
      brand: '',
      category: '',
    });

    const mainFilters: FilterPanelProps['filters'] = [
      {
        key: 'unitOfMeasure',
        label: 'UOM',
        type: 'tabs',
        options: UNIT_OF_MEASURE_OPTIONS,
      },
      {
        key: 'timeGranularity',
        label: 'Time Granularity',
        type: 'tabs',
        options: TIME_GRANULARITY_OPTIONS,
      },
    ];

    const advancedFilters: FilterPanelProps['advancedFilters'] = [
      {
        key: 'region',
        label: 'Region',
        type: 'select',
        asyncSelectProps: {
          options: REGION_OPTIONS,
          placeholder: 'Select region',
          enableLocalFilter: true,
        },
      },
      {
        key: 'dc',
        label: 'DC',
        type: 'select',
        asyncSelectProps: {
          options: DC_OPTIONS,
          placeholder: 'Select DC',
          enableLocalFilter: true,
        },
      },
      {
        key: 'channel',
        label: 'Channel',
        type: 'select',
        asyncSelectProps: {
          options: CHANNEL_OPTIONS,
          placeholder: 'Select channel',
          enableLocalFilter: true,
        },
      },
      {
        key: 'product',
        label: 'Product',
        type: 'select',
        asyncSelectProps: {
          options: [
            { value: 'prod_1', label: 'Coca-Cola 500ml' },
            { value: 'prod_2', label: 'Pepsi 330ml' },
          ],
          placeholder: 'Select product',
          enableLocalFilter: true,
        },
      },
      {
        key: 'brand',
        label: 'Brand',
        type: 'select',
        asyncSelectProps: {
          options: [
            { value: 'brand_1', label: 'Brand A' },
            { value: 'brand_2', label: 'Brand B' },
          ],
          placeholder: 'Select brand',
          enableLocalFilter: true,
        },
      },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        asyncSelectProps: {
          options: [
            { value: 'cat_1', label: 'Beverages' },
            { value: 'cat_2', label: 'Snacks' },
          ],
          placeholder: 'Select category',
          enableLocalFilter: true,
        },
      },
    ];

    const handleFilterChange = (key: string, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      action('filter changed')({ key, value });
    };

    return (
      <div className="w-full max-w-6xl space-y-4">
        <p className="text-muted-foreground text-sm">
          Advanced filters using <code>advancedFiltersColumns</code> prop with responsive config:
          <code className="ml-2 rounded bg-muted px-1">{'{ sm: 1, md: 2, lg: 3 }'}</code>
        </p>
        <FilterPanel
          filters={mainFilters}
          advancedFilters={advancedFilters}
          advancedFiltersColumns={{ sm: 1, md: 2, lg: 3 }}
          values={filters}
          onChange={handleFilterChange}
          advancedFiltersLabel="Advanced Filters (3 columns on lg)"
          advancedFiltersButton="More Filters"
        />
      </div>
    );
  },
};

/**
 * Filter panel with fixed 4 columns for advanced filters
 */
export const WithFixedColumns: Story = {
  args: {
    filters: [],
    values: {},
    onChange: () => {},
  },
  render: () => {
    const [filters, setFilters] = useState({
      unitOfMeasure: 'case',
      region: '',
      dc: '',
      channel: '',
      product: '',
    });

    const mainFilters: FilterPanelProps['filters'] = [
      {
        key: 'unitOfMeasure',
        label: 'UOM',
        type: 'tabs',
        options: UNIT_OF_MEASURE_OPTIONS,
      },
    ];

    const advancedFilters: FilterPanelProps['advancedFilters'] = [
      {
        key: 'region',
        label: 'Region',
        type: 'select',
        asyncSelectProps: {
          options: REGION_OPTIONS,
          placeholder: 'Select region',
          enableLocalFilter: true,
        },
      },
      {
        key: 'dc',
        label: 'DC',
        type: 'select',
        asyncSelectProps: {
          options: DC_OPTIONS,
          placeholder: 'Select DC',
          enableLocalFilter: true,
        },
      },
      {
        key: 'channel',
        label: 'Channel',
        type: 'select',
        asyncSelectProps: {
          options: CHANNEL_OPTIONS,
          placeholder: 'Select channel',
          enableLocalFilter: true,
        },
      },
      {
        key: 'product',
        label: 'Product',
        type: 'select',
        asyncSelectProps: {
          options: [
            { value: 'prod_1', label: 'Coca-Cola 500ml' },
            { value: 'prod_2', label: 'Pepsi 330ml' },
          ],
          placeholder: 'Select product',
          enableLocalFilter: true,
        },
      },
    ];

    const handleFilterChange = (key: string, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      action('filter changed')({ key, value });
    };

    return (
      <div className="w-full max-w-6xl space-y-4">
        <p className="text-muted-foreground text-sm">
          Advanced filters using fixed <code>advancedFiltersColumns={4}</code> — always 4 columns
        </p>
        <FilterPanel
          filters={mainFilters}
          advancedFilters={advancedFilters}
          advancedFiltersColumns={4}
          values={filters}
          onChange={handleFilterChange}
          advancedFiltersLabel="Advanced Filters (4 columns)"
          advancedFiltersButton="Filters"
        />
      </div>
    );
  },
};

/**
 * Demonstrates sticky top behavior with animated border-radius removal.
 * Scroll down to see the FilterPanel stick to the top and lose its border-radius.
 */
export const StickyTop: Story = {
  args: {
    filters: [],
    values: {},
    onChange: () => {},
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: () => {
    const [filters, setFilters] = useState({
      unitOfMeasure: 'case',
      timeGranularity: 'month',
      viewLevel: 'distributor',
    });

    const mainFilters: FilterPanelProps['filters'] = [
      {
        key: 'unitOfMeasure',
        label: 'UOM',
        type: 'tabs',
        options: UNIT_OF_MEASURE_OPTIONS,
      },
      {
        key: 'timeGranularity',
        label: 'Time Granularity',
        type: 'tabs',
        options: TIME_GRANULARITY_OPTIONS,
      },
      {
        key: 'viewLevel',
        label: 'View Level',
        type: 'select',
        asyncSelectProps: {
          options: VIEW_LEVEL_OPTIONS,
          placeholder: 'Select view level',
          enableLocalFilter: true,
        },
      },
    ];

    const handleFilterChange = (key: string, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      action('filter changed')({ key, value });
    };

    return (
      <div className="p-6">
        <div className="mb-4 rounded-md border bg-muted/30 p-4">
          <p className="text-muted-foreground text-sm">
            Scroll down to see the FilterPanel stick to the top. Border-radius animates to 0 when
            stuck.
          </p>
        </div>
        <FilterPanel
          filters={mainFilters}
          values={filters}
          onChange={handleFilterChange}
          stickyOffsetTop="top-4"
          stickyBg="bg-background"
        />
        {/* Spacer content to enable scrolling */}
        <div className="mt-6 space-y-4">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <p className="font-medium text-sm">Content block {i + 1}</p>
              <p className="text-muted-foreground text-sm">
                Scroll to see sticky behavior. The filter panel sticks to the top and its
                border-radius transitions to 0.
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * Minimal filter panel (no advanced filters, no reset)
 */
export const Minimal: Story = {
  args: {
    filters: [],
    values: {},
    onChange: () => {},
  },
  render: () => {
    const [filters, setFilters] = useState({
      timeGranularity: 'month',
    });

    const mainFilters: FilterPanelProps['filters'] = [
      {
        key: 'timeGranularity',
        label: 'Time Granularity',
        type: 'tabs',
        options: TIME_GRANULARITY_OPTIONS,
      },
    ];

    const handleFilterChange = (key: string, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      action('filter changed')({ key, value });
    };

    return (
      <div className="w-full max-w-4xl">
        <FilterPanel filters={mainFilters} values={filters} onChange={handleFilterChange} />
      </div>
    );
  },
};
