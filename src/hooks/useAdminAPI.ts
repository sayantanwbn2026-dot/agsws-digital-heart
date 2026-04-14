const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function getToken() {
  return localStorage.getItem('agsws_admin_token') ?? '';
}

export function useAdminAPI() {

  const adminFetch = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any
  ) => {
    const token = getToken()
    const targetUrl = url.startsWith('http') ? url : `${SUPABASE_URL}${url}`
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': ANON_KEY,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    return res.json()
  }

  return { adminFetch }
}
