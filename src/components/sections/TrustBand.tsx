import { ShieldCheck, FileText, Lock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import FadeInUp from "../ui/FadeInUp";

const items = [
  { icon: ShieldCheck, title: "80G Tax Benefit", desc: "Donations eligible for 50% tax deduction under Section 80G" },
  { icon: FileText, title: "NGO Registration", desc: "Registered under Societies Act, West Bengal. Govt approved." },
  { icon: Lock, title: "Secure Payments", desc: "256-bit SSL encrypted via Razorpay. UPI, Cards, Netbanking." },
  { icon: BarChart3, title: "Full Transparency", desc: "Annual financial reports publicly available in Resources.", link: true },
];

const TrustBand = () => (
  <section className="relative bg-[var(--teal)] mt-12 mb-12 py-[12px]">
    {/* SVG Wave top */}
    <div className="absolute left-0 right-0 top-0 -translate-y-full text-[var(--teal)] w-full overflow-hidden leading-none">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[60px] fill-current">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C63.26,35.26,163.5,60.85,321.39,56.44Z"></path>
      </svg>
    </div>

    <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <FadeInUp key={item.title} delay={i * 0.1} className="text-center p-[40px_24px] flex flex-col items-center">
            <item.icon size={32} className="text-[var(--yellow)] mb-[12px]" />
            <h4 className="font-semibold text-[15px] text-white mb-[8px] tracking-wide">{item.title}</h4>
            <p className="text-[13px] font-normal text-white/80 leading-[1.6] max-w-[200px] mx-auto">
              {item.desc}
            </p>
            {item.link && (
              <Link to="/transparency" className="text-[var(--yellow)] text-[12px] font-medium hover:underline mt-[12px] inline-block tracking-wide">
                View Report →
              </Link>
            )}
          </FadeInUp>
        ))}
      </div>
    </div>

    {/* SVG Wave bottom */}
    <div className="absolute left-0 right-0 bottom-0 translate-y-full text-[var(--teal)] w-full overflow-hidden leading-none rotate-180">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-[60px] fill-current">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C63.26,35.26,163.5,60.85,321.39,56.44Z"></path>
      </svg>
    </div>
  </section>
);

export default TrustBand;
