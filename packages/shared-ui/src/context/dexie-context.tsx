import * as React from 'react';
import type Dexie from 'dexie';

const DexieContext = React.createContext<Dexie | null>(null);

export interface DexieProviderProps {
  db: Dexie;
  children: React.ReactNode;
}

/**
 * Provides a Dexie database instance to the React tree.
 *
 * @example
 * ```tsx
 * import { createTypedDB, DexieProvider } from '@masan-group/shared-ui';
 *
 * const db = createTypedDB<MyDB>('app', { todos: '++id, title' });
 *
 * function App() {
 *   return (
 *     <DexieProvider db={db}>
 *       <TodoList />
 *     </DexieProvider>
 *   );
 * }
 * ```
 */
export function DexieProvider({ db, children }: DexieProviderProps) {
  return <DexieContext.Provider value={db}>{children}</DexieContext.Provider>;
}

/**
 * Read the Dexie database instance from the nearest `DexieProvider`.
 * Throws if used outside a provider.
 *
 * @example
 * ```tsx
 * const db = useDexieDB();
 * const friends = await db.table('friends').toArray();
 * ```
 */
export function useDexieDB(): Dexie {
  const db = React.useContext(DexieContext);
  if (!db) {
    throw new Error('useDexieDB must be used within a <DexieProvider>');
  }
  return db;
}
