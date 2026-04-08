/**
 * Layout components barrel export
 * Router-agnostic sidebar layout system for shared-ui consumers
 */

// Context & types
export { LayoutProvider, useLayoutContext, DefaultLink } from './layout-context';
export type { LinkComponent, LinkComponentProps } from './layout-context';
export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink, UserData } from './types';

// Layout shell
export { Layout } from './layout';
export type { LayoutProps } from './layout';

// Sidebar
export { AppSidebar } from './app-sidebar';
export type { AppSidebarProps } from './app-sidebar';

// Header
export { AppHeader } from './app-header';
export type { AppHeaderProps, BreadcrumbItemData } from './app-header';
export { Header } from './header';
export type { HeaderProps } from './header';

// Nav components
export { NavGroup as NavGroupComponent } from './nav-group';
export { NavItemRenderer, NavBadge } from './nav-item-renderer';
export { NavUser } from './nav-user';
export type { NavUserProps, NavUserMenuItem } from './nav-user';
export { checkIsActive, flattenNavItems } from './nav-utils';

// App title
export { AppTitle } from './app-title';
export type { AppTitleProps } from './app-title';

// Content
export { Main } from './main';
export type { MainProps } from './main';

// Top nav
export { TopNav } from './top-nav';
export type { TopNavProps, TopNavLink } from './top-nav';

// Theme & layout settings
export { ConfigDrawer } from './config-drawer/index';
export { ThemeSwitch } from './theme-switch';
export { ThemeProvider, useTheme } from '../../context/theme-provider';
export { LayoutSettingsProvider, useLayoutSettings } from '../../context/layout-settings-provider';
export type {
  Collapsible as SidebarCollapsible,
  Variant as SidebarVariant,
} from '../../context/layout-settings-provider';
export { FontProvider, useFont } from '../../context/font-provider';
