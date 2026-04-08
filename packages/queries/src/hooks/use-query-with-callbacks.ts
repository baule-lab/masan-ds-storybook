import { useEffect, useRef } from 'react';
import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';

export interface CallbackOptions<TData = unknown, TError = unknown> {
  cbSuccess?: (data?: TData) => void;
  cbError?: (err: TError) => void;
  cbSettled?: () => void;
}

/**

/**
 * Wraps useQuery to guarantee cbSuccess/cbError/cbSettled always fire,
 * including when data is served from cache (queryFn not called).
 */
export function useQueryWithCallbacks<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
  TError = unknown,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  { cbSuccess, cbError, cbSettled }: CallbackOptions<TData, TError> = {}
): UseQueryResult<TData, TError> {
  const query = useQuery(options);

  // Use refs to avoid re-triggering effects on callback identity changes
  const cbSuccessRef = useRef(cbSuccess);
  const cbErrorRef = useRef(cbError);
  const cbSettledRef = useRef(cbSettled);
  cbSuccessRef.current = cbSuccess;
  cbErrorRef.current = cbError;
  cbSettledRef.current = cbSettled;

  // Fire cbSuccess whenever the query is in a successful state and dataUpdatedAt changes.
  // This includes initial loads, cached responses, and background refetches.
  useEffect(() => {
    if (query.status === 'success') {
      cbSuccessRef.current?.(query.data);
    }
  }, [query.status, query.dataUpdatedAt]);

  // Fire cbError when query errors
  useEffect(() => {
    if (query.status === 'error') {
      cbErrorRef.current?.(query.error);
    }
  }, [query.status, query.errorUpdatedAt]);

  // Fire cbSettled whenever the query is no longer pending and has either data or an error.
  // This runs both after network fetches and when data is served from cache.
  useEffect(() => {
    if (query.status !== 'pending' && (query.dataUpdatedAt > 0 || query.errorUpdatedAt > 0)) {
      cbSettledRef.current?.();
    }
  }, [query.status, query.dataUpdatedAt, query.errorUpdatedAt]);

  return query;
}
