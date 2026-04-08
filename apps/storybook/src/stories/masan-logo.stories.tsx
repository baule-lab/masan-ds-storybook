import type { Meta, StoryObj } from '@storybook/react-vite';
import { MasanLogo, MasanLogoIcon } from '@masan-group/shared-ui/masan-logo';

/**
 * Masan Group brand logos with automatic dark mode support.
 * Renders different images for light/dark themes.
 */
const meta = {
  title: 'brand/MasanLogo',
  component: MasanLogo,
  tags: ['autodocs'],
} satisfies Meta<typeof MasanLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full logo for headers and landing pages. */
export const Default: Story = {};

/** Smaller icon variant for sidebars and compact spaces. */
export const Icon: Story = {
  render: () => <MasanLogoIcon className="size-8" />,
};

/** Various sizes of the icon. */
export const IconSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <MasanLogoIcon className="size-4" />
      <MasanLogoIcon className="size-6" />
      <MasanLogoIcon className="size-8" />
      <MasanLogoIcon className="size-12" />
      <MasanLogoIcon className="size-20" />
    </div>
  ),
};
