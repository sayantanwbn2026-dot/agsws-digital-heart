#!/usr/bin/env node
// Build-time CMS audit. Runs against the live Supabase project and verifies
// every cms_sections key + cms_stats logical key + required CMS table referenced
// by src/lib/cms-manifest.ts has data. Intended to run via the Vite plugin in
// vite.config.ts on every `vite build` (and also invocable directly for CI).
//
// Failures are printed but DO NOT block the build by default — set
// CMS_AUDIT_STRICT=1 to make audit failures fail the build.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Read the manifest as text and extract the required arrays.
// We don't import the TS file directly to keep the script tooling-free.
function loadManifest() {
  const src = readFileSync(resolve(__dirname, '../src/lib/cms-manifest.ts'), 'utf8')
  const sectionMatches = [...src.matchAll(/sections:\s*\[([^\]]*)\]/g)]
    .flatMap(m => [...m[1].matchAll(/'([a-z0-9_]+)'/g)].map(x => x[1]))
  const tableMatches = [...src.matchAll(/tables:\s*\[([^\]]*)\]/g)]
    .flatMap(m => [...m[1].matchAll(/'([a-z0-9_]+)'/g)].map(x => x[1]))
  const statMatches = [...src.matchAll(/statKeys:\s*\[([^\]]*)\]/g)]
    .flatMap(m => [...m[1].matchAll(/'([a-z0-9_]+)'/g)].map(x => x[1]))
  return {
    sections: [...new Set(sectionMatches)],
    tables: [...new Set(tableMatches)],
    statKeys: [...new Set(statMatches)],
  }
}

const ALIASES = {
  patients: ['patient', 'patients'],
  students: ['student', 'students', 'children'],
  families: ['family', 'families', 'parents'],
  years: ['year', 'years'],
  funds: ['funds'],
  cities: ['city', 'cities'],
  donors: ['donor', 'donors'],
}
function resolveStatKey(label) {
  const slug = (label || '').toLowerCase().replace(/[^a-z0-9]/g, '')
  for (const [key, aliases] of Object.entries(ALIASES)) {
    if (aliases.some(a => slug === a || slug.includes(a))) return key
  }
  return slug
}

async function fetchJson(url, key) {
  const res = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

export async function runAudit({ url, key, strict = false } = {}) {
  const SUPABASE_URL = url || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const SUPABASE_KEY = key || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('[cms-audit] Skipping — Supabase URL/key not available in this build environment.')
    return { ok: true, skipped: true }
  }
  const manifest = loadManifest()
  try {
    const [sectionsRows, statsRows] = await Promise.all([
      fetchJson(`${SUPABASE_URL}/rest/v1/cms_sections?select=section_key`, SUPABASE_KEY),
      fetchJson(`${SUPABASE_URL}/rest/v1/cms_stats?select=label`, SUPABASE_KEY),
    ])
    const haveSections = new Set(sectionsRows.map(r => r.section_key))
    const haveStatKeys = new Set(statsRows.map(r => resolveStatKey(r.label)))
    const tableCounts = {}
    await Promise.all(manifest.tables.map(async t => {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${t}?select=id`, {
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact', Range: '0-0' },
        })
        const range = res.headers.get('content-range') || '0/0'
        const total = Number(range.split('/').pop()) || 0
        tableCounts[t] = total
      } catch { tableCounts[t] = 0 }
    }))

    const missingSections = manifest.sections.filter(s => !haveSections.has(s))
    const missingStats = manifest.statKeys.filter(s => !haveStatKeys.has(s))
    const emptyTables = manifest.tables.filter(t => (tableCounts[t] ?? 0) === 0)
    const ok = missingSections.length === 0 && missingStats.length === 0 && emptyTables.length === 0

    const tag = ok ? '\x1b[32m[cms-audit] PASS\x1b[0m' : '\x1b[33m[cms-audit] WARN\x1b[0m'
    console.log(`${tag} sections:${manifest.sections.length}/${haveSections.size} stats:${manifest.statKeys.length} tables:${manifest.tables.length}`)
    if (missingSections.length) console.warn('  · missing cms_sections keys:', missingSections.join(', '))
    if (missingStats.length)    console.warn('  · missing cms_stats keys:   ', missingStats.join(', '))
    if (emptyTables.length)     console.warn('  · empty CMS tables:         ', emptyTables.join(', '))

    if (!ok && strict) {
      throw new Error('CMS audit failed (CMS_AUDIT_STRICT=1)')
    }
    return { ok, missingSections, missingStats, emptyTables }
  } catch (err) {
    console.warn('[cms-audit] Could not reach Supabase, skipping audit:', err.message)
    return { ok: true, skipped: true }
  }
}

// Allow direct invocation: `node scripts/cms-audit.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  runAudit({ strict: process.env.CMS_AUDIT_STRICT === '1' }).then(r => {
    if (!r.ok && !r.skipped) process.exit(1)
  })
}