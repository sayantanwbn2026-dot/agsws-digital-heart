import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, ChevronDown, Heart, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";
import { useCMSData } from "@/hooks/useCMSData";

const CompassionText = () => {
  const letters = "Compassion".split("");
  return (
    <motion.span className="inline-block text-[var(--yellow)]">
      {letters.map((char, i) => (
        <motion.span key={i} initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.5, delay: 0.4 + i * 0.04 }} className="inline-block">
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const StatCard = ({ value, label, delay }: { value: string; label: string; delay: number }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }} className="text-center px-4">
    <p className="text-[clamp(24px,3.5vw,36px)] font-[800] text-white leading-none tracking-[-0.02em]">{value}</p>
    <p className="text-[10px] font-[500] text-white/50 mt-1.5 uppercase tracking-[0.1em]">{label}</p>
  </motion.div>
);

const defaultHero = {
  headline: 'Changing Lives, One Act of Compassion at a Time.',
  subtitle: 'Providing medical aid, education support, and emergency care for families across Kolkata. Every rupee reaches those who need it most.',
  cta_text: 'Donate Now',
  cta_link: '/donate',
  background_image: null as string | null,
};

const HeroSection = () => {
  const sectionRef = useRef(null);
  const { openOverlay } = useDonateOverlay();
  const { data: hero } = useCMSData<typeof defaultHero>('cms_hero', defaultHero);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacityOut = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Split headline into words, detect "Compassion" for special styling
  const headlineWords = (hero.headline || defaultHero.headline).split(/\s+/);
  const compassionIndex = headlineWords.findIndex(w => w.toLowerCase().replace(/[.,!]/g, '') === 'compassion');

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        {hero.background_image ? (
          <>
            <img src={hero.background_image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A1415] via-[#0D2B30] to-[#14555E]" />
        )}
        <svg className="absolute right-[-8%] top-[10%] w-[800px] h-[800px] opacity-[0.04]" viewBox="0 0 800 800">
          <circle cx="400" cy="400" r="380" stroke="white" strokeWidth="0.4" fill="none" />
          <circle cx="400" cy="400" r="280" stroke="white" strokeWidth="0.4" fill="none" />
          <circle cx="400" cy="400" r="180" stroke="white" strokeWidth="0.4" fill="none" />
          <circle cx="400" cy="400" r="80" stroke="white" strokeWidth="0.4" fill="none" />
        </svg>
        <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--teal)]/[0.08] blur-[120px]" />
        <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[var(--yellow)]/[0.05] blur-[100px]" />
        <div className="absolute bottom-[15%] left-[8%] opacity-[0.05] grid grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (<div key={i} className="w-1 h-1 rounded-full bg-white" />))}
        </div>
        <svg className="absolute left-[15%] top-[20%] w-[200px] h-[200px] opacity-[0.03]" viewBox="0 0 200 200">
          <line x1="0" y1="0" x2="200" y2="200" stroke="white" strokeWidth="0.5" />
          <line x1="0" y1="40" x2="160" y2="200" stroke="white" strokeWidth="0.5" />
          <line x1="40" y1="0" x2="200" y2="160" stroke="white" strokeWidth="0.5" />
        </svg>
      </motion.div>

      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      <motion.div style={{ y: contentY, opacity: opacityOut }} className="relative z-10 text-center max-w-[860px] mx-auto px-6 py-32 will-change-transform">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-block mb-8">
          <span className="bg-white/[0.06] backdrop-blur-sm text-white/80 px-5 py-2 rounded-full text-[10px] font-[600] uppercase tracking-[0.12em] border border-white/[0.08]">
            Kolkata, West Bengal · Est. 2020
          </span>
        </motion.div>

        <h1 className="display-hero text-white mb-6 max-w-[800px] mx-auto">
          {headlineWords.map((word, i) => {
            if (i === compassionIndex) {
              return <span key={i} className="inline-block mr-3"><CompassionText /></span>;
            }
            return (
              <motion.span key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.45 }} className="inline-block mr-3">{word}</motion.span>
            );
          })}
        </h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }} className="text-[clamp(14px,1.6vw,17px)] font-[400] text-white/65 max-w-[540px] mx-auto mb-10 leading-[1.8]">
          {hero.subtitle || defaultHero.subtitle}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }} className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mb-12">
          <motion.button onClick={openOverlay} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="px-9 py-4 text-[14px] font-[700] bg-[var(--yellow)] text-[var(--dark)] rounded-full shadow-[0_4px_16px_rgba(242,183,5,0.25)] hover:shadow-[0_8px_32px_rgba(242,183,5,0.4)] transition-shadow flex items-center justify-center gap-2">
            {hero.cta_text || defaultHero.cta_text} <ArrowRight size={16} />
          </motion.button>
          <Link to="/apply" className="px-9 py-4 text-[14px] font-[600] text-white/90 border border-white/[0.15] rounded-full hover:bg-white/[0.06] hover:border-white/[0.25] transition-all text-center">
            Apply for Support
          </Link>
        </motion.div>

        {/* Stats - hidden on mobile */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }} className="hidden sm:flex flex-wrap justify-center divide-x divide-white/[0.1] mb-8">
          <StatCard value="2,400+" label="Patients Aided" delay={1.15} />
          <StatCard value="850+" label="Students Sponsored" delay={1.25} />
          <StatCard value="120+" label="Families Registered" delay={1.35} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }} className="hidden sm:flex flex-wrap justify-center gap-5 text-white/45">
          {[
            { icon: Shield, text: "Secure Stripe Checkout" },
            { icon: Heart, text: "100% Transparent" },
            { icon: Users, text: "Registered NGO" },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-1.5 text-[11px] font-[500]">
              <Icon size={12} className="text-[var(--yellow)]/80" />{text}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Live donation ticker */}
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6, duration: 0.6 }} className="absolute bottom-28 left-6 z-20 hidden lg:block">
        <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl p-4 max-w-[260px] border border-white/[0.08]">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]" />
            </span>
            <span className="text-[10px] text-white/40 font-[500]">Live Activity</span>
          </div>
          <p className="text-[12px] font-[500] text-white/80 leading-relaxed">Anjali from Pune donated ₹1,000 to Medical Aid</p>
          <p className="text-[10px] text-white/30 mt-1">Just now</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
        <span className="text-[10px] text-white/30 font-[500] uppercase tracking-[0.14em]">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}><ChevronDown size={14} className="text-white/30" /></motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
