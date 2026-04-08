'use client';

/**
 * app-title - sidebar header with logo (expanded/collapsed variants) and optional title
 * Shows `logo` when sidebar is open, `collapsedLogo` when collapsed. Logo centered.
 */

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/display/sidebar';
import { useLayoutContext } from './layout-context';

type AppTitleProps = {
  title?: string;
  subtitle?: string;
  homeUrl?: string;
  /** Logo shown when sidebar is expanded */
  logo?: React.ReactNode;
  /** Logo shown when sidebar is collapsed (icon variant) */
  collapsedLogo?: React.ReactNode;
};

export function AppTitle({ title, subtitle, homeUrl = '/', logo, collapsedLogo }: AppTitleProps) {
  const { setOpenMobile, state } = useSidebar();
  const { linkComponent: LinkComp } = useLayoutContext();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="h-auto gap-2 py-3 hover:bg-transparent active:bg-transparent"
          asChild
        >
          <LinkComp to={homeUrl} onClick={() => setOpenMobile(false)}>
            {isCollapsed && collapsedLogo ? (
              <div className="flex w-full items-center justify-center">{collapsedLogo}</div>
            ) : (
              <>
                {logo && <div className="flex w-full items-center justify-center">{logo}</div>}
                {title && (
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-bold">{title}</span>
                    {subtitle && <span className="truncate text-xs">{subtitle}</span>}
                  </div>
                )}
              </>
            )}
          </LinkComp>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export type { AppTitleProps };
