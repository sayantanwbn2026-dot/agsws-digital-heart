import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion, useScroll, useTransform } from "framer-motion";
import { stats } from "@/data/stats";
import { useRef, useState, useEffect } from "react";

const parallaxDistances = [-20, -28, -22, -32, -18];

const ImpactStats = () => {
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  // Live increment effect
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
    <section ref={sectionRef} className="bg-card py-16">
      {/* Line draw divider */}
      <motion.div
        className="h-[2px] bg-teal mx-auto mb-16 origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ maxWidth: "100%" }}
      />
      <div ref={inViewRef} className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {stats.map((stat, i) => {
            const y = useTransform(scrollYProgress, [0, 1], [0, parallaxDistances[i]]);
            return (
              <motion.div
                key={stat.label}
                style={{ y }}
                className={`text-center will-change-transform ${i < stats.length - 1 ? "md:border-r md:border-border" : ""}`}
              >
                <div className={`stat-number transition-colors duration-300 ${flashIndex === i ? "!text-primary-foreground" : ""}`}
                  style={{ fontVariantNumeric: "tabular-nums" }}>
                  {stat.prefix || ""}
                  {inView ? (
                    <CountUp end={stat.targetValue + increments[i]} duration={2.5} delay={i * 0.15} />
                  ) : (
                    "0"
                  )}
                  {stat.suffix}
                </div>
                <p className="text-[13px] font-medium text-text-mid tracking-wide uppercase mt-2">
                  {stat.label}
                </p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  className="w-6 h-0.5 bg-teal mx-auto mt-3 origin-left"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
