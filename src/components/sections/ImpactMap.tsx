import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MapPin, Activity, Users, BookOpen, Heart, GraduationCap, Stethoscope } from "lucide-react";
import FadeInUp from "../ui/FadeInUp";
import { useCMSList } from "@/hooks/useCMSList";

type ImpactZone = {
  id: string;
  name: string;
  type: string;
  description?: string;
  metric?: string;
  icon?: string;
  position_x: number;
  position_y: number;
};

const fallbackZones: ImpactZone[] = [
  { id: 'f1', name: "Salt Lake", type: "medical", description: "Weekly Health Camps", metric: "2,500+ Treated", icon: 'Activity', position_x: 20, position_y: 30 },
  { id: 'f2', name: "Park Street District", type: "education", description: "Scholarship Hub", metric: "450 Students", icon: 'BookOpen', position_x: 50, position_y: 45 },
  { id: 'f3', name: "Howrah", type: "community", description: "Emergency Response", metric: "24/7 Support", icon: 'Users', position_x: 30, position_y: 70 },
  { id: 'f4', name: "New Town", type: "medical", description: "Elderly Care Unit", metric: "120 Families", icon: 'Activity', position_x: 75, position_y: 25 },
  { id: 'f5', name: "Ballygunge", type: "education", description: "Community Library", metric: "New Facility", icon: 'BookOpen', position_x: 65, position_y: 65 },
];

const ICONS: Record<string, any> = { MapPin, Activity, Users, BookOpen, Heart, GraduationCap, Stethoscope };

const colorMap: Record<string, string> = {
  medical: "hsl(var(--primary))",
  education: "hsl(242, 29%, 50%)",
  community: "hsl(var(--accent))",
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/** Gutter kept between the tooltip and the map's edges. */
const EDGE = 10;
/** Marker radius + breathing room, used to offset the tooltip off the pin. */
const PIN_GAP = 30;
/** Roughly how tall a tooltip gets — only used to pick above vs. below. */
const TIP_H = 128;

const ImpactMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [map, setMap] = useState({ w: 0, h: 0 });
  const { data: regions } = useCMSList<ImpactZone>('cms_impact_zones', fallbackZones, {
    orderBy: { column: 'sort_order', ascending: true },
  });
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const mapScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  // The tooltip is placed in pixels against the map box, so it has to know how
  // big that box currently is (it's fluid: square on phones, 16/9 on desktop).
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setMap({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Dismiss on Escape or a tap anywhere outside the map (touch has no hover-out).
  useEffect(() => {
    if (!activeRegion) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveRegion(null); };
    const onDown = (e: PointerEvent) => {
      if (!mapRef.current?.contains(e.target as Node)) setActiveRegion(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [activeRegion]);

  const active = regions.find((r) => r.id === activeRegion) || null;

  // Solve the tooltip box against the map: never wider than the map, never
  // past an edge, and flipped below the pin when there's no room above.
  let tip: { w: number; left: number; top?: number; bottom?: number; arrowX: number; below: boolean } | null = null;
  if (active && map.w > 0) {
    const w = Math.min(220, map.w - EDGE * 2);
    const pinX = (active.position_x / 100) * map.w;
    const pinY = (active.position_y / 100) * map.h;
    const left = clamp(pinX - w / 2, EDGE, Math.max(EDGE, map.w - w - EDGE));
    const below = pinY - PIN_GAP - TIP_H < 0;
    tip = {
      w,
      left,
      ...(below ? { top: pinY + PIN_GAP } : { bottom: map.h - pinY + PIN_GAP }),
      arrowX: clamp(pinX - left, 16, w - 16),
      below,
    };
  }

  return (
    <section className="section bg-[hsl(187,68%,5%)] relative overflow-hidden" ref={containerRef}>
      {/* Parallax BG orbs */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--primary))]/[0.06] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[hsl(var(--accent))]/[0.04] rounded-full blur-[120px]" />
      </motion.div>

      <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] relative z-10">
        <FadeInUp>
          <div className="text-center mb-12 lg:mb-16">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">Live Operations</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">Active Impact Zones</h2>
            <p className="text-white/40 max-w-[500px] mx-auto text-sm">
              Our network spans across key districts — rapid medical response and accessible education hubs.
            </p>
          </div>
        </FadeInUp>

        <motion.div
          ref={mapRef}
          className="relative w-full max-w-[900px] mx-auto aspect-square md:aspect-[16/9] rounded-2xl bg-white/[0.03] backdrop-blur-sm overflow-hidden border border-white/[0.06]"
          style={{ scale: mapScale }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

          {regions.map((region, i) => {
            const color = colorMap[region.type] || colorMap.medical;
            const isActive = activeRegion === region.id;

            return (
              <motion.div
                key={region.id}
                className="absolute flex items-center justify-center"
                style={{ left: `${region.position_x}%`, top: `${region.position_y}%`, x: "-50%", y: "-50%" }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
              >
                <span className="absolute inline-flex h-full w-full rounded-full opacity-20 animate-ping" style={{ backgroundColor: color, animationDuration: '3s' }} />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`${region.name}${region.description ? ` — ${region.description}` : ''}`}
                  aria-expanded={isActive}
                  onMouseEnter={() => setActiveRegion(region.id)}
                  onMouseLeave={() => setActiveRegion((cur) => (cur === region.id ? null : cur))}
                  onFocus={() => setActiveRegion(region.id)}
                  onBlur={() => setActiveRegion((cur) => (cur === region.id ? null : cur))}
                  onClick={() => setActiveRegion((cur) => (cur === region.id ? null : region.id))}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-2 cursor-pointer bg-[hsl(187,68%,5%)]"
                  style={{ borderColor: color }}
                >
                  <MapPin size={16} style={{ color }} />
                </motion.button>
              </motion.div>
            );
          })}

          {/* One tooltip, positioned against the map box rather than the pin, so
              it can be clamped inside the edges instead of overflowing them. */}
          <AnimatePresence>
            {active && tip && (() => {
              const color = colorMap[active.type] || colorMap.medical;
              const Icon = ICONS[active.icon || 'MapPin'] || MapPin;
              return (
                <motion.div
                  key={active.id}
                  role="tooltip"
                  initial={{ opacity: 0, y: tip.below ? -6 : 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: tip.below ? -4 : 4, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute z-50 rounded-xl border border-[hsl(var(--border))] bg-white p-3.5 text-left shadow-xl pointer-events-none"
                  style={{ width: tip.w, left: tip.left, top: tip.top, bottom: tip.bottom }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon size={14} style={{ color }} />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--foreground))]">{active.name}</span>
                  </div>
                  {active.description && (
                    <p className="mb-2 text-[12px] leading-snug text-[hsl(var(--muted-foreground))]">{active.description}</p>
                  )}
                  {active.metric && (
                    <div className="rounded-lg px-2.5 py-1.5 text-center" style={{ backgroundColor: `${color}14` }}>
                      <span className="text-[11px] font-semibold" style={{ color }}>{active.metric}</span>
                    </div>
                  )}
                  {/* Connector points back at the pin, wherever it was clamped to. */}
                  <span
                    aria-hidden
                    className="absolute h-2.5 w-2.5 rotate-45 border-[hsl(var(--border))] bg-white"
                    style={{
                      left: tip.arrowX - 5,
                      [tip.below ? 'top' : 'bottom']: -5,
                      borderTopWidth: tip.below ? 1 : 0,
                      borderLeftWidth: tip.below ? 1 : 0,
                      borderRightWidth: tip.below ? 0 : 1,
                      borderBottomWidth: tip.below ? 0 : 1,
                    }}
                  />
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactMap;
