import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Activity, Users, BookOpen } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import FadeInUp from "../ui/FadeInUp";

const regions = [
  { id: 1, name: "Salt Lake", type: "medical", x: 20, y: 30, desc: "Weekly Health Camps", icon: Activity, metric: "2,500+ Treated" },
  { id: 2, name: "Park Street District", type: "education", x: 50, y: 45, desc: "Scholarship Hub", icon: BookOpen, metric: "450 Students" },
  { id: 3, name: "Howrah", type: "community", x: 30, y: 70, desc: "Emergency Response", icon: Users, metric: "24/7 Support" },
  { id: 4, name: "New Town", type: "medical", x: 75, y: 25, desc: "Elderly Care Unit", icon: Activity, metric: "120 Families" },
  { id: 5, name: "Ballygunge", type: "education", x: 65, y: 65, desc: "Community Library", icon: BookOpen, metric: "New Facility" },
];

const ImpactMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredRegion, setHoveredRegion] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const mapScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const mapOpacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);

  return (
    <section className="section bg-[var(--dark)] relative overflow-hidden" ref={containerRef}>
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--teal)] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--yellow)] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] relative z-10">
        <FadeInUp>
          <div className="text-center mb-[48px] lg:mb-[64px]">
            <span className="label text-[var(--teal-light)]">Live Operations</span>
            <h2 className="text-white mt-3">Active Impact Zones in Kolkata</h2>
            <p className="text-white/70 max-w-[600px] mx-auto mt-4 text-[16px]">
              Our network spans across key districts, ensuring rapid response for medical emergencies and accessible education hubs for communities in need.
            </p>
          </div>
        </FadeInUp>

        {/* Abstract Map UI */}
        <motion.div 
          className="relative w-full max-w-[900px] mx-auto aspect-square md:aspect-[16/9] border border-white/10 rounded-[var(--radius-3xl)] bg-black/20 backdrop-blur-md overflow-hidden shadow-[var(--shadow-lg)]"
          style={{ scale: mapScale, opacity: mapOpacity }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {regions.map((region, i) => {
            const isHovered = hoveredRegion === region.id;
            const color = region.type === 'medical' ? 'var(--teal)' : region.type === 'education' ? 'var(--purple)' : 'var(--yellow)';

            return (
              <motion.div
                key={region.id}
                className="absolute flex items-center justify-center pointer-events-auto"
                style={{ left: `${region.x}%`, top: `${region.y}%`, x: "-50%", y: "-50%" }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Ping animation effect */}
                <span className="absolute inline-flex h-full w-full rounded-full opacity-30 animate-ping" style={{ backgroundColor: color, animationDuration: '3s' }} />

                {/* Node */}
                <div 
                  className="relative flex items-center justify-center w-[40px] h-[40px] rounded-full shadow-lg border-[2px] cursor-pointer transition-transform duration-300 hover:scale-110"
                  style={{ backgroundColor: 'var(--dark)', borderColor: color }}
                >
                  <MapPin size={18} style={{ color }} />
                </div>

                {/* Info Card Popover */}
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute bottom-[52px] left-1/2 -translateX-1/2 w-[220px] bg-white rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-lg)] z-50 text-left border border-[var(--border-color)]"
                    style={{ marginLeft: "-110px" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <region.icon size={16} style={{ color }} />
                      <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--dark)]">{region.name}</span>
                    </div>
                    <p className="text-[13px] text-[var(--mid)] mb-3 leading-snug">{region.desc}</p>
                    <div className="bg-[var(--bg)] rounded-[var(--radius-sm)] py-2 px-3 text-center">
                      <span className="text-[12px] font-semibold" style={{ color }}>{region.metric}</span>
                    </div>
                    {/* Arrow down */}
                    <div className="absolute -bottom-[6px] left-1/2 -translateX-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-[var(--border-color)]" style={{ marginLeft: "-6px" }} />
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
