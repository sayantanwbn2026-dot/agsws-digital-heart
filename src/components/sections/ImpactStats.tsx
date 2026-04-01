import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion, useScroll, useTransform } from "framer-motion";
import { stats as staticStats } from "@/data/stats";
import { useRef, useState, useEffect } from "react";
import { StaggerContainer } from "../ui/StaggerContainer";
import { useCMSList } from "@/hooks/useCMSList";

const parallaxDistances = [-20, -28, -22, -32, -18];

const ImpactStats = () => {
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
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
    <section ref={sectionRef} className="global-card py-[64px] rounded-none border-x-0 !shadow-none">
      <div ref={inViewRef} className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
        <StaggerContainer staggerDelay={0.10} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-8">
          {stats.map((stat, i) => {
            const y = useTransform(scrollYProgress, [0, 1], [0, parallaxDistances[i]]);
            
            let borderClasses = "border-transparent";
            if (i === 0 || i === 1) borderClasses = "md:border-r md:border-[var(--border-color)]";
            else if (i === 2) borderClasses = "lg:border-r lg:border-[var(--border-color)]";
            else if (i === 3) borderClasses = "md:border-r md:border-[var(--border-color)]";

            return (
              <motion.div
                key={stat.label}
                style={{ y }}
                className={`text-center p-[24px_16px] will-change-transform border-r ${borderClasses}`}
              >
                <div 
                  className={`text-[clamp(36px,4vw,56px)] font-[800] text-[var(--teal)] tracking-[-0.03em] leading-none transition-colors duration-300 ${flashIndex === i ? "text-[var(--teal-dark)] scale-105 transform inline-block" : "inline-block"}`}
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
                <p className="text-[12px] font-[500] text-[var(--light)] uppercase tracking-[0.06em] mt-[8px]">
                  {stat.label}
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: 24 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  className="h-[2px] bg-[var(--teal)] mx-auto mt-[8px]"
                />
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default ImpactStats;
