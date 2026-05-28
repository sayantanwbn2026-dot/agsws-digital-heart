import { dedupedJsonFetch, invalidateDedupe } from './request-dedupe';

// CMS Preview Mode utilities.
//
// When preview mode is active, the public site fetches CMS data through the
// authenticated cms-api edge function (service role, RLS bypassed) instead of
// the public Supabase client. This means admins can SEE drafts and
// unpublished rows on the live site exactly as they will appear after
// publishing, without exposing them to the public.
//
// Activation:
//   1. Visit any page with ?preview=1 in the URL while logged into /admin —
//      the URL param flips on a localStorage flag and is stripped.
//   2. The PreviewBar at the top of the screen lets the admin exit preview
//      with one click.
//
// Safety: the cms-api edge function still requires a valid admin Bearer
// token, so a non-admin who manually sets the flag will simply fall back to
// the public/published view (the fetch will 401 and we use the public data).

const PREVIEW_KEY = 'agsws_cms_preview';

export function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(PREVIEW_KEY) === '1' &&
      !!localStorage.getItem('agsws_admin_token');
  } catch {
    return false;
  }
}

export function setPreviewMode(on: boolean) {
  try {
    invalidateDedupe('cms-');
    if (on) localStorage.setItem(PREVIEW_KEY, '1');
    else localStorage.removeItem(PREVIEW_KEY);
    window.dispatchEvent(new CustomEvent('agsws-preview-changed'));
  } catch {}
}

/**
 * Reads ?preview=1 / ?preview=0 from the current URL, applies it, and
 * removes the param from the address bar. Call once in App init.
 */
export function syncPreviewFromURL() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const param = url.searchParams.get('preview');
  if (param === null) return;
  setPreviewMode(param === '1');
  url.searchParams.delete('preview');
  const newSearch = url.searchParams.toString();
  window.history.replaceState(
    {},
    '',
    url.pathname + (newSearch ? `?${newSearch}` : '') + url.hash
  );
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Fetch all rows from a CMS table via the admin edge function.
 * Returns null on failure so callers can fall back to the public client.
 */
export async function previewFetchTable<T = any>(table: string): Promise<T[] | null> {
  try {
    const token = localStorage.getItem('agsws_admin_token') || '';
    if (!token) return null;
    const url = `${SUPABASE_URL}/functions/v1/cms-api?table=${encodeURIComponent(table)}`;
    const data = await dedupedJsonFetch<T[] | T>(`cms-preview:${table}`, url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': ANON_KEY,
      },
    }, { ttlMs: 15000 });
    return Array.isArray(data) ? data : [data];
  } catch {
    return null;
  }
}
