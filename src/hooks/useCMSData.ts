import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { CMS_UPDATE_EVENT } from '@/lib/cms-sync'
import { isPreviewMode, previewFetchTable } from '@/lib/cms-preview'

export function useCMSData<T>(table: string, fallback: T) {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(() => {
    if (isPreviewMode()) {
      previewFetchTable(table).then((rows) => {
        if (rows && rows.length) setData(rows[0] as T)
        setLoading(false)
      })
      return
    }
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
    window.addEventListener('agsws-preview-changed', handler)
    window.addEventListener('storage', (e) => {
      if (e.key === 'agsws_cms_last_updated') handler()
    })
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handler)
      window.removeEventListener('agsws-preview-changed', handler)
    }
  }, [fetchData])

  return { data, loading, refetch: fetchData }
}
