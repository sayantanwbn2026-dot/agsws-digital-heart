import { useSearchParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Check, Stethoscope, GraduationCap, Heart, Printer, Share2, ArrowRight, TrendingUp, Users, ShieldCheck, Download } from "lucide-react";
import { useEffect, useRef } from "react";
import FadeInUp from "@/components/ui/FadeInUp";
import { jsPDF } from "jspdf";

const gatewayConfig: Record<string, { icon: typeof Stethoscope; color: string; gradient: string; label: string }> = {
  medical: { icon: Stethoscope, color: "var(--teal)", gradient: "from-[var(--teal)] to-[var(--teal-dark)]", label: "Medical Aid" },
  education: { icon: GraduationCap, color: "var(--purple)", gradient: "from-[var(--purple)] to-[#4A48A0]", label: "Education Support" },
  goldenage: { icon: Heart, color: "#B6A388", gradient: "from-[#B6A388] to-[#8a7861]", label: "GoldenAge Care" },
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

  const downloadReceipt = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const M = 48;
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const receiptNo = `AGSWS-${(paymentId || Date.now().toString()).slice(-10).toUpperCase()}`;

    // Header band
    doc.setFillColor(31, 154, 168);
    doc.rect(0, 0, W, 90, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("AGSWS", M, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Donation Receipt", M, 62);
    doc.setFontSize(9);
    doc.text(`Receipt #: ${receiptNo}`, W - M, 42, { align: "right" });
    doc.text(`Date: ${today}`, W - M, 58, { align: "right" });

    // Body
    doc.setTextColor(20, 20, 20);
    let y = 140;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(`Thank you, ${name}.`, M, y);
    y += 22;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(80, 80, 80);
    const intro = doc.splitTextToSize(
      "We gratefully acknowledge receipt of your contribution towards AGSWS. Your generosity directly supports families in Kolkata through medical aid, education, and GoldenAge Care.",
      W - M * 2
    );
    doc.text(intro, M, y);
    y += intro.length * 14 + 18;

    // Box
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(M, y, W - M * 2, 130, 8, 8);
    const rows: [string, string][] = [
      ["Donor Name", name],
      ["Cause", config.label],
      ["Payment ID", paymentId || "Processing"],
      ["Date", today],
      ["Amount", `INR ${amountNum.toLocaleString("en-IN")}`],
    ];
    let ry = y + 24;
    rows.forEach(([k, v]) => {
      doc.setTextColor(120, 120, 120);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.text(k.toUpperCase(), M + 18, ry);
      doc.setTextColor(20, 20, 20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(String(v), W - M - 18, ry, { align: "right" });
      ry += 22;
    });
    y += 150;

    // 80G note
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text("Tax Exemption (80G)", M, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const note = doc.splitTextToSize(
      "Donations to AGSWS are eligible for tax deduction under Section 80G of the Income Tax Act, 1961. A signed 80G certificate will be emailed separately within 7 working days.",
      W - M * 2
    );
    doc.text(note, M, y);
    y += note.length * 14 + 30;

    // Footer
    doc.setDrawColor(230, 230, 230);
    doc.line(M, y, W - M, y);
    y += 22;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("AGSWS — Kolkata, West Bengal, India", M, y);
    doc.text("support@agsws.org  ·  agsws.org", W - M, y, { align: "right" });

    doc.save(`AGSWS-Receipt-${receiptNo}.pdf`);
  };

  const impactItems = gateway === "medical" 
    ? [{ label: "Medicines Funded", value: `${Math.ceil(amountNum / 500)} months` }, { label: "Patients Supported", value: `${Math.max(1, Math.floor(amountNum / 2000))}` }, { label: "Cause", value: "Medical Aid" }]
    : [{ label: "Children Supported", value: `${Math.max(1, Math.floor(amountNum / 1500))}` }, { label: "School Days Funded", value: `${Math.ceil(amountNum / 50)}` }, { label: "Cause", value: "Education" }];

  return (
    <main id="main-content" ref={containerRef} className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 lg:pt-36 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-95`} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-[600px] mx-auto px-5 sm:px-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }} className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 border border-white/20">
            <Check size={38} className="text-white sm:hidden" />
            <Check size={44} className="text-white hidden sm:block" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-[26px] sm:text-[32px] lg:text-[40px] font-[800] text-white mb-2 tracking-[-0.02em] leading-[1.15]">Thank You, {name}!</h1>
            <p className="text-white/70 text-[14px] sm:text-[16px]">Your generosity is making a real difference.</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[700px] mx-auto px-5 sm:px-6 -mt-6 sm:-mt-8 pb-28 sm:pb-20 relative z-10">
        {/* Amount Card */}
        <FadeInUp>
          <div className="bg-[var(--white)] rounded-[20px] sm:rounded-[24px] border border-[var(--border-color)] shadow-[var(--shadow-lg)] p-6 sm:p-8 mb-5 sm:mb-6 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
              <GatewayIcon size={22} style={{ color: config.color }} />
            </div>
            <p className="text-[10px] sm:text-[11px] text-[var(--light)] uppercase tracking-[0.12em] font-[600] mb-1">Donation Amount</p>
            <p className="text-[34px] sm:text-[42px] font-[800] tracking-[-0.02em]" style={{ color: config.color }}>₹{amountNum.toLocaleString("en-IN")}</p>
            <p className="text-[12px] sm:text-[14px] text-[var(--mid)] mt-1 px-2 break-all">{config.label}{paymentId ? ` • ID: ${paymentId.slice(0, 14)}` : " • Processing"}</p>
          </div>
        </FadeInUp>

        {/* Impact Grid */}
        <FadeInUp delay={0.1}>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
            {impactItems.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="bg-[var(--white)] rounded-[14px] sm:rounded-[18px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-3 sm:p-5 text-center min-w-0">
                <p className="text-[14px] sm:text-[20px] font-[800] text-[var(--dark)] leading-[1.2] break-words">{item.value}</p>
                <p className="text-[9px] sm:text-[10px] text-[var(--light)] uppercase tracking-[0.06em] font-[600] mt-1.5 leading-tight">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </FadeInUp>

        {/* Receipt & Actions */}
        <FadeInUp delay={0.2}>
          <div className="bg-[var(--white)] rounded-[18px] sm:rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-5 sm:p-6 mb-5 sm:mb-6">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <ShieldCheck size={18} style={{ color: config.color }} />
              <p className="text-[13px] sm:text-[14px] font-[700] text-[var(--dark)]">Your Donation Receipt</p>
            </div>
            <p className="text-[12px] sm:text-[13px] text-[var(--mid)] mb-4 sm:mb-5 leading-[1.6]">A confirmation receipt has been emailed to you. You can also print this page for your records.</p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={downloadReceipt} className="h-[46px] sm:h-[44px] px-6 bg-[var(--yellow)] text-[var(--dark)] font-[600] text-[13px] rounded-full shadow-[var(--shadow-yellow)] flex items-center justify-center gap-2">
                <Download size={14} /> Download Receipt
              </motion.button>
              <button onClick={() => window.print()} className="h-[46px] sm:h-[44px] px-6 border-[1.5px] border-[var(--border-color)] text-[var(--dark)] font-[600] text-[13px] rounded-full flex items-center justify-center gap-2 hover:bg-[var(--bg)] transition-all">
                <Printer size={14} /> Print
              </button>
              <a href={`https://wa.me/?text=${whatsappShareText}`} target="_blank" rel="noopener noreferrer" className="h-[46px] sm:h-[44px] px-6 border-[1.5px] border-[#25D366] text-[#25D366] font-[600] text-[13px] rounded-full flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition-all">
                <Share2 size={14} /> Share
              </a>
            </div>
          </div>
        </FadeInUp>

        {/* Next steps */}
        <FadeInUp delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <Link to={`/track-donation?payment_id=${paymentId || "demo"}`} className="flex-1 h-[50px] sm:h-[52px] bg-[var(--white)] rounded-[14px] sm:rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-[600] text-[var(--teal)] hover:shadow-[var(--shadow-md)] transition-all">
              <TrendingUp size={16} /> Track Your Donation
            </Link>
            <Link to="/donor-wall" className="flex-1 h-[50px] sm:h-[52px] bg-[var(--white)] rounded-[14px] sm:rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-[600] text-[var(--teal)] hover:shadow-[var(--shadow-md)] transition-all">
              <Users size={16} /> View Donor Wall
            </Link>
            <Link to="/" className="flex-1 h-[50px] sm:h-[52px] bg-[var(--white)] rounded-[14px] sm:rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-[600] text-[var(--mid)] hover:shadow-[var(--shadow-md)] transition-all">
              <ArrowRight size={16} /> Back to Home
            </Link>
          </div>
        </FadeInUp>
      </section>
    </main>
  );
};

export default DonationComplete;
