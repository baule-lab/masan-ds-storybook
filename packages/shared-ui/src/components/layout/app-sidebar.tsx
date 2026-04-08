'use client';

/**
 * app-sidebar - props-driven sidebar shell
 * Accepts navGroups + optional header/footer slots. No internal data hooks.
 */

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '../ui/display/sidebar';
import { NavGroup } from './nav-group';
import { useLayoutSettings } from '../../context/layout-settings-provider';
import type { NavGroup as NavGroupType } from './types';

type AppSidebarProps = {
  navGroups: NavGroupType[];
  /** Current page href passed down for active-state detection */
  currentHref?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  /** Override collapsible from LayoutSettingsProvider */
  collapsible?: 'offcanvas' | 'icon' | 'none';
  /** Override variant from LayoutSettingsProvider */
  variant?: 'sidebar' | 'floating' | 'inset';
};

export function AppSidebar({
  navGroups,
  currentHref = '',
  header,
  footer,
  collapsible: collapsibleProp,
  variant: variantProp,
}: AppSidebarProps) {
  const settings = useLayoutSettings();
  const collapsible = collapsibleProp ?? settings.collapsible;
  const variant = variantProp ?? settings.variant;

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      {header && <SidebarHeader className="pb-0">{header}</SidebarHeader>}
      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup key={group.title} {...group} currentHref={currentHref} />
        ))}
      </SidebarContent>
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
      <SidebarRail />
    </Sidebar>
  );
}

export type { AppSidebarProps };
