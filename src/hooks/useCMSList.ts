import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { CMS_UPDATE_EVENT } from '@/lib/cms-sync'

interface Options {
  filter?: { column: string; value: any }
  orderBy?: { column: string; ascending?: boolean; nullsFirst?: boolean }
  limit?: number
}

export function useCMSList<T>(
  table: string,
  fallback: T[],
  options?: Options
) {
  const [data, setData] = useState<T[]>(fallback)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(() => {
    let query = (supabase.from(table as any) as any).select('*')

    if (options?.filter) {
      query = query.eq(options.filter.column, options.filter.value)
    }
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true,
        nullsFirst: options.orderBy.nullsFirst ?? false,
      })
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    query.then(({ data: rows }: any) => {
      if (rows?.length) setData(rows as T[])
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
