import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { CMS_UPDATE_EVENT } from '@/lib/cms-sync'
import { isPreviewMode, previewFetchTable } from '@/lib/cms-preview'
import { subscribeRealtime } from '@/lib/cms-realtime'

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
    if (isPreviewMode()) {
      previewFetchTable(table).then((rows) => {
        if (rows) {
          let result = rows as any[]
          if (options?.filter) {
            result = result.filter((r) => r[options.filter!.column] === options.filter!.value)
          }
          if (options?.orderBy) {
            const col = options.orderBy.column
            const asc = options.orderBy.ascending ?? true
            result = [...result].sort((a, b) => {
              const av = a[col]; const bv = b[col]
              if (av == null && bv == null) return 0
              if (av == null) return options.orderBy!.nullsFirst ? -1 : 1
              if (bv == null) return options.orderBy!.nullsFirst ? 1 : -1
              if (av < bv) return asc ? -1 : 1
              if (av > bv) return asc ? 1 : -1
              return 0
            })
          }
          if (options?.limit) result = result.slice(0, options.limit)
          setData(result as T[])
        }
        setLoading(false)
      })
      return
    }
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
