'use client';

import type Lenis from 'lenis';

/**
 * Tiny module-level store so UI (e.g. the auto-scroll button) can reach the
 * single Lenis instance created in `useSmoothScroll` without prop drilling or
 * a full context provider.
 */
let instance: Lenis | null = null;
const subscribers = new Set<(l: Lenis | null) => void>();

export function setLenis(l: Lenis | null): void {
  instance = l;
  subscribers.forEach((cb) => cb(l));
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Subscribe to instance changes; fires immediately with the current value. */
export function onLenis(cb: (l: Lenis | null) => void): () => void {
  cb(instance);
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}
