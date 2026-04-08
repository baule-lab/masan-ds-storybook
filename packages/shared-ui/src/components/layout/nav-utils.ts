/**
 * nav-utils - pure utility functions for nav active state and flattening
 * No React, no router dependencies
 */

import type { NavItem, NavLink } from './types';

/**
 * Normalizes a URL by stripping trailing slash and query params
 */
function normalizeUrl(url: string): string {
  const withoutParams = url.split('?')[0] ?? url;
  return withoutParams.endsWith('/') ? withoutParams.slice(0, -1) : withoutParams;
}

/**
 * Check if a nav item (or any of its descendants) is active.
 * Compares fully-prefixed URLs against the current href directly.
 */
export function checkIsActive(href: string, item: NavItem, mainNav = false): boolean {
  const normalizedHref = normalizeUrl(href);

  // Check explicit actives array first
  if (item.actives && item.actives.length > 0) {
    const matchesActives = item.actives.some((activeUrl) => {
      const normalizedActive = normalizeUrl(activeUrl);
      return (
        normalizedHref === normalizedActive || normalizedHref.startsWith(`${normalizedActive}/`)
      );
    });
    if (matchesActives) return true;
  }

  // Recursively check child items
  if ('items' in item && item.items) {
    if (item.items.some((child) => checkIsActive(href, child))) return true;
  }

  // Check item's own URL
  if ('url' in item && item.url) {
    const normalizedItemUrl = normalizeUrl(item.url as string);

    if (mainNav && href.includes('?')) return false;

    return (
      normalizedHref === normalizedItemUrl ||
      normalizedHref.startsWith(`${normalizedItemUrl}/`) ||
      (mainNav &&
        href.split('/')[1] !== '' &&
        href.split('/')[1] === (item.url as string).split('/')[1])
    );
  }

  return false;
}

/**
 * Flatten nested nav items into a flat array with depth tracking.
 * Used by collapsed dropdown to show all leaf items.
 */
export function flattenNavItems(items: NavItem[], depth = 0): Array<NavLink & { depth: number }> {
  return items.flatMap((item) => {
    if ('items' in item && item.items) {
      return flattenNavItems(item.items, depth + 1);
    }
    return [{ ...(item as NavLink), depth }];
  });
}
