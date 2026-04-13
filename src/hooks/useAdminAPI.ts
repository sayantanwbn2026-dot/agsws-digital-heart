function getAdminToken() {
  return localStorage.getItem('agsws_admin_token') ?? '';
}

async function parseResponse(res: Response) {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

export function useAdminAPI() {
  const adminFetch = async (
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any
  ) => {
    const token = getAdminToken();

    if (!token) {
      throw new Error('Your admin session has expired. Please sign in again.');
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    let res: Response;
    try {
      res = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new Error('Network request failed. Please refresh and try again.');
    }

    const data = await parseResponse(res);

    if (!res.ok) {
      throw new Error(data?.error || `Request failed (${res.status})`);
    }

    return data;
  };

  return { adminFetch };
}
