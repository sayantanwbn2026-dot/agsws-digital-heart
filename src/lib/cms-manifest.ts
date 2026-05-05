// CMS manifest — single source of truth mapping every frontend route
// to the cms_sections keys and cms_stats logical keys it depends on.
//
// Both the build-time auditor (vite plugin) and the in-app admin auditor
// import this file so a single edit keeps every check in sync.

export interface RouteCMSBinding {
  /** React Router path (informational; used for display + dedupe). */
  route: string;
  /** Human label shown in the admin audit panel. */
  label: string;
  /** cms_sections.section_key rows that MUST exist for this page. */
  sections?: string[];
  /** cms_* tables that should have at least one published row. */
  tables?: string[];
  /** Logical KPI keys (resolved by useGlobalStats) the page binds to. */
  statKeys?: string[];
}

export const CMS_MANIFEST: RouteCMSBinding[] = [
  {
    route: '/',
    label: 'Home',
    sections: ['how_it_works', 'scrolling_stories', 'impact_story', 'analytics', 'cta_banner', 'trust_band'],
    tables: ['cms_hero', 'cms_stats', 'cms_initiatives', 'cms_testimonials', 'cms_partners', 'cms_impact_zones', 'cms_blog_posts'],
    statKeys: ['patients', 'students', 'families', 'years', 'funds'],
  },
  {
    route: '/about',
    label: 'About',
    sections: ['about_mission', 'about_values', 'about_counters', 'about_timeline', 'about_docs', 'about_cta'],
    tables: ['cms_team'],
  },
  { route: '/initiatives', label: 'Initiatives', tables: ['cms_initiatives'] },
  { route: '/initiatives/medical', label: 'Medical Aid', sections: ['medical_page'] },
  { route: '/initiatives/education', label: 'Education Support', sections: ['education_page'] },
  { route: '/impact', label: 'Impact Report', sections: ['impact_report'], statKeys: ['patients', 'students', 'families', 'funds'] },
  { route: '/donor-wall', label: 'Donor Wall', sections: ['donor_wall'] },
  { route: '/volunteer-portal', label: 'Volunteer Portal', sections: ['volunteer_portal'] },
  { route: '/register-parent', label: 'GoldenAge / Register Parent', sections: ['register_parent'] },
  { route: '/blog', label: 'Blog', tables: ['cms_blog_posts'] },
  { route: '/events', label: 'Events', tables: ['cms_events'] },
  { route: '/gallery', label: 'Gallery', tables: ['cms_gallery', 'cms_videos'] },
  { route: '/faq', label: 'FAQ', tables: ['cms_faqs'] },
  { route: '/resources', label: 'Resources', tables: ['cms_resources'] },
  { route: '/updates', label: 'Updates', sections: ['updates_page'], tables: ['cms_updates'] },
  { route: '/contact', label: 'Contact', sections: ['contact_page'] },
  { route: '/transparency', label: 'Transparency', sections: ['transparency_page'] },
  // Footer is global but bound through the home route audit too:
  { route: '*footer*', label: 'Global Footer', sections: ['footer'], tables: ['cms_site_settings'] },
];

/** Flat de-duplicated list of all required section keys. */
export const REQUIRED_SECTION_KEYS = Array.from(
  new Set(CMS_MANIFEST.flatMap(r => r.sections ?? []))
).sort();

/** Flat de-duplicated list of all required CMS tables. */
export const REQUIRED_TABLES = Array.from(
  new Set(CMS_MANIFEST.flatMap(r => r.tables ?? []))
).sort();

/** Flat de-duplicated list of all required stat logical keys. */
export const REQUIRED_STAT_KEYS = Array.from(
  new Set(CMS_MANIFEST.flatMap(r => r.statKeys ?? []))
).sort();

export interface CMSAuditResult {
  ok: boolean;
  missingSections: string[];
  missingStatKeys: string[];
  emptyTables: string[];
  routeIssues: Array<{ route: string; label: string; missing: string[] }>;
}

/** Pure audit function — no I/O. Caller passes in the fetched data. */
export function auditCMS(data: {
  sectionKeys: string[];
  statKeys: string[];          // already-resolved logical keys (patients, students, ...)
  tableCounts: Record<string, number>;
}): CMSAuditResult {
  const haveSections = new Set(data.sectionKeys);
  const haveStats = new Set(data.statKeys);

  const missingSections = REQUIRED_SECTION_KEYS.filter(k => !haveSections.has(k));
  const missingStatKeys = REQUIRED_STAT_KEYS.filter(k => !haveStats.has(k));
  const emptyTables = REQUIRED_TABLES.filter(t => (data.tableCounts[t] ?? 0) === 0);

  const routeIssues = CMS_MANIFEST.map(r => {
    const missing: string[] = [];
    (r.sections ?? []).forEach(s => { if (!haveSections.has(s)) missing.push(`section:${s}`); });
    (r.statKeys ?? []).forEach(s => { if (!haveStats.has(s)) missing.push(`stat:${s}`); });
    (r.tables ?? []).forEach(t => { if ((data.tableCounts[t] ?? 0) === 0) missing.push(`table:${t}`); });
    return { route: r.route, label: r.label, missing };
  }).filter(r => r.missing.length > 0);

  return {
    ok: missingSections.length === 0 && missingStatKeys.length === 0 && emptyTables.length === 0,
    missingSections,
    missingStatKeys,
    emptyTables,
    routeIssues,
  };
}