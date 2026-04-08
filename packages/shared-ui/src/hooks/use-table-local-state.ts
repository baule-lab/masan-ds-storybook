import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useMemo, useRef, useState } from 'react';

type SearchRecord = Record<string, unknown>;

type UseTableLocalStateParams = {
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
};

export type UseTableLocalStateReturn<TParams = SearchRecord> = {
  // Global filter
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;
  // Column filters
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  // Pagination
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  // Sorting (client-side — satisfies DataTable urlState interface)
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  // Params (similar to URL search params)
  params: TParams;
  // Helpers
  ensurePageInRange: (pageCount: number, opts?: { resetTo?: 'first' | 'last' }) => void;
  resetFilters: () => void;
  setParams: (nextParams: SearchRecord) => void;
};

export function useTableLocalState<TParams extends SearchRecord = SearchRecord>(
  params: UseTableLocalStateParams = {}
): UseTableLocalStateReturn<TParams> {
  const {
    pagination: paginationCfg,
    globalFilter: globalFilterCfg,
    columnFilters: columnFiltersCfg = [],
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

  // State management
  const [internalState, setInternalState] = useState<SearchRecord>(() => {
    const initial: SearchRecord = {};
    // Initialize with default pagination values if offset-based
    if (isOffsetBased) {
      initial[pageKey] = 0;
      initial[pageSizeKey] = defaultPageSize;
    } else {
      initial[pageKey] = defaultPage;
      initial[pageSizeKey] = defaultPageSize;
    }
    return initial;
  });

  // Build column filters from internal state
  const columnFilters: ColumnFiltersState = useMemo(() => {
    const collected: ColumnFiltersState = [];
    for (const cfg of columnFiltersCfg) {
      const raw = internalState[cfg.searchKey];
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
  }, [columnFiltersCfg, internalState]);

  // Build pagination from internal state
  const pagination: PaginationState = useMemo(() => {
    const rawPageSize = internalState[pageSizeKey];
    const pageSizeNum = typeof rawPageSize === 'number' ? rawPageSize : defaultPageSize;

    if (isOffsetBased) {
      // For offset-based pagination: offset = pageIndex * pageSize
      const rawOffset = internalState[pageKey];
      const offset = typeof rawOffset === 'number' ? rawOffset : 0;
      const pageIndex = Math.floor(offset / pageSizeNum);
      return { pageIndex: Math.max(0, pageIndex), pageSize: pageSizeNum };
    }

    // For page-based pagination (default)
    const rawPage = internalState[pageKey];
    const pageNum = typeof rawPage === 'number' ? rawPage : defaultPage;
    return { pageIndex: Math.max(0, pageNum - 1), pageSize: pageSizeNum };
  }, [internalState, pageKey, pageSizeKey, defaultPage, defaultPageSize, isOffsetBased]);

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    const nextPageSize = next.pageSize;

    setInternalState((prev) => {
      const updated = { ...prev };

      if (isOffsetBased) {
        // For offset-based pagination: calculate offset from pageIndex
        const nextOffset = next.pageIndex * nextPageSize;
        updated[pageKey] = nextOffset === 0 ? undefined : nextOffset;
        updated[pageSizeKey] = nextPageSize === defaultPageSize ? undefined : nextPageSize;
      } else {
        // For page-based pagination (default)
        const nextPage = next.pageIndex + 1;
        updated[pageKey] = nextPage <= defaultPage ? undefined : nextPage;
        updated[pageSizeKey] = nextPageSize === defaultPageSize ? undefined : nextPageSize;
      }

      return updated;
    });
  };

  const [sorting, setSorting] = useState<SortingState>([]);

  const [globalFilter, setGlobalFilter] = useState<string>(() => {
    if (!globalFilterEnabled) return '';
    const raw = internalState[globalFilterKey];
    return typeof raw === 'string' ? raw : '';
  });

  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState<string>(globalFilter);

  // Debounced value for filter updates
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const onGlobalFilterChange: OnChangeFn<string> | undefined = globalFilterEnabled
    ? (updater) => {
        const next = typeof updater === 'function' ? updater(globalFilter ?? '') : updater;
        const value = trimGlobal ? next.trim() : next;

        // Update local state immediately for responsive UI
        setGlobalFilter(value);

        // Debounce internal state update
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
          setDebouncedGlobalFilter(value);
          setInternalState((prev) => ({
            ...prev,
            [pageKey]: undefined,
            [globalFilterKey]: value ? value : undefined,
          }));
        }, debounceMs);
      }
    : undefined;

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const next = typeof updater === 'function' ? updater(columnFilters) : updater;

    const patch: SearchRecord = {};

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

    setInternalState((prev) => ({
      ...prev,
      [pageKey]: undefined,
      ...patch,
    }));
  };

  const ensurePageInRange = (
    pageCount: number,
    opts: { resetTo?: 'first' | 'last' } = { resetTo: 'first' }
  ) => {
    const currentPage = internalState[pageKey];
    const pageNum = typeof currentPage === 'number' ? currentPage : defaultPage;
    if (pageCount > 0 && pageNum > pageCount) {
      setInternalState((prev) => ({
        ...prev,
        [pageKey]: opts.resetTo === 'last' ? pageCount : undefined,
      }));
    }
  };

  const resetFilters = () => {
    const initial: SearchRecord = {};
    // Reset to default pagination values
    if (isOffsetBased) {
      initial[pageKey] = 0;
      initial[pageSizeKey] = defaultPageSize;
    } else {
      initial[pageKey] = defaultPage;
      initial[pageSizeKey] = defaultPageSize;
    }
    setInternalState(initial);
    setGlobalFilter('');
    setDebouncedGlobalFilter('');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  // Build params object for API calls (similar to URL search params)
  const paramsObj = useMemo(() => {
    const result: SearchRecord = { ...internalState };

    // Clean up undefined values
    for (const key in result) {
      if (result[key] === undefined) {
        delete result[key];
      }
    }

    return result as unknown as TParams;
  }, [internalState]);

  const setParams = (nextParams: SearchRecord) => {
    setInternalState((prev) => ({
      ...nextParams,
      [pageKey]: nextParams[pageKey] ?? (isOffsetBased ? 0 : 1),
      [pageSizeKey]:
        nextParams[pageSizeKey] ??
        prev[pageSizeKey] ??
        (isOffsetBased ? defaultPageSize : undefined),
    }));
  };

  return {
    globalFilter: globalFilterEnabled ? debouncedGlobalFilter : undefined,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange: setSorting,
    params: paramsObj,
    ensurePageInRange,
    resetFilters,
    setParams,
  };
}
