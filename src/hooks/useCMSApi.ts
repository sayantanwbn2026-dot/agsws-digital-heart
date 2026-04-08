import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseCMSApiOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useCMSApi() {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('agsws_admin_token') ?? '';
  
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || 
    import.meta.env.VITE_SUPABASE_URL?.replace('https://', '').replace('.supabase.co', '') || '';

  const baseUrl = `https://${projectId}.supabase.co/functions/v1`;

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
      
      const res = await fetch(`${baseUrl}/cms-api?${params}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
  }, [token, baseUrl]);

  const getAll = (table: string) => cmsFetch(table, 'GET');
  const create = (table: string, body: any) => cmsFetch(table, 'POST', body);
  const update = (table: string, id: string, body: any) => cmsFetch(table, 'PUT', body, id);
  const remove = (table: string, id: string) => cmsFetch(table, 'DELETE', undefined, id);

  const uploadImage = useCallback(async (file: File, folder = 'general') => {
    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    
    const { data, error } = await supabase.storage
      .from('cms-uploads')
      .upload(path, file, { cacheControl: '3600', upsert: false });
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('cms-uploads')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  }, []);

  return { getAll, create, update, remove, uploadImage, loading };
}
