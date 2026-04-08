import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavUser } from '@masan-group/shared-ui/layout/nav-user';
import { SidebarProvider, Sidebar, SidebarFooter } from '@masan-group/shared-ui/sidebar';
import { sampleUser, sampleUserMenuItems } from './mock-nav-data';

/**
 * User menu component for sidebar footer. Fully props-driven —
 * no auth dependencies. Pass user data and menu items.
 */
const meta = {
  title: 'layout/NavUser',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SidebarProvider>
        <Sidebar>
          <SidebarFooter>
            <Story />
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof NavUser>;

export default meta;
type Story = StoryObj<typeof meta>;

/** User menu with avatar and dropdown items. */
export const Default: Story = {
  render: () => <NavUser user={sampleUser} menuItems={sampleUserMenuItems} />,
};

/** User with avatar image. */
export const WithAvatar: Story = {
  render: () => (
    <NavUser
      user={{ name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150' }}
      menuItems={sampleUserMenuItems}
    />
  ),
};
