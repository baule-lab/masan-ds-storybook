import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '@masan-group/shared-ui/spinner';

/**
 * A simple loading spinner based on Loader2 icon with spin animation.
 */
const meta = {
  title: 'ui/Spinner',
  component: Spinner,
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default small spinner. */
export const Default: Story = {};

/** Different sizes using className. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner className="size-4" />
      <Spinner className="size-6" />
      <Spinner className="size-8" />
      <Spinner className="size-12" />
    </div>
  ),
};

/** Colored spinners. */
export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-6 text-primary" />
      <Spinner className="size-6 text-destructive" />
      <Spinner className="size-6 text-muted-foreground" />
      <Spinner className="size-6 text-green-500" />
    </div>
  ),
};
