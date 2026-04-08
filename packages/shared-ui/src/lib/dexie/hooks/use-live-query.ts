import * as React from 'react';
import { useLiveQuery as useDexieLiveQuery } from 'dexie-react-hooks';

export interface UseLiveQueryResult<T> {
  data: T;
  error: Error | null;
}

/**
 * Wrapper around `dexie-react-hooks`' `useLiveQuery` that returns
 * `{ data, isLoading, error }` instead of throwing on error or
 * returning `undefined` while loading.
 *
 * @example
 * ```tsx
 * const { data: friends, isLoading, error } = useLiveQuery(
 *   () => db.friends.where('age').above(18).toArray(),
 *   [],
 *   [],
 * );
 * ```
 */
export function useLiveQuery<T>(
  querier: () => Promise<T> | T,
  deps?: unknown[]
): UseLiveQueryResult<T | undefined>;

export function useLiveQuery<T, TDefault>(
  querier: () => Promise<T> | T,
  deps: unknown[],
  defaultResult: TDefault
): UseLiveQueryResult<T | TDefault>;

export function useLiveQuery<T, TDefault>(
  querier: () => Promise<T> | T,
  deps?: unknown[],
  defaultResult?: TDefault
): UseLiveQueryResult<T | TDefault | undefined> {
  const [error, setError] = React.useState<Error | null>(null);

  const result = useDexieLiveQuery(
    async () => {
      try {
        setError(null);
        return await querier();
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
        return defaultResult;
      }
    },
    deps ?? [],
    defaultResult
  );

  const data = result ?? defaultResult;

  return { data, error };
}
