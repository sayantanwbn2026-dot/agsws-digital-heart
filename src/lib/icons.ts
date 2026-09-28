/**
 * Icon resolution for CMS-authored content.
 *
 * CMS rows store an icon as a *string* name (e.g. "Heart"). Resolving that used
 * to be `import * as Icons from 'lucide-react'`, which forces the bundler to
 * keep all ~1,500 icon components — several hundred KB — in whatever chunk the
 * consumer lands in. Because KPIStatCard renders in the homepage hero, that was
 * the entry chunk, on every first visit.
 *
 * Instead we bundle the icons the site actually uses and fall back to a lazy
 * import for anything else, so an editor picking an unlisted icon still works —
 * it just costs one extra request on that page rather than on every page.
 */
import {
  Activity, Award, BookOpen, Building2, Calendar, CheckCircle2, Clock,
  CreditCard, Eye, FileCheck, FileText, Gift, Globe, GraduationCap, Handshake,
  Heart, HeartHandshake, Home, IdCard, Image, Library, Lightbulb, Lock, Mail,
  MapPin, Monitor, Newspaper, Phone, Pill, Scale, Shield, ShieldCheck, Sparkles,
  Star, Stethoscope, Target, TrendingUp, Truck, User, UserPlus, Users, Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Activity, Award, BookOpen, Building2, Calendar, CheckCircle2, Clock,
  CreditCard, Eye, FileCheck, FileText, Gift, Globe, GraduationCap, Handshake,
  Heart, HeartHandshake, Home, IdCard, Image, Library, Lightbulb, Lock, Mail,
  MapPin, Monitor, Newspaper, Phone, Pill, Scale, Shield, ShieldCheck, Sparkles,
  Star, Stethoscope, Target, TrendingUp, Truck, User, UserPlus, Users, Wrench,
};

/** Synchronous lookup — returns null for names outside the bundled set. */
export function getIcon(name?: string | null): LucideIcon | null {
  if (!name) return null;
  return ICON_MAP[name] ?? null;
}

/**
 * Resolves an icon that may be a component, a bundled name, or an arbitrary
 * lucide name only known at runtime. The last case loads the full icon set on
 * demand; everything else resolves synchronously with no extra request.
 */
export function useResolvedIcon(
  icon?: LucideIcon | string | null
): LucideIcon | null {
  const initial = typeof icon === "string" ? getIcon(icon) : icon ?? null;
  const [resolved, setResolved] = useState<LucideIcon | null>(initial);

  useEffect(() => {
    if (typeof icon !== "string") {
      setResolved(icon ?? null);
      return;
    }
    const known = getIcon(icon);
    if (known) {
      setResolved(known);
      return;
    }
    let cancelled = false;
    import("lucide-react")
      .then((mod) => {
        if (cancelled) return;
        const found = (mod as unknown as Record<string, LucideIcon>)[icon];
        setResolved(found ?? null);
      })
      .catch(() => {
        if (!cancelled) setResolved(null);
      });
    return () => {
      cancelled = true;
    };
  }, [icon]);

  return resolved;
}
