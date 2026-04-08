import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from './use-intersection-observer';

const DEFAULT_THRESHOLD = 0.5;
const DEFAULT_ROOT_MARGIN = '200px';

export interface InfiniteScrollOptions<T> {
  /**
   * Async function to load options
   * @param search - Search query
   * @param page - Page number for pagination (starts at 1)
   * @returns Promise with options and hasMore flag
   */
  loadOptions: (
    search: string,
    page: number
  ) => Promise<{
    options: T[];
    hasMore: boolean;
  }>;

  /**
   * Debounce delay for search in milliseconds
   * @default 300
   */
  debounceMs?: number;

  /**
   * Whether to load initial options when enabled becomes true
   * @default false
   */
  enabled?: boolean;

  /**
   * Initial search value
   * @default ''
   */
  initialSearch?: string;

  /**
   * Root margin used by IntersectionObserver to preload before reaching the bottom.
   * @default '200px'
   */
  observerRootMargin?: string;

  /**
   * Custom intersection root. Set this to a scroll container element when
   * infinite loading should trigger based on container scrolling, not viewport.
   */
  observerRoot?: Element | Document | null;

  /**
   * Optional key extractor used to dedupe merged options when appending pages.
   */
  getOptionKey?: (option: T) => string | number;
}

export interface InfiniteScrollResult<T> {
  /** Current options */
  options: T[];
  /** Current search value */
  search: string;
  /** Function to update search value */
  setSearch: (value: string, options?: { skipFetch?: boolean }) => void;
  /** Current page number */
  page: number;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether initial loading is in progress */
  isLoading: boolean;
  /** Whether loading more items is in progress */
  isLoadingMore: boolean;
  /** Error object from the latest failed request, if any */
  error: unknown;
  /** Ref to attach to the element that triggers infinite scroll */
  observerTarget: React.RefCallback<HTMLDivElement>;
  /** Function to manually fetch options */
  fetchOptions: (searchQuery: string, pageNum: number, append?: boolean) => Promise<void>;
  /** Function to reset all state */
  reset: () => void;
}

/**
 * Custom hook for infinite scroll functionality with debounced search
 * @template T - Type of option items
 */
export function useInfiniteScroll<T>({
  loadOptions,
  debounceMs = 300,
  enabled = false,
  initialSearch = '',
  observerRootMargin = DEFAULT_ROOT_MARGIN,
  observerRoot = null,
  getOptionKey,
}: InfiniteScrollOptions<T>): InfiniteScrollResult<T> {
  const [options, setOptions] = useState<T[]>([]);
  const [search, setSearchState] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);
  const hasFetchedInitialRef = useRef(false);
  const skipNextSearchFetchRef = useRef(false);
  const wasEnabledRef = useRef(enabled);
  const fetchOptionsRef = useRef<
    (searchQuery: string, pageNum: number, append?: boolean) => Promise<void>
  >(async () => {});
  const latestStateRef = useRef({
    hasMore,
    isLoading,
    isLoadingMore,
    page,
    search,
    optionCount: options.length,
  });

  latestStateRef.current = {
    hasMore,
    isLoading,
    isLoadingMore,
    page,
    search,
    optionCount: options.length,
  };

  const setSearch = useCallback((value: string, options?: { skipFetch?: boolean }) => {
    if (options?.skipFetch) {
      skipNextSearchFetchRef.current = true;
    }
    setSearchState(value);
  }, []);

  const invalidatePendingRequests = useCallback(() => {
    requestIdRef.current += 1;
    if (!isMountedRef.current) return;
    setIsLoading(false);
    setIsLoadingMore(false);
  }, []);

  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    root: observerRoot,
    rootMargin: observerRootMargin,
    threshold: DEFAULT_THRESHOLD,
    enabled,
  });

  const observerTarget = useCallback(
    (node: HTMLDivElement | null) => {
      intersectionRef(node);
    },
    [intersectionRef]
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      requestIdRef.current += 1;
      clearTimeout(debounceTimer.current);
    };
  }, []);

  // Load options function
  const fetchOptions = useCallback(
    async (searchQuery: string, pageNum: number, append = false) => {
      const requestId = ++requestIdRef.current;

      try {
        if (pageNum === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setError(null);

        const result = await loadOptions(searchQuery, pageNum);
        if (!isMountedRef.current || requestId !== requestIdRef.current) return;

        setOptions((prev) => {
          const nextOptions = append ? [...prev, ...result.options] : result.options;
          if (!append || !getOptionKey) {
            return nextOptions;
          }

          const seen = new Set<string>();
          return nextOptions.filter((option) => {
            const key = String(getOptionKey(option));
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        });
        setHasMore(result.hasMore);
        setPage(pageNum);
        if (pageNum === 1) {
          hasFetchedInitialRef.current = true;
        }
      } catch (error) {
        if (!isMountedRef.current || requestId !== requestIdRef.current) return;
        setError(error);
        console.error('Error loading options:', error);
      } finally {
        if (isMountedRef.current && requestId === requestIdRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [loadOptions, getOptionKey]
  );

  useEffect(() => {
    fetchOptionsRef.current = fetchOptions;
  }, [fetchOptions]);

  const tryLoadNextPage = useCallback(() => {
    if (!enabled || !hasFetchedInitialRef.current) return;

    const state = latestStateRef.current;
    if (!state.hasMore || state.isLoading || state.isLoadingMore) return;

    // Guard against duplicate triggers before React applies loading state.
    latestStateRef.current = {
      ...state,
      isLoadingMore: true,
    };
    void fetchOptionsRef.current(state.search, state.page + 1, true);
  }, [enabled]);

  // Debounced search
  useEffect(() => {
    if (!enabled) return;

    const wasEnabled = wasEnabledRef.current;
    wasEnabledRef.current = true;
    const state = latestStateRef.current;

    if (!wasEnabled && state.optionCount > 0 && state.search === initialSearch) {
      return;
    }

    if (skipNextSearchFetchRef.current) {
      skipNextSearchFetchRef.current = false;
      return;
    }

    invalidatePendingRequests();
    clearTimeout(debounceTimer.current);

    // On initial enable, fetch immediately without debounce for instant loading.
    // Debounce only applies to subsequent user-typed search changes.
    if (!wasEnabled) {
      setPage(1);
      setHasMore(true);
      void fetchOptionsRef.current(search, 1, false);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      void fetchOptionsRef.current(search, 1, false);
    }, debounceMs);

    return () => {
      clearTimeout(debounceTimer.current);
    };
  }, [search, debounceMs, enabled, invalidatePendingRequests, initialSearch]);

  useEffect(() => {
    if (!enabled) {
      wasEnabledRef.current = false;
      hasFetchedInitialRef.current = false;
    }
  }, [enabled]);

  // Trigger next page load when sentinel is intersecting.
  // Including `isLoadingMore` ensures we re-evaluate after a page finishes
  // loading in case the sentinel is still visible.
  useEffect(() => {
    if (!enabled || !isIntersecting || !hasFetchedInitialRef.current) return;
    tryLoadNextPage();
  }, [enabled, isIntersecting, isLoadingMore, tryLoadNextPage]);

  // Reset function
  const reset = useCallback(() => {
    clearTimeout(debounceTimer.current);
    invalidatePendingRequests();
    hasFetchedInitialRef.current = false;
    setOptions([]);
    setSearch(initialSearch);
    setPage(1);
    setHasMore(true);
    setIsLoading(false);
    setIsLoadingMore(false);
    setError(null);
  }, [initialSearch, invalidatePendingRequests]);

  return {
    options,
    search,
    setSearch,
    page,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    observerTarget,
    fetchOptions,
    reset,
  };
}
