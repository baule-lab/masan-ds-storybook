import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlobalLoading } from '@masan-group/shared-ui/global-loading';

/**
 * Full-screen loading indicator with animated Masan logo.
 * Used as initial app loading or route transition screen.
 */
const meta = {
  title: 'brand/GlobalLoading',
  component: GlobalLoading,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GlobalLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default loading screen. */
export const Default: Story = {};

/** With custom loading text. */
export const WithText: Story = {
  args: {
    text: 'Loading application...',
  },
};

/** Compact height for inline usage. */
export const CompactHeight: Story = {
  args: {
    className: 'h-64',
    text: 'Loading data...',
  },
};
