import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';

type SearchRecord = Record<string, unknown>;

export type NavigateFn = (opts: {
  search: true | SearchRecord | ((prev: SearchRecord) => Partial<SearchRecord> | SearchRecord);
  replace?: boolean;
}) => void;

type UseTableUrlStateParams = {
  search: SearchRecord;
  navigate: NavigateFn;
  pagination?: {
    pageKey?: string;
    pageSizeKey?: string;
    defaultPage?: number;
    defaultPageSize?: number;
  };
  globalFilter?: {
    enabled?: boolean;
    key?: string;
    trim?: boolean;
    debounceMs?: number; // Debounce delay in milliseconds (default: 300)
  };
  columnFilters?: Array<
    | {
        columnId: string;
        searchKey: string;
        type?: 'string';
        // Optional transformers for custom types
        serialize?: (value: unknown) => unknown;
        deserialize?: (value: unknown) => unknown;
      }
    | {
        columnId: string;
        searchKey: string;
        type: 'array';
        serialize?: (value: unknown) => unknown;
        deserialize?: (value: unknown) => unknown;
      }
  >;
  sorting?: {
    /** URL key for the column id to sort by. @default 'order_by' */
    orderByKey?: string;
    /** URL key for the sort direction. @default 'descending' */
    descendingKey?: string;
  };
};

export type UseTableUrlStateReturn = {
  // Global filter
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;
  // Column filters
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  // Pagination
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  // Sorting
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  // Helpers
  ensurePageInRange: (pageCount: number, opts?: { resetTo?: 'first' | 'last' }) => void;
};

export function useTableUrlState(params: UseTableUrlStateParams): UseTableUrlStateReturn {
  const {
    search,
    navigate,
    pagination: paginationCfg,
    globalFilter: globalFilterCfg,
    columnFilters: columnFiltersCfg = [],
    sorting: sortingCfg,
  } = params;

  const pageKey = paginationCfg?.pageKey ?? ('offset' as string);
  const pageSizeKey = paginationCfg?.pageSizeKey ?? ('limit' as string);
  const defaultPage = paginationCfg?.defaultPage ?? 1;
  const defaultPageSize = paginationCfg?.defaultPageSize ?? 20;
  const isOffsetBased = pageKey === 'offset';

  const globalFilterKey = globalFilterCfg?.key ?? ('filter' as string);
  const globalFilterEnabled = globalFilterCfg?.enabled ?? true;
  const trimGlobal = globalFilterCfg?.trim ?? true;
  const debounceMs = globalFilterCfg?.debounceMs ?? 300;

  // Build initial column filters from the current search params
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    const collected: ColumnFiltersState = [];
    for (const cfg of columnFiltersCfg) {
      const raw = (search as SearchRecord)[cfg.searchKey];
      const deserialize = cfg.deserialize ?? ((v: unknown) => v);
      if (cfg.type === 'string') {
        const value = (deserialize(raw) as string) ?? '';
        if (typeof value === 'string' && value.trim() !== '') {
          collected.push({ id: cfg.columnId, value });
        }
      } else {
        // default to array type
        const value = (deserialize(raw) as unknown[]) ?? [];
        if (Array.isArray(value) && value.length > 0) {
          collected.push({ id: cfg.columnId, value });
        }
      }
    }
    return collected;
  }, [columnFiltersCfg, search]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters);

  const pagination: PaginationState = useMemo(() => {
    const rawPageSize = (search as SearchRecord)[pageSizeKey];
    const pageSizeNum = typeof rawPageSize === 'number' ? rawPageSize : defaultPageSize;

    if (isOffsetBased) {
      // For offset-based pagination: offset = pageIndex * pageSize
      const rawOffset = (search as SearchRecord)[pageKey];
      const offset = typeof rawOffset === 'number' ? rawOffset : 0;
      const pageIndex = Math.floor(offset / pageSizeNum);
      return { pageIndex: Math.max(0, pageIndex), pageSize: pageSizeNum };
    }

    // For page-based pagination (default)
    const rawPage = (search as SearchRecord)[pageKey];
    const pageNum = typeof rawPage === 'number' ? rawPage : defaultPage;
    return { pageIndex: Math.max(0, pageNum - 1), pageSize: pageSizeNum };
  }, [search, pageKey, pageSizeKey, defaultPage, defaultPageSize, isOffsetBased]);

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    const nextPageSize = next.pageSize;

    if (isOffsetBased) {
      // For offset-based pagination: calculate offset from pageIndex
      const nextOffset = next.pageIndex * nextPageSize;
      navigate({
        search: (prev) => ({
          ...(prev as SearchRecord),
          [pageKey]: nextOffset === 0 ? undefined : nextOffset,
          [pageSizeKey]: nextPageSize === defaultPageSize ? undefined : nextPageSize,
        }),
      });
    } else {
      // For page-based pagination (default)
      const nextPage = next.pageIndex + 1;
      navigate({
        search: (prev) => ({
          ...(prev as SearchRecord),
          [pageKey]: nextPage <= defaultPage ? undefined : nextPage,
          [pageSizeKey]: nextPageSize === defaultPageSize ? undefined : nextPageSize,
        }),
      });
    }
  };

  const [globalFilter, setGlobalFilter] = useState<string | undefined>(() => {
    if (!globalFilterEnabled) return undefined;
    const raw = (search as SearchRecord)[globalFilterKey];
    return typeof raw === 'string' ? raw : '';
  });

  // Debounced value for URL updates
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Sync URL to local state when URL changes externally (e.g., browser back/forward)
  useEffect(() => {
    if (!globalFilterEnabled) return;
    const raw = (search as SearchRecord)[globalFilterKey];
    const urlValue = typeof raw === 'string' ? raw : '';
    if (urlValue !== globalFilter) {
      setGlobalFilter(urlValue);
    }
  }, [search, globalFilterKey, globalFilterEnabled]);

  const onGlobalFilterChange: OnChangeFn<string> | undefined = globalFilterEnabled
    ? (updater) => {
        const next = typeof updater === 'function' ? updater(globalFilter ?? '') : updater;
        const value = trimGlobal ? next.trim() : next;

        // Update local state immediately for responsive UI
        setGlobalFilter(value);

        // Debounce URL update
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
          navigate({
            search: (prev) => ({
              ...(prev as SearchRecord),
              [pageKey]: undefined,
              [globalFilterKey]: value ? value : undefined,
            }),
          });
        }, debounceMs);
      }
    : undefined;

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const next = typeof updater === 'function' ? updater(columnFilters) : updater;
    setColumnFilters(next);

    const patch: Record<string, unknown> = {};

    for (const cfg of columnFiltersCfg) {
      const found = next.find((f) => f.id === cfg.columnId);
      const serialize = cfg.serialize ?? ((v: unknown) => v);
      if (cfg.type === 'string') {
        const value = typeof found?.value === 'string' ? (found.value as string) : '';
        patch[cfg.searchKey] = value.trim() !== '' ? serialize(value) : undefined;
      } else {
        const value = Array.isArray(found?.value) ? (found?.value as unknown[]) : [];
        patch[cfg.searchKey] = value.length > 0 ? serialize(value) : undefined;
      }
    }

    navigate({
      search: (prev) => ({
        ...(prev as SearchRecord),
        [pageKey]: undefined,
        ...patch,
      }),
    });
  };

  const orderByKey = sortingCfg?.orderByKey ?? 'order_by';
  const descendingKey = sortingCfg?.descendingKey ?? 'descending';

  const sorting: SortingState = useMemo(() => {
    const rawOrderBy = (search as SearchRecord)[orderByKey];
    const rawDescending = (search as SearchRecord)[descendingKey];
    if (!rawOrderBy) return [];
    const col = Array.isArray(rawOrderBy) ? rawOrderBy[0] : rawOrderBy;
    const desc = Array.isArray(rawDescending) ? rawDescending[0] : rawDescending;
    return [{ id: String(col), desc: desc === true || desc === 'true' }];
  }, [search, orderByKey, descendingKey]);

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    const sortConfig = next?.[0];
    navigate({
      search: (prev) => ({
        ...(prev as SearchRecord),
        [orderByKey]: sortConfig?.id ?? undefined,
        [descendingKey]: sortConfig ? sortConfig.desc : undefined,
        [pageKey]: undefined,
      }),
    });
  };

  const ensurePageInRange = (
    pageCount: number,
    opts: { resetTo?: 'first' | 'last' } = { resetTo: 'first' }
  ) => {
    const currentPage = (search as SearchRecord)[pageKey];
    const pageNum = typeof currentPage === 'number' ? currentPage : defaultPage;
    if (pageCount > 0 && pageNum > pageCount) {
      navigate({
        replace: true,
        search: (prev) => ({
          ...(prev as SearchRecord),
          [pageKey]: opts.resetTo === 'last' ? pageCount : undefined,
        }),
      });
    }
  };

  return {
    globalFilter: globalFilterEnabled ? (globalFilter ?? '') : undefined,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    ensurePageInRange,
  };
}
