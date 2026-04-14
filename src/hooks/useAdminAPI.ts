export function useAdminAPI() {
  const token = localStorage.getItem('agsws_admin_token') ?? ''

  const adminFetch = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any
  ) => {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    return res.json()
  }

  return { adminFetch }
}
