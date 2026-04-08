import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnimatedPOSMarker } from '@masan-group/shared-ui/components/features/map';

const meta = {
  title: 'Custom Components/AnimatedPOSMarker',
  component: AnimatedPOSMarker,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['healthy', 'warning', 'critical'],
      description: 'Health status determining color scheme',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Marker size variant',
    },
    count: {
      control: 'number',
      description: 'Optional count for cluster markers',
    },
    onClick: {
      action: 'clicked',
      description: 'Optional click handler',
    },
  },
} satisfies Meta<typeof AnimatedPOSMarker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default healthy marker with fire icon (single POS)
 */
export const Healthy: Story = {
  args: {
    status: 'healthy',
    size: 'md',
  },
};

/**
 * Warning status marker with fire icon
 */
export const Warning: Story = {
  args: {
    status: 'warning',
    size: 'md',
  },
};

/**
 * Critical status marker with fire icon
 */
export const Critical: Story = {
  args: {
    status: 'critical',
    size: 'md',
  },
};

/**
 * Small marker (single point - 16px inner)
 */
export const SmallSize: Story = {
  args: {
    status: 'healthy',
    size: 'sm',
  },
};

/**
 * Medium marker (small cluster <50 - 24px inner)
 */
export const MediumSize: Story = {
  args: {
    status: 'healthy',
    size: 'md',
  },
};

/**
 * Large marker (medium cluster 50-99 - 32px inner)
 */
export const LargeSize: Story = {
  args: {
    status: 'warning',
    size: 'lg',
  },
};

/**
 * Extra large marker (large cluster 100+ - 40px inner)
 */
export const ExtraLargeSize: Story = {
  args: {
    status: 'critical',
    size: 'xl',
  },
};

/**
 * Cluster marker with count display
 */
export const WithCount: Story = {
  args: {
    status: 'healthy',
    size: 'md',
    count: 42,
  },
};

/**
 * Large cluster with count
 */
export const LargeClusterWithCount: Story = {
  args: {
    status: 'warning',
    size: 'xl',
    count: 156,
  },
};

/**
 * Clickable marker with handler
 */
export const Clickable: Story = {
  args: {
    status: 'healthy',
    size: 'md',
    count: 12,
    onClick: () => alert('Marker clicked!'),
  },
};

/**
 * All status colors comparison
 */
export const AllStatuses: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <AnimatedPOSMarker status="healthy" size="md" />
        <span className="text-white text-xs">Healthy</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AnimatedPOSMarker status="warning" size="md" />
        <span className="text-white text-xs">Warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AnimatedPOSMarker status="critical" size="md" />
        <span className="text-white text-xs">Critical</span>
      </div>
    </div>
  ),
};

/**
 * All size variants comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <AnimatedPOSMarker status="healthy" size="sm" />
        <span className="text-white text-xs">SM</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AnimatedPOSMarker status="healthy" size="md" />
        <span className="text-white text-xs">MD</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AnimatedPOSMarker status="healthy" size="lg" />
        <span className="text-white text-xs">LG</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AnimatedPOSMarker status="healthy" size="xl" />
        <span className="text-white text-xs">XL</span>
      </div>
    </div>
  ),
};

/**
 * Cluster markers with varying counts
 */
export const ClusterVariants: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <AnimatedPOSMarker status="healthy" size="sm" count={5} />
        <span className="text-white text-xs">5 POS</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AnimatedPOSMarker status="warning" size="md" count={25} />
        <span className="text-white text-xs">25 POS</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AnimatedPOSMarker status="warning" size="lg" count={75} />
        <span className="text-white text-xs">75 POS</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <AnimatedPOSMarker status="critical" size="xl" count={150} />
        <span className="text-white text-xs">150 POS</span>
      </div>
    </div>
  ),
};

/**
 * Multiple markers on map-like background
 */
export const MapDemo: Story = {
  render: () => (
    <div className="relative h-96 w-96 overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      {/* Simulated map grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Markers positioned on "map" */}
      <div className="absolute top-12 left-16">
        <AnimatedPOSMarker status="healthy" size="md" count={12} />
      </div>
      <div className="absolute top-24 right-20">
        <AnimatedPOSMarker status="warning" size="lg" count={45} />
      </div>
      <div className="absolute bottom-20 left-24">
        <AnimatedPOSMarker status="critical" size="xl" count={89} />
      </div>
      <div className="absolute right-16 bottom-16">
        <AnimatedPOSMarker status="healthy" size="sm" />
      </div>
    </div>
  ),
};
