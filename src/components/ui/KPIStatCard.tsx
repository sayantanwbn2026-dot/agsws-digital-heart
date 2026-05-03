// KPIStatCard — shared, responsive KPI tile used across Hero, Footer,
// Impact Report, Analytics, and any other surface that displays a single
// number + label from `cms_stats` (or any equivalent source).
//
// One component, four visual variants — so spacing, typography rhythm,
// CountUp behaviour, and icon treatment stay consistent everywhere.
//
//   variant="hero"      → large white-on-dark, centered, no card chrome.
//                         Used in HeroSection over the gradient hero.
//   variant="report"    → very large white-on-dark with optional icon and
//                         underline accent. Used in ImpactReport.
//   variant="footer"    → compact, left-aligned, dark surface, no card.
//                         Used in the Footer impact column.
//   variant="analytics" → small glass-card tile with icon, dark surface.
//                         Used in the AnalyticsInfographic sidebar.
//   variant="light"     → light card surface (white bg, dark text). Used
//                         on light pages (DonorWall summary, etc.) when
//                         we want to share the same animation rhythm.
//
// All variants accept the same parsed-stat shape (numeric + prefix/suffix)
// OR a pre-formatted display string. CountUp is opt-in via `animate`.

import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGlobalStats } from '@/hooks/useGlobalStats'

export type KPIVariant = 'hero' | 'report' | 'footer' | 'analytics' | 'light'

export interface KPIStatCardProps {
  /** Shorthand: pull display/numeric/prefix/suffix/label directly from the
   *  global cms_stats table by slug (e.g. "patients", "students", "funds").
   *  When provided, overrides numeric/display/prefix/suffix/label unless
   *  those props are also explicitly set. */
  statKey?: string
  /** Optional pre-formatted display string (e.g. "₹48L+"). If provided and
   *  `animate` is false, this is rendered verbatim. */
  display?: string
  /** Numeric portion for CountUp animation. Required when animate=true. */
  numeric?: number
  /** String shown before the number, e.g. "₹". */
  prefix?: string
  /** String shown after the number, e.g. "+", "L+", "%". */
  suffix?: string
  /** Stat label (rendered as small uppercase caption). Optional when
   *  `statKey` is provided — the label will be sourced from cms_stats. */
  label?: string
  /** Lucide icon component, OR a string name resolved from lucide-react.
   *  Only rendered by variants that show icons (report, analytics). */
  icon?: LucideIcon | string | null
  /** Animate the number with CountUp on first scroll into view. */
  animate?: boolean
  /** Stagger delay in seconds. */
  delay?: number
  /** Tone variant — see file header. */
  variant?: KPIVariant
  /** Optional accent colour (used by analytics + light variants for the
   *  icon ring / underline). Falls back to the variant default. */
  accent?: string
  className?: string
}

function resolveIcon(icon: KPIStatCardProps['icon']): LucideIcon | null {
  if (!icon) return null
  if (typeof icon === 'string') {
    const I = (Icons as any)[icon] as LucideIcon | undefined
    return I ?? null
  }
  return icon
}

/** Variant-specific Tailwind class bundles. Centralised so spacing &
 *  typography rhythm stay in lockstep across the site. */
const VARIANT_STYLES: Record<KPIVariant, {
  wrap: string
  number: string
  label: string
  icon: string
  underline: string | null
  align: 'center' | 'left'
  iconSize: number
  showUnderline: boolean
}> = {
  hero: {
    wrap: 'px-3 sm:px-4 py-1',
    number: 'text-[clamp(24px,3.5vw,36px)] font-[800] text-white leading-none tracking-[-0.02em]',
    label: 'text-[10px] font-[500] text-white/50 mt-1.5 uppercase tracking-[0.1em]',
    icon: 'text-white/60',
    underline: null,
    align: 'center',
    iconSize: 18,
    showUnderline: false,
  },
  report: {
    wrap: 'group',
    number: 'text-[clamp(40px,7vw,80px)] font-extrabold text-white leading-none tracking-tighter block',
    label: 'text-[11px] sm:text-sm font-medium text-white/40 uppercase tracking-widest mt-3',
    icon: 'mx-auto mb-3 text-[hsl(var(--primary))]/60',
    underline: 'h-[2px] bg-[hsl(var(--accent))] mx-auto mt-4 rounded-full',
    align: 'center',
    iconSize: 24,
    showUnderline: true,
  },
  footer: {
    wrap: '',
    number: 'text-lg font-bold text-white leading-none',
    label: 'text-[10px] text-white/40 uppercase tracking-wider mt-1',
    icon: 'text-white/40',
    underline: null,
    align: 'left',
    iconSize: 14,
    showUnderline: false,
  },
  analytics: {
    wrap: 'bg-white/[0.04] rounded-[16px] border border-white/[0.06] p-4',
    number: 'text-[18px] font-[800] text-white leading-none',
    label: 'text-[9px] text-white/30 uppercase tracking-[0.06em] font-[500] mt-1',
    icon: 'mx-auto mb-2',
    underline: null,
    align: 'center',
    iconSize: 18,
    showUnderline: false,
  },
  light: {
    wrap: 'bg-white rounded-[var(--radius-xl)] border border-[var(--border-color)] p-4 sm:p-5 shadow-[var(--shadow-card)]',
    number: 'text-[clamp(20px,4vw,28px)] font-[800] text-[var(--dark)] leading-none',
    label: 'text-[11px] font-[500] text-[var(--light)] uppercase tracking-[0.06em] mt-1',
    icon: 'mx-auto mb-3',
    underline: null,
    align: 'center',
    iconSize: 18,
    showUnderline: false,
  },
}

const KPIStatCard = ({
  statKey,
  display,
  numeric,
  prefix = '',
  suffix = '',
  label,
  icon,
  animate = false,
  delay = 0,
  variant = 'hero',
  accent,
  className,
}: KPIStatCardProps) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })
  const styles = VARIANT_STYLES[variant]
  const { get } = useGlobalStats()

  // When statKey is provided, hydrate any missing field from the CMS row.
  if (statKey) {
    const stat = get(statKey)
    if (display === undefined) display = stat.display
    if (numeric === undefined) numeric = stat.numeric
    if (!prefix) prefix = stat.prefix
    if (!suffix) suffix = stat.suffix
    if (!label) label = stat.label
    if (!icon && stat.icon) icon = stat.icon as any
  }
  const Icon = resolveIcon(icon)

  // Render the number. CountUp only fires when both animate=true AND a
  // numeric value is provided. Otherwise we trust the display string.
  const num = (() => {
    if (animate && typeof numeric === 'number') {
      return (
        <>
          {prefix}
          {inView ? <CountUp end={numeric} duration={2.2} /> : '0'}
          {suffix}
        </>
      )
    }
    if (display) return display
    return `${prefix}${numeric ?? 0}${suffix}`
  })()

  const alignCls = styles.align === 'center' ? 'text-center' : 'text-left'

  // Icon style: analytics + light variants accept an `accent` colour for
  // the icon stroke; report + footer fall back to the variant default.
  const iconStyle = accent && (variant === 'analytics' || variant === 'light')
    ? { color: accent }
    : undefined

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className={cn(styles.wrap, alignCls, className)}
    >
      {Icon && <Icon size={styles.iconSize} className={styles.icon} style={iconStyle} />}
      <span
        className={styles.number}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {num}
      </span>
      <p className={styles.label}>{label}</p>
      {styles.showUnderline && styles.underline && (
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: 28 } : {}}
          transition={{ delay: delay + 0.4, duration: 0.5 }}
          className={styles.underline}
        />
      )}
    </motion.div>
  )
}

export default KPIStatCard