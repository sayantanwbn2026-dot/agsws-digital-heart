import { ShieldCheck, FileText, Lock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import FadeInUp from "../ui/FadeInUp";

const items = [
  { icon: ShieldCheck, title: "80G Tax Benefit", desc: "Donations eligible for 50% tax deduction under Section 80G" },
  { icon: FileText, title: "NGO Registration", desc: "Registered under Societies Act, West Bengal" },
  { icon: Lock, title: "Secure Payments", desc: "256-bit SSL encrypted via Razorpay. UPI, Cards, Netbanking." },
  { icon: BarChart3, title: "Full Transparency", desc: "Annual financial reports publicly available in Resources", link: true },
];

const TrustBand = () => (
  <section className="bg-teal py-16">
    <div className="max-w-[1100px] mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item, i) => (
          <FadeInUp key={item.title} delay={i * 0.1} className="text-center lg:text-left">
            <item.icon size={32} className="text-yellow mx-auto lg:mx-0 mb-4" />
            <h4 className="font-semibold text-primary-foreground mb-2">{item.title}</h4>
            <p className="text-sm text-primary-foreground/80">{item.desc}</p>
            {item.link && (
              <Link to="/transparency" className="text-yellow text-xs font-medium hover:underline mt-2 inline-block">
                View Transparency Report →
              </Link>
            )}
          </FadeInUp>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBand;
