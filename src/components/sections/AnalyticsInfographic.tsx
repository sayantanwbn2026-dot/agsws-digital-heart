import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { TrendingUp, Heart, GraduationCap, Users, Activity } from "lucide-react";
import FadeInUp from "@/components/ui/FadeInUp";
import { useCMSSection } from "@/hooks/useCMSSection";

const iconMap: Record<string, any> = { Heart, GraduationCap, Users, TrendingUp };

const defaultData = {
  section_badge: "Live Impact Analytics",
  section_title: "Your Donations at Work",
  section_subtitle: "Real-time visualization of how every rupee creates impact across Kolkata.",
  chart_data: [
    { month: "Jan", medical: 45, education: 32 },
    { month: "Feb", medical: 52, education: 38 },
    { month: "Mar", medical: 61, education: 45 },
    { month: "Apr", medical: 58, education: 52 },
    { month: "May", medical: 72, education: 58 },
    { month: "Jun", medical: 85, education: 65 },
    { month: "Jul", medical: 78, education: 72 },
    { month: "Aug", medical: 92, education: 80 },
  ],
  donut_value: 78,
  donut_label: "Direct to Programs",
  donut_desc: "78p of every rupee goes directly to medical and education programs.",
  sidebar_stats: [
    { label: "Patients", value: 2400, icon: "Heart", color: "var(--teal)" },
    { label: "Students", value: 850, icon: "GraduationCap", color: "var(--purple)" },
    { label: "Families", value: 1200, icon: "Users", color: "var(--yellow)" },
    { label: "Success %", value: 94, icon: "TrendingUp", color: "#16A34A" },
  ],
};

const MiniDonut = ({ value, max, color, size = 56 }: { value: number; max: number; color: string; size?: number }) => {
  const pct = (value / max) * 100;
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border-color)" strokeWidth="5" fill="none" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} whileInView={{ strokeDashoffset: offset }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} />
    </svg>
  );
};

const AnalyticsInfographic = () => {
  const sectionRef = useRef(null);
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const { data } = useCMSSection<typeof defaultData>('analytics', defaultData);

  const chartData = data.chart_data;
  const maxVal = Math.max(...chartData.flatMap(d => [d.medical, d.education]));

  return (
    <section ref={sectionRef} className="relative bg-[var(--dark)] section overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </motion.div>

      <div className="max-w-[var(--container)] mx-auto px-6 relative z-10" ref={inViewRef}>
        <FadeInUp className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white/[0.06] text-white/60 text-[11px] font-[600] uppercase tracking-[0.12em] px-4 py-1.5 rounded-full border border-white/[0.08] mb-4">
            <Activity size={12} /> {data.section_badge}
          </div>
          <h2 className="text-[28px] lg:text-[36px] font-[800] text-white tracking-[-0.02em]">{data.section_title}</h2>
          <p className="text-white/40 text-[14px] mt-2 max-w-[500px] mx-auto">{data.section_subtitle}</p>
        </FadeInUp>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <FadeInUp>
            <div className="bg-white/[0.04] backdrop-blur-sm rounded-[24px] border border-white/[0.06] p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[16px] font-[600] text-white">Monthly Impact — 2025</h3>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[11px] text-white/50"><span className="w-2.5 h-2.5 rounded-full bg-[var(--teal)]" />Medical</span>
                  <span className="flex items-center gap-1.5 text-[11px] text-white/50"><span className="w-2.5 h-2.5 rounded-full bg-[var(--purple)]" />Education</span>
                </div>
              </div>
              <div className="flex items-end gap-3 h-[200px]">
                {chartData.map((d: any, i: number) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-1 items-end h-[160px]">
                      <motion.div
                        className="flex-1 bg-gradient-to-t from-[var(--teal)] to-[var(--teal)]/60 rounded-t-[4px]"
                        initial={{ height: 0 }}
                        animate={inView ? { height: `${(d.medical / maxVal) * 100}%` } : {}}
                        transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                      />
                      <motion.div
                        className="flex-1 bg-gradient-to-t from-[var(--purple)] to-[var(--purple)]/60 rounded-t-[4px]"
                        initial={{ height: 0 }}
                        animate={inView ? { height: `${(d.education / maxVal) * 100}%` } : {}}
                        transition={{ duration: 0.8, delay: i * 0.08 + 0.05, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-[10px] text-white/30 font-[500] mt-1">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInUp>

          <div className="space-y-5">
            <FadeInUp delay={0.1}>
              <div className="bg-white/[0.04] backdrop-blur-sm rounded-[20px] border border-white/[0.06] p-6">
                <div className="flex items-center gap-4 mb-4">
                  <MiniDonut value={data.donut_value} max={100} color="var(--teal)" />
                  <div>
                    <p className="text-[24px] font-[800] text-white">{inView ? <CountUp end={data.donut_value} duration={2} /> : 0}%</p>
                    <p className="text-[11px] text-white/40 uppercase tracking-[0.06em] font-[500]">{data.donut_label}</p>
                  </div>
                </div>
                <p className="text-[12px] text-white/30 leading-[1.6]">{data.donut_desc}</p>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {data.sidebar_stats.map((s: any, i: number) => {
                  const Icon = iconMap[s.icon] || Heart;
                  return (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.06 }} className="bg-white/[0.04] rounded-[16px] border border-white/[0.06] p-4 text-center">
                      <Icon size={18} className="mx-auto mb-2" style={{ color: s.color }} />
                      <p className="text-[18px] font-[800] text-white">{inView ? <CountUp end={s.value} duration={2} /> : 0}{s.label === "Success %" ? "%" : "+"}</p>
                      <p className="text-[9px] text-white/30 uppercase tracking-[0.06em] font-[500]">{s.label}</p>
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

export default AnalyticsInfographic;
