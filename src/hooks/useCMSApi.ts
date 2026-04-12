import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCMSApi() {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('agsws_admin_token') ?? '';

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

      // Use the Supabase URL directly to avoid preview proxy issues
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const url = `${supabaseUrl}/functions/v1/cms-api?${params}`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
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
  }, [token]);

  const getAll = (table: string) => cmsFetch(table, 'GET');
  const create = (table: string, body: any) => cmsFetch(table, 'POST', body);
  const update = (table: string, id: string, body: any) => cmsFetch(table, 'PUT', body, id);
  const remove = (table: string, id: string) => cmsFetch(table, 'DELETE', undefined, id);

  const uploadImage = useCallback(async (file: File, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const res = await fetch(`${supabaseUrl}/functions/v1/cms-api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.url;
  }, [token]);

  return { getAll, create, update, remove, uploadImage, loading };
}
