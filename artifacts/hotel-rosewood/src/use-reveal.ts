import { useEffect, useRef, useState } from 'react';

/**
 * Adds a class once the element first scrolls into view, then stops
 * observing it. Reveals are one-way on purpose: re-animating on the way
 * back up makes a long page feel busy rather than alive.
 *
 * Honours prefers-reduced-motion by marking the element visible
 * immediately, so nothing depends on an animation that never runs.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: options?.threshold ?? 0.15, rootMargin: options?.rootMargin ?? '0px 0px -8% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shown, options?.threshold, options?.rootMargin]);

  return { ref, shown } as const;
}
