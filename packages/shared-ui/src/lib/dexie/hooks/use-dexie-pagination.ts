import * as React from 'react';
import type { Collection, IndexableType, Table } from 'dexie';
import { useLiveQuery } from './use-live-query';

export interface UseDexiePaginationOptions<T, TKey extends IndexableType = IndexableType> {
  /** The Dexie table to paginate. */
  table: Table<T, TKey>;
  /** Optional transform applied to the collection before pagination (e.g. filter, orderBy). */
  query?: (collection: Collection<T, TKey>) => Collection<T, TKey>;
  /** Number of items per page. @default 10 */
  pageSize?: number;
  /** Zero-based initial page index. @default 0 */
  initialPage?: number;
  /** Dependency array — re-subscribes when values change. */
  deps?: unknown[];
}

export interface UseDexiePaginationReturn<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  error: Error | null;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated, reactive queries over a Dexie table.
 *
 * Built on `useLiveQuery` — data updates automatically when underlying
 * IndexedDB records change.
 *
 * @example
 * ```tsx
 * const {
 *   data: friends,
 *   page,
 *   totalPages,
 *   setPage,
 *   isLoading,
 * } = useDexiePagination({
 *   table: db.friends,
 *   pageSize: 20,
 *   query: (col) => col.where('age').above(18),
 * });
 * ```
 */
export function useDexiePagination<T, TKey extends IndexableType = IndexableType>(
  options: UseDexiePaginationOptions<T, TKey>
): UseDexiePaginationReturn<T> {
  const { table, query, pageSize: initialPageSize = 10, initialPage = 0, deps = [] } = options;

  const [page, setPage] = React.useState(initialPage);
  const [pageSize, setPageSizeState] = React.useState(initialPageSize);

  // Reset to first page when pageSize or external deps change
  const setPageSize = React.useCallback((size: number) => {
    setPageSizeState(size);
    setPage(0);
  }, []);

  const queryRef = React.useRef(query);
  queryRef.current = query;

  const tableRef = React.useRef(table);
  tableRef.current = table;

  const { data: result, error } = useLiveQuery(
    async () => {
      const baseCollection = queryRef.current
        ? queryRef.current(tableRef.current.toCollection())
        : tableRef.current.toCollection();

      const [items, totalCount] = await Promise.all([
        baseCollection
          .offset(page * pageSize)
          .limit(pageSize)
          .toArray(),
        // Count needs its own collection instance (offset/limit mutate the collection)
        queryRef.current
          ? queryRef.current(tableRef.current.toCollection()).count()
          : tableRef.current.count(),
      ]);

      return { items, totalCount };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, pageSize, ...deps],
    { items: [] as T[], totalCount: 0 }
  );

  const totalCount = result?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const data = result?.items ?? [];

  return {
    data,
    page,
    pageSize,
    totalCount,
    totalPages,
    error,
    setPage,
    setPageSize,
    hasNextPage: page < totalPages - 1,
    hasPreviousPage: page > 0,
  };
}
