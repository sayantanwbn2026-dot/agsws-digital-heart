import { useSEO } from "@/hooks/useSEO";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";
import { ArrowRight, Heart, BookOpen, Users, TrendingUp, Quote } from "lucide-react";

const sections = ["Cover", "Numbers", "Medical", "Education", "Reach", "Story", "Finances", "CTA"];

const SectionNav = ({ active }: { active: number }) => (
  <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2.5">
    {sections.map((s, i) => (
      <button
        key={s}
        onClick={() => document.getElementById(`impact-s${i}`)?.scrollIntoView({ behavior: "smooth" })}
        className="group flex items-center gap-2.5 justify-end"
      >
        <span className="text-[10px] font-medium text-white/0 group-hover:text-white/60 transition-all duration-300 whitespace-nowrap">{s}</span>
        <motion.span
          animate={{ scale: active === i ? 1.3 : 1 }}
          className={`block rounded-full transition-all duration-300 ${active === i ? "bg-[hsl(var(--accent))] w-3 h-3" : "bg-white/20 w-2 h-2 hover:bg-white/40"}`}
        />
      </button>
    ))}
  </div>
);

const StatBlock = ({ value, suffix, label, icon: Icon }: { value: number; suffix: string; label: string; icon?: typeof Heart }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center group"
    >
      {Icon && <Icon size={24} className="mx-auto mb-3 text-[hsl(var(--primary))]/60" />}
      <span className="text-[clamp(48px,8vw,80px)] font-extrabold text-white leading-none tracking-tighter block" style={{ fontVariantNumeric: "tabular-nums" }}>
        {inView ? <CountUp end={value} duration={2.5} /> : "0"}{suffix}
      </span>
      <p className="text-sm font-medium text-white/40 uppercase tracking-widest mt-3">{label}</p>
      <motion.div initial={{ width: 0 }} animate={inView ? { width: 32 } : {}} transition={{ delay: 2, duration: 0.5 }} className="h-[2px] bg-[hsl(var(--accent))] mx-auto mt-4 rounded-full" />
    </motion.div>
  );
};

const ParallaxSection = ({ children, id, className }: { children: React.ReactNode; id: string; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  return (
    <section ref={ref} id={id} className={`min-h-screen flex items-center relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }} />
      </motion.div>
      {children}
    </section>
  );
};

const ImpactReport = () => {
  useSEO("Annual Impact Report 2024–25", "Interactive annual impact report from AGSWS.");
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [activeSection, setActiveSection] = useState(0);
  const { openOverlay } = useDonateOverlay();

  useEffect(() => {
    const handler = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(`impact-s${i}`);
        if (el && el.getBoundingClientRect().top < window.innerHeight / 2) {
          setActiveSection(i);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <main id="main-content" className="bg-[hsl(var(--background))]">
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] z-[60] origin-left" style={{ width: progressWidth }} />
      <SectionNav active={activeSection} />

      {/* S0: Cover */}
      <ParallaxSection id="impact-s0" className="bg-gradient-to-br from-[hsl(187,68%,5%)] via-[hsl(187,68%,12%)] to-[hsl(187,70%,18%)]">
        <svg className="absolute right-[10%] top-[15%] w-[600px] h-[600px] opacity-[0.03]" viewBox="0 0 600 600">
          <circle cx="300" cy="300" r="280" stroke="white" strokeWidth="0.4" fill="none" />
          <circle cx="300" cy="300" r="200" stroke="white" strokeWidth="0.4" fill="none" />
          <circle cx="300" cy="300" r="120" stroke="white" strokeWidth="0.4" fill="none" />
        </svg>
        <div className="relative z-10 text-center max-w-[800px] mx-auto px-6 w-full">
          <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-block bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-[10px] font-bold px-5 py-2 rounded-full uppercase tracking-[0.2em] mb-8 border border-[hsl(var(--primary))]/20">
            Annual Report · 2024–25
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
            Impact<br /><span className="text-[hsl(var(--accent))]">Report</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-base text-white/50 mb-14">One year. Thousands of lives. Zero compromise.</motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-2 text-white/30 text-sm animate-bounce">
            Scroll to explore ↓
          </motion.div>
        </div>
      </ParallaxSection>

      {/* S1: Numbers */}
      <ParallaxSection id="impact-s1" className="bg-[hsl(187,68%,5%)]">
        <div className="max-w-[1100px] mx-auto px-6 py-24 relative z-10 w-full">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))] mb-16">
            The Year in Numbers
          </motion.p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            <StatBlock value={2400} suffix="+" label="Patients Supported" icon={Heart} />
            <StatBlock value={850} suffix="+" label="Children Educated" icon={BookOpen} />
            <StatBlock value={120} suffix="+" label="Families Registered" icon={Users} />
            <StatBlock value={6} suffix="" label="Years of Service" />
            <StatBlock value={48} suffix="L+" label="Funds Deployed (₹)" icon={TrendingUp} />
          </div>
        </div>
      </ParallaxSection>

      {/* S2: Medical */}
      <ParallaxSection id="impact-s2" className="bg-gradient-to-br from-[hsl(187,70%,15%)] to-[hsl(187,68%,8%)]">
        <div className="absolute right-0 top-0 bottom-0 w-[50%] hidden lg:block opacity-[0.08]">
          <ImagePlaceholder category="medical" className="w-full h-full" />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 py-24 relative z-10 w-full">
          <div className="max-w-lg">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.15em] mb-6">
              Medical Aid
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-white mb-10 leading-tight">
              2,400 patients<br />supported this year.
            </motion.h2>
            <div className="space-y-0">
              {[["847", "Emergency cases handled"], ["312", "Surgeries supported"], ["₹28.4L", "Total medical funds deployed"]].map(([num, desc], i) => (
                <motion.div
                  key={desc}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-5 py-5 border-b border-white/[0.08]"
                >
                  <span className="text-2xl font-extrabold text-[hsl(var(--accent))] w-24 font-mono">{num}</span>
                  <span className="text-white/60 text-sm">{desc}</span>
                </motion.div>
              ))}
            </div>
            <Link to="/donate/medical" className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-[hsl(var(--primary))] hover:text-white transition-colors">
              Donate to Medical Aid <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </ParallaxSection>

      {/* S3: Education */}
      <ParallaxSection id="impact-s3" className="bg-gradient-to-br from-[hsl(242,29%,20%)] to-[hsl(242,29%,12%)]">
        <div className="absolute left-0 top-0 bottom-0 w-[45%] hidden lg:block opacity-[0.08]">
          <ImagePlaceholder category="classroom" className="w-full h-full" />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 py-24 relative z-10 flex justify-end w-full">
          <div className="max-w-lg">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.15em] mb-6">
              Education
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-white mb-10 leading-tight">
              850 children<br />kept in school.
            </motion.h2>
            <div className="space-y-0">
              {[["124", "Full year sponsorships"], ["3,200+", "School meals funded"], ["₹12.6L", "Education funds deployed"]].map(([num, desc], i) => (
                <motion.div
                  key={desc}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-5 py-5 border-b border-white/[0.08]"
                >
                  <span className="text-2xl font-extrabold text-[hsl(var(--accent))] w-24 font-mono">{num}</span>
                  <span className="text-white/60 text-sm">{desc}</span>
                </motion.div>
              ))}
            </div>
            <Link to="/donate/education" className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-[hsl(242,29%,60%)] hover:text-white transition-colors">
              Sponsor a Child <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </ParallaxSection>

      {/* S4: Geographic Reach */}
      <ParallaxSection id="impact-s4" className="bg-[hsl(187,68%,5%)]">
        <div className="max-w-[900px] mx-auto px-6 py-24 text-center relative z-10 w-full">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))] mb-6">
            Geographic Reach
          </motion.span>
          <div className="relative w-[300px] h-[300px] mx-auto mb-12">
            {[
              { city: "Mumbai", x: 25, y: 55, size: 12, count: 42 },
              { city: "Delhi", x: 40, y: 22, size: 12, count: 38 },
              { city: "Bengaluru", x: 35, y: 78, size: 10, count: 28 },
              { city: "Chennai", x: 48, y: 75, size: 8, count: 15 },
              { city: "Kolkata", x: 65, y: 45, size: 16, count: 120 },
              { city: "Pune", x: 28, y: 60, size: 8, count: 12 },
            ].map(dot => (
              <motion.div
                key={dot.city}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute group"
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              >
                <span className={`block rounded-full ${dot.city === "Kolkata" ? "bg-[hsl(var(--accent))]" : "bg-[hsl(var(--primary))]"} animate-pulse`} style={{ width: dot.size, height: dot.size }} />
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">{dot.city}: {dot.count}</span>
              </motion.div>
            ))}
          </div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-bold text-white mb-4">
            120+ parents registered. 18 cities. 4 countries.
          </motion.h2>
          <p className="text-white/40 text-base max-w-lg mx-auto">North Kolkata to London — connecting families separated by distance.</p>
        </div>
      </ParallaxSection>

      {/* S5: Story */}
      <ParallaxSection id="impact-s5" className="bg-[hsl(187,68%,3%)]">
        <div className="max-w-[1100px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden">
            <ImagePlaceholder category="elderly" className="w-full h-[400px]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Quote size={32} className="text-[hsl(var(--accent))]/30 mb-4" />
            <p className="text-2xl md:text-3xl font-light italic text-white/85 leading-relaxed mb-8">
              "My father was attended to within 3 hours. I was in Singapore. AGSWS was in Kolkata. That's all that mattered."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--primary))]/20 flex items-center justify-center text-[hsl(var(--primary))] text-lg font-bold">P</div>
              <div>
                <p className="font-semibold text-white">Priya Sengupta</p>
                <p className="text-sm text-white/40">Registered daughter, since 2023</p>
              </div>
            </div>
            <Link to="/blog/ranu-mondal-emergency-care" className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-[hsl(var(--primary))] hover:text-white transition-colors">
              Read Full Story <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* S6: Finances */}
      <ParallaxSection id="impact-s6" className="bg-[hsl(var(--card))]">
        <div className="max-w-[900px] mx-auto px-6 py-24 text-center relative z-10 w-full">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--primary))] mb-4">
            Where Money Went
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl font-bold text-[hsl(var(--foreground))] mb-12">Financial Transparency</motion.h2>
          <DonutChart />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            {[
              { pct: "78%", label: "Programme Costs", amount: "₹37.8L", color: "bg-[hsl(var(--primary))]" },
              { pct: "12%", label: "Operations", amount: "₹5.8L", color: "bg-[hsl(242,29%,50%)]" },
              { pct: "10%", label: "Administration", amount: "₹4.8L", color: "bg-[hsl(28,22%,62%)]" },
            ].map(item => (
              <motion.div
                key={item.label}
                whileHover={{ y: -4 }}
                className="bg-[hsl(var(--background))] rounded-2xl p-6 border border-[hsl(var(--border))]"
              >
                <span className={`inline-block w-3 h-3 rounded-full ${item.color} mb-3`} />
                <p className="text-3xl font-bold text-[hsl(var(--foreground))]">{item.pct}</p>
                <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] mt-1">{item.label}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]/60 mt-0.5">{item.amount}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* S7: CTA */}
      <ParallaxSection id="impact-s7" className="bg-gradient-to-br from-[hsl(187,70%,25%)] via-[hsl(187,68%,18%)] to-[hsl(187,68%,10%)]">
        <div className="max-w-[700px] mx-auto px-6 py-24 text-center relative z-10 w-full">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-white mb-6">
            2025–26 starts <span className="text-[hsl(var(--accent))]">now.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-base text-white/60 mb-10 max-w-lg mx-auto">
            Every rupee you give today becomes part of next year's impact report. Will your name be in it?
          </motion.p>
          <motion.button
            onClick={openOverlay}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-12 py-4 text-base font-bold bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            Donate Now →
          </motion.button>
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {[
              { amount: "₹500", impact: "Medicines for 1 month", to: "/donate/medical" },
              { amount: "₹5,000", impact: "Surgery support", to: "/donate/medical" },
              { amount: "₹12,000", impact: "Child's full school year", to: "/donate/education" },
            ].map(tier => (
              <Link key={tier.amount} to={tier.to}>
                <motion.div whileHover={{ y: -4 }} className="bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-2xl px-6 py-4 hover:bg-white/[0.1] transition-colors">
                  <p className="text-xl font-bold text-white">{tier.amount}</p>
                  <p className="text-xs text-white/50 mt-1">{tier.impact}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </ParallaxSection>
    </main>
  );
};

const DonutChart = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const segments = [
    { pct: 78, color: "hsl(187, 70%, 39%)", offset: 0 },
    { pct: 12, color: "hsl(242, 29%, 50%)", offset: 78 },
    { pct: 10, color: "hsl(28, 22%, 62%)", offset: 90 },
  ];
  const r = 90;
  const circumference = 2 * Math.PI * r;

  return (
    <div ref={ref} className="relative w-[220px] h-[220px] mx-auto">
      <svg viewBox="0 0 240 240" className="w-full h-full -rotate-90">
        {segments.map((seg, i) => (
          <motion.circle
            key={i}
            cx="120" cy="120" r={r}
            fill="none" stroke={seg.color} strokeWidth="20" strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={inView ? { strokeDasharray: `${(seg.pct / 100) * circumference} ${circumference}` } : {}}
            transition={{ duration: 1.2, delay: i * 0.3, ease: "easeOut" }}
            strokeDashoffset={`${-(seg.offset / 100) * circumference}`}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-[hsl(var(--primary))]">₹48.4L</p>
          <p className="text-[10px] text-[hsl(var(--muted-foreground))]">total deployed</p>
        </div>
      </div>
    </div>
  );
};

export default ImpactReport;
