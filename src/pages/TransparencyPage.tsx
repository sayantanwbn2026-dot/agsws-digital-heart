import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { FileCheck, Award, Globe, Shield, ArrowRight, TrendingUp, PieChart } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fundCards = [
  { pct: "78%", title: "Programme Costs", desc: "Directly funds patient care, medicines, surgery support, school fees, books, meals, and field coordinator costs.", items: ["Medical treatment support", "Emergency hospitalisation", "School fee sponsorship", "Books and stationery", "Mid-day meal programme"], color: "var(--teal)" },
  { pct: "12%", title: "Operations", desc: "Field coordinator salaries, transport, communication, camp organisation, and programme management.", items: [], color: "var(--purple)" },
  { pct: "10%", title: "Administration", desc: "Office costs, legal compliance, audit fees, and technology infrastructure.", items: [], color: "var(--beige)" },
];

const quarters = [
  { q: "Q1 2024", income: "₹3,40,000", expenditure: "₹2,85,000", pct: "78%", surplus: "₹55,000" },
  { q: "Q2 2024", income: "₹4,20,000", expenditure: "₹3,60,000", pct: "80%", surplus: "₹60,000" },
  { q: "Q3 2024", income: "₹5,80,000", expenditure: "₹4,90,000", pct: "77%", surplus: "₹90,000" },
  { q: "Q4 2024", income: "₹6,10,000", expenditure: "₹5,20,000", pct: "79%", surplus: "₹90,000" },
];

const gateways = [
  { title: "Medical Aid Donations", desc: "100% of Gateway 1 donations go directly to patient care, medicines, surgery support, hospital fees, and emergency transport in Kolkata.", badge: "100% to patients", color: "var(--teal)" },
  { title: "Education Support Donations", desc: "100% of Gateway 2 donations fund school fees, books, stationery, and mid-day meals for children in our partner schools.", badge: "100% to children", color: "var(--purple)" },
  { title: "Parent Registration Fee (₹100)", desc: "The ₹100 platform fee covers: Coordinator assignment (₹40), SMS alert system (₹20), case file maintenance (₹25), admin (₹15).", badge: "Fully allocated", color: "var(--yellow)" },
];

const compliance = [
  { icon: FileCheck, title: "Audited Accounts", desc: "Annual accounts audited by a registered CA firm. Audit reports available for download." },
  { icon: Award, title: "80G Certified", desc: "All donations eligible for 50% tax deduction. Certificate valid and current." },
  { icon: Globe, title: "NGO Darpan Listed", desc: "Listed on the Government of India's NGO Darpan portal." },
  { icon: Shield, title: "FCRA Status", desc: "Currently not FCRA registered. Only accepting domestic donations at this time." },
];

const ProgressBar = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const segments = [
    { width: 78, color: "var(--teal)", label: "78% Programme" },
    { width: 12, color: "var(--purple)", label: "12% Ops" },
    { width: 10, color: "var(--beige)", label: "10% Admin" },
  ];
  return (
    <div ref={ref} className="h-10 bg-[var(--border-color)] rounded-full overflow-hidden flex">
      {segments.map((s, i) => (
        <motion.div
          key={i}
          initial={{ width: 0 }}
          animate={inView ? { width: `${s.width}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: i * 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="h-full flex items-center justify-center"
          style={{ backgroundColor: s.color }}
        >
          <span className="text-[11px] font-[600] text-white whitespace-nowrap">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

const TransparencyPage = () => {
  useSEO("Transparency", "AGSWS Donation Transparency — see exactly how every rupee is used.");

  return (
    <main id="main-content">
      <PageHero title="Where Your Money Goes" label="Open Accounts" subtitle="Full financial transparency. Every rupee tracked, reported, and verified." bgVariant="teal-dark" size="md" breadcrumb={[{ label: "Home", href: "/" }, { label: "Transparency" }]} />

      {/* Fund Utilisation */}
      <section className="bg-white py-[64px] lg:py-[96px]">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
          <FadeInUp className="text-center mb-14">
            <span className="label">Financial Breakdown</span>
            <h2 className="text-[var(--dark)] mt-3 before:hidden mx-auto text-center">How Every Rupee Is Used</h2>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {fundCards.map((card, i) => (
              <FadeInUp key={card.title} delay={i * 0.1}>
                <div className="rounded-[var(--radius-2xl)] p-8 h-full text-white relative overflow-hidden" style={{ backgroundColor: card.color }}>
                  {/* Decorative circle */}
                  <div className="absolute right-[-20px] top-[-20px] w-[100px] h-[100px] rounded-full border border-white/10" />
                  <p className="text-[56px] font-[800] opacity-90 mb-2 leading-none tracking-[-0.03em]">{card.pct}</p>
                  <h3 className="text-[18px] font-[700] mb-3 text-white">{card.title}</h3>
                  <p className="text-[14px] opacity-[0.8] leading-[1.7]">{card.desc}</p>
                  {card.items.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {card.items.map(item => (
                        <li key={item} className="text-[13px] opacity-[0.75] flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-white/60 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp>
            <ProgressBar />
          </FadeInUp>
        </div>
      </section>

      {/* Quarterly Summary */}
      <section className="bg-[var(--bg)] py-[64px] lg:py-[96px]">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
          <FadeInUp className="text-center mb-12">
            <span className="label">Quarterly Report</span>
            <h2 className="text-[var(--dark)] mt-3 before:hidden mx-auto text-center">Financial Transparency — FY 2024–25</h2>
          </FadeInUp>

          <FadeInUp>
            <div className="bg-white rounded-[var(--radius-2xl)] border border-[var(--border-color)] shadow-[var(--shadow-card)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="border-b-2 border-[var(--teal)]">
                      {["Quarter", "Income (₹)", "Expenditure (₹)", "Programme %", "Surplus"].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-[11px] font-[600] uppercase text-[var(--light)] tracking-[0.06em]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {quarters.map((q, i) => (
                      <tr key={q.q} className={`border-b border-[var(--border-color)] ${i % 2 ? "bg-[var(--bg)]" : ""}`}>
                        <td className="px-6 py-4 font-[600] text-[var(--dark)]">{q.q}</td>
                        <td className="px-6 py-4 text-[var(--mid)]">{q.income}</td>
                        <td className="px-6 py-4 text-[var(--mid)]">{q.expenditure}</td>
                        <td className="px-6 py-4 text-[var(--teal)] font-[600]">{q.pct}</td>
                        <td className="px-6 py-4 text-[var(--mid)]">{q.surplus}</td>
                      </tr>
                    ))}
                    <tr className="bg-[var(--teal)] text-white font-[700]">
                      <td className="px-6 py-4">FY Total</td>
                      <td className="px-6 py-4">₹19,50,000</td>
                      <td className="px-6 py-4">₹16,55,000</td>
                      <td className="px-6 py-4">79%</td>
                      <td className="px-6 py-4">₹2,95,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </FadeInUp>

          <p className="text-center text-[14px] text-[var(--mid)] mt-6">
            Full audited financial statements available in our{" "}
            <Link to="/resources" className="text-[var(--teal)] font-[600] hover:underline">Resources section →</Link>
          </p>
        </div>
      </section>

      {/* Gateway Breakdown */}
      <section className="bg-white py-[64px] lg:py-[96px]">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
          <FadeInUp className="text-center mb-12">
            <span className="label">Gateway Breakdown</span>
            <h2 className="text-[var(--dark)] mt-3 before:hidden mx-auto text-center">How Each Gateway's Funds Are Used</h2>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {gateways.map((g, i) => (
              <FadeInUp key={g.title} delay={i * 0.1}>
                <div className="bg-white border border-[var(--border-color)] rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] transition-shadow" style={{ borderLeftWidth: 4, borderLeftColor: g.color }}>
                  <h4 className="font-[600] text-[var(--dark)] mb-3 text-[16px]">{g.title}</h4>
                  <p className="text-[14px] text-[var(--mid)] leading-[1.7] mb-4">{g.desc}</p>
                  <span className="bg-[#16A34A]/10 text-[#16A34A] text-[11px] font-[600] px-3 py-1 rounded-full">{g.badge}</span>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="bg-[var(--bg)] py-[64px] lg:py-[96px]">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
          <FadeInUp className="text-center mb-12">
            <span className="label">Verification</span>
            <h2 className="text-[var(--dark)] mt-3 before:hidden mx-auto text-center">Third-Party Verified</h2>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {compliance.map((c, i) => (
              <FadeInUp key={c.title} delay={i * 0.08}>
                <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--border-color)] p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-[var(--teal)]/8 flex items-center justify-center mb-4">
                    <c.icon size={22} className="text-[var(--teal)]" />
                  </div>
                  <h4 className="font-[600] text-[var(--dark)] mb-2 text-[16px]">{c.title}</h4>
                  <p className="text-[14px] text-[var(--mid)] leading-[1.7]">{c.desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="bg-gradient-to-r from-[var(--teal-dark)] to-[var(--teal)] py-14">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-[700] text-[18px]">Read our complete Annual Report</p>
            <p className="text-white/60 text-[14px] mt-1">Full financial statements and impact reports available for download.</p>
          </div>
          <Link to="/resources" className="bg-[var(--yellow)] text-[var(--dark)] font-[700] px-8 py-3 rounded-full shadow-[var(--shadow-yellow)] flex items-center gap-2 hover:scale-[1.02] transition-transform whitespace-nowrap text-[14px]">
            Download Reports <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default TransparencyPage;
