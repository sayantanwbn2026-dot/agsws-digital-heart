import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle } from "lucide-react";
import FadeInUp from "../ui/FadeInUp";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { useRef } from "react";

const ImpactStory = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Line draw divider */}
      <motion.div
        className="h-[2px] bg-teal origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <div className="bg-gradient-to-r from-teal-dark to-[#0F1F20] relative">
        {/* Background mosaic - Moved to right and lowered opacity to prevent text overlap */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 grid grid-cols-2 gap-4 opacity-[0.05] hidden xl:grid z-0 pointer-events-none">
          {(["child", "elderly", "medical", "community"] as const).map((cat) => (
            <ImagePlaceholder key={cat} category={cat} className="w-[140px] h-[140px] rounded-2xl border border-white/5" />
          ))}
        </div>
        <div className="max-w-[1240px] mx-auto px-6 py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[55%_40%] gap-16 items-center">
            {/* Left */}
            <motion.div style={{ y: leftY }} className="will-change-transform z-10 relative">
              <FadeInUp>
                <span className="label-text text-yellow">Impact Story</span>
                <h2 className="text-4xl font-bold text-primary-foreground mt-4 mb-6 tracking-tight">
                  How ₹5,000 Changed Ranu's Story
                </h2>
                <p className="body-lg text-primary-foreground/80 mb-8">
                  Ranu Mondal, 67, from North Kolkata, was alone when she needed emergency cardiac care. Her son in Bengaluru had registered her through AGSWS six months before. Within 2 hours of her collapse, our team had her admitted at a network hospital.
                </p>
                <div className="w-16 h-0.5 bg-teal mb-8" />
                <div className="flex flex-wrap gap-3 mb-8">
                  {["₹5,000 donated", "2 hours response", "Full recovery"].map((text) => (
                    <span key={text} className="bg-yellow text-text-dark text-[13px] font-semibold px-4 py-2 rounded-full">
                      {text}
                    </span>
                  ))}
                </div>
                <button className="border border-primary-foreground/40 text-primary-foreground px-8 py-3 rounded-full font-semibold text-sm hover:bg-primary-foreground/10 transition-all">
                  Read Full Story →
                </button>
              </FadeInUp>
            </motion.div>

            {/* Right — Evidence Card */}
            <motion.div style={{ y: rightY }} className="will-change-transform">
              <FadeInUp delay={0.2}>
                <div className="bg-card rounded-xl p-8 shadow-brand-lg">
                  <span className="label-text text-teal">Registered Case</span>
                  <div className="mt-6 space-y-4">
                    {[
                      ["Case ID", "AGS-2024-082"],
                      ["Date", "15 Jan 2025"],
                      ["Location", "North Kolkata"],
                      ["Status", "Active ✓"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2 border-b border-border">
                        <span className="text-sm text-text-light">{label}</span>
                        <span className="text-sm font-semibold text-text-dark">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-mid">Recovery</span>
                      <span className="font-semibold text-teal">Complete</span>
                    </div>
                    <div className="w-full h-2 bg-teal-light rounded-full overflow-hidden">
                      <div className="h-full bg-teal rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                      <CheckCircle size={20} className="text-teal" />
                    </div>
                    <span className="text-xs font-semibold text-teal">AGSWS Verified</span>
                  </div>
                </div>
              </FadeInUp>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStory;
