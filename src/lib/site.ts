/**
 * The site's public origin — the single source of truth for canonical URLs,
 * Open Graph URLs, JSON-LD and anything printed for people to visit later
 * (e.g. certificate verification links).
 *
 * Override per environment with VITE_SITE_URL (no trailing slash). The
 * default is the production domain; it must match `SITE_URL` used by
 * scripts/generate-sitemap.ts and the canonical in index.html.
 */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) || "https://agsws.org"
).replace(/\/+$/, "");

/** Bare host for display text, e.g. "agsws.org". */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
