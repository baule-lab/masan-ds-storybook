'use client';

/**
 * nav-item-renderer - recursive nav item components
 * Handles: simple links, collapsible groups, collapsed dropdown (icon-mode sidebar)
 * Router-agnostic: uses useLayoutContext().linkComponent
 */

import { ChevronRight } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/display/collapsible';
import { LongText } from '../patterns/long-text';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from '../ui/display/sidebar';
import { Badge } from '../ui/display/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/actions/dropdown-menu';
import { cn } from '../../lib/utils';
import { useLayoutContext } from './layout-context';
import { checkIsActive, flattenNavItems } from './nav-utils';
import type { NavCollapsible, NavItem, NavLink } from './types';

/** Small badge pill shown beside nav item labels */
export function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>;
}

/**
 * Recursive nav item renderer
 * Dispatches to SidebarMenuLink, SidebarMenuCollapsible, or SidebarMenuCollapsedDropdown
 */
export function NavItemRenderer({
  item,
  href,
  level = 0,
}: {
  item: NavItem;
  href: string;
  level?: number;
}) {
  const { state, isMobile } = useSidebar();
  const isCollapsible = 'items' in item && item.items && item.items.length > 0;

  if (!isCollapsible) {
    return <SidebarMenuLink item={item as NavLink} href={href} level={level} />;
  }

  if (state === 'collapsed' && !isMobile) {
    return <SidebarMenuCollapsedDropdown item={item as NavCollapsible} href={href} />;
  }

  return (
    <SidebarMenuCollapsible item={item as NavCollapsible} href={href} level={level}>
      {(item as NavCollapsible).items.map((subItem, index) => (
        <NavItemRenderer key={index} item={subItem} href={href} level={level + 1} />
      ))}
    </SidebarMenuCollapsible>
  );
}

/** Renders a leaf nav link — supports top-level (SidebarMenuItem) and sub-level */
function SidebarMenuLink({
  item,
  href,
  level = 0,
}: {
  item: NavLink;
  href: string;
  level?: number;
}) {
  const { setOpenMobile } = useSidebar();
  const { linkComponent: LinkComp } = useLayoutContext();
  const isActive = checkIsActive(href, item);

  if (level > 0) {
    return (
      <SidebarMenuSubItem>
        <LinkComp
          to={item.url}
          onClick={() => setOpenMobile(false)}
          className={cn(
            'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
            'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
            isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
          )}
        >
          <LongText className="min-w-0 text-sm">{item.title}</LongText>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </LinkComp>
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <LinkComp to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <LongText className="min-w-0 flex-1">{item.title}</LongText>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </LinkComp>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/** Renders a collapsible group — expands inline when sidebar is open */
function SidebarMenuCollapsible({
  item,
  href,
  level = 0,
  children,
}: {
  item: NavCollapsible;
  href: string;
  level?: number;
  children: ReactNode;
}) {
  const isActive = checkIsActive(href, item);
  const indentClass = level > 0 ? `pl-${level * 2}` : '';
  const chevronSize = level === 0 ? 'h-4 w-4' : 'h-3 w-3';
  // Top-level groups open by default; nested groups only if currently active
  const [open, setOpen] = useState(level === 0 ? true : isActive);

  if (level === 0) {
    return (
      <Collapsible asChild open={open} onOpenChange={setOpen} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className={indentClass}>
              {item.icon && <item.icon className={cn('h-4 w-4', open && 'text-primary')} />}
              <LongText className={cn('min-w-0 flex-1', open && 'text-primary')}>
                {item.title}
              </LongText>
              {item.badge && <NavBadge>{item.badge}</NavBadge>}
              <ChevronRight
                className={cn(
                  'ms-auto font-semibold transition-transform duration-200',
                  open && 'rotate-90',
                  chevronSize,
                  open && 'text-primary'
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="CollapsibleContent">
            <SidebarMenuSub className="mr-0! ml-1!">{children}</SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuSubItem>
      <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible relative">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className={cn('w-full', indentClass)}>
            {item.icon && <item.icon className={cn('h-3 w-3', open && 'text-primary')} />}
            <LongText className={cn('min-w-0 flex-1', open && 'text-primary')}>
              {item.title}
            </LongText>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight
              className={cn(
                'ms-auto font-semibold transition-transform duration-200',
                open && 'rotate-90',
                'h-3 w-3',
                open && 'text-primary'
              )}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub className="mr-0! ml-1!">{children}</SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuSubItem>
  );
}

/** Renders a dropdown for collapsible items when sidebar is icon-only (collapsed) */
function SidebarMenuCollapsedDropdown({ item, href }: { item: NavCollapsible; href: string }) {
  const { linkComponent: LinkComp } = useLayoutContext();
  const flattenedItems = flattenNavItems(item.items);

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={(props) => (
            <SidebarMenuButton {...props} isActive={checkIsActive(href, item)}>
              {item.icon && <item.icon />}
              <LongText className="min-w-0 flex-1">{item.title}</LongText>
              {item.badge && <NavBadge>{item.badge}</NavBadge>}
              <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          )}
        />
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title}
            {item.badge ? ` (${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {flattenedItems.map((flatItem, index) => (
            <DropdownMenuItem
              key={index}
              render={(itemProps) => (
                <LinkComp
                  {...itemProps}
                  to={flatItem.url}
                  className={cn(
                    itemProps.className,
                    checkIsActive(href, flatItem) ? 'bg-secondary' : ''
                  )}
                >
                  {flatItem.depth > 0 && (
                    <span className="opacity-0">{'  '.repeat(flatItem.depth)}</span>
                  )}
                  {flatItem.icon && <flatItem.icon />}
                  <LongText className="min-w-0 max-w-40 flex-1">{flatItem.title}</LongText>
                  {flatItem.badge && <span className="ms-auto text-xs">{flatItem.badge}</span>}
                </LinkComp>
              )}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
