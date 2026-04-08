import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from '@masan-group/shared-ui/empty-state';

/**
 * Empty State Component
 *
 * A comprehensive animated empty state component for displaying when there's no data.
 * Features beautiful SVG SMIL animations for various scenarios including charts, tables,
 * lists, search results, errors, permissions, and coming soon features.
 *
 * **Use Cases:**
 * - Empty data tables or lists
 * - No search results found
 * - Charts without data
 * - Error states
 * - Permission restricted content
 * - Features under development
 */
const meta = {
  title: 'Custom Components/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A beautiful animated empty state component with multiple variants for different scenarios.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['chart', 'table', 'list', 'search', 'error', 'permission', 'coming-soon'],
      description: 'The type of empty state to display',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the empty state component',
    },
    title: {
      control: 'text',
      description: 'Custom title text (overrides default)',
    },
    description: {
      control: 'text',
      description: 'Custom description text (overrides default)',
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the animated illustration',
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default - Chart empty state
 */
export const Default: Story = {
  args: {
    variant: 'chart',
    size: 'default',
    showIcon: true,
  },
};

/**
 * Empty Chart - For charts with no data
 */
export const EmptyChart: Story = {
  args: {
    variant: 'chart',
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated flat line with pulsing data points. Perfect for empty chart states.',
      },
    },
  },
};

/**
 * Empty Table - For tables with no records
 */
export const EmptyTable: Story = {
  args: {
    variant: 'table',
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated skeleton rows with shimmer effect. Ideal for empty data tables.',
      },
    },
  },
};

/**
 * Empty List - For lists with no items
 */
export const EmptyList: Story = {
  args: {
    variant: 'list',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Animated list items that fade in sequentially. Great for empty feeds or item lists.',
      },
    },
  },
};

/**
 * Empty Search - For search with no results
 */
export const EmptySearch: Story = {
  args: {
    variant: 'search',
    title: 'No results for "dashboard"',
    description: 'Try different keywords or remove some filters',
  },
  parameters: {
    docs: {
      description: {
        story: 'Magnifying glass with scanning animation. Perfect for search result pages.',
      },
    },
  },
};

/**
 * Error State - For error scenarios
 */
export const EmptyError: Story = {
  args: {
    variant: 'error',
    action: {
      label: 'Try Again',
      onClick: () => alert('Retry clicked!'),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Warning triangle with attention-grabbing pulse. Use for error states with retry option.',
      },
    },
  },
};

/**
 * Permission Restricted - For access denied scenarios
 */
export const EmptyPermission: Story = {
  args: {
    variant: 'permission',
    action: {
      label: 'Request Access',
      onClick: () => alert('Request access clicked!'),
      variant: 'outline',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Lock with shield animation. Conveys restricted access professionally.',
      },
    },
  },
};

/**
 * Coming Soon - For features under development
 */
export const EmptyComingSoon: Story = {
  args: {
    variant: 'coming-soon',
    title: 'AI Predictions',
    description: 'This exciting feature is coming in the next release',
  },
  parameters: {
    docs: {
      description: {
        story: 'Rocket with twinkling stars. Creates excitement for upcoming features.',
      },
    },
  },
};

/**
 * With Action Button - Shows how to add call-to-action
 */
export const WithAction: Story = {
  args: {
    variant: 'list',
    title: 'No items yet',
    description: 'Create your first item to get started',
    action: {
      label: 'Create Item',
      onClick: () => alert('Create clicked!'),
    },
  },
};

/**
 * With Outline Button
 */
export const WithOutlineAction: Story = {
  args: {
    variant: 'search',
    action: {
      label: 'Clear Filters',
      onClick: () => alert('Clear filters clicked!'),
      variant: 'outline',
    },
  },
};

/**
 * With Ghost Button
 */
export const WithGhostAction: Story = {
  args: {
    variant: 'error',
    action: {
      label: 'Go Back',
      onClick: () => alert('Go back clicked!'),
      variant: 'ghost',
    },
  },
};

/**
 * Small Size - Compact version
 */
export const SmallSize: Story = {
  args: {
    variant: 'chart',
    size: 'sm',
  },
};

/**
 * Large Size - Expanded version
 */
export const LargeSize: Story = {
  args: {
    variant: 'chart',
    size: 'lg',
  },
};

/**
 * Without Icon - Text only
 */
export const WithoutIcon: Story = {
  args: {
    variant: 'table',
    showIcon: false,
    action: {
      label: 'Import Data',
      onClick: () => {},
    },
  },
};

/**
 * Custom Content - Override defaults
 */
export const CustomContent: Story = {
  args: {
    variant: 'chart',
    title: 'Sales data unavailable',
    description:
      'The sales report will be generated once transactions are recorded for this period.',
  },
};

/**
 * All Variants - Side by side comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-center font-semibold text-muted-foreground text-sm">Chart</h3>
        <EmptyState variant="chart" size="sm" />
      </div>
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-center font-semibold text-muted-foreground text-sm">Table</h3>
        <EmptyState variant="table" size="sm" />
      </div>
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-center font-semibold text-muted-foreground text-sm">List</h3>
        <EmptyState variant="list" size="sm" />
      </div>
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-center font-semibold text-muted-foreground text-sm">Search</h3>
        <EmptyState variant="search" size="sm" />
      </div>
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-center font-semibold text-muted-foreground text-sm">Error</h3>
        <EmptyState variant="error" size="sm" />
      </div>
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 text-center font-semibold text-muted-foreground text-sm">Permission</h3>
        <EmptyState variant="permission" size="sm" />
      </div>
      <div className="col-span-full rounded-lg border border-border p-4 md:col-span-2 lg:col-span-3">
        <h3 className="mb-4 text-center font-semibold text-muted-foreground text-sm">
          Coming Soon
        </h3>
        <EmptyState variant="coming-soon" size="sm" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all seven variants.',
      },
    },
  },
};

/**
 * Size Comparison - All sizes
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 font-semibold text-lg">Small</h3>
        <EmptyState variant="chart" size="sm" />
      </div>
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 font-semibold text-lg">Default</h3>
        <EmptyState variant="chart" size="default" />
      </div>
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-4 font-semibold text-lg">Large</h3>
        <EmptyState variant="chart" size="lg" />
      </div>
    </div>
  ),
};

/**
 * In Card Container - Real-world usage
 */
export const InCardContainer: Story = {
  render: () => (
    <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Revenue Analytics</h2>
        <div className="flex gap-2">
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
      <EmptyState
        variant="chart"
        title="No revenue data"
        description="Revenue data will appear here once transactions are recorded"
        action={{
          label: 'Import Data',
          onClick: () => {},
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of EmptyState integrated within a card component.',
      },
    },
  },
};

/**
 * In Table Container - Empty table example
 */
export const InTableContainer: Story = {
  render: () => (
    <div className="rounded-lg border border-border">
      <div className="flex items-center justify-between border-border border-b p-4">
        <h2 className="font-semibold">User Management</h2>
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="border-border border-b">
        <div className="grid grid-cols-4 bg-muted/30 p-3">
          <span className="font-medium text-sm">Name</span>
          <span className="font-medium text-sm">Email</span>
          <span className="font-medium text-sm">Role</span>
          <span className="font-medium text-sm">Actions</span>
        </div>
      </div>
      <EmptyState
        variant="table"
        title="No users found"
        description="Invite team members to get started"
        action={{
          label: 'Invite User',
          onClick: () => {},
        }}
      />
    </div>
  ),
};

/**
 * Search Results Page - Real-world search example
 */
export const SearchResultsPage: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 rounded-lg border border-border px-4 py-2">
          <span className="text-muted-foreground">Search: "advanced analytics"</span>
        </div>
        <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="flex gap-2">
        {['All', 'Documents', 'Users', 'Projects'].map((filter) => (
          <div key={filter} className="rounded-full border border-border px-3 py-1 text-sm">
            {filter}
          </div>
        ))}
      </div>
      <EmptyState
        variant="search"
        title='No results for "advanced analytics"'
        description="Try different keywords or check your spelling"
        action={{
          label: 'Clear Search',
          onClick: () => {},
          variant: 'outline',
        }}
      />
    </div>
  ),
};

/**
 * Dashboard Integration - Full dashboard example
 */
export const DashboardIntegration: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl">Analytics Dashboard</h2>
          <p className="text-muted-foreground text-sm">Real-time insights</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <h3 className="mb-2 font-medium">Sales Trend</h3>
          <EmptyState variant="chart" size="sm" />
        </div>
        <div className="rounded-lg border border-border p-4">
          <h3 className="mb-2 font-medium">Recent Orders</h3>
          <EmptyState
            variant="table"
            size="sm"
            title="No recent orders"
            description="Orders will appear here"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-2 font-medium">AI Insights</h3>
        <EmptyState
          variant="coming-soon"
          size="sm"
          title="AI-Powered Insights"
          description="Coming in the next release"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of multiple EmptyState variants used together in a dashboard layout.',
      },
    },
  },
};

/**
 * Dark Mode - Works seamlessly with dark theme
 */
export const DarkMode: Story = {
  args: {
    variant: 'coming-soon',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-8">
        <Story />
      </div>
    ),
  ],
};

/**
 * Error with Retry Pattern
 */
export const ErrorWithRetry: Story = {
  render: () => (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
      <EmptyState
        variant="error"
        title="Failed to load data"
        description="There was a problem connecting to the server. Please try again."
        action={{
          label: 'Retry',
          onClick: () => alert('Retrying...'),
        }}
      />
    </div>
  ),
};

/**
 * Permission with Request Access
 */
export const PermissionWithRequest: Story = {
  render: () => (
    <div className="rounded-lg border border-border bg-muted/10 p-6">
      <EmptyState
        variant="permission"
        title="Admin Access Required"
        description="This section contains sensitive data. Contact your administrator for access."
        action={{
          label: 'Request Access',
          onClick: () => alert('Access requested'),
          variant: 'outline',
        }}
      />
    </div>
  ),
};
