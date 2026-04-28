import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion, useScroll, useTransform } from "framer-motion";
import { stats as staticStats } from "@/data/stats";
import { useRef, useState, useEffect } from "react";
import { useCMSList } from "@/hooks/useCMSList";

const ImpactStats = () => {
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const { data: cmsStats } = useCMSList<any>('cms_stats', [], {
    orderBy: { column: 'sort_order' }
  });

  const stats = cmsStats.length ? cmsStats.map((s: any) => {
    // Parse value like "2400+" or "₹48L+"
    const raw = s.value || '0';
    const numMatch = raw.match(/[\d,]+/);
    const numVal = numMatch ? parseInt(numMatch[0].replace(/,/g, ''), 10) : 0;
    const prefix = raw.match(/^[^\d]*/)?.[0] || '';
    const suffix = raw.replace(/^[^\d]*[\d,]+/, '') || '';
    return {
      label: s.label,
      targetValue: numVal,
      prefix,
      suffix,
    };
  }) : staticStats;

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
    <section ref={sectionRef} className="relative bg-[hsl(var(--card))] section-sm border-y border-[hsl(var(--border))] overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--primary))]/[0.02] rounded-full blur-[100px]" />
      </motion.div>
      <div ref={inViewRef} className="max-w-[var(--container)] mx-auto px-[var(--container-px)] relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 divide-y divide-[hsl(var(--border))] sm:divide-y-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={[
                "text-center py-5 sm:py-6 px-3 sm:px-4 relative",
                // 2-col mobile separators: vertical on odd cells (left col), horizontal handled by parent divide-y
                "[&:nth-child(odd)]:border-r border-[hsl(var(--border))] sm:border-r-0",
                // md+ vertical separators except for last in row
                "md:[&:not(:nth-child(3n))]:border-r md:[&:nth-child(3n)]:border-r-0",
                // lg vertical separators except last in row of 5
                "lg:[&:not(:nth-child(5n))]:border-r lg:[&:nth-child(5n)]:border-r-0",
              ].join(" ")}
            >
              <motion.div
                animate={flashIndex === i ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.4 }}
                className="text-[clamp(32px,4vw,48px)] font-[800] text-[hsl(var(--primary))] tracking-[-0.03em] leading-none"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {stat.prefix || ""}
                {inView ? <CountUp end={stat.targetValue + increments[i]} duration={2.5} delay={i * 0.15} /> : "0"}
                {stat.suffix}
              </motion.div>
              <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-[0.1em] mt-2">
                {stat.label}
              </p>
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: 20 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="h-[2px] bg-[hsl(var(--primary))] mx-auto mt-3 rounded-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
