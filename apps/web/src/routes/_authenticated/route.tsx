import { createFileRoute, Outlet, Link, useLocation } from '@tanstack/react-router';
import {
  Layout,
  AppSidebar,
  AppHeader,
  NavUser,
  Main,
  ConfigDrawer,
  ThemeSwitch,
} from '@masan-group/shared-ui/layout';
import type { LinkComponentProps } from '@masan-group/shared-ui/layout';
import { navGroups } from '@/config/nav-data';
import { SidebarCompanyHeader } from '@/components/sidebar-company-header';

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

function titleFromPath(value: string) {
  if (value === 'dashboard') {
    return 'Material Requirement Plan';
  }

  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildBreadcrumbs(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return [{ label: 'Material Requirement Plan', isPage: true }];
  }

  return parts.map((part, index) => ({
    label: titleFromPath(part),
    href: `/${parts.slice(0, index + 1).join('/')}`,
    isPage: index === parts.length - 1,
  }));
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
  const location = useLocation();
  const breadcrumbs = buildBreadcrumbs(location.pathname);

  return (
    <Layout
      linkComponent={RouterLink}
      sidebar={
        <AppSidebar
          navGroups={navGroups}
          header={<SidebarCompanyHeader />}
          footer={<NavUser user={sampleUser} />}
        />
      }
    >
      <AppHeader
        breadcrumbs={breadcrumbs}
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
