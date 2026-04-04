import { ShieldCheck, FileText, Lock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const items = [
  { icon: ShieldCheck, title: "80G Tax Benefit", desc: "Donations eligible for 50% tax deduction under Section 80G" },
  { icon: FileText, title: "NGO Registration", desc: "Registered under Societies Act, West Bengal. Govt approved." },
  { icon: Lock, title: "Secure Payments", desc: "256-bit SSL encrypted via Razorpay. UPI, Cards, Netbanking." },
  { icon: BarChart3, title: "Full Transparency", desc: "Annual financial reports publicly available in Resources.", link: true },
];

const TrustBand = () => (
  <section className="relative bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] py-16 lg:py-20">
    {/* Subtle pattern overlay */}
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
      backgroundSize: '32px 32px'
    }} />

    <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="text-center flex flex-col items-center px-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/[0.1] flex items-center justify-center mb-4">
              <item.icon size={24} className="text-[var(--yellow)]" />
            </div>
            <h4 className="font-[700] text-[14px] text-white mb-2">{item.title}</h4>
            <p className="text-[12px] text-white/70 leading-relaxed max-w-[200px]">{item.desc}</p>
            {item.link && (
              <Link to="/transparency" className="text-[var(--yellow)] text-[11px] font-[600] hover:underline mt-3 inline-block">
                View Report →
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBand;
