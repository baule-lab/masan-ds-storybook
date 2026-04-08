'use client';

/**
 * LayoutContext - provides router-agnostic LinkComponent to all layout children
 * Consumers set linkComponent once at layout level instead of per-component
 */

import { createContext, useContext } from 'react';

type LinkComponentProps = {
  to: string;
  children?: React.ReactNode;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: React.MouseEventHandler<any>;
  [key: string]: unknown;
};

type LinkComponent = React.ComponentType<LinkComponentProps>;

/** Fallback: plain <a> tag when no router-specific link is provided */
const DefaultLink: LinkComponent = ({ to, children, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
);

type LayoutContextValue = {
  linkComponent: LinkComponent;
};

const LayoutContext = createContext<LayoutContextValue>({
  linkComponent: DefaultLink,
});

function LayoutProvider({
  linkComponent = DefaultLink,
  children,
}: {
  linkComponent?: LinkComponent;
  children: React.ReactNode;
}) {
  return <LayoutContext.Provider value={{ linkComponent }}>{children}</LayoutContext.Provider>;
}

function useLayoutContext() {
  return useContext(LayoutContext);
}

export { LayoutProvider, useLayoutContext, DefaultLink };
export type { LinkComponent, LinkComponentProps };
