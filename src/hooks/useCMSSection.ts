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
      .single()
      .then(({ data: row }: any) => {
        if (row?.content) setData(row.content as T)
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
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [fetchData])

  return { data, loading }
}
