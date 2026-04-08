import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { ThemeProvider, LayoutSettingsProvider } from '@masan-group/shared-ui/layout';
import { FontProvider } from '@masan-group/shared-ui/context';
import { queryClient } from '@/lib/query-client';
import { router } from '@/router';
import '@/styles/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="masan-theme">
        <LayoutSettingsProvider>
          <FontProvider fonts={['inter', 'manrope', 'system']}>
            <RouterProvider router={router} />
          </FontProvider>
        </LayoutSettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
