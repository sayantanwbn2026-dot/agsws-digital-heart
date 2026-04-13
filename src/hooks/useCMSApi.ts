import { useState, useCallback } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function getToken() {
  return localStorage.getItem('agsws_admin_token') ?? '';
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
      const params = new URLSearchParams({ table });
      if (id) params.set('id', id);

      const url = `${SUPABASE_URL}/functions/v1/cms-api?${params}`;
      const token = getToken();

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': ANON_KEY,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAll = (table: string) => cmsFetch(table, 'GET');
  const create = (table: string, body: any) => cmsFetch(table, 'POST', body);
  const update = (table: string, id: string, body: any) => cmsFetch(table, 'PUT', body, id);
  const remove = (table: string, id: string) => cmsFetch(table, 'DELETE', undefined, id);

  const uploadImage = useCallback(async (file: File, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = getToken();
    const res = await fetch(`${SUPABASE_URL}/functions/v1/cms-api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': ANON_KEY,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.url;
  }, []);

  return { getAll, create, update, remove, uploadImage, loading };
}
