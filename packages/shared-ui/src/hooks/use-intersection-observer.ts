import React from 'react';

export type UseIntersectionObserverOptions = {
  threshold?: number | number[];
  root?: Element | Document | null;
  rootMargin?: string;
  /** Stop observing once the element becomes visible */
  freezeOnceVisible?: boolean;
  /** Callback fired on every intersection change */
  onChange?: (entry: IntersectionObserverEntry) => void;
  /** Conditionally enable/disable the observer */
  enabled?: boolean;
};

export type UseIntersectionObserverReturn = {
  ref: (node: Element | null) => void;
  entry: IntersectionObserverEntry | undefined;
  isIntersecting: boolean;
};

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
    onChange,
    enabled = true,
  } = options;

  const [entry, setEntry] = React.useState<IntersectionObserverEntry>();
  const previousObserver = React.useRef<IntersectionObserver | null>(null);
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const ref = React.useCallback(
    (node: Element | null) => {
      if (previousObserver.current) {
        previousObserver.current.disconnect();
        previousObserver.current = null;
      }

      if (frozen || !enabled) return;

      if (node?.nodeType === Node.ELEMENT_NODE) {
        const observer = new IntersectionObserver(
          ([newEntry]) => {
            setEntry(newEntry);
            if (newEntry) onChange?.(newEntry);
          },
          { threshold, root, rootMargin }
        );

        observer.observe(node);
        previousObserver.current = observer;
      }
    },
    [threshold, root, rootMargin, frozen, enabled, onChange]
  );

  return { ref, entry, isIntersecting: entry?.isIntersecting ?? false };
}
