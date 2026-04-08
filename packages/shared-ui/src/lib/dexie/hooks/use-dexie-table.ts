import * as React from 'react';
import type { IndexableType, Table, UpdateSpec } from 'dexie';
import { useLiveQuery } from './use-live-query';

export interface UseDexieTableReturn<T, TKey extends IndexableType> {
  data: T[];
  error: Error | null;
  add: (item: T) => Promise<TKey>;
  put: (item: T) => Promise<TKey>;
  update: (key: TKey, changes: UpdateSpec<T>) => Promise<number>;
  remove: (key: TKey) => Promise<void>;
  bulkAdd: (items: T[]) => Promise<TKey>;
  bulkPut: (items: T[]) => Promise<TKey>;
  bulkDelete: (keys: TKey[]) => Promise<void>;
  clear: () => Promise<void>;
  getById: (key: TKey) => Promise<T | undefined>;
}

/**
 * Reactive CRUD hook for a Dexie table.
 *
 * Built on `useLiveQuery` — `data` updates automatically when underlying
 * IndexedDB records change.
 *
 * @example
 * ```tsx
 * const {
 *   data: friends,
 *   isLoading,
 *   error,
 *   add,
 *   remove,
 * } = useDexieTable(db.friends);
 *
 * // Mutations
 * await add({ name: 'Alice', age: 30 });
 * await remove(1);
 * ```
 */
export function useDexieTable<T, TKey extends IndexableType = IndexableType>(
  table: Table<T, TKey>,
  deps: unknown[] = []
): UseDexieTableReturn<T, TKey> {
  const tableRef = React.useRef(table);
  tableRef.current = table;

  // ── Reactive reads ────────────────────────────────────────────────────
  const { data, error } = useLiveQuery(
    () => tableRef.current.toArray(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
    [] as T[]
  );

  // ── Mutations ─────────────────────────────────────────────────────────
  const add = (item: T) => tableRef.current.add(item) as Promise<TKey>;
  const put = (item: T) => tableRef.current.put(item) as Promise<TKey>;
  const update = (key: TKey, changes: UpdateSpec<T>) => tableRef.current.update(key, changes);
  const remove = (key: TKey) => tableRef.current.delete(key);
  const bulkAdd = (items: T[]) => tableRef.current.bulkAdd(items) as Promise<TKey>;
  const bulkPut = (items: T[]) => tableRef.current.bulkPut(items) as Promise<TKey>;
  const bulkDelete = (keys: TKey[]) => tableRef.current.bulkDelete(keys);
  const clear = () => tableRef.current.clear();
  const getById = (key: TKey) => tableRef.current.get(key);

  return {
    data: data ?? [],
    error,
    add,
    put,
    update,
    remove,
    bulkAdd,
    bulkPut,
    bulkDelete,
    clear,
    getById,
  };
}
