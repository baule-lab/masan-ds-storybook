import { createFileRoute, Outlet, Link } from '@tanstack/react-router';
import {
  Layout,
  AppSidebar,
  AppHeader,
  NavUser,
  Main,
  ConfigDrawer,
  ThemeSwitch,
  AppTitle,
} from '@masan-group/shared-ui/layout';
import type { LinkComponentProps } from '@masan-group/shared-ui/layout';
import { MasanLogo, MasanLogoIcon } from '@masan-group/shared-ui/masan-logo';
import { navGroups } from '@/config/nav-data';

/**
 * Adapter: bridges shared-ui's simple LinkComponentProps with TanStack Router's Link.
 * Casts `to` as `string` to avoid strict route-path generics at this boundary.
 */
function RouterLink({ to, children, ...props }: LinkComponentProps) {
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
}

/**
 * Authenticated layout route — wraps all /dashboard, /settings, etc.
 * Uses shared-ui Layout with TanStack Router Link for client-side navigation.
 */
export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});

/** Sample user — replace with real auth context */
const sampleUser = {
  name: 'Masan User',
  email: 'user@masangroup.com',
  avatar: '',
};

function AuthenticatedLayout() {
  return (
    <Layout
      linkComponent={RouterLink}
      sidebar={
        <AppSidebar
          navGroups={navGroups}
          header={
            <AppTitle
              logo={<MasanLogo className="h-10 w-auto" />}
              collapsedLogo={<MasanLogoIcon className="size-8" />}
            />
          }
          footer={<NavUser user={sampleUser} />}
        />
      }
    >
      <AppHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', isPage: true },
        ]}
        fixed
        actions={
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <ConfigDrawer />
          </div>
        }
      />
      <Main>
        <Outlet />
      </Main>
    </Layout>
  );
}
