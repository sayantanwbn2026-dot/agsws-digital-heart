import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { FileCheck, Award, Globe, Shield, ArrowRight, Download, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ──────────────────────────────────────────────────────────────
   Data
   ────────────────────────────────────────────────────────────── */

const allocation = [
  {
    pct: 78,
    label: "Programmes",
    desc: "Patient care, medicines, surgery support, school fees, books, meals and field coordination.",
    color: "var(--teal)",
    items: ["Medical treatment", "Emergency hospitalisation", "School fee sponsorship", "Books & stationery", "Mid-day meals"],
  },
  {
    pct: 12,
    label: "Operations",
    desc: "Field coordinator salaries, transport, communications and camp organisation.",
    color: "var(--purple)",
    items: [],
  },
  {
    pct: 10,
    label: "Administration",
    desc: "Office costs, legal compliance, audit fees and technology infrastructure.",
    color: "var(--beige)",
    items: [],
  },
];

const headline = [
  { value: "₹19.5L", label: "Funds raised", sub: "FY 2024–25" },
  { value: "78%", label: "To programmes", sub: "Direct beneficiary spend" },
  { value: "100%", label: "Audited", sub: "By registered CA firm" },
];

const quarters = [
  { q: "Q1 2024", income: 340000, expenditure: 285000, pct: 78, surplus: 55000 },
  { q: "Q2 2024", income: 420000, expenditure: 360000, pct: 80, surplus: 60000 },
  { q: "Q3 2024", income: 580000, expenditure: 490000, pct: 77, surplus: 90000 },
  { q: "Q4 2024", income: 610000, expenditure: 520000, pct: 79, surplus: 90000 },
];

const gateways = [
  { title: "Medical Aid", desc: "100% of donations fund patient care, medicines, surgery support, hospital fees and emergency transport in Kolkata.", badge: "100% to patients", color: "var(--teal)" },
  { title: "Education Support", desc: "100% of donations fund school fees, books, stationery and mid-day meals for children in our partner schools.", badge: "100% to children", color: "var(--purple)" },
  { title: "Parent Registration", desc: "₹100 platform fee covers coordinator assignment (₹40), SMS alerts (₹20), case file maintenance (₹25) and admin (₹15).", badge: "Fully allocated", color: "var(--yellow)" },
];

const compliance = [
  { icon: FileCheck, title: "Audited Accounts", desc: "Annual accounts audited by a registered CA firm. Reports published openly." },
  { icon: Award, title: "Quarterly Reporting", desc: "Detailed income and expenditure breakdowns published every quarter." },
  { icon: Globe, title: "NGO Darpan Listed", desc: "Listed on the Government of India's NGO Darpan portal." },
  { icon: Shield, title: "FCRA Status", desc: "Currently not FCRA registered. Only accepting domestic donations at this time." },
];

const fmt = (n: number) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(2).replace(/\.00$/, "")}L` : `₹${n.toLocaleString("en-IN")}`;

const totalIncome = quarters.reduce((s, q) => s + q.income, 0);
const totalExp = quarters.reduce((s, q) => s + q.expenditure, 0);
const totalSurplus = quarters.reduce((s, q) => s + q.surplus, 0);

/* ──────────────────────────────────────────────────────────────
   Sleek allocation visual: animated segmented donut + legend
   ────────────────────────────────────────────────────────────── */

const AllocationDonut = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const C = 2 * Math.PI * 70; // circumference for r=70
  let offset = 0;

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-8 sm:gap-10 md:gap-12">
      {/* Donut */}
      <div className="relative mx-auto w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] md:w-[240px] md:h-[240px] flex-shrink-0">
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
          <circle cx="90" cy="90" r="70" fill="none" stroke="var(--border-color)" strokeWidth="14" />
          {allocation.map((a) => {
            const len = (a.pct / 100) * C;
            const dash = `${len} ${C - len}`;
            const seg = (
              <motion.circle
                key={a.label}
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke={a.color}
                strokeWidth="14"
                strokeLinecap="butt"
                strokeDasharray={dash}
                initial={{ strokeDashoffset: -C }}
                animate={inView ? { strokeDashoffset: -offset } : { strokeDashoffset: -C }}
                transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] font-[600] uppercase tracking-[0.12em] text-[var(--light)]">Programmes</span>
          <span className="text-[44px] sm:text-[52px] font-[800] text-[var(--dark)] tracking-[-0.03em] leading-none mt-1">78%</span>
          <span className="text-[12px] text-[var(--mid)] mt-1">of every rupee</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-4 sm:space-y-5">
        {allocation.map((a, i) => (
          <motion.div
            key={a.label}
            initial={{ opacity: 0, x: 12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            className="border-l-[3px] pl-4 sm:pl-5"
            style={{ borderColor: a.color }}
          >
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <h3 className="text-[15px] sm:text-[16px] font-[700] text-[var(--dark)]">{a.label}</h3>
              <span className="text-[20px] sm:text-[22px] font-[800] tabular-nums tracking-[-0.02em]" style={{ color: a.color }}>
                {a.pct}%
              </span>
            </div>
            <p className="text-[13px] sm:text-[13.5px] text-[var(--mid)] leading-[1.65]">{a.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   Quarterly summary — table on md+, card stack on mobile
   ────────────────────────────────────────────────────────────── */

const QuarterlyView = () => {
  return (
    <>
      {/* Mobile/Tablet stacked cards */}
      <div className="md:hidden space-y-3">
        {quarters.map((q) => (
          <div
            key={q.q}
            className="bg-white rounded-[var(--radius-xl)] border border-[var(--border-color)] p-4 sm:p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border-color)]">
              <span className="text-[14px] font-[700] text-[var(--dark)]">{q.q}</span>
              <span className="text-[11px] font-[700] uppercase tracking-[0.1em] text-[var(--teal)] bg-[var(--teal-light)] px-2.5 py-1 rounded-full">
                {q.pct}% to programmes
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--light)] font-[600] mb-1">Income</p>
                <p className="text-[14px] font-[700] text-[var(--dark)] tabular-nums">{fmt(q.income)}</p>
              </div>
              <div className="border-x border-[var(--border-color)]">
                <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--light)] font-[600] mb-1">Spent</p>
                <p className="text-[14px] font-[700] text-[var(--dark)] tabular-nums">{fmt(q.expenditure)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--light)] font-[600] mb-1">Surplus</p>
                <p className="text-[14px] font-[700] text-[#16A34A] tabular-nums">{fmt(q.surplus)}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-[var(--teal)] text-white rounded-[var(--radius-xl)] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/20">
            <span className="text-[14px] font-[700]">FY 2024–25 Total</span>
            <span className="text-[11px] font-[700] uppercase tracking-[0.1em] bg-white/15 px-2.5 py-1 rounded-full">79% programmes</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.08em] opacity-70 font-[600] mb-1">Income</p>
              <p className="text-[14px] font-[700] tabular-nums">{fmt(totalIncome)}</p>
            </div>
            <div className="border-x border-white/20">
              <p className="text-[10px] uppercase tracking-[0.08em] opacity-70 font-[600] mb-1">Spent</p>
              <p className="text-[14px] font-[700] tabular-nums">{fmt(totalExp)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.08em] opacity-70 font-[600] mb-1">Surplus</p>
              <p className="text-[14px] font-[700] tabular-nums">{fmt(totalSurplus)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop / large tablet table */}
      <div className="hidden md:block bg-white rounded-[var(--radius-2xl)] border border-[var(--border-color)] shadow-[var(--shadow-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg)]">
                {["Quarter", "Income", "Expenditure", "Programme %", "Surplus"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-4 text-[10.5px] font-[600] uppercase text-[var(--light)] tracking-[0.08em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quarters.map((q) => (
                <tr
                  key={q.q}
                  className="border-b border-[var(--border-color)] last:border-b-0 hover:bg-[var(--bg)]/60 transition-colors"
                >
                  <td className="px-6 py-4 font-[600] text-[var(--dark)]">{q.q}</td>
                  <td className="px-6 py-4 text-[var(--mid)] tabular-nums">{fmt(q.income)}</td>
                  <td className="px-6 py-4 text-[var(--mid)] tabular-nums">{fmt(q.expenditure)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-[var(--teal)] font-[600] tabular-nums">{q.pct}%</span>
                      <span className="block w-[60px] h-[4px] bg-[var(--border-color)] rounded-full overflow-hidden">
                        <span
                          className="block h-full bg-[var(--teal)] rounded-full"
                          style={{ width: `${q.pct}%` }}
                        />
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#16A34A] font-[600] tabular-nums">{fmt(q.surplus)}</td>
                </tr>
              ))}
              <tr className="bg-[var(--dark)] text-white font-[700]">
                <td className="px-6 py-4">FY Total</td>
                <td className="px-6 py-4 tabular-nums">{fmt(totalIncome)}</td>
                <td className="px-6 py-4 tabular-nums">{fmt(totalExp)}</td>
                <td className="px-6 py-4 tabular-nums">79%</td>
                <td className="px-6 py-4 tabular-nums">{fmt(totalSurplus)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

/* ──────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────── */

const TransparencyPage = () => {
  useSEO("Transparency", "AGSWS Donation Transparency — see exactly how every rupee is used.");

  return (
    <main id="main-content">
      <PageHero
        title="Where every rupee goes."
        label="Open Accounts"
        subtitle="Full financial transparency. Every donation tracked, every quarter reported, every account audited."
        bgVariant="teal-dark"
        size="md"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Transparency" }]}
      />

      {/* Headline numbers strip */}
      <section className="bg-white border-b border-[var(--border-color)]">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] py-8 sm:py-10">
          <div className="grid grid-cols-3 divide-x divide-[var(--border-color)]">
            {headline.map((h, i) => (
              <FadeInUp key={h.label} delay={i * 0.08}>
                <div className="text-center px-2 sm:px-4">
                  <p className="text-[clamp(22px,4vw,36px)] font-[800] text-[var(--teal)] tracking-[-0.03em] leading-none tabular-nums">
                    {h.value}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-[600] uppercase tracking-[0.1em] text-[var(--dark)] mt-2">
                    {h.label}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[var(--light)] mt-0.5 hidden sm:block">{h.sub}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Allocation — sleek donut + legend */}
      <section className="bg-white section">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
          <FadeInUp className="mb-10 sm:mb-14 max-w-[640px]">
            <span className="label">Allocation</span>
            <h2 className="text-[var(--dark)] mt-2 before:hidden text-[clamp(24px,3.6vw,36px)]">
              How every rupee is used.
            </h2>
            <p className="text-[var(--mid)] mt-3 text-[14px] sm:text-[15px] leading-[1.7]">
              Our model is simple: most of what you give reaches a beneficiary directly. The rest keeps the system honest and running.
            </p>
          </FadeInUp>

          <FadeInUp>
            <div className="bg-white rounded-[var(--radius-2xl)] border border-[var(--border-color)] p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-card)]">
              <AllocationDonut />
            </div>
          </FadeInUp>

          {/* Programme detail */}
          <FadeInUp delay={0.15}>
            <div className="mt-6 sm:mt-8 bg-[var(--teal-light)]/40 border border-[var(--teal)]/15 rounded-[var(--radius-xl)] p-5 sm:p-6">
              <p className="text-[11px] font-[600] uppercase tracking-[0.1em] text-[var(--teal-dark)] mb-3">
                Inside the 78% programme spend
              </p>
              <div className="flex flex-wrap gap-2">
                {allocation[0].items.map((i) => (
                  <span
                    key={i}
                    className="text-[12px] sm:text-[13px] text-[var(--dark)] bg-white border border-[var(--border-color)] rounded-full px-3 py-1.5"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Quarterly summary */}
      <section className="bg-[var(--bg)] section">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
          <FadeInUp className="mb-8 sm:mb-12 max-w-[640px]">
            <span className="label">Quarterly Report</span>
            <h2 className="text-[var(--dark)] mt-2 before:hidden text-[clamp(24px,3.6vw,36px)]">Financial summary, FY 2024–25.</h2>
            <p className="text-[var(--mid)] mt-3 text-[14px] sm:text-[15px] leading-[1.7]">
              Full audited statements are published in our Resources section. Numbers below are rounded for readability.
            </p>
          </FadeInUp>

          <FadeInUp>
            <QuarterlyView />
          </FadeInUp>

          <p className="text-center text-[13px] sm:text-[14px] text-[var(--mid)] mt-6 sm:mt-8">
            Need the line-item breakdown?{" "}
            <Link to="/resources" className="text-[var(--teal)] font-[600] hover:underline inline-flex items-center gap-1">
              View full audited statements <ArrowUpRight size={13} />
            </Link>
          </p>
        </div>
      </section>

      {/* Gateway promises */}
      <section className="bg-white section">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
          <FadeInUp className="mb-8 sm:mb-12 max-w-[640px]">
            <span className="label">Donation Gateways</span>
            <h2 className="text-[var(--dark)] mt-2 before:hidden text-[clamp(24px,3.6vw,36px)]">Your money, your gateway.</h2>
            <p className="text-[var(--mid)] mt-3 text-[14px] sm:text-[15px] leading-[1.7]">
              Each donation route has a clear, ring-fenced purpose. Funds raised under one gateway are never pooled into another.
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {gateways.map((g, i) => (
              <FadeInUp key={g.title} delay={i * 0.08}>
                <div
                  className="group h-full bg-white border border-[var(--border-color)] rounded-[var(--radius-xl)] p-5 sm:p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] transition-shadow flex flex-col"
                  style={{ borderTop: `3px solid ${g.color}` }}
                >
                  <span className="inline-flex items-center w-fit gap-1.5 bg-[#16A34A]/8 text-[#15803D] text-[10.5px] font-[700] px-2.5 py-1 rounded-full uppercase tracking-[0.06em] mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                    {g.badge}
                  </span>
                  <h3 className="font-[700] text-[var(--dark)] mb-2 text-[15px] sm:text-[16px]">{g.title}</h3>
                  <p className="text-[13px] sm:text-[13.5px] text-[var(--mid)] leading-[1.7] flex-1">{g.desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="bg-[var(--bg)] section">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
          <FadeInUp className="mb-8 sm:mb-12 max-w-[640px]">
            <span className="label">Verification</span>
            <h2 className="text-[var(--dark)] mt-2 before:hidden text-[clamp(24px,3.6vw,36px)]">Independently verified.</h2>
            <p className="text-[var(--mid)] mt-3 text-[14px] sm:text-[15px] leading-[1.7]">
              We don't ask you to take our word for it. Audits, government registrations and quarterly reports keep us accountable.
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {compliance.map((c, i) => (
              <FadeInUp key={c.title} delay={i * 0.06}>
                <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--border-color)] p-5 sm:p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] transition-shadow flex gap-4 sm:gap-5 h-full">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--teal)]/8 flex items-center justify-center flex-shrink-0">
                    <c.icon size={20} className="text-[var(--teal)]" />
                  </div>
                  <div>
                    <h4 className="font-[700] text-[var(--dark)] mb-1.5 text-[15px] sm:text-[16px]">{c.title}</h4>
                    <p className="text-[13px] sm:text-[13.5px] text-[var(--mid)] leading-[1.65]">{c.desc}</p>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[var(--teal-dark)] via-[var(--teal)] to-[#0D1B1C] py-12 sm:py-14 lg:py-16">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          <div className="max-w-[520px]">
            <p className="text-white font-[700] text-[18px] sm:text-[20px] tracking-[-0.01em]">Read our complete Annual Report</p>
            <p className="text-white/65 text-[13px] sm:text-[14px] mt-1.5 leading-[1.6]">
              Full audited financial statements, programme outcomes and detailed impact reports — open for download.
            </p>
          </div>
          <Link
            to="/resources"
            className="bg-[var(--yellow)] text-[var(--dark)] font-[700] px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-[var(--shadow-yellow)] flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform whitespace-nowrap text-[13px] sm:text-[14px] w-full sm:w-auto justify-center"
          >
            <Download size={15} />
            Download Reports
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default TransparencyPage;