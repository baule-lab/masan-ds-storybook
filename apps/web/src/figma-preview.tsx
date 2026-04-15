/**
 * Figma Make preview entry — standalone MRP scheduling render (no router needed)
 * Renders the full authenticated layout + scheduling page statically.
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
  ThemeProvider,
  LayoutSettingsProvider,
  FontProvider,
} from '@masan-group/shared-ui/layout';
import { navGroups } from '@/config/nav-data';
import { MRPScheduler } from '@/components/mrp-scheduler';
import { SidebarCompanyHeader } from '@/components/sidebar-company-header';

const sampleUser = {
  name: 'Masan User',
  email: 'user@masangroup.com',
  avatar: '',
};

function App() {
  return (
    <ThemeProvider>
      <FontProvider fonts={['inter', 'manrope', 'system']}>
        <LayoutSettingsProvider>
          <Layout
            sidebar={
              <AppSidebar
                navGroups={navGroups}
                header={<SidebarCompanyHeader />}
                footer={<NavUser user={sampleUser} />}
              />
            }
          >
            <AppHeader
              breadcrumbs={[
                { label: 'Planning', href: '/dashboard' },
                { label: 'Material Requirement Plan', isPage: true },
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
              <MRPScheduler />
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
