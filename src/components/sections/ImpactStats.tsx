import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { stats as staticStats } from "@/data/stats";
import { useRef, useState, useEffect } from "react";
import { useCMSList } from "@/hooks/useCMSList";

const ImpactStats = () => {
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const sectionRef = useRef(null);
  const { data: cmsStats } = useCMSList<any>('impact_stats', [], {
    filter: { column: 'is_active', value: true },
    orderBy: { column: 'display_order' }
  });
  const stats = cmsStats.length ? cmsStats.map((s: any) => ({
    label: s.label,
    targetValue: s.value,
    prefix: s.prefix ?? '',
    suffix: s.suffix ?? '',
  })) : staticStats;

  const [increments, setIncrements] = useState<number[]>(new Array(stats.length).fill(0));
  const [flashIndex, setFlashIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * stats.length);
      setIncrements(prev => { const n = [...prev]; n[idx] += 1; return n; });
      setFlashIndex(idx);
      setTimeout(() => setFlashIndex(null), 600);
    }, 8000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white py-16 border-y border-[var(--border-color)]">
      <div ref={inViewRef} className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-[var(--border-color)]">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="text-center py-6 px-4"
            >
              <div
                className={`text-[clamp(32px,4vw,48px)] font-[800] text-[var(--teal)] tracking-[-0.03em] leading-none transition-all duration-300 ${flashIndex === i ? "scale-110" : ""}`}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {stat.prefix || ""}
                {inView ? (
                  <CountUp end={stat.targetValue + increments[i]} duration={2.5} delay={i * 0.15} />
                ) : (
                  "0"
                )}
                {stat.suffix}
              </div>
              <p className="text-[11px] font-[600] text-[var(--light)] uppercase tracking-[0.08em] mt-2">
                {stat.label}
              </p>
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: 20 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="h-[2px] bg-[var(--teal)] mx-auto mt-3 rounded-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
