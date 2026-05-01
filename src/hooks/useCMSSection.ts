import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { CMS_UPDATE_EVENT } from '@/lib/cms-sync'
import { isPreviewMode, previewFetchTable } from '@/lib/cms-preview'
import { subscribeRealtime } from '@/lib/cms-realtime'

export function useCMSSection<T>(sectionKey: string, fallback: T): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(() => {
    if (isPreviewMode()) {
      previewFetchTable('cms_sections').then((rows) => {
        const row = rows?.find((r: any) => r.section_key === sectionKey)
        if (row?.content && typeof row.content === 'object') {
          setData({ ...(fallback as any), ...row.content } as T)
        }
        setLoading(false)
      })
      return
    }
    (supabase.from('cms_sections' as any) as any)
      .select('content')
      .eq('section_key', sectionKey)
      .limit(1)
      .maybeSingle()
      .then(({ data: row }: any) => {
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
    // Re-fetch when tab regains focus (covers admin → home tab switch)
    const focusHandler = () => fetchData()
    const visibilityHandler = () => { if (document.visibilityState === 'visible') fetchData() }
    window.addEventListener('focus', focusHandler)
    document.addEventListener('visibilitychange', visibilityHandler)
    const unsub = subscribeRealtime('cms_sections', handler)
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handler)
      window.removeEventListener('agsws-preview-changed', handler)
      window.removeEventListener('storage', storageHandler)
      window.removeEventListener('focus', focusHandler)
      document.removeEventListener('visibilitychange', visibilityHandler)
      unsub()
    }
  }, [fetchData])

  return { data, loading }
}
