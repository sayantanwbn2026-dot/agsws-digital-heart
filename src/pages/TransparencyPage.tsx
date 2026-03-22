import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { Link } from "react-router-dom";
import { FileCheck, Award, Globe, Shield, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fundCards = [
  { pct: "78%", title: "Programme Costs", desc: "Directly funds patient care, medicines, surgery support, school fees, books, meals, and field coordinator costs.", items: ["Medical treatment support", "Emergency hospitalisation", "School fee sponsorship", "Books and stationery", "Mid-day meal programme"], bg: "bg-teal", color: "text-primary-foreground" },
  { pct: "12%", title: "Operations", desc: "Field coordinator salaries, transport, communication, camp organisation, and programme management.", items: [], bg: "bg-purple", color: "text-primary-foreground" },
  { pct: "10%", title: "Administration", desc: "Office costs, legal compliance, audit fees, and technology infrastructure.", items: [], bg: "bg-beige", color: "text-primary-foreground" },
];

const quarters = [
  { q: "Q1 2024", income: "₹3,40,000", expenditure: "₹2,85,000", pct: "78%", surplus: "₹55,000" },
  { q: "Q2 2024", income: "₹4,20,000", expenditure: "₹3,60,000", pct: "80%", surplus: "₹60,000" },
  { q: "Q3 2024", income: "₹5,80,000", expenditure: "₹4,90,000", pct: "77%", surplus: "₹90,000" },
  { q: "Q4 2024", income: "₹6,10,000", expenditure: "₹5,20,000", pct: "79%", surplus: "₹90,000" },
];

const gateways = [
  { title: "Medical Aid Donations", desc: "100% of Gateway 1 donations go directly to patient care, medicines, surgery support, hospital fees, and emergency transport in Kolkata. No administrative overhead is deducted from medical donations.", badge: "100% to patients", border: "border-l-teal" },
  { title: "Education Support Donations", desc: "100% of Gateway 2 donations fund school fees, books, stationery, and mid-day meals for children in our partner schools. AGSWS covers all administrative costs from our general fund.", badge: "100% to children", border: "border-l-purple" },
  { title: "Parent Registration Fee (₹100)", desc: "The ₹100 platform fee covers: Coordinator assignment (₹40), SMS alert system (₹20), case file maintenance (₹25), admin (₹15). It does not go into the donation fund.", badge: "Fully allocated", border: "border-l-yellow" },
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
    { width: 78, color: "bg-teal", label: "78% Programme" },
    { width: 12, color: "bg-purple", label: "12% Operations" },
    { width: 10, color: "bg-beige", label: "10% Admin" },
  ];

  return (
    <div ref={ref} className="h-12 bg-border rounded-full overflow-hidden flex">
      {segments.map((s, i) => (
        <motion.div
          key={i}
          initial={{ width: 0 }}
          animate={inView ? { width: `${s.width}%` } : { width: 0 }}
          transition={{ duration: 1, delay: i * 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className={`${s.color} h-full flex items-center justify-center`}
        >
          <span className="text-xs font-semibold text-primary-foreground whitespace-nowrap">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

const TransparencyPage = () => {
  useSEO("Transparency", "AGSWS Donation Transparency — see exactly how every rupee is used.");

  return (
    <main id="main-content">
      <section className="h-[300px] bg-gradient-to-br from-teal-dark via-teal to-teal flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/30" />
        <div className="relative z-10 text-center">
          <h1 className="heading-1 text-primary-foreground">Where Your Money Goes</h1>
          <p className="text-sm text-primary-foreground/60 mt-3">Home / Transparency</p>
        </div>
      </section>

      {/* Fund Utilisation */}
      <section className="bg-card py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeInUp className="text-center mb-16">
            <span className="label-text text-teal">Financial Breakdown</span>
            <h2 className="heading-2 text-text-dark mt-3">How Every Rupee Is Used</h2>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {fundCards.map((card, i) => (
              <FadeInUp key={card.title} delay={i * 0.1}>
                <div className={`${card.bg} ${card.color} rounded-xl p-8 h-full`}>
                  <p className="text-6xl font-extrabold opacity-90 mb-3">{card.pct}</p>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{card.desc}</p>
                  {card.items.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {card.items.map((item) => (
                        <li key={item} className="text-sm opacity-80 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FadeInUp>
            ))}
          </div>

          <ProgressBar />
        </div>
      </section>

      {/* Quarterly Summary */}
      <section className="bg-background py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeInUp className="text-center mb-12">
            <span className="label-text text-teal">Quarterly Report</span>
            <h2 className="heading-2 text-text-dark mt-3">Financial Transparency — FY 2024–25</h2>
          </FadeInUp>

          <FadeInUp>
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-teal">
                    {["Quarter", "Income (₹)", "Expenditure (₹)", "Programme Spend", "Surplus"].map((h) => (
                      <th key={h} className="text-left px-5 py-4 text-xs font-semibold uppercase text-text-light tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quarters.map((q, i) => (
                    <tr key={q.q} className={`border-b border-border ${i % 2 ? "bg-background" : ""}`}>
                      <td className="px-5 py-4 font-medium text-text-dark">{q.q}</td>
                      <td className="px-5 py-4 text-text-mid">{q.income}</td>
                      <td className="px-5 py-4 text-text-mid">{q.expenditure}</td>
                      <td className="px-5 py-4 text-teal font-semibold">{q.pct}</td>
                      <td className="px-5 py-4 text-text-mid">{q.surplus}</td>
                    </tr>
                  ))}
                  <tr className="bg-teal text-primary-foreground font-bold">
                    <td className="px-5 py-4">FY 2023–24 Total</td>
                    <td className="px-5 py-4">₹19,50,000</td>
                    <td className="px-5 py-4">₹16,55,000</td>
                    <td className="px-5 py-4">79%</td>
                    <td className="px-5 py-4">₹2,95,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeInUp>

          <p className="text-center text-sm text-text-mid mt-6">
            Full audited financial statements available in our{" "}
            <Link to="/resources" className="text-teal font-medium hover:underline">Resources section →</Link>
          </p>
        </div>
      </section>

      {/* Gateway Breakdown */}
      <section className="bg-card py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeInUp className="text-center mb-12">
            <span className="label-text text-teal">Gateway Breakdown</span>
            <h2 className="heading-2 text-text-dark mt-3">How Each Gateway's Funds Are Used</h2>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gateways.map((g, i) => (
              <FadeInUp key={g.title} delay={i * 0.1}>
                <div className={`bg-card border border-border ${g.border} border-l-4 rounded-lg p-6`}>
                  <h4 className="font-semibold text-text-dark mb-3">{g.title}</h4>
                  <p className="text-sm text-text-mid leading-relaxed mb-4">{g.desc}</p>
                  <span className="bg-teal-light text-teal text-xs font-semibold px-3 py-1 rounded-full">{g.badge}</span>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="bg-background py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeInUp className="text-center mb-12">
            <span className="label-text text-teal">Verification</span>
            <h2 className="heading-2 text-text-dark mt-3">Third-Party Verified</h2>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {compliance.map((c, i) => (
              <FadeInUp key={c.title} delay={i * 0.1}>
                <div className="bg-card border border-border rounded-xl p-6">
                  <c.icon size={28} className="text-teal mb-3" />
                  <h4 className="font-semibold text-text-dark mb-2">{c.title}</h4>
                  <p className="text-sm text-text-mid">{c.desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTA */}
      <section className="bg-teal py-16">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-primary-foreground font-semibold text-lg">Read our complete Annual Report and Financial Statements</p>
          <Link to="/resources" className="bg-yellow text-text-dark font-bold px-8 py-3 rounded-full shadow-yellow flex items-center gap-2 hover:scale-[1.02] transition-transform whitespace-nowrap">
            Download Reports <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default TransparencyPage;
