import { useSEO } from "@/hooks/useSEO";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import DonateButton from "@/components/ui/DonateButton";

const sections = ["Cover", "Numbers", "Medical", "Education", "Registration", "Story", "Finances", "CTA"];

const SectionNav = ({ active }: { active: number }) => (
  <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
    {sections.map((s, i) => (
      <button
        key={s}
        onClick={() => document.getElementById(`impact-s${i}`)?.scrollIntoView({ behavior: "smooth" })}
        className="group flex items-center gap-2 justify-end"
      >
        <span className="text-[11px] font-medium text-white/0 group-hover:text-white/70 transition-colors whitespace-nowrap">{s}</span>
        <span className={`w-2.5 h-2.5 rounded-full transition-all ${active === i ? "bg-teal w-3 h-3" : "bg-white/30"}`} />
      </button>
    ))}
  </div>
);

const StatBlock = ({ value, suffix, label }: { value: number; suffix: string; label: string }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <div ref={ref} className="text-center">
      <span className="text-[96px] font-extrabold text-teal leading-none tracking-tighter" style={{ fontVariantNumeric: "tabular-nums" }}>
        {inView ? <CountUp end={value} duration={2} /> : "0"}{suffix}
      </span>
      <p className="text-lg font-medium text-text-mid uppercase tracking-wide mt-2">{label}</p>
      <motion.div initial={{ width: 0 }} animate={inView ? { width: 48 } : {}} transition={{ delay: 2, duration: 0.4 }} className="h-[2px] bg-teal mx-auto mt-3" />
    </div>
  );
};

const ImpactReport = () => {
  useSEO("Annual Impact Report 2024–25", "Interactive annual impact report from AGSWS — one year, thousands of lives, zero compromise.");
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [activeSection, setActiveSection] = useState(0);

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
    <main id="main-content" className="bg-background">
      {/* Progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-teal z-[60] origin-left" style={{ width: progressWidth }} />
      <SectionNav active={activeSection} />

      {/* S0: Cover */}
      <section id="impact-s0" className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-teal-dark to-[hsl(187,68%,15%)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <svg className="absolute right-[10%] top-[20%] w-[500px] h-[500px] opacity-[0.06]" viewBox="0 0 500 500"><circle cx="250" cy="250" r="240" stroke="hsl(187 52% 93%)" strokeWidth="1" fill="none" /></svg>
        <div className="relative z-10 text-center max-w-[800px] px-6">
          <span className="inline-block bg-teal/20 text-teal-light text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-widest mb-8">2024–25</span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-[64px] font-extrabold text-white leading-[1.05] tracking-tight mb-6">
            AGSWS Annual<br />Impact Report
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg text-white/70 mb-12">One year. Thousands of lives. Zero compromise.</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center justify-center gap-2 text-white/50 text-sm">
            Scroll to explore →
          </motion.div>
        </div>
      </section>

      {/* S1: Numbers */}
      <section id="impact-s1" className="min-h-screen flex items-center bg-card relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[360px] font-extrabold text-teal/[0.03] leading-none">2024</span>
        </div>
        <div className="max-w-[1100px] mx-auto px-6 py-24 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
            <StatBlock value={2400} suffix="+" label="Patients Supported" />
            <StatBlock value={850} suffix="+" label="Children Educated" />
            <StatBlock value={120} suffix="+" label="Families Registered" />
            <StatBlock value={6} suffix="" label="Years of Service" />
            <StatBlock value={48} suffix="L+" label="Funds Distributed (₹)" />
          </div>
        </div>
      </section>

      {/* S2: Medical */}
      <section id="impact-s2" className="min-h-screen flex items-center bg-teal-dark relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:grid grid-cols-3 grid-rows-3 gap-1 opacity-[0.12]">
          {["medical","hospital","community","medical","hospital","community","medical","hospital","community"].map((c, i) => (
            <ImagePlaceholder key={i} category={c as any} className="w-full h-full" />
          ))}
        </div>
        <div className="max-w-[1100px] mx-auto px-6 py-24 relative z-10">
          <div className="max-w-lg">
            <span className="inline-block bg-yellow/20 text-yellow text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">Medical Aid</span>
            <h2 className="text-4xl font-bold text-white mb-8">2,400 patients supported this year.</h2>
            <div className="space-y-4 mb-8">
              {[["847", "Emergency cases handled"],["312", "Surgeries supported"],["₹28.4L", "Total medical funds deployed"]].map(([num, desc]) => (
                <div key={desc} className="flex items-center gap-4 py-3 border-b border-white/15">
                  <span className="text-2xl font-extrabold text-white w-24">{num}</span>
                  <span className="text-white/70">{desc}</span>
                </div>
              ))}
            </div>
            <Link to="/donate/medical" className="inline-block border border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              Donate to Medical Aid →
            </Link>
          </div>
        </div>
      </section>

      {/* S3: Education */}
      <section id="impact-s3" className="min-h-screen flex items-center bg-purple relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[45%] hidden lg:grid grid-cols-3 gap-1 opacity-[0.12]">
          {["classroom","child","education","classroom","child","education"].map((c, i) => (
            <ImagePlaceholder key={i} category={c as any} className="w-full h-full" />
          ))}
        </div>
        <div className="max-w-[1100px] mx-auto px-6 py-24 relative z-10 flex justify-end">
          <div className="max-w-lg">
            <span className="inline-block bg-yellow/20 text-yellow text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">Education</span>
            <h2 className="text-4xl font-bold text-white mb-8">850 children kept in school.</h2>
            <div className="space-y-4 mb-8">
              {[["124", "Full year sponsorships"],["3,200+", "School meals funded"],["₹12.6L", "Education funds deployed"]].map(([num, desc]) => (
                <div key={desc} className="flex items-center gap-4 py-3 border-b border-white/15">
                  <span className="text-2xl font-extrabold text-white w-24">{num}</span>
                  <span className="text-white/70">{desc}</span>
                </div>
              ))}
            </div>
            <Link to="/donate/education" className="inline-block border border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              Sponsor a Child →
            </Link>
          </div>
        </div>
      </section>

      {/* S4: Registration */}
      <section id="impact-s4" className="min-h-screen flex items-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(28 22% 62%), hsl(187 70% 39%))" }}>
        <div className="max-w-[1100px] mx-auto px-6 py-24 relative z-10 text-center">
          {/* Simplified India map represented by dots */}
          <div className="relative w-[300px] h-[300px] mx-auto mb-12">
            {[
              { city: "Mumbai", x: 25, y: 55, size: 12, count: 42 },
              { city: "Delhi", x: 40, y: 22, size: 12, count: 38 },
              { city: "Bengaluru", x: 35, y: 78, size: 10, count: 28 },
              { city: "Chennai", x: 48, y: 75, size: 8, count: 15 },
              { city: "Kolkata", x: 65, y: 45, size: 16, count: 120 },
              { city: "Pune", x: 28, y: 60, size: 8, count: 12 },
            ].map(dot => (
              <div key={dot.city} className="absolute group" style={{ left: `${dot.x}%`, top: `${dot.y}%` }}>
                <span className={`block rounded-full ${dot.city === "Kolkata" ? "bg-yellow" : "bg-teal-light"} animate-pulse`} style={{ width: dot.size, height: dot.size }} />
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">{dot.city}: {dot.count}</span>
              </div>
            ))}
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">120+ parents registered. 18 cities. 4 countries.</h2>
          <p className="text-white/70 text-lg max-w-lg mx-auto">North Kolkata to London — AGSWS connects families separated by distance.</p>
        </div>
      </section>

      {/* S5: Story of the Year */}
      <section id="impact-s5" className="min-h-screen flex items-center bg-[#0A0A0A] relative overflow-hidden">
        <div className="max-w-[1100px] mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ImagePlaceholder category="elderly" className="w-full h-[400px] rounded-xl" />
          <div>
            <span className="text-[96px] font-extrabold text-white/[0.06] absolute -top-4 left-0">"</span>
            <p className="text-3xl font-light italic text-white/90 leading-relaxed mb-6">
              "My father was attended to within 3 hours. I was in Singapore. AGSWS was in Kolkata. That's all that mattered."
            </p>
            <p className="font-semibold text-white">Priya Sengupta</p>
            <p className="text-sm text-white/50">Registered daughter, since 2023</p>
            <Link to="/blog/ranu-mondal-emergency-care" className="inline-block mt-6 border border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              Read Full Story →
            </Link>
          </div>
        </div>
      </section>

      {/* S6: Finances */}
      <section id="impact-s6" className="min-h-screen flex items-center bg-card">
        <div className="max-w-[800px] mx-auto px-6 py-24 text-center">
          <span className="label-text text-teal mb-4 block">Where Money Went</span>
          <h2 className="heading-2 text-text-dark mb-12">Financial Transparency</h2>
          <DonutChart />
          <div className="grid grid-cols-3 gap-6 mt-10">
            {[
              { pct: "78%", label: "Programme Costs", amount: "₹37.8L", color: "bg-teal" },
              { pct: "12%", label: "Operations", amount: "₹5.8L", color: "bg-purple" },
              { pct: "10%", label: "Administration", amount: "₹4.8L", color: "bg-beige" },
            ].map(item => (
              <div key={item.label} className="bg-card border border-border rounded-lg p-4 shadow-brand-sm">
                <span className={`inline-block w-3 h-3 rounded-full ${item.color} mb-2`} />
                <p className="text-2xl font-bold text-text-dark">{item.pct}</p>
                <p className="text-sm font-medium text-text-mid">{item.label}</p>
                <p className="text-xs text-text-light">{item.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S7: CTA */}
      <section id="impact-s7" className="min-h-screen flex items-center bg-gradient-to-br from-teal to-teal-dark text-center relative">
        <div className="max-w-[700px] mx-auto px-6 py-24">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">2025–26 starts now.</h2>
          <p className="text-lg text-white/80 mb-10 max-w-lg mx-auto">Every rupee you give today becomes part of next year's impact report. Will your name be in it?</p>
          <Link to="/donate/medical">
            <DonateButton className="px-12 py-4 text-lg">Donate Now →</DonateButton>
          </Link>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {[
              { amount: "₹500", impact: "Medicines for 1 month", to: "/donate/medical" },
              { amount: "₹5,000", impact: "Surgery support", to: "/donate/medical" },
              { amount: "₹12,000", impact: "Child's full school year", to: "/donate/education" },
            ].map(tier => (
              <Link key={tier.amount} to={tier.to} className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 hover:bg-white/20 transition-colors">
                <p className="text-xl font-bold text-white">{tier.amount}</p>
                <p className="text-sm text-white/70">{tier.impact}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

const DonutChart = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const segments = [
    { pct: 78, color: "hsl(187 70% 39%)", offset: 0 },
    { pct: 12, color: "hsl(242 29% 50%)", offset: 78 },
    { pct: 10, color: "hsl(28 22% 62%)", offset: 90 },
  ];
  const r = 90;
  const circumference = 2 * Math.PI * r;

  return (
    <div ref={ref} className="relative w-[240px] h-[240px] mx-auto">
      <svg viewBox="0 0 240 240" className="w-full h-full -rotate-90">
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx="120" cy="120" r={r}
            fill="none" stroke={seg.color} strokeWidth="24"
            strokeDasharray={`${(seg.pct / 100) * circumference} ${circumference}`}
            strokeDashoffset={`${-(seg.offset / 100) * circumference}`}
            className="transition-all duration-[1.2s] ease-out"
            style={{ opacity: inView ? 1 : 0 }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-teal">₹48.4L</p>
          <p className="text-xs text-text-light">total</p>
        </div>
      </div>
    </div>
  );
};

export default ImpactReport;
