import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface Options {
  filter?: { column: string; value: any }
  orderBy?: { column: string; ascending?: boolean }
  limit?: number
}

export function useCMSList<T>(
  table: string,
  fallback: T[],
  options?: Options
) {
  const [data, setData] = useState<T[]>(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let query = (supabase.from(table as any) as any).select('*')

    if (options?.filter) {
      query = query.eq(options.filter.column, options.filter.value)
    }
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
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

  return { data, loading }
}
