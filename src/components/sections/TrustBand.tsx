import { motion } from "framer-motion";
import { ArrowRight, BarChart3, FileText, Lock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  {
    icon: ShieldCheck,
    title: "80G Tax Benefit",
    desc: "Donations remain eligible for tax deduction, with compliance details made visible for donors.",
  },
  {
    icon: FileText,
    title: "Audited Reports",
    desc: "Impact reports, receipts, and operational disclosures are presented with clear public access.",
    link: "/transparency",
  },
  {
    icon: Lock,
    title: "Protected Payments",
    desc: "Secure payment flows are designed to feel reliable, fast, and transparent from the first click.",
  },
  {
    icon: BarChart3,
    title: "Proof of Impact",
    desc: "Stories, metrics, and reports work together so visitors can feel the outcome behind every donation.",
  },
];

const proofStats = ["80G compliant", "Encrypted checkout", "Public reporting"];

const TrustBand = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-24">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 20% 18%, hsl(var(--accent) / 0.16), transparent 24%), linear-gradient(135deg, hsl(var(--primary)), hsl(var(--foreground)))`,
        }}
      />

      <div className="container relative z-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-background/10 bg-background/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-background/72 backdrop-blur-xl">
              Trust & transparency
            </span>

            <h2 className="mt-6 max-w-none text-[clamp(2.2rem,4vw,3.5rem)] font-black leading-[1.02] tracking-[-0.05em] text-background">
              Built to feel human, backed by proof.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-background/72">
              Every donation journey is shaped to feel warm and intuitive while still giving visitors the confidence of receipts,
              audited reporting, secure payments, and measurable outcomes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {proofStats.map((stat) => (
                <span
                  key={stat}
                  className="rounded-full border border-background/10 bg-background/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-background/72 backdrop-blur-xl"
                >
                  {stat}
                </span>
              ))}
            </div>

            <Link
              to="/transparency"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-accent-foreground shadow-[var(--shadow-yellow)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Open transparency page
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="rounded-[26px] border border-background/10 bg-background/10 p-5 backdrop-blur-2xl shadow-[var(--shadow-lg)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/10 text-accent">
                  <item.icon size={22} />
                </div>

                <h3 className="mt-5 max-w-none text-lg font-black tracking-[-0.03em] text-background">{item.title}</h3>
                <p className="mt-3 max-w-none text-sm leading-7 text-background/68">{item.desc}</p>

                {item.link && (
                  <Link to={item.link} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    View reports
                    <ArrowRight size={15} />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBand;
