// Shared Supabase Realtime subscription manager for CMS tables.
//
// React hooks (useCMSData, useCMSList, useCMSSection) call subscribeRealtime()
// to register a refetch callback against a given Postgres table. We multiplex
// all subscribers for the same table onto a SINGLE Supabase channel so we
// don't open dozens of WebSockets when many components mount.
//
// On any INSERT/UPDATE/DELETE in the table, every registered callback fires.
// The channel is torn down automatically when the last subscriber unsubscribes.

import { supabase } from '@/integrations/supabase/client'

type Listener = () => void

interface ChannelEntry {
  channel: ReturnType<typeof supabase.channel>
  listeners: Set<Listener>
}

const channels = new Map<string, ChannelEntry>()

export function subscribeRealtime(table: string, listener: Listener): () => void {
  let entry = channels.get(table)
  if (!entry) {
    const channel = supabase
      .channel(`cms-rt-${table}`)
      .on(
        'postgres_changes' as any,
        { event: '*', schema: 'public', table },
        () => {
          const e = channels.get(table)
          if (!e) return
          e.listeners.forEach((fn) => {
            try { fn() } catch { /* ignore */ }
          })
        }
      )
      .subscribe()
    entry = { channel, listeners: new Set() }
    channels.set(table, entry)
  }

  entry.listeners.add(listener)

  return () => {
    const e = channels.get(table)
    if (!e) return
    e.listeners.delete(listener)
    if (e.listeners.size === 0) {
      try { supabase.removeChannel(e.channel) } catch { /* ignore */ }
      channels.delete(table)
    }
  }
}