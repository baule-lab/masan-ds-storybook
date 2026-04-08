'use client';

/**
 * app-header - header with breadcrumbs or title + optional actions slot
 * Uses LayoutContext linkComponent for breadcrumb links
 */

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '../ui/display/breadcrumb';
import { useLayoutContext } from './layout-context';
import { Header } from './header';

type BreadcrumbItemData = {
  label: string;
  href?: string;
  isPage?: boolean;
};

type AppHeaderProps = {
  breadcrumbs?: BreadcrumbItemData[];
  title?: string;
  fixed?: boolean;
  actions?: React.ReactNode;
};

export function AppHeader({ breadcrumbs, title, fixed = true, actions }: AppHeaderProps) {
  const { linkComponent: LinkComp } = useLayoutContext();

  return (
    <Header fixed={fixed}>
      {breadcrumbs ? (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem className="text-base">
                  {item.isPage ? (
                    <BreadcrumbPage className="font-bold text-base">{item.label}</BreadcrumbPage>
                  ) : item.href ? (
                    <BreadcrumbLink asChild>
                      <LinkComp className="text-base" to={item.href}>
                        {item.label}
                      </LinkComp>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink className="text-base">{item.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      ) : title ? (
        <span className="font-bold text-base">{title}</span>
      ) : null}
      {actions && <div className="ms-auto flex items-center space-x-4">{actions}</div>}
    </Header>
  );
}

export type { BreadcrumbItemData, AppHeaderProps };
