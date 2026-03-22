import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import DonateButton from "../ui/DonateButton";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";

const words = ["Changing", "Lives,", "One", "Act", "of", "Compassion", "at", "a", "Time."];

const FloatingDonationCard = ({ delay, text, time, className }: { delay: number; text: string; time: string; className: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, type: "spring", stiffness: 120 }}
    className={`bg-card/95 backdrop-blur-sm rounded-lg shadow-brand-lg p-3 sm:p-4 max-w-[260px] ${className}`}
  >
    <div className="flex items-center gap-2 mb-1">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
      </span>
      <span className="text-[11px] text-text-light">{time}</span>
    </div>
    <p className="text-[13px] font-medium text-text-dark">{text}</p>
  </motion.div>
);

const CompassionText = () => {
  const letters = "Compassion".split("");
  return (
    <motion.span className="inline-block text-yellow">
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

const PolaroidCard = ({ category, caption, rotation, className, parallaxY }: {
  category: 'child' | 'medical' | 'elderly';
  caption: string;
  rotation: string;
  className: string;
  parallaxY: any;
}) => (
  <motion.div
    style={{ y: parallaxY, rotate: rotation }}
    className={`absolute hidden lg:block bg-card p-2 rounded shadow-brand-lg z-20 ${className}`}
  >
    <ImagePlaceholder category={category} className="w-[140px] h-[170px] rounded-sm" />
    <p className="text-[11px] text-text-mid text-center mt-1.5 font-normal">{caption}</p>
  </motion.div>
);

const HeroSection = () => {
  const sectionRef = useRef(null);
  const { openOverlay } = useDonateOverlay();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const polaroid1Y = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const polaroid2Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const polaroid3Y = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax bg images */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 flex will-change-transform">
        <div className="w-1/2 h-[120%] -mt-[10%] relative">
          <ImagePlaceholder category="community" className="w-full h-full" />
          <div className="absolute inset-0 bg-[hsl(187,68%,27%)]/55" />
        </div>
        <div className="w-1/2 h-[120%] -mt-[10%] relative">
          <ImagePlaceholder category="elderly" className="w-full h-full" />
          <div className="absolute inset-0 bg-[hsl(187,68%,10%)]/65" />
        </div>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-teal-light/20" />
      </motion.div>

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* Geometric elements */}
      <svg className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.08]" viewBox="0 0 600 600">
        <circle cx="300" cy="300" r="280" stroke="hsl(187 52% 93%)" strokeWidth="1" fill="none" />
      </svg>
      <div className="absolute top-[15%] left-[8%] w-[200px] h-[200px] rounded-full bg-teal-light/5" />
      <div className="absolute bottom-[15%] left-[5%] opacity-[0.12] grid grid-cols-6 gap-2">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-teal-light" />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0D1B1C]/40" />

      {/* Polaroid Cards */}
      <PolaroidCard category="child" caption="Kolkata, 2024" rotation="3deg" className="right-[8%] top-[18%]" parallaxY={polaroid1Y} />
      <PolaroidCard category="medical" caption="Health Camp, 2024" rotation="-2deg" className="right-[14%] top-[42%]" parallaxY={polaroid2Y} />
      <PolaroidCard category="elderly" caption="Elder Care, 2024" rotation="1deg" className="right-[6%] top-[60%]" parallaxY={polaroid3Y} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-[860px] mx-auto px-6 py-32">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block mb-8">
          <span className="bg-teal-light/20 text-teal-light px-4 py-2 rounded-full label-text text-xs backdrop-blur-sm">
            Kolkata, West Bengal • Est. 2020
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="display-hero text-primary-foreground mb-8">
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
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="body-lg text-primary-foreground/80 max-w-[560px] mx-auto mb-12">
          Providing medical aid, education support, and emergency care for families across Kolkata. Every rupee reaches those who need it most.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.4 }} className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-8">
          <DonateButton className="px-10 py-4 text-base" onClick={openOverlay}>Donate Now →</DonateButton>
          <Link to="/initiatives" className="px-10 py-4 text-base font-semibold text-primary-foreground border border-primary-foreground/40 rounded-full hover:bg-primary-foreground/10 transition-all duration-300 text-center">
            Our Initiatives
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className="flex flex-wrap justify-center gap-4 text-primary-foreground/70">
          {["80G Tax Benefits", "Registered NGO", "100% Transparent"].map((text) => (
            <span key={text} className="flex items-center gap-1.5 text-[13px] font-medium">
              <Shield size={14} className="text-yellow" />
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Floating donation activity cards */}
      <div className="absolute bottom-20 left-6 z-20 hidden md:block">
        <FloatingDonationCard delay={1.5} time="Just now" text="Anjali from Pune donated ₹1,000 to Medical Aid" className="mb-3" />
        <FloatingDonationCard delay={4.5} time="2 hours ago" text="Parent registered from London for Kolkata family" className="ml-8" />
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
        <span className="text-xs text-primary-foreground/50">Scroll to explore</span>
        <ChevronDown size={16} className="text-primary-foreground/50 animate-bounce-gentle" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
