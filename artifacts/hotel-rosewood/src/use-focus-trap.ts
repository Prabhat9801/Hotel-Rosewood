import { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Moves focus into a dialog when it opens, keeps Tab cycling inside it, and
 * restores focus to whatever opened it on close. Without this, Tab walks the
 * page behind an open modal and keyboard users lose their place entirely.
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(active: boolean) {
  const ref = useRef<T | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    restoreTo.current = document.activeElement as HTMLElement | null;

    const visibleFocusable = (node: T) =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement,
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const node = ref.current;
      if (!node) return;
      const items = visibleFocusable(node);
      if (items.length === 0) return;
      const start = items[0];
      const end = items[items.length - 1];
      if (event.shiftKey && document.activeElement === start) {
        event.preventDefault();
        end.focus();
      } else if (!event.shiftKey && document.activeElement === end) {
        event.preventDefault();
        start.focus();
      }
    };

    // The dialog can mount a frame or two after `active` flips (and some
    // dialogs render their trapped element behind an early return), so poll a
    // few frames for the node instead of assuming it exists on this pass.
    let raf = 0;
    let tries = 0;
    const arm = () => {
      const node = ref.current;
      if (!node) {
        if (tries++ < 10) raf = requestAnimationFrame(arm);
        return;
      }
      const first = visibleFocusable(node)[0];
      if (first) {
        first.focus();
      } else {
        node.tabIndex = -1;
        node.focus();
      }
    };
    raf = requestAnimationFrame(arm);

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      restoreTo.current?.focus?.();
    };
  }, [active]);

  return ref;
}
