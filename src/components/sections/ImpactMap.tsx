import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
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

const ImpactMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const { data: regions } = useCMSList<ImpactZone>('cms_impact_zones', fallbackZones, {
    orderBy: { column: 'sort_order', ascending: true },
  });
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const mapScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

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
          className="relative w-full max-w-[900px] mx-auto aspect-square md:aspect-[16/9] rounded-2xl bg-white/[0.03] backdrop-blur-sm overflow-hidden border border-white/[0.06]"
          style={{ scale: mapScale }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

          {regions.map((region, i) => {
            const isHovered = hoveredRegion === region.id;
            const color = colorMap[region.type] || colorMap.medical;
            const Icon = ICONS[region.icon || 'MapPin'] || MapPin;

            return (
              <motion.div
                key={region.id}
                className="absolute flex items-center justify-center pointer-events-auto"
                style={{ left: `${region.position_x}%`, top: `${region.position_y}%`, x: "-50%", y: "-50%" }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                <span className="absolute inline-flex h-full w-full rounded-full opacity-20 animate-ping" style={{ backgroundColor: color, animationDuration: '3s' }} />
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-2 cursor-pointer bg-[hsl(187,68%,5%)]"
                  style={{ borderColor: color }}
                >
                  <MapPin size={16} style={{ color }} />
                </motion.div>

                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-14 left-1/2 w-[200px] bg-white rounded-xl p-4 shadow-lg z-50 text-left border border-[hsl(var(--border))]"
                    style={{ marginLeft: "-100px" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={14} style={{ color }} />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[hsl(var(--foreground))]">{region.name}</span>
                    </div>
                    {region.description && (
                      <p className="text-[12px] text-[hsl(var(--muted-foreground))] mb-2">{region.description}</p>
                    )}
                    {region.metric && (
                      <div className="bg-[hsl(var(--background))] rounded-lg py-1.5 px-2.5 text-center">
                        <span className="text-[11px] font-semibold" style={{ color }}>{region.metric}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactMap;
