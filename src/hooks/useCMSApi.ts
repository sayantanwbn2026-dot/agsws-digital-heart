import { useState, useCallback } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function getToken() {
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

function getCmsHeaders(includeContentType = false) {
  const token = getToken();

  if (!token) {
    throw new Error('Your CMS session has expired. Please sign in again.');
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    apikey: ANON_KEY,
  };

  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

export function useCMSApi() {
  const [loading, setLoading] = useState(false);

  const cmsFetch = useCallback(async (
    table: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any,
    id?: string
  ) => {
    setLoading(true);

    try {
      if (!SUPABASE_URL || !ANON_KEY) {
        throw new Error('CMS is not configured correctly.');
      }

      const params = new URLSearchParams({ table });
      if (id) params.set('id', id);

      const url = `${SUPABASE_URL}/functions/v1/cms-api?${params}`;

      let res: Response;
      try {
        res = await fetch(url, {
          method,
          headers: getCmsHeaders(Boolean(body)),
          body: body ? JSON.stringify(body) : undefined,
        });
      } catch {
        throw new Error('Network request failed. Please refresh and try again.');
      }

      const data = await parseResponse(res);
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAll = (table: string) => cmsFetch(table, 'GET');
  const create = (table: string, body: any) => cmsFetch(table, 'POST', body);
  const update = (table: string, id: string, body: any) => cmsFetch(table, 'PUT', body, id);
  const remove = (table: string, id: string) => cmsFetch(table, 'DELETE', undefined, id);

  const uploadImage = useCallback(async (file: File, folder = 'general') => {
    if (!SUPABASE_URL || !ANON_KEY) {
      throw new Error('CMS is not configured correctly.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    let res: Response;
    try {
      res = await fetch(`${SUPABASE_URL}/functions/v1/cms-api/upload`, {
        method: 'POST',
        headers: getCmsHeaders(),
        body: formData,
      });
    } catch {
      throw new Error('Image upload failed. Please refresh and try again.');
    }

    const data = await parseResponse(res);
    if (!res.ok) {
      throw new Error(data?.error || 'Upload failed');
    }

    return data?.url;
  }, []);

  return { getAll, create, update, remove, uploadImage, loading };
}
