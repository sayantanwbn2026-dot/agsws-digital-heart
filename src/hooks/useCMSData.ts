import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { CMS_UPDATE_EVENT } from '@/lib/cms-sync'
import { isPreviewMode, previewFetchTable } from '@/lib/cms-preview'
import { subscribeRealtime } from '@/lib/cms-realtime'
import { dedupeRequest } from '@/lib/request-dedupe'

export function useCMSData<T>(table: string, fallback: T) {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(() => {
    const requestKey = `cms-data:${table}:${isPreviewMode() ? 'preview' : 'public'}`
    if (isPreviewMode()) {
      dedupeRequest<T[] | null>(requestKey, () => previewFetchTable<T>(table), { ttlMs: 15000 }).then((rows) => {
        if (rows && rows.length) setData(rows[0] as T)
        setLoading(false)
      })
      return
    }
    dedupeRequest<T | null>(requestKey, () => (supabase.from(table as any) as any)
      .select('*')
      .limit(1)
      .single()
      .then(({ data: row }: any) => {
        return row as T | null
      }), { ttlMs: 15000 }).then((row) => {
      if (row) setData(row as T)
      setLoading(false)
    })
  }, [table])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Listen for CMS updates and refetch
  useEffect(() => {
    const handler = () => fetchData()
    window.addEventListener(CMS_UPDATE_EVENT, handler)
    window.addEventListener('agsws-preview-changed', handler)
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'agsws_cms_last_updated') handler()
    }
    window.addEventListener('storage', storageHandler)
    const unsub = subscribeRealtime(table, handler)
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handler)
      window.removeEventListener('agsws-preview-changed', handler)
      window.removeEventListener('storage', storageHandler)
      unsub()
    }
  }, [fetchData, table])

  return { data, loading, refetch: fetchData }
}
