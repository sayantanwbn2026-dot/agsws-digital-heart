// useGlobalStats — universal access to site-wide KPI numbers from `cms_stats`.
//
// All stat numbers across the site (Hero, Footer, Impact Report, Analytics,
// About, Initiatives, etc.) should source from this hook so editing a value
// in the CMS updates EVERY page instantly via Realtime.
//
// Lookup is by a normalised slug derived from the stat label, e.g.
//   "Patients Supported"  -> "patients"
//   "Children Educated"   -> "students" (alias) / "children"
//   "Families Registered" -> "families"
//   "Years of Service"    -> "years"
//   "Funds Distributed"   -> "funds"
//
// Each entry exposes both the raw display string ("2,400+", "₹48L+") and a
// parsed numeric value + prefix/suffix for use with CountUp.

import { useMemo } from 'react'
import { useCMSList } from './useCMSList'

export interface ParsedStat {
  key: string
  label: string
  display: string
  numeric: number
  prefix: string
  suffix: string
  icon?: string | null
}

const ALIASES: Record<string, string[]> = {
  patients: ['patient', 'patients', 'patientssupported', 'patientsaided', 'patientshelped'],
  students: ['student', 'students', 'children', 'childreneducated', 'studentssponsored', 'studentssupported'],
  families: ['family', 'families', 'familiesregistered', 'parents', 'parentsregistered'],
  years: ['year', 'years', 'yearsofservice'],
  funds: ['funds', 'fundsdistributed', 'fundsdeployed', 'fundsraised'],
  cities: ['city', 'cities'],
  donors: ['donor', 'donors', 'totaldonors'],
}

function slugify(s: string): string {
  return (s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function resolveKey(label: string): string {
  const slug = slugify(label)
  for (const [key, aliases] of Object.entries(ALIASES)) {
    if (aliases.some(a => slug === a || slug.includes(a))) return key
  }
  return slug
}

export function parseStatValue(raw: string): { numeric: number; prefix: string; suffix: string } {
  const value = raw ?? ''
  const numMatch = value.match(/[\d,.]+/)
  const numeric = numMatch ? parseFloat(numMatch[0].replace(/,/g, '')) : 0
  const prefix = (value.match(/^[^\d]*/)?.[0] ?? '').trim()
  const suffix = (value.replace(/^[^\d]*[\d,.]+/, '') ?? '').trim()
  return { numeric, prefix, suffix }
}

export function useGlobalStats() {
  const { data, loading } = useCMSList<any>('cms_stats', [], { orderBy: { column: 'sort_order' } })

  const stats = useMemo<ParsedStat[]>(() => {
    return (data || []).map((row: any) => {
      const parsed = parseStatValue(row.value)
      return {
        key: resolveKey(row.label),
        label: row.label,
        display: row.value,
        numeric: parsed.numeric,
        prefix: parsed.prefix,
        suffix: parsed.suffix,
        icon: row.icon ?? null,
      }
    })
  }, [data])

  const byKey = useMemo(() => {
    const map: Record<string, ParsedStat> = {}
    stats.forEach(s => { if (!map[s.key]) map[s.key] = s })
    return map
  }, [stats])

  /** Get a stat by named key, with a safe fallback. */
  const get = (key: string, fallback?: Partial<ParsedStat>): ParsedStat => {
    return byKey[key] || ({
      key,
      label: fallback?.label ?? '',
      display: fallback?.display ?? '0',
      numeric: fallback?.numeric ?? 0,
      prefix: fallback?.prefix ?? '',
      suffix: fallback?.suffix ?? '',
      icon: null,
    } as ParsedStat)
  }

  return { stats, byKey, get, loading }
}