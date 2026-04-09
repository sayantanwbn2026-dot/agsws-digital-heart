import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function useCMSData<T>(table: string, fallback: T) {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (supabase.from(table as any) as any)
      .select('*')
      .limit(1)
      .single()
      .then(({ data: row }: any) => {
        if (row) setData(row as T)
        setLoading(false)
      })
  }, [table])

  return { data, loading }
}
