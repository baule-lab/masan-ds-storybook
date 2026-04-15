import { ChevronsUpDown } from 'lucide-react';
import { useLayoutContext } from '@masan-group/shared-ui/layout';
import { MasanLogo, MasanLogoIcon } from '@masan-group/shared-ui/masan-logo';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@masan-group/shared-ui/sidebar';

export function SidebarCompanyHeader() {
  const { linkComponent: LinkComp } = useLayoutContext();
  const { setOpenMobile, state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="h-auto justify-center py-3 hover:bg-transparent active:bg-transparent"
          asChild
        >
          <LinkComp to="/dashboard" onClick={() => setOpenMobile(false)}>
            {isCollapsed ? (
              <MasanLogoIcon className="size-8" />
            ) : (
              <MasanLogo className="h-12 w-auto" />
            )}
          </LinkComp>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {!isCollapsed && (
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="h-auto items-start justify-between rounded-xl px-3 py-3"
          >
            <div className="grid min-w-0 flex-1 text-left leading-tight">
              <span className="truncate font-semibold text-primary">MCH</span>
              <span className="truncate text-muted-foreground text-xs">
                Masan Consumer Holdings
              </span>
            </div>
            <ChevronsUpDown className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
