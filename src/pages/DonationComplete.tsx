import { useSearchParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Check, Stethoscope, GraduationCap, Printer, Share2, ArrowRight, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import FadeInUp from "@/components/ui/FadeInUp";

const gatewayConfig: Record<string, { icon: typeof Stethoscope; color: string; gradient: string; label: string }> = {
  medical: { icon: Stethoscope, color: "var(--teal)", gradient: "from-[var(--teal)] to-[var(--teal-dark)]", label: "Medical Aid" },
  education: { icon: GraduationCap, color: "var(--purple)", gradient: "from-[var(--purple)] to-[#4A48A0]", label: "Education Support" },
};

const DonationComplete = () => {
  const [params] = useSearchParams();
  const paymentId = params.get("payment_id") ?? "";
  const name = params.get("name") || "Friend";
  const amount = params.get("amount") || "0";
  const gateway = params.get("gateway") || "medical";
  const amountNum = parseInt(amount);
  const config = gatewayConfig[gateway] || gatewayConfig.medical;
  const GatewayIcon = config.icon;
  const containerRef = useRef<HTMLDivElement>(null);

  useSEO("Donation Complete", `Thank you for your ₹${amountNum.toLocaleString()} donation.`);

  useEffect(() => {
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({ particleCount: 120, spread: 80, colors: ["#1F9AA8", "#F2B705", "#5C5AA6", "#B6A388", "#FFFFFF"], origin: { y: 0.5 } });
    });
  }, []);

  const referralUrl = `${window.location.origin}/donate/${gateway}?ref=${name.split(" ")[0].toLowerCase()}${new Date().getFullYear()}`;
  const whatsappShareText = encodeURIComponent(`I just donated ₹${amountNum.toLocaleString("en-IN")} to AGSWS — a Kolkata NGO providing medical aid and education support.\n\nJoin me: ${referralUrl}`);

  const impactItems = gateway === "medical" 
    ? [{ label: "Medicines Funded", value: `${Math.ceil(amountNum / 500)} months` }, { label: "Patients Supported", value: `${Math.max(1, Math.floor(amountNum / 2000))}` }, { label: "Cause", value: "Medical Aid" }]
    : [{ label: "Children Supported", value: `${Math.max(1, Math.floor(amountNum / 1500))}` }, { label: "School Days Funded", value: `${Math.ceil(amountNum / 50)}` }, { label: "Cause", value: "Education" }];

  return (
    <main id="main-content" ref={containerRef} className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-95`} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-[600px] mx-auto px-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }} className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
            <Check size={44} className="text-white" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-[32px] lg:text-[40px] font-[800] text-white mb-2 tracking-[-0.02em]">Thank You, {name}!</h1>
            <p className="text-white/60 text-[16px]">Your generosity is making a real difference.</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[700px] mx-auto px-6 -mt-8 pb-20 relative z-10">
        {/* Amount Card */}
        <FadeInUp>
          <div className="bg-[var(--white)] rounded-[24px] border border-[var(--border-color)] shadow-[var(--shadow-lg)] p-8 mb-6 text-center">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
              <GatewayIcon size={24} style={{ color: config.color }} />
            </div>
            <p className="text-[11px] text-[var(--light)] uppercase tracking-[0.1em] font-[600] mb-1">Donation Amount</p>
            <p className="text-[42px] font-[800] tracking-[-0.02em]" style={{ color: config.color }}>₹{amountNum.toLocaleString("en-IN")}</p>
            <p className="text-[14px] text-[var(--mid)] mt-1">{config.label} • {paymentId ? `ID: ${paymentId.slice(0, 16)}` : "Processing"}</p>
          </div>
        </FadeInUp>

        {/* Impact Grid */}
        <FadeInUp delay={0.1}>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {impactItems.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="bg-[var(--white)] rounded-[18px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-5 text-center">
                <p className="text-[20px] font-[800] text-[var(--dark)]">{item.value}</p>
                <p className="text-[10px] text-[var(--light)] uppercase tracking-[0.06em] font-[500] mt-1">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </FadeInUp>

        {/* Receipt & Actions */}
        <FadeInUp delay={0.2}>
          <div className="bg-[var(--white)] rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={18} style={{ color: config.color }} />
              <p className="text-[14px] font-[600] text-[var(--dark)]">Your Donation Receipt</p>
            </div>
            <p className="text-[13px] text-[var(--mid)] mb-5 leading-[1.6]">A confirmation receipt has been emailed to you. You can also print this page for your records.</p>
            <div className="flex flex-wrap gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => window.print()} className="h-[44px] px-6 bg-[var(--yellow)] text-[var(--dark)] font-[600] text-[13px] rounded-full shadow-[var(--shadow-yellow)] flex items-center gap-2">
                <Printer size={14} /> Print Receipt
              </motion.button>
              <a href={`https://wa.me/?text=${whatsappShareText}`} target="_blank" rel="noopener noreferrer" className="h-[44px] px-6 border-[1.5px] border-[#25D366] text-[#25D366] font-[600] text-[13px] rounded-full flex items-center gap-2 hover:bg-[#25D366] hover:text-white transition-all">
                <Share2 size={14} /> Share on WhatsApp
              </a>
            </div>
          </div>
        </FadeInUp>

        {/* Next steps */}
        <FadeInUp delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/track-donation?payment_id=${paymentId || "demo"}`} className="flex-1 h-[52px] bg-[var(--white)] rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] flex items-center justify-center gap-2 text-[14px] font-[600] text-[var(--teal)] hover:shadow-[var(--shadow-md)] transition-all">
              <TrendingUp size={16} /> Track Your Donation
            </Link>
            <Link to="/donor-wall" className="flex-1 h-[52px] bg-[var(--white)] rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] flex items-center justify-center gap-2 text-[14px] font-[600] text-[var(--teal)] hover:shadow-[var(--shadow-md)] transition-all">
              <Users size={16} /> View Donor Wall
            </Link>
            <Link to="/" className="flex-1 h-[52px] bg-[var(--white)] rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] flex items-center justify-center gap-2 text-[14px] font-[600] text-[var(--mid)] hover:shadow-[var(--shadow-md)] transition-all">
              <ArrowRight size={16} /> Back to Home
            </Link>
          </div>
        </FadeInUp>
      </section>
    </main>
  );
};

export default DonationComplete;
