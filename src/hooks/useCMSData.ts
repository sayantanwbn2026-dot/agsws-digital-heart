import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { CMS_UPDATE_EVENT } from '@/lib/cms-sync'

export function useCMSData<T>(table: string, fallback: T) {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(() => {
    (supabase.from(table as any) as any)
      .select('*')
      .limit(1)
      .single()
      .then(({ data: row }: any) => {
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
    window.addEventListener('storage', (e) => {
      if (e.key === 'agsws_cms_last_updated') handler()
    })
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handler)
    }
  }, [fetchData])

  return { data, loading, refetch: fetchData }
}
