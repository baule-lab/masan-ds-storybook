import { useEffect, useRef, useState } from 'react';

/** Detects when a sticky element is "stuck" at the top using a sentinel + IntersectionObserver */
export function useStickyObserver() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => setIsStuck(!entries[0]?.isIntersecting),
      { threshold: 1.0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return { sentinelRef, isStuck };
}
