import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, ChevronDown, Heart, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";

const words = ["Changing", "Lives,", "One", "Act", "of", "Compassion", "at", "a", "Time."];

const CompassionText = () => {
  const letters = "Compassion".split("");
  return (
    <motion.span className="inline-block text-[var(--yellow)]">
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5, delay: 5 * 0.08 + i * 0.04 }}
          className="inline-block"
          style={{ transformOrigin: "bottom" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const StatCard = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="text-center"
  >
    <p className="text-[clamp(28px,4vw,40px)] font-[800] text-white leading-none tracking-tight">{value}</p>
    <p className="text-[12px] font-[500] text-white/60 mt-1 uppercase tracking-[0.08em]">{label}</p>
  </motion.div>
);

const HeroSection = () => {
  const sectionRef = useRef(null);
  const { openOverlay } = useDonateOverlay();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Parallax bg */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B1C] via-[#156B75] to-[#1F9AA8]" />
        {/* Geometric patterns */}
        <svg className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.06]" viewBox="0 0 700 700">
          <circle cx="350" cy="350" r="320" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="350" cy="350" r="240" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="350" cy="350" r="160" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
        <div className="absolute top-[15%] left-[5%] w-[300px] h-[300px] rounded-full bg-[var(--teal)]/10 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] rounded-full bg-[var(--yellow)]/8 blur-[80px]" />
        
        {/* Dot grid */}
        <div className="absolute bottom-[12%] left-[6%] opacity-[0.08] grid grid-cols-8 gap-3">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white" />
          ))}
        </div>
      </motion.div>

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-[900px] mx-auto px-6 py-32">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block mb-6">
          <span className="bg-white/[0.08] backdrop-blur-sm text-white/90 px-5 py-2 rounded-full text-[11px] font-[600] uppercase tracking-[0.1em] border border-white/[0.12]">
            Kolkata, West Bengal · Est. 2020
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="display-hero text-white mb-6 max-w-[800px] mx-auto">
          {words.map((word, i) => (
            word === "Compassion" ? (
              <span key={i} className="inline-block mr-3"><CompassionText /></span>
            ) : (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            )
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="text-[clamp(15px,1.8vw,18px)] font-[400] text-white/75 max-w-[580px] mx-auto mb-10 leading-[1.75]">
          Providing medical aid, education support, and emergency care for families across Kolkata. Every rupee reaches those who need it most.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.4 }} className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-10">
          <button 
            onClick={openOverlay}
            className="px-10 py-4 text-[15px] font-[700] bg-[var(--yellow)] text-[var(--dark)] rounded-full hover:shadow-[var(--shadow-yellow)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
          >
            Donate Now →
          </button>
          <Link to="/initiatives" className="px-10 py-4 text-[15px] font-[600] text-white border-[1.5px] border-white/30 rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-center">
            Our Initiatives
          </Link>
        </motion.div>

        {/* Impact Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-8"
        >
          <StatCard value="2,400+" label="Patients Aided" delay={1.1} />
          <StatCard value="850+" label="Students Sponsored" delay={1.2} />
          <StatCard value="120+" label="Families Registered" delay={1.3} />
        </motion.div>

        {/* Trust row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.5 }} className="flex flex-wrap justify-center gap-5 text-white/55">
          {[
            { icon: Shield, text: "80G Tax Benefits" },
            { icon: Heart, text: "100% Transparent" },
            { icon: Users, text: "Registered NGO" },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2 text-[12px] font-[500]">
              <Icon size={14} className="text-[var(--yellow)]" />
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Live donation ticker */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-24 left-6 z-20 hidden lg:block"
      >
        <div className="bg-white/[0.08] backdrop-blur-md rounded-[var(--radius-xl)] p-4 max-w-[280px] border border-white/[0.1]">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
            </span>
            <span className="text-[11px] text-white/50 font-[500]">Live Activity</span>
          </div>
          <p className="text-[13px] font-[500] text-white/90">Anjali from Pune donated ₹1,000 to Medical Aid</p>
          <p className="text-[11px] text-white/40 mt-1">Just now</p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
        <span className="text-[11px] text-white/40 font-[500] uppercase tracking-[0.1em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
