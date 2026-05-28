import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { CMS_UPDATE_EVENT } from '@/lib/cms-sync'
import { isPreviewMode, previewFetchTable } from '@/lib/cms-preview'
import { subscribeRealtime } from '@/lib/cms-realtime'
import { dedupeRequest } from '@/lib/request-dedupe'

export function useCMSSection<T>(sectionKey: string, fallback: T): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(() => {
    const requestKey = `cms-section:${sectionKey}:${isPreviewMode() ? 'preview' : 'public'}`
    if (isPreviewMode()) {
      dedupeRequest<any[] | null>(requestKey, () => previewFetchTable('cms_sections'), { ttlMs: 5000 }).then((rows) => {
        const row = rows?.find((r: any) => r.section_key === sectionKey)
        if (row?.content && typeof row.content === 'object') {
          setData({ ...(fallback as any), ...row.content } as T)
        }
        setLoading(false)
      })
      return
    }
    dedupeRequest<any | null>(requestKey, () => (supabase.from('cms_sections' as any) as any)
      .select('content')
      .eq('section_key', sectionKey)
      .limit(1)
      .maybeSingle()
      .then(({ data: row }: any) => {
        return row
      }), { ttlMs: 5000 }).then((row) => {
      if (row?.content && typeof row.content === 'object') {
        // Merge fetched content over fallback so missing keys keep defaults
        setData({ ...(fallback as any), ...row.content } as T)
      }
      setLoading(false)
    })
  }, [sectionKey])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    const handler = () => fetchData()
    window.addEventListener(CMS_UPDATE_EVENT, handler)
    window.addEventListener('agsws-preview-changed', handler)
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'agsws_cms_last_updated') handler()
    }
    window.addEventListener('storage', storageHandler)
    const unsub = subscribeRealtime('cms_sections', handler)
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handler)
      window.removeEventListener('agsws-preview-changed', handler)
      window.removeEventListener('storage', storageHandler)
      unsub()
    }
  }, [fetchData])

  return { data, loading }
}
