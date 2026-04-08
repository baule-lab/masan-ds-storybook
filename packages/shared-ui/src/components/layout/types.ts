/**
 * Layout component types - router-agnostic, auth-free
 * URLs are plain strings (no TanStack Router LinkProps)
 */

type BaseNavItem = {
  title: string;
  badge?: string;
  icon?: React.ElementType;
  /** Additional URL patterns that trigger active state */
  actives?: string[];
};

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: NavItem[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

type NavGroup = {
  title: string;
  items: NavItem[];
};

type SidebarData = {
  navGroups: NavGroup[];
};

type UserData = {
  name: string;
  email: string;
  avatar?: string;
};

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink, UserData };
