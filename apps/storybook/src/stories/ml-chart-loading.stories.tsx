import type { Meta, StoryObj } from '@storybook/react-vite';
import { MLChartLoading } from '@masan-group/shared-ui/ml-chart-loading';

/**
 * ML Chart Loading Animation
 *
 * A sophisticated loading animation designed for ML/AI data processing scenarios
 * where loading times can be longer. Features multiple animation variants including
 * animated chart bars, wave patterns, pulse effects, and neural network visualizations.
 *
 * **Use Cases:**
 * - Loading machine learning predictions
 * - Processing large datasets
 * - Running AI model inference
 * - Generating analytics reports
 * - Any long-running data operations
 */
const meta = {
  title: 'Custom Components/ML Chart Loading',
  component: MLChartLoading,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A premium loading animation for ML/AI data processing with multiple variants and customization options.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['bars', 'wave', 'pulse', 'neural'],
      description: 'Animation style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the loading animation',
    },
    colorScheme: {
      control: 'select',
      options: ['primary', 'chart', 'gradient'],
      description: 'Color scheme for the animation',
    },
    showProgress: {
      control: 'boolean',
      description: 'Show progress bar indicator',
    },
    showLegend: {
      control: 'boolean',
      description: 'Show legend skeleton below chart',
    },
    showTitle: {
      control: 'boolean',
      description: 'Show title skeleton above chart',
    },
    message: {
      control: 'text',
      description: 'Custom loading message (overrides rotating messages)',
    },
  },
} satisfies Meta<typeof MLChartLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default bars animation - Animated bar chart with staggered heights
 */
export const Default: Story = {
  args: {
    variant: 'bars',
    size: 'default',
    showProgress: false,
    showLegend: true,
    showTitle: true,
    colorScheme: 'primary',
  },
};

/**
 * Bars Animation - Classic animated bar chart
 */
export const BarsAnimation: Story = {
  args: {
    variant: 'bars',
    colorScheme: 'chart',
    showProgress: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated bar chart with staggered heights and chart colors.',
      },
    },
  },
};

/**
 * Wave Animation - Flowing sine wave pattern
 */
export const WaveAnimation: Story = {
  args: {
    variant: 'wave',
    colorScheme: 'gradient',
    showProgress: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Smooth wave animation ideal for time-series data loading.',
      },
    },
  },
};

/**
 * Pulse Animation - Radiating circles from center
 */
export const PulseAnimation: Story = {
  args: {
    variant: 'pulse',
    showProgress: true,
    message: 'Analyzing data patterns...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Pulsing circles animation for a modern, clean look.',
      },
    },
  },
};

/**
 * Neural Network Animation - Network nodes with flowing data
 */
export const NeuralAnimation: Story = {
  args: {
    variant: 'neural',
    showProgress: true,
    statusMessages: [
      'Initializing neural network...',
      'Loading model weights...',
      'Processing input features...',
      'Running forward pass...',
      'Computing predictions...',
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Neural network visualization with animated nodes and data flow. Perfect for AI/ML applications.',
      },
    },
  },
};

/**
 * Small Size - Compact loading animation
 */
export const SmallSize: Story = {
  args: {
    variant: 'bars',
    size: 'sm',
    showProgress: true,
    showLegend: false,
  },
};

/**
 * Large Size - Expanded loading animation
 */
export const LargeSize: Story = {
  args: {
    variant: 'neural',
    size: 'lg',
    showProgress: true,
    colorScheme: 'gradient',
  },
};

/**
 * Custom Status Messages - Rotating through custom messages
 */
export const CustomMessages: Story = {
  args: {
    variant: 'bars',
    showProgress: true,
    statusMessages: [
      'Fetching historical data...',
      'Calculating trends...',
      'Building prediction model...',
      'Generating forecast...',
      'Optimizing accuracy...',
    ],
  },
};

/**
 * Minimal - Without title and legend
 */
export const Minimal: Story = {
  args: {
    variant: 'pulse',
    showTitle: false,
    showLegend: false,
    showProgress: false,
    message: 'Loading...',
    chartHeight: 'h-[200px]',
  },
};

/**
 * All Variants Comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Bars</h3>
        <MLChartLoading variant="bars" colorScheme="chart" showProgress />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Wave</h3>
        <MLChartLoading variant="wave" colorScheme="gradient" showProgress />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Pulse</h3>
        <MLChartLoading variant="pulse" showProgress />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Neural</h3>
        <MLChartLoading variant="neural" showProgress />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of all animation variants.',
      },
    },
  },
};

/**
 * Color Schemes Comparison
 */
export const ColorSchemes: Story = {
  render: () => (
    <div className="grid gap-8 lg:grid-cols-3">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Primary</h3>
        <MLChartLoading variant="bars" colorScheme="primary" showTitle={false} showLegend={false} />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Chart Colors</h3>
        <MLChartLoading variant="bars" colorScheme="chart" showTitle={false} showLegend={false} />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Gradient</h3>
        <MLChartLoading
          variant="bars"
          colorScheme="gradient"
          showTitle={false}
          showLegend={false}
        />
      </div>
    </div>
  ),
};

/**
 * Size Comparison
 */
export const SizeComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Small</h3>
        <MLChartLoading variant="bars" size="sm" showLegend={false} />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Default</h3>
        <MLChartLoading variant="bars" size="default" showLegend={false} />
      </div>
      <div>
        <h3 className="mb-4 font-semibold text-lg">Large</h3>
        <MLChartLoading variant="bars" size="lg" showLegend={false} />
      </div>
    </div>
  ),
};

/**
 * Dashboard Integration Example
 */
export const DashboardExample: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl">ML Analytics Dashboard</h2>
          <p className="text-muted-foreground text-sm">Real-time prediction insights</p>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-8 w-16 animate-pulse rounded bg-muted" />
            <div className="mt-1 h-3 w-24 animate-pulse rounded bg-muted/60" />
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MLChartLoading
          variant="bars"
          colorScheme="chart"
          showProgress
          statusMessages={[
            'Loading revenue predictions...',
            'Processing sales data...',
            'Generating forecast...',
          ]}
        />
        <MLChartLoading
          variant="neural"
          showProgress
          statusMessages={[
            'Analyzing customer segments...',
            'Running clustering algorithm...',
            'Identifying patterns...',
          ]}
        />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border border-border">
        <div className="border-border border-b p-4">
          <div className="h-5 w-48 animate-pulse rounded bg-muted" />
        </div>
        <div className="p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-border border-b py-3 last:border-0"
            >
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="ml-auto h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how ML Chart Loading integrates into a full dashboard layout.',
      },
    },
  },
};

/**
 * Dark Mode - Works seamlessly with dark theme
 */
export const DarkMode: Story = {
  args: {
    variant: 'neural',
    showProgress: true,
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
 * In Card Container
 */
export const InCardContainer: Story = {
  render: () => (
    <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
      <MLChartLoading
        variant="neural"
        showProgress
        showTitle
        showLegend
        statusMessages={[
          'Connecting to ML service...',
          'Loading prediction model...',
          'Analyzing input data...',
          'Generating insights...',
        ]}
      />
    </div>
  ),
};
