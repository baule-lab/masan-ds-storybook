import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Layout,
  AppSidebar,
  AppHeader,
  AppTitle,
  NavUser,
  Main,
  ConfigDrawer,
  ThemeSwitch,
} from '@masan-group/shared-ui/layout';
import { ThemeProvider } from '@masan-group/shared-ui/context';
import { sampleNavGroups, sampleUser, sampleUserMenuItems } from './mock-nav-data';

/**
 * Theme Settings drawer with visual selectors for theme (System/Light/Dark),
 * sidebar variant (Inset/Floating/Sidebar), layout mode (Default/Compact/Full),
 * and font size slider. All settings persist to cookies.
 */
const meta = {
  title: 'layout/ConfigDrawer',
  parameters: { layout: 'fullscreen' },
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

/** ConfigDrawer integrated in a full layout with header actions. */
export const InLayout: Story = {
  render: () => (
    <Layout
      sidebar={
        <AppSidebar
          navGroups={sampleNavGroups}
          header={<AppTitle title="My App" subtitle="Dashboard" homeUrl="/" />}
          footer={<NavUser user={sampleUser} menuItems={sampleUserMenuItems} />}
        />
      }
    >
      <AppHeader
        title="Dashboard"
        actions={
          <>
            <ThemeSwitch />
            <ConfigDrawer />
          </>
        }
      />
      <Main>
        <div className="p-6">
          <h1 className="font-bold text-2xl">Theme Settings Demo</h1>
          <p className="mt-2 text-muted-foreground">
            Click the gear icon in the header to open Theme Settings.
          </p>
        </div>
      </Main>
    </Layout>
  ),
};
