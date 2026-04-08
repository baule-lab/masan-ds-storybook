import { useRef } from 'react';

/**
 * Creates a debounced version of the provided callback that delays execution until
 * the user stops calling it for the specified delay.
 */
export function useDebounceCallback<T extends (...args: readonly any[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Parameters<T>) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
