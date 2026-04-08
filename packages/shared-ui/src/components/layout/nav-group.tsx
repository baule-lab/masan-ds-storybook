'use client';

/**
 * nav-group - renders a labeled sidebar section with its nav items
 * Accepts currentHref prop instead of reading from router
 */

import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '../ui/display/sidebar';
import { NavItemRenderer } from './nav-item-renderer';
import type { NavGroup as NavGroupType } from './types';

type NavGroupProps = NavGroupType & {
  /** Current page href for active state detection */
  currentHref?: string;
};

export function NavGroup({ title, items, currentHref = '' }: NavGroupProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <NavItemRenderer key={index} item={item} href={currentHref} level={0} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
