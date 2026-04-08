'use client';

/**
 * top-nav - horizontal nav with mobile dropdown fallback
 * Adapted from e2e-frontend: replaced TanStack Link with useLayoutContext().linkComponent
 */

import { Menu } from 'lucide-react';
import { Button } from '../ui/actions/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/actions/dropdown-menu';
import { cn } from '../../lib/utils';
import { useLayoutContext } from './layout-context';

type TopNavLink = {
  title: string;
  href: string;
  isActive: boolean;
  disabled?: boolean;
};

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links: TopNavLink[];
};

export function TopNav({ className, links, ...props }: TopNavProps) {
  const { linkComponent: LinkComp } = useLayoutContext();

  return (
    <>
      {/* Mobile: collapsed dropdown */}
      <div className="lg:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            render={(props) => (
              <Button {...props} size="icon" variant="outline" className="md:size-7">
                <Menu />
              </Button>
            )}
          />
          <DropdownMenuContent side="bottom" align="start">
            {links.map(({ title, href, isActive, disabled }) => (
              <DropdownMenuItem
                key={`${title}-${href}`}
                disabled={disabled}
                render={(itemProps) => (
                  <LinkComp
                    {...itemProps}
                    to={href}
                    className={cn(itemProps.className, !isActive ? 'text-muted-foreground' : '')}
                  >
                    {title}
                  </LinkComp>
                )}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop: inline nav links */}
      <nav
        className={cn('hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6', className)}
        {...props}
      >
        {links.map(({ title, href, isActive, disabled }) => (
          <LinkComp
            key={`${title}-${href}`}
            to={href}
            aria-disabled={disabled}
            className={cn(
              'font-medium text-sm transition-colors hover:text-primary',
              !isActive && 'text-muted-foreground',
              disabled && 'pointer-events-none opacity-50'
            )}
          >
            {title}
          </LinkComp>
        ))}
      </nav>
    </>
  );
}

export type { TopNavProps, TopNavLink };
