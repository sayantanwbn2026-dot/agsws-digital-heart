const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function getToken() {
  return localStorage.getItem('agsws_admin_token') ?? '';
}

/**
 * Admin API client that maps legacy `/api/admin/*` paths to the
 * Supabase Edge Function `data-api/admin-*` actions. This keeps
 * existing call-sites unchanged while routing through Supabase
 * (which is where the deployment actually lives).
 */
function rewriteUrl(input: string): string {
  if (input.startsWith('http')) return input;
  // Map admin paths to data-api edge function actions
  if (input.startsWith('/api/admin/donations')) {
    const qs = input.split('?')[1] ?? '';
    return `${SUPABASE_URL}/functions/v1/data-api?action=admin-donations${qs ? `&${qs}` : ''}`;
  }
  if (input.startsWith('/api/admin/registrations')) {
    const qs = input.split('?')[1] ?? '';
    return `${SUPABASE_URL}/functions/v1/data-api?action=admin-registrations${qs ? `&${qs}` : ''}`;
  }
  // Default: assume same-origin Supabase function
  return `${SUPABASE_URL}${input}`;
}

export function useAdminAPI() {
  const adminFetch = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any
  ) => {
    const token = getToken();
    const targetUrl = rewriteUrl(url);
    const res = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': ANON_KEY,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  };

  return { adminFetch };
}
