import Dexie, { type Table, type EntityTable, type IndexableType } from 'dexie';
import { liveQuery } from 'dexie';

// ─── Type Re-exports ────────────────────────────────────────────────────────
export { Dexie, liveQuery };
export type { Table as DexieTable, EntityTable, IndexableType };

// ─── Typed DB Factory ───────────────────────────────────────────────────────

/**
 * Create a typed Dexie database instance with schema definitions.
 *
 * @example
 * ```ts
 * interface Friend {
 *   id: number;
 *   name: string;
 *   age: number;
 * }
 *
 * interface MyDB {
 *   friends: EntityTable<Friend, 'id'>;
 * }
 *
 * const db = createTypedDB<MyDB>('myDatabase', {
 *   friends: '++id, name, age',
 * });
 *
 * // Fully typed table access
 * await db.friends.add({ name: 'Alice', age: 30 });
 * ```
 *
 * @param name - The IndexedDB database name.
 * @param stores - Schema definition mapping table names to index declarations.
 * @param version - Schema version number (default: 1).
 */
export function createTypedDB<T extends Record<string, Table>>(
  name: string,
  stores: Record<keyof T, string>,
  version = 1
): Dexie & T {
  const db = new Dexie(name);
  db.version(version).stores(stores as Record<string, string>);
  return db as Dexie & T;
}

// ─── DB Export / Import / Clear ─────────────────────────────────────────────

/**
 * Export all data from a Dexie database as a plain object.
 *
 * @example
 * ```ts
 * const snapshot = await exportDB(db);
 * // { friends: [{ id: 1, name: 'Alice' }, ...], ... }
 * ```
 */
export async function exportDB(db: Dexie): Promise<Record<string, unknown[]>> {
  const result: Record<string, unknown[]> = {};
  for (const table of db.tables) {
    result[table.name] = await table.toArray();
  }
  return result;
}

/**
 * Import data into a Dexie database via `bulkPut` (upsert semantics).
 * Only tables present in `data` are affected; others remain untouched.
 *
 * @example
 * ```ts
 * await importDB(db, {
 *   friends: [{ id: 1, name: 'Alice', age: 30 }],
 * });
 * ```
 */
export async function importDB(db: Dexie, data: Record<string, unknown[]>): Promise<void> {
  const tableNames = Object.keys(data);
  const tables = tableNames
    .map((name) => db.tables.find((t) => t.name === name))
    .filter((t): t is Table => t != null);

  await db.transaction('rw', tables, async () => {
    for (const table of tables) {
      await table.bulkPut(data[table.name]!);
    }
  });
}

/**
 * Clear all data from every table in a Dexie database.
 *
 * @example
 * ```ts
 * await clearDB(db);
 * ```
 */
export async function clearDB(db: Dexie): Promise<void> {
  await db.transaction('rw', db.tables, async () => {
    for (const table of db.tables) {
      await table.clear();
    }
  });
}
