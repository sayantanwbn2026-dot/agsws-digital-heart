import { useSearchParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import FadeInUp from "@/components/ui/FadeInUp";

const causeConfig: Record<string, { label: string; retry: string; gradient: string; accent: string }> = {
  medical: {
    label: "Medical Aid",
    retry: "/donate/medical",
    gradient: "from-[#0f3a44] via-[#13525e] to-[#1F9AA8]",
    accent: "var(--teal)",
  },
  education: {
    label: "Education Support",
    retry: "/donate/education",
    gradient: "from-[#2a285f] via-[#3d3a85] to-[#5C5AA6]",
    accent: "var(--purple)",
  },
  goldenage: {
    label: "GoldenAge Care Registration",
    retry: "/register-parent",
    gradient: "from-[#3a2f1e] via-[#5a4628] to-[#B6A388]",
    accent: "#B6A388",
  },
};

const DonationCancelled = () => {
  const [params] = useSearchParams();
  const name = params.get("name") || "Friend";
  const amount = params.get("amount") || "0";
  const gateway = params.get("gateway") || "medical";
  const amountNum = parseInt(amount) || 0;
  const cfg = causeConfig[gateway] || causeConfig.medical;

  useSEO("Transaction Cancelled", "Your donation was not completed.");

  return (
    <main id="main-content" className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 lg:pt-36 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-95`} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-[600px] mx-auto px-5 sm:px-6 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.15 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-white/20"
          >
            <XCircle size={40} className="text-white sm:hidden" strokeWidth={1.8} />
            <XCircle size={44} className="text-white hidden sm:block" strokeWidth={1.8} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <p className="text-[10px] sm:text-[11px] tracking-[0.18em] uppercase font-[600] text-white/60 mb-3">Transaction Cancelled</p>
            <h1 className="text-[26px] sm:text-[32px] lg:text-[40px] font-[800] text-white mb-2 sm:mb-3 tracking-[-0.02em] leading-[1.15]">
              No worries, {name}.
            </h1>
            <p className="text-white/70 text-[14px] sm:text-[16px] leading-[1.55] max-w-[460px] mx-auto px-2">
              Your payment was not completed and you have not been charged. You can try again whenever you are ready.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[680px] mx-auto px-5 sm:px-6 -mt-6 sm:-mt-8 pb-28 sm:pb-20 relative z-10">
        {/* Summary */}
        <FadeInUp>
          <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-[var(--border-color)] shadow-[var(--shadow-lg)] p-6 sm:p-8 mb-5 sm:mb-6 text-center">
            <p className="text-[10px] sm:text-[11px] text-[var(--light)] uppercase tracking-[0.12em] font-[600] mb-2">Attempted Contribution</p>
            <p className="text-[34px] sm:text-[42px] font-[800] tracking-[-0.02em]" style={{ color: cfg.accent }}>
              ₹{amountNum.toLocaleString("en-IN")}
            </p>
            <p className="text-[13px] sm:text-[14px] text-[var(--mid)] mt-1">{cfg.label}</p>
            <div className="mt-5 sm:mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg)] border border-[var(--border-color)]">
              <ShieldCheck size={14} className="text-[var(--teal)]" />
              <span className="text-[11px] sm:text-[12px] font-[600] text-[var(--mid)]">You were not charged</span>
            </div>
          </div>
        </FadeInUp>

        {/* Why this happens */}
        <FadeInUp delay={0.1}>
          <div className="bg-white rounded-[18px] sm:rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-5 sm:p-6 mb-5 sm:mb-6">
            <p className="text-[14px] sm:text-[15px] font-[700] text-[var(--dark)] mb-3">Common reasons a payment is cancelled</p>
            <ul className="space-y-2.5 sm:space-y-3">
              {[
                "You closed the secure checkout window before completing payment.",
                "Your bank declined the transaction or required extra verification.",
                "A momentary network or browser interruption.",
              ].map((reason) => (
                <li key={reason} className="flex gap-3 text-[13px] sm:text-[14px] text-[var(--mid)] leading-[1.55]">
                  <span className="mt-[7px] w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ backgroundColor: cfg.accent }} />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeInUp>

        {/* Actions */}
        <FadeInUp delay={0.2}>
          <div className="flex flex-col gap-3">
            <Link
              to={cfg.retry}
              className="h-[54px] sm:h-[56px] w-full bg-[var(--yellow)] text-[var(--dark)] font-[700] text-[14px] sm:text-[15px] rounded-[16px] shadow-[var(--shadow-yellow)] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <RefreshCw size={16} /> Try the donation again
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/"
                className="h-[50px] bg-white rounded-[14px] border border-[var(--border-color)] shadow-[var(--shadow-card)] flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-[600] text-[var(--mid)] active:scale-[0.98] transition-transform"
              >
                <ArrowLeft size={15} /> Home
              </Link>
              <Link
                to="/contact"
                className="h-[50px] bg-white rounded-[14px] border border-[var(--border-color)] shadow-[var(--shadow-card)] flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-[600] text-[var(--teal)] active:scale-[0.98] transition-transform"
              >
                <MessageCircle size={15} /> Need help?
              </Link>
            </div>
          </div>
        </FadeInUp>

        {/* Reassurance */}
        <FadeInUp delay={0.3}>
          <div className="mt-6 sm:mt-8 flex items-start gap-3 p-4 sm:p-5 rounded-[16px] bg-gradient-to-br from-[var(--bg)] to-white border border-[var(--border-color)]">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cfg.accent}15` }}>
              <Heart size={16} style={{ color: cfg.accent }} />
            </div>
            <p className="text-[12px] sm:text-[13px] text-[var(--mid)] leading-[1.6]">
              Every contribution — completed or attempted — tells us this work matters. Whenever you are ready, we are here.
            </p>
          </div>
        </FadeInUp>
      </section>
    </main>
  );
};

export default DonationCancelled;