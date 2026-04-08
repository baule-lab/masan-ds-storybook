'use client';

/**
 * Layout - generic sidebar layout shell
 * Wraps SidebarProvider + SidebarInset, provides LayoutContext for router link injection
 */

import { SidebarInset, SidebarProvider } from '../ui/display/sidebar';
import { cn } from '../../lib/utils';
import { LayoutProvider } from './layout-context';
import type { LinkComponent } from './layout-context';

type LayoutProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  defaultSidebarOpen?: boolean;
  linkComponent?: LinkComponent;
  className?: string;
};

export function Layout({
  children,
  sidebar,
  defaultSidebarOpen = true,
  linkComponent,
  className,
}: LayoutProps) {
  return (
    <LayoutProvider linkComponent={linkComponent}>
      <SidebarProvider defaultOpen={defaultSidebarOpen}>
        {sidebar}
        <SidebarInset
          className={cn(
            'm-3!',
            '@container/content',
            'has-data-[layout=fixed]:h-svh',
            'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]',
            className
          )}
        >
          {children}
        </SidebarInset>
      </SidebarProvider>
    </LayoutProvider>
  );
}

export type { LayoutProps };
