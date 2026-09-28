/**
 * Route chunk prefetching.
 *
 * Splitting every page keeps the entry bundle small, but it also means a
 * navigation can't paint until its chunk arrives. This registry lets the app
 * fetch a chunk *before* the click — on link hover/focus, and for the handful
 * of high-traffic routes during the browser's first idle window — so the split
 * is invisible to the visitor.
 *
 * Each loader is invoked at most once; the browser caches the module after that.
 */

type Loader = () => Promise<unknown>;

const loaders = new Map<string, Loader>();
const started = new Set<string>();

export function registerRoute(path: string, loader: Loader) {
  loaders.set(path, loader);
}

/** Fetch a route's chunk now, if it isn't already in flight. */
export function prefetchRoute(path?: string | null) {
  if (!path || started.has(path)) return;
  const loader = loaders.get(path);
  if (!loader) return;
  started.add(path);
  // Failures are non-fatal: the real navigation will retry and surface errors.
  loader().catch(() => started.delete(path));
}

/**
 * Warm the routes most visitors reach next, once the main thread is free.
 * Skipped on save-data or 2g connections, where speculative downloads cost the
 * visitor real money and bandwidth they'd rather spend on the page they asked for.
 */
export function prefetchWhenIdle(paths: string[]) {
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (conn?.saveData) return;
  if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return;

  const run = () => paths.forEach(prefetchRoute);
  if ("requestIdleCallback" in window) {
    (window as Window & {
      requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback(run, { timeout: 3000 });
  } else {
    setTimeout(run, 1500);
  }
}
