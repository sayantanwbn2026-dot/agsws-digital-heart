import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { CMS_UPDATE_EVENT } from '@/lib/cms-sync'

export function useCMSSection<T>(sectionKey: string, fallback: T): { data: T; loading: boolean } {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(() => {
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
    const storageHandler = (e: StorageEvent) => {
      if (e.key === 'agsws_cms_last_updated') handler()
    }
    window.addEventListener('storage', storageHandler)
    // Re-fetch when tab regains focus (covers admin → home tab switch)
    const focusHandler = () => fetchData()
    const visibilityHandler = () => { if (document.visibilityState === 'visible') fetchData() }
    window.addEventListener('focus', focusHandler)
    document.addEventListener('visibilitychange', visibilityHandler)
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handler)
      window.removeEventListener('storage', storageHandler)
      window.removeEventListener('focus', focusHandler)
      document.removeEventListener('visibilitychange', visibilityHandler)
    }
  }, [fetchData])

  return { data, loading }
}
