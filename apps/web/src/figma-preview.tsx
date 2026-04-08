/**
 * Figma Make preview entry — standalone dashboard render (no router needed)
 * Renders the full authenticated layout + dashboard page statically.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/globals.css';

import {
  Layout,
  AppSidebar,
  AppHeader,
  NavUser,
  Main,
  ConfigDrawer,
  ThemeSwitch,
  AppTitle,
  ThemeProvider,
  LayoutSettingsProvider,
  FontProvider,
} from '@masan-group/shared-ui/layout';
import { MasanLogo, MasanLogoIcon } from '@masan-group/shared-ui/masan-logo';
import { navGroups } from '@/config/nav-data';

const sampleUser = {
  name: 'Masan User',
  email: 'user@masangroup.com',
  avatar: '',
};

function DashboardContent() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Users', value: '12,450' },
          { label: 'Revenue', value: '$48,200' },
          { label: 'Active Sessions', value: '1,823' },
          { label: 'Conversion', value: '3.6%' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border bg-card p-6 shadow-xs">
            <p className="font-medium text-muted-foreground text-sm">{label}</p>
            <p className="mt-2 font-bold text-3xl">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <FontProvider fonts={['inter', 'manrope', 'system']}>
        <LayoutSettingsProvider>
          <Layout
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
              <DashboardContent />
            </Main>
          </Layout>
        </LayoutSettingsProvider>
      </FontProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
