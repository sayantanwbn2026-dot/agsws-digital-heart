import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useCMSData<T>(table: string, fallback: T) {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from(table)
      .select('*')
      .limit(1)
      .single()
      .then(({ data: row }) => {
        if (row) setData(row as T)
        setLoading(false)
      })
  }, [table])

  return { data, loading }
}
