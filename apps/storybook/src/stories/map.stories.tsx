import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * MapLibre GL-based map component for displaying geographical data.
 * Requires a map style URL and MapLibre GL CSS.
 *
 * Note: Map rendering requires a valid MapLibre style URL.
 * These stories show the component structure and API.
 */
const meta = {
  title: 'Custom Components/Map',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Interactive map component built on MapLibre GL. Supports markers, cluster layers, and animated position markers. Requires maplibre-gl CSS to be loaded.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Placeholder — map requires runtime MapLibre GL context. */
export const Default: Story = {
  render: () => (
    <div className="flex h-96 w-full items-center justify-center rounded-lg border border-dashed bg-muted">
      <div className="text-center text-muted-foreground">
        <p className="font-medium text-lg">Map Component</p>
        <p className="text-sm">
          Requires MapLibre GL style URL and CSS.
          <br />
          Import from <code>@masan-group/shared-ui/map</code>
        </p>
      </div>
    </div>
  ),
};
