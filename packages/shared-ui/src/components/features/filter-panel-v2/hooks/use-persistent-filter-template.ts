import * as React from 'react';
import { createTypedDB, type EntityTable } from '../../../../lib/dexie';
import { useLiveQuery } from '../../../../lib/dexie';
import type { FilterValueV2 } from '../types';

// ─── Schema ─────────────────────────────────────────────────────────────────

export interface FilterTemplateDBV2 {
  id: string;
  module: string;
  name: string;
  filters: Record<string, FilterValueV2>;

  createdAt: number;
  updatedAt: number;
  /** `0` = not deleted, otherwise the timestamp of soft-deletion. Stored as number so IndexedDB can index it. */
  deletedAt: number;

  isSynced: boolean;
  serverId?: string;

  version: number;
}

type DB = {
  templates: EntityTable<FilterTemplateDBV2, 'id'>;
};

const CURRENT_DB_VERSION = 1;
const DELETED_AT_DEFAULT_VALUE = 0; // Using `0` instead of `null` for `deletedAt` allows us to leverage IndexedDB's numeric indexes for efficient range queries (e.g. find all non-deleted records with `deletedAt = 0`).

/**
 * Indexes:
 * - `id`                            — primary key
 * - `module`                        — list all templates for a module
 * - `[module+deletedAt+updatedAt]`  — **hot path**: fetch latest non-deleted template per module
 *                                     in a single indexed range-scan + `.last()`
 * - `[module+updatedAt]`            — general queries
 * - `isSynced`                      — find un-synced records for server sync
 * - `serverId`                      — look-up by remote id
 */
const filterTemplateDB = createTypedDB<DB>(
  'filter-templates',
  {
    templates: 'id, module, [module+deletedAt+updatedAt], [module+updatedAt], isSynced, serverId',
  },
  CURRENT_DB_VERSION
);

// ─── Hook ───────────────────────────────────────────────────────────────────

export interface UsePersistentFilterTemplateReturnV2 {
  /** The most-recently-updated non-deleted template for this module. */
  latestTemplate: FilterTemplateDBV2 | undefined;
  /** All non-deleted templates for this module, newest first. */
  templates: FilterTemplateDBV2[];
  error: Error | null;
  /** Create a new template. Returns the generated `id`. */
  saveTemplate: (name: string, filters: Record<string, FilterValueV2>) => Promise<string>;
  /** Overwrite filters on an existing template (bumps `updatedAt` & `version`). */
  updateTemplate: (
    id: string,
    changes: Partial<Pick<FilterTemplateDBV2, 'name' | 'filters'>>
  ) => Promise<void>;
  /** Soft-delete a template. */
  deleteTemplate: (id: string) => Promise<void>;
  /** Promote a template to "latest" by bumping its `updatedAt`. */
  applyTemplate: (id: string) => Promise<void>;
}

/**
 * Manage per-module filter templates stored in IndexedDB.
 *
 * The "latest" template is determined by the highest `updatedAt` among
 * non-deleted records for the given `module`, resolved via the compound
 * index `[module+deleted+updatedAt]` in a single seek.
 *
 * @example
 * ```tsx
 * const { latestTemplate, templates, saveTemplate } = useFilterTemplate('orders');
 *
 * // Apply latest on mount
 * useEffect(() => {
 *   if (latestTemplate) applyFilters(latestTemplate.filters);
 * }, [latestTemplate]);
 * ```
 */
export function usePersistentFilterTemplate(module: string): UsePersistentFilterTemplateReturnV2 {
  const tableRef = React.useRef(filterTemplateDB.templates);

  // ── Reactive reads ──────────────────────────────────────────────────────
  const { data: queryResult, error } = useLiveQuery(
    async () => {
      const table = tableRef.current;

      // Compound index [module+deletedAt+updatedAt]: seek where module=X, deletedAt=0.
      // Each terminal operation gets its own Collection instance — Dexie's reverse()
      // mutates the collection in place, so sharing one instance across two concurrent
      // terminal ops corrupts the cursor direction for both.
      const [templates, latest] = await Promise.all([
        // .reverse().toArray() walks the compound index from highest updatedAt down —
        // no in-memory re-sort needed (unlike .reverse().sortBy() which re-sorts ASC).
        table
          .where('[module+deletedAt+updatedAt]')
          .between(
            [module, DELETED_AT_DEFAULT_VALUE, Number.NEGATIVE_INFINITY],
            [module, DELETED_AT_DEFAULT_VALUE, Number.POSITIVE_INFINITY]
          )
          .reverse()
          .toArray(),
        // Forward cursor → .last() returns the record with the highest updatedAt.
        table
          .where('[module+deletedAt+updatedAt]')
          .between(
            [module, DELETED_AT_DEFAULT_VALUE, Number.NEGATIVE_INFINITY],
            [module, DELETED_AT_DEFAULT_VALUE, Number.POSITIVE_INFINITY]
          )
          .last(),
      ]);

      return { templates, latest };
    },
    [module],
    { templates: [] as FilterTemplateDBV2[], latest: undefined as FilterTemplateDBV2 | undefined }
  );

  // ── Mutations ───────────────────────────────────────────────────────────

  const saveTemplate = async (name: string, filters: Record<string, FilterValueV2>) => {
    const now = Date.now();
    const id = crypto.randomUUID();
    await tableRef.current.add({
      id,
      module,
      name,
      filters,
      createdAt: now,
      updatedAt: now,
      deletedAt: DELETED_AT_DEFAULT_VALUE,
      isSynced: false,
      version: CURRENT_DB_VERSION,
    });
    return id;
  };

  const updateTemplate = async (
    id: string,
    changes: Partial<Pick<FilterTemplateDBV2, 'name' | 'filters'>>
  ) => {
    const existing = await tableRef.current.get(id);
    if (!existing) return;
    await tableRef.current.update(id, {
      ...changes,
      updatedAt: Date.now(),
      version: existing.version + 1,
      isSynced: false,
    });
  };

  const deleteTemplate = async (id: string) => {
    await tableRef.current.update(id, {
      deletedAt: Date.now(),
      isSynced: false,
    });
  };

  const applyTemplate = async (id: string) => {
    await tableRef.current.update(id, { updatedAt: Date.now() });
  };

  return {
    latestTemplate: queryResult?.latest,
    templates: queryResult?.templates ?? [],
    error,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    applyTemplate,
  };
}
