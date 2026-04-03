import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle, ArrowRight, Clock, MapPin, Heart } from "lucide-react";
import FadeInUp from "../ui/FadeInUp";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";

const milestones = [
  { icon: Clock, label: "Registered", detail: "Son registered from Bengaluru", done: true },
  { icon: Heart, label: "Emergency", detail: "Cardiac event — team mobilised", done: true },
  { icon: MapPin, label: "Admitted", detail: "Network hospital in 2 hours", done: true },
  { icon: CheckCircle, label: "Recovered", detail: "Full recovery in 12 days", done: true },
];

const ImpactStory = () => {
  const sectionRef = useRef(null);
  const { openOverlay } = useDonateOverlay();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="bg-gradient-to-br from-[#0D1B1C] via-[var(--teal-dark)] to-[#0F1F20] relative">
        {/* Subtle geometric accents */}
        <svg className="absolute right-[-5%] top-[-10%] w-[500px] h-[500px] opacity-[0.04] pointer-events-none" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="200" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="250" cy="250" r="140" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>

        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] py-[80px] lg:py-[120px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Story */}
            <motion.div style={{ y: leftY }} className="will-change-transform">
              <FadeInUp>
                <span className="inline-block bg-white/[0.08] text-white/80 text-[11px] font-[600] uppercase tracking-[0.1em] px-4 py-1.5 rounded-full border border-white/[0.1] mb-6">
                  Impact Story
                </span>
                <h2 className="text-[clamp(28px,4vw,40px)] font-[800] text-white leading-[1.1] tracking-[-0.02em] mb-6 max-w-[500px]">
                  How <span className="text-[var(--yellow)]">₹5,000</span> Changed Ranu's Story
                </h2>
                <p className="text-[16px] text-white/70 leading-[1.8] mb-8 max-w-[480px]">
                  Ranu Mondal, 67, from North Kolkata, was alone when she needed emergency cardiac care. Her son in Bengaluru had registered her through AGSWS six months before. Within 2 hours of her collapse, our team had her admitted at a network hospital.
                </p>

                {/* Stats pills */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {["₹5,000 donated", "2-hour response", "Full recovery"].map((text) => (
                    <span key={text} className="bg-[var(--yellow)]/10 text-[var(--yellow)] text-[12px] font-[600] px-4 py-2 rounded-full border border-[var(--yellow)]/20">
                      {text}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={openOverlay}
                    className="bg-[var(--yellow)] text-[var(--dark)] px-7 py-3 rounded-full font-[700] text-[14px] hover:shadow-[var(--shadow-yellow)] hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-2"
                  >
                    Donate Now <ArrowRight size={16} />
                  </button>
                  <Link 
                    to="/blog" 
                    className="border border-white/20 text-white px-7 py-3 rounded-full font-[600] text-[14px] hover:bg-white/[0.06] transition-all"
                  >
                    Read More Stories
                  </Link>
                </div>
              </FadeInUp>
            </motion.div>

            {/* Right — Timeline Card */}
            <motion.div style={{ y: rightY }} className="will-change-transform">
              <FadeInUp delay={0.15}>
                <div className="bg-white rounded-[var(--radius-2xl)] p-8 shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-[11px] font-[600] uppercase tracking-[0.1em] text-[var(--teal)]">Registered Case</span>
                      <p className="text-[20px] font-[700] text-[var(--dark)] mt-1">AGS-2024-082</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#16A34A]/10 flex items-center justify-center">
                      <CheckCircle size={20} className="text-[#16A34A]" />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative pl-6 space-y-0 mb-6">
                    {/* Vertical line */}
                    <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-[var(--border-color)]" />
                    
                    {milestones.map((m, i) => (
                      <motion.div
                        key={m.label}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
                        className="relative flex items-start gap-4 py-3"
                      >
                        <div className="absolute left-[-18px] top-[16px] w-[20px] h-[20px] rounded-full bg-[var(--teal)] flex items-center justify-center z-10 shadow-sm">
                          <m.icon size={10} className="text-white" />
                        </div>
                        <div className="ml-2">
                          <p className="text-[13px] font-[600] text-[var(--dark)]">{m.label}</p>
                          <p className="text-[12px] text-[var(--light)]">{m.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recovery bar */}
                  <div className="bg-[var(--bg)] rounded-[var(--radius-lg)] p-4">
                    <div className="flex justify-between text-[12px] mb-2">
                      <span className="text-[var(--light)] font-[500]">Recovery Progress</span>
                      <span className="font-[700] text-[#16A34A]">100%</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[var(--teal)] to-[#16A34A] rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Verified badge */}
                  <div className="mt-5 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[var(--teal)]/10 flex items-center justify-center">
                      <CheckCircle size={12} className="text-[var(--teal)]" />
                    </div>
                    <span className="text-[11px] font-[600] text-[var(--teal)] uppercase tracking-[0.06em]">AGSWS Verified · 15 Jan 2025</span>
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
