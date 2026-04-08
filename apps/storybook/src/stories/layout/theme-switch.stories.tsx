import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeSwitch } from '@masan-group/shared-ui/layout/theme-switch';
import { ThemeProvider } from '@masan-group/shared-ui/context';

/**
 * Quick theme toggle dropdown. Switches between System, Light, and Dark
 * themes with animated sun/moon icon.
 */
const meta = {
  title: 'layout/ThemeSwitch',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Default theme toggle button. */
export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ThemeSwitch />
      <span className="text-muted-foreground text-sm">Click to toggle theme</span>
    </div>
  ),
};
