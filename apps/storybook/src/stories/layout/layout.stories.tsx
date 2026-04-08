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
import { MasanLogo, MasanLogoIcon } from '@masan-group/shared-ui/masan-logo';
import { ThemeProvider, LayoutSettingsProvider } from '@masan-group/shared-ui/context';
import { sampleNavGroups, sampleUser, sampleUserMenuItems } from './mock-nav-data';

/**
 * Full layout composition with sidebar, header, and content area.
 * Includes ThemeSwitch and ConfigDrawer in header actions.
 * Wrapped with ThemeProvider and LayoutSettingsProvider for functional settings.
 */
const meta = {
  title: 'layout/Layout',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <LayoutSettingsProvider>
          <Story />
        </LayoutSettingsProvider>
      </ThemeProvider>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Complete layout with sidebar, breadcrumbs, theme controls, and main content. */
export const Default: Story = {
  render: () => (
    <Layout
      sidebar={
        <AppSidebar
          navGroups={sampleNavGroups}
          header={
            <AppTitle
              title=""
              subtitle=""
              homeUrl="/"
              logo={<MasanLogo className="h-10 w-auto" />}
              collapsedLogo={<MasanLogoIcon className="size-8" />}
            />
          }
          footer={<NavUser user={sampleUser} menuItems={sampleUserMenuItems} />}
        />
      }
    >
      <AppHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', isPage: true },
        ]}
        actions={
          <>
            <ThemeSwitch />
            <ConfigDrawer />
          </>
        }
      />
      <Main>
        <div className="p-6">
          <h1 className="font-bold text-2xl">Welcome to the Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Click the gear icon in the header to open Theme Settings.
          </p>
        </div>
      </Main>
    </Layout>
  ),
};

/** Layout with sidebar initially collapsed. */
export const CollapsedSidebar: Story = {
  render: () => (
    <Layout
      defaultSidebarOpen={false}
      sidebar={
        <AppSidebar navGroups={sampleNavGroups} header={<AppTitle title="My App" homeUrl="/" />} />
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
          <p>Sidebar starts collapsed. Click the rail to expand.</p>
        </div>
      </Main>
    </Layout>
  ),
};
