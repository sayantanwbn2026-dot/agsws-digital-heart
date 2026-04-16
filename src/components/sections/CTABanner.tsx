import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, Shield, Clock, HeartHandshake } from "lucide-react";
import FadeInUp from "@/components/ui/FadeInUp";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";
import { useCMSSection } from "@/hooks/useCMSSection";

const iconMap: Record<string, any> = { Shield, Clock, HeartHandshake };

const defaultData = {
  badge: "Make a Difference Today",
  headline: "Every Rupee Writes a New Story",
  highlight: "New Story",
  subtitle: "Join thousands of donors who are transforming healthcare and education for underprivileged families across Kolkata.",
  features: [
    { icon: "Shield", title: "100% Transparent", desc: "Every donation tracked and reported with full accountability." },
    { icon: "Clock", title: "2-Hour Response", desc: "Emergency medical support within 2 hours of activation." },
    { icon: "HeartHandshake", title: "Direct Impact", desc: "78p of every rupee goes directly to patient care and education." },
  ],
};

const CTABanner = () => {
  const { openOverlay } = useDonateOverlay();
  const { data } = useCMSSection<typeof defaultData>('cta_banner', defaultData);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  // Highlight part of headline
  const headlineParts = data.highlight && data.headline.includes(data.highlight)
    ? data.headline.split(data.highlight)
    : null;

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="bg-gradient-to-br from-[var(--teal)] via-[var(--teal-dark)] to-[#0D1B1C] py-20 lg:py-28">
        <motion.div style={{ y }} className="absolute inset-0 opacity-[0.04]">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        </motion.div>

        <div className="max-w-[var(--container)] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
            <FadeInUp>
              <div className="inline-flex items-center gap-2 bg-white/[0.06] text-white/60 text-[11px] font-[600] uppercase tracking-[0.12em] px-4 py-1.5 rounded-full border border-white/[0.08] mb-5">
                <Sparkles size={12} /> {data.badge}
              </div>
              <h2 className="text-[28px] lg:text-[38px] font-[800] text-white leading-[1.1] tracking-[-0.02em] mb-4 max-w-[520px]">
                {headlineParts ? (
                  <>{headlineParts[0]}<span className="text-[var(--yellow)]">{data.highlight}</span>{headlineParts[1]}</>
                ) : data.headline}
              </h2>
              <p className="text-white/50 text-[15px] leading-[1.7] mb-8 max-w-[480px]">
                {data.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openOverlay} className="bg-[var(--yellow)] text-[var(--dark)] font-[700] px-8 py-3.5 rounded-full text-[14px] shadow-[var(--shadow-yellow)] flex items-center gap-2">
                  Donate Now <ArrowRight size={16} />
                </motion.button>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <div className="space-y-4 lg:w-[300px]">
                {data.features.map((f, i) => {
                  const Icon = iconMap[f.icon] || Shield;
                  return (
                    <motion.div key={f.title} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }} className="bg-white/[0.06] backdrop-blur-sm rounded-[16px] border border-white/[0.08] p-4 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.08] flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-[var(--yellow)]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-[600] text-white">{f.title}</p>
                        <p className="text-[11px] text-white/40 leading-[1.5]">{f.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
