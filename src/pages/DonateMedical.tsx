import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Shield, Gift, Loader2 } from "lucide-react";
import ImpactVisualiser from "@/components/donation/ImpactVisualiser";
import CampaignThermometer from "@/components/campaign/CampaignThermometer";
import PageHero from "@/components/layout/PageHero";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const donorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  pan: z.string().optional(),
  showOnWall: z.boolean().default(true),
  isGift: z.boolean().default(false),
  giftRecipientName: z.string().optional(),
  giftRecipientEmail: z.string().optional(),
  giftMessage: z.string().max(200).optional(),
});

type DonorFormData = z.infer<typeof donorSchema>;

const amounts = [
  { value: 500, label: "₹500", impact: "Medicines for 1 child for 1 month" },
  { value: 1000, label: "₹1,000", impact: "Emergency transport + specialist consultation" },
  { value: 5000, label: "₹5,000", impact: "Surgery support + hospital operational costs for 1 day" },
  { value: 10000, label: "₹10,000", impact: "Full treatment cycle — admission, surgery, medicines, post-discharge care" },
];

const slabs = [5, 20, 30];

const loadRazorpayScript = () =>
  new Promise<void>((resolve) => {
    if (document.querySelector('script[src*="razorpay"]')) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    document.body.appendChild(script);
  });

const DonateMedical = () => {
  useSEO("Donate Medical Aid", "Donate to AGSWS Medical Aid — fund emergency care and treatment in Kolkata.");
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentFeed, setRecentFeed] = useState<any[]>([]);
  const [taxSlab, setTaxSlab] = useState(() => {
    const saved = localStorage.getItem("agsws_tax_slab");
    return saved ? parseInt(saved) : 30;
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DonorFormData>({
    resolver: zodResolver(donorSchema),
    defaultValues: { showOnWall: true, isGift: false },
  });

  // Donor memory pre-fill
  useEffect(() => {
    const saved = localStorage.getItem("agsws_donor");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.name) setValue("name", d.name);
        if (d.email) setValue("email", d.email);
        if (d.phone) setValue("phone", d.phone);
        if (d.pan) setValue("pan", d.pan);
      } catch { /* ignore */ }
    }
  }, [setValue]);

  // Pending donation recovery
  useEffect(() => {
    const pending = localStorage.getItem("agsws_pending_donation");
    if (pending) {
      try {
        const p = JSON.parse(pending);
        if (p.gateway === "medical") {
          if (p.amount) setSelectedAmount(p.amount);
          if (p.frequency) setFrequency(p.frequency);
          toast("Resuming your previous donation session.", { icon: "↩️" });
        }
      } catch { /* ignore */ }
    }
  }, []);

  // Load live feed
  useEffect(() => {
    fetch("/api/live-feed?limit=4")
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setRecentFeed(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem("agsws_tax_slab", String(taxSlab));
  }, [taxSlab]);

  const isGift = watch("isGift");
  const currentAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  const taxSaving = currentAmount > 0 ? Math.round(currentAmount * 0.5 * (taxSlab / 100)) : 0;
  const netCost = currentAmount - taxSaving;

  // Save pending state on every change
  useEffect(() => {
    if (currentAmount > 0) {
      localStorage.setItem("agsws_pending_donation",
        JSON.stringify({ gateway: "medical", amount: currentAmount, frequency }));
    }
  }, [currentAmount, frequency]);

  const onSubmit = async (data: DonorFormData) => {
    if (!currentAmount || currentAmount < 1) {
      toast.error("Please select or enter a donation amount.");
      return;
    }
    setIsSubmitting(true);
    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway: "medical",
          amount: currentAmount * 100,
          frequency,
          donor_name: data.name,
          donor_email: data.email,
          donor_phone: data.phone,
          pan_number: data.pan ?? "",
          is_gift: data.isGift ?? false,
          gift_recipient_name: data.giftRecipientName ?? "",
          gift_recipient_email: data.giftRecipientEmail ?? "",
          gift_message: data.giftMessage ?? "",
          show_on_wall: data.showOnWall ?? true,
          referrer_code: new URLSearchParams(window.location.search).get("ref") ?? "",
        }),
      });
      const { order_id, amount: rzpAmount, key_id } = await orderRes.json();
      if (!order_id) throw new Error("Order creation failed");

      localStorage.setItem("agsws_donor", JSON.stringify({
        name: data.name, email: data.email, phone: data.phone, pan: data.pan ?? "",
        lastAmount: currentAmount, lastGateway: "Medical Aid",
        lastDate: new Date().toLocaleDateString("en-IN"),
      }));
      localStorage.removeItem("agsws_pending_donation");

      await loadRazorpayScript();

      const rzp = new (window as any).Razorpay({
        key: key_id,
        amount: rzpAmount,
        order_id,
        name: "AGSWS — Social Welfare Society",
        description: "Medical Aid Donation",
        image: "/icon-192.png",
        prefill: { name: data.name, email: data.email, contact: data.phone },
        theme: { color: "#1F9AA8" },
        handler: (response: any) => {
          navigate(
            `/thank-you?payment_id=${response.razorpay_payment_id}` +
            `&amount=${currentAmount}&gateway=medical` +
            `&name=${encodeURIComponent(data.name)}`
          );
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            toast.error("Payment cancelled.");
          },
        },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content">
      <PageHero 
        title="Donate Medical Aid" 
        subtitle="Every rupee funds direct patient care for underprivileged families in Kolkata."
        bgVariant="teal"
        breadcrumb={[{label: "Home", href: "/"}, {label: "Initiatives", href: "/initiatives/medical"}, {label: "Donate"}]}
      />

      <section className="bg-[var(--bg)] py-[64px] lg:py-[96px]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-[40px]">
          
          {/* Form Left Side */}
          <div>
            <FadeInUp>
              <div className="mb-8">
                <div className="bg-[var(--bg)] rounded-[var(--radius-full)] p-[4px] inline-flex relative shadow-inner border border-[var(--border-color)]">
                  {(["once", "monthly"] as const).map((f) => {
                    const isActive = frequency === f;
                    return (
                      <button 
                        key={f} 
                        onClick={() => setFrequency(f)} 
                        className={`relative px-[20px] py-[8px] rounded-[var(--radius-full)] font-['Inter'] font-[600] text-[13px] transition-colors duration-200 z-10 ${isActive ? "text-white" : "text-[var(--mid)]"}`}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="freqBgMed" 
                            className="absolute inset-0 bg-[var(--teal)] rounded-[var(--radius-full)] z-[-1]" 
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        {f === "once" ? "One-Time" : "Monthly"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[12px] mb-6">
                {amounts.map((a) => {
                  const isSelected = selectedAmount === a.value;
                  return (
                    <motion.button 
                      key={a.value} 
                      onClick={() => { setSelectedAmount(a.value); setCustomAmount(""); }} 
                      className={`flex flex-col justify-center min-h-[72px] lg:min-h-[64px] p-4 rounded-[var(--radius-lg)] border-[1.5px] text-left transition-colors duration-200 ${isSelected ? "bg-[var(--teal)] border-[var(--teal)] text-white shadow-[var(--shadow-md)]" : "bg-white text-[var(--dark)] border-[var(--border-color)] hover:bg-[var(--teal-light)] hover:border-[var(--teal)]"}`}
                      animate={{ scale: isSelected ? 1.02 : 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <span className="font-['Inter'] font-[700] text-[20px] leading-tight">{a.label}</span>
                      <p className={`font-['Inter'] font-[400] text-[11px] leading-tight mt-1 transition-opacity ${isSelected ? "opacity-[0.85] text-white" : "opacity-[0.80] text-[var(--mid)]"}`}>
                        {a.impact}
                      </p>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mb-8">
                <label className="text-[14px] text-[var(--mid)] mb-2 block font-medium">Or enter custom amount</label>
                <div className="relative">
                  <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] font-[600] font-['Inter'] text-[var(--teal)]">₹</span>
                  <input 
                    type="number" 
                    value={customAmount} 
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }} 
                    className="w-full h-[52px] pl-[28px] pr-[16px] border-[1.5px] border-[var(--border-color)] rounded-[var(--radius-md)] text-[18px] font-[500] font-['Inter'] text-[var(--dark)] focus:border-[var(--teal)] focus:shadow-[0_0_0_3px_rgba(31,154,168,0.12)] outline-none transition-all no-float" 
                    placeholder="Enter amount" 
                  />
                </div>
              </div>
            </FadeInUp>

            {/* Tax Calculator */}
            {currentAmount > 0 && (
              <FadeInUp>
                <div className="bg-[var(--teal-light)] border border-[rgba(31,154,168,0.2)] rounded-[var(--radius-xl)] px-[24px] py-[20px] mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[14px] font-[600] text-[var(--dark)]">80G Tax Saving Calculator</p>
                    <div className="flex bg-white rounded-full p-1 border border-black/5">
                      {slabs.map(s => (
                        <button 
                          key={s} 
                          onClick={() => setTaxSlab(s)} 
                          className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${taxSlab === s ? "bg-[var(--teal)] text-white" : "text-[var(--mid)] hover:text-[var(--dark)]"}`}
                        >
                          {s}%
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-row gap-[12px]">
                    <div className="flex-1 bg-white rounded-[var(--radius-md)] p-[12px_16px] text-center shadow-sm">
                      <p className="text-[10px] font-[600] uppercase tracking-[0.06em] text-[var(--mid)] font-['Inter'] mb-1">You Donate</p>
                      <p className="text-[20px] font-[700] font-['Inter'] text-[var(--teal)]">₹{currentAmount.toLocaleString()}</p>
                    </div>
                    <div className="flex-1 bg-white rounded-[var(--radius-md)] p-[12px_16px] text-center shadow-sm">
                      <p className="text-[10px] font-[600] uppercase tracking-[0.06em] text-[var(--mid)] font-['Inter'] mb-1">Tax Saving</p>
                      <p className="text-[20px] font-[700] font-['Inter'] text-[#16A34A]">₹{taxSaving.toLocaleString()}</p>
                    </div>
                    <div className="flex-1 bg-white rounded-[var(--radius-md)] p-[12px_16px] text-center shadow-sm">
                      <p className="text-[10px] font-[600] uppercase tracking-[0.06em] text-[var(--mid)] font-['Inter'] mb-1">Net Cost</p>
                      <p className="text-[20px] font-[700] font-['Inter'] text-[var(--dark)]">₹{netCost.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--light)] text-center mt-3">Under Section 80G of the Income Tax Act. Consult your CA for exact figures.</p>
                </div>
              </FadeInUp>
            )}

            {/* Impact Visualiser */}
            <AnimatePresence>
              {currentAmount >= 500 && <ImpactVisualiser amount={currentAmount} gateway="medical" />}
            </AnimatePresence>

            {/* Donor Form Details */}
            <AnimatePresence>
              {currentAmount > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2  gap-5 lg:gap-8">
                      {([["name", "Full Name", "text"], ["email", "Email Address", "email"]] as const).map(([name, label, type]) => (
                        <div key={name}>
                          <label className="text-sm font-medium text-[var(--dark)] mb-1 block">{label}</label>
                          <input placeholder=" " {...register(name)} type={type} className={`w-full h-12 px-4 border rounded-lg bg-white outline-none transition-all focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/15 ${errors[name] ? "border-[#DC2626]" : "border-[var(--border-color)]"}`} />
                          {errors[name] && <p className="text-xs text-[#DC2626] mt-1">{String(errors[name]?.message)}</p>}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2  gap-5 lg:gap-8">
                      <div>
                        <label className="text-sm font-medium text-[var(--dark)] mb-1 block">Phone Number</label>
                        <input placeholder=" " {...register("phone")} type="tel" className={`w-full h-12 px-4 border rounded-lg bg-white outline-none transition-all focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/15 ${errors.phone ? "border-[#DC2626]" : "border-[var(--border-color)]"}`} />
                        {errors.phone && <p className="text-xs text-[#DC2626] mt-1">{String(errors.phone?.message)}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[var(--dark)] mb-1 block">PAN Number <span className="text-[var(--light)] font-normal text-xs">(Req for 80G)</span></label>
                        <input placeholder=" " {...register("pan")} className="w-full h-12 px-4 border border-[var(--border-color)] rounded-lg bg-white outline-none transition-all focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/15" />
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer py-3 mt-2">
                      <input placeholder=" " {...register("showOnWall")} type="checkbox" className="w-[18px] h-[18px] rounded border-[1.5px] border-[var(--border-color)] text-[var(--teal)] focus:ring-[var(--teal)]" />
                      <span className="text-[14px] text-[var(--mid)]">Add my first name and city to the AGSWS Donor Wall</span>
                    </label>

                    {/* Gift toggle */}
                    <div className="flex items-center gap-3 py-2">
                      <button type="button" onClick={() => setValue("isGift", !isGift)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${isGift ? "bg-[var(--teal-light)] text-[var(--teal)] border-[var(--teal)]" : "bg-transparent text-[var(--mid)] border-[var(--border-color)] hover:border-[var(--teal)] hover:text-[var(--teal)]"}`}>
                        <Gift size={16} /> Make this a gift donation
                      </button>
                    </div>

                    <AnimatePresence>
                      {isGift && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 border border-[var(--border-color)] bg-white rounded-xl p-6 overflow-hidden">
                          <p className="text-[13px] font-bold text-[var(--teal)] uppercase tracking-wider mb-2">Gift recipient details</p>
                          <div className="grid grid-cols-1 md:grid-cols-2  gap-5 lg:gap-8">
                            <input {...register("giftRecipientName")} placeholder="Recipient's Name" className="w-full h-12 px-4 border border-[var(--border-color)] rounded-lg bg-white outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/15" />
                            <input {...register("giftRecipientEmail")} placeholder="Recipient's Email" type="email" className="w-full h-12 px-4 border border-[var(--border-color)] rounded-lg bg-white outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/15" />
                          </div>
                          <textarea {...register("giftMessage")} placeholder="Personal message (optional)" maxLength={200} rows={3} className="w-full p-4 border border-[var(--border-color)] rounded-lg bg-white outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/15 resize-none" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-[52px] bg-[var(--yellow)] font-['Inter'] font-[700] text-[15px] text-[var(--dark)] rounded-[var(--radius-full)] hover:shadow-[var(--shadow-yellow)] transition-all flex items-center justify-center mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--yellow)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          Processing...
                        </>
                      ) : (
                        `Donate ₹${currentAmount.toLocaleString()} Now →`
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trust Sidebar */}
          <div className="lg:sticky lg:top-[80px] space-y-6 self-start">
            <CampaignThermometer goalAmount={500000} raisedAmount={320000} deadlineDate="2025-06-30" campaignName="Medical Aid Q2 Campaign" compact />

            <div className="bg-[var(--white)] border border-[var(--border-color)] rounded-[var(--radius-2xl)] p-[28px] shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3 mb-5">
                <Shield size={24} className="text-[var(--teal)]" />
                <span className="font-semibold text-[var(--dark)] text-[16px]">Your Donation is Safe</span>
              </div>
              {["Patient treatment & medicines", "Surgery and specialist support", "Hospital operations & emergency care", "Field coordinator & transport"].map((text) => (
                <div key={text} className="flex items-start gap-3 mb-3.5">
                  <CheckCircle size={18} className="text-[#16A34A] mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] leading-snug text-[var(--mid)]">{text}</span>
                </div>
              ))}
            </div>

            <div className="bg-[var(--white)] border border-[var(--border-color)] rounded-[var(--radius-2xl)] p-[28px] shadow-[var(--shadow-card)]">
              <h4 className="font-semibold text-[var(--dark)] mb-5 text-[15px]">Recent Support</h4>
              <div className="space-y-4">
                {(recentFeed.length > 0 ? recentFeed : [
                  { city: "Kolkata", amount: "₹1,000", gateway: "Medical", time: "Just now" },
                  { city: "Mumbai", amount: "₹5,000", gateway: "Medical", time: "5 min ago" },
                  { city: "Delhi", amount: "₹500", gateway: "Medical", time: "12 min ago" },
                  { city: "Pune", amount: "₹2,000", gateway: "Medical", time: "1 hr ago" },
                ]).slice(0, 4).map((d: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--teal-light)] border-2 border-[var(--teal)] flex-shrink-0" />
                    <p className="text-[13px] text-[var(--mid)] leading-tight flex-1">
                      A donor from <span className="font-medium text-[var(--dark)]">{d.city ?? "India"}</span> donated{" "}
                      <span className="font-semibold text-[var(--teal)]">
                        {d.amount ? (typeof d.amount === "number" ? `₹${(d.amount).toLocaleString("en-IN")}` : d.amount) : "—"}
                      </span>{" "}
                      <span className="text-[var(--light)] text-[11px] block mt-0.5">{d.time ?? d.created_at ?? ""}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DonateMedical;
