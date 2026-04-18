import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Shield, Gift, Loader2 } from "lucide-react";
import { recentDonations } from "@/data/recentDonations";
import ImpactVisualiser from "@/components/donation/ImpactVisualiser";
import CampaignThermometer from "@/components/campaign/CampaignThermometer";
import PageHero from "@/components/layout/PageHero";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";

const donorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  showOnWall: z.boolean().default(true),
  isGift: z.boolean().default(false),
  giftRecipientName: z.string().optional(),
  giftRecipientEmail: z.string().optional(),
  giftMessage: z.string().max(200).optional(),
});

type DonorFormData = z.infer<typeof donorSchema>;

const amounts = [
  { value: 1500, label: "₹1,500", impact: "School books & stationery for 1 child, full year" },
  { value: 2500, label: "₹2,500", impact: "Mid-day school meals for 1 child, one term (90 days)" },
  { value: 5000, label: "₹5,000", impact: "Full academic year school fees at partner schools" },
  { value: 12000, label: "₹12,000", impact: "Complete sponsorship — fees, books, meals & uniform" },
];

const DonateEducation = () => {
  useSEO("Donate Education", "Donate to AGSWS Education — sponsor scholarships and learning programs.");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DonorFormData>({
    resolver: zodResolver(donorSchema),
    defaultValues: { showOnWall: true, isGift: false },
  });

  const isGift = watch("isGift");
  const currentAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

  useEffect(() => {
    const saved = localStorage.getItem("agsws_donor");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.name) setValue("name", d.name);
        if (d.email) setValue("email", d.email);
        if (d.phone) setValue("phone", d.phone);
      } catch { /* ignore */ }
    }
  }, [setValue]);

  const onSubmit = async (data: DonorFormData) => {
    if (!currentAmount || currentAmount < 1) { toast.error("Please select or enter a donation amount."); return; }
    setIsSubmitting(true);
    try {
      localStorage.setItem("agsws_donor", JSON.stringify({
        name: data.name, email: data.email, phone: data.phone,
        lastAmount: currentAmount, lastGateway: "Education", lastDate: new Date().toLocaleDateString(),
      }));

      const { data: result, error } = await supabase.functions.invoke('create-stripe-donation', {
        body: {
          cause: 'education',
          amount: currentAmount,
          donor_name: data.name,
          donor_email: data.email,
          donor_phone: data.phone,
          is_gift: data.isGift,
          gift_recipient_name: data.giftRecipientName,
          gift_recipient_email: data.giftRecipientEmail,
          gift_message: data.giftMessage,
          show_on_wall: data.showOnWall,
          success_url: `${window.location.origin}/thank-you?cause=education&amount=${currentAmount}&name=${encodeURIComponent(data.name)}`,
          cancel_url: window.location.href,
        },
      });
      if (error) throw error;
      if (!result?.url) throw new Error('Checkout URL missing');
      window.location.href = result.url;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content">
      <PageHero title="Donate to Education" subtitle="Give a child the gift of learning and a chance at a brighter future in Kolkata."
        bgVariant="purple" breadcrumb={[{label: "Home", href: "/"}, {label: "Initiatives", href: "/initiatives/education"}, {label: "Donate"}]} />

      <section className="bg-[var(--bg)] py-[64px] lg:py-[96px]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-[40px]">

          <div>
            <FadeInUp>
              <div className="mb-8">
                <div className="bg-[var(--bg)] rounded-[var(--radius-full)] p-[4px] inline-flex relative shadow-inner border border-[var(--border-color)]">
                  {(["once", "monthly"] as const).map((f) => {
                    const isActive = frequency === f;
                    return (
                      <button key={f} onClick={() => setFrequency(f)}
                        className={`relative px-[20px] py-[8px] rounded-[var(--radius-full)] font-['Inter'] font-[600] text-[13px] transition-colors duration-200 z-10 ${isActive ? "text-white" : "text-[var(--mid)]"}`}>
                        {isActive && (
                          <motion.div layoutId="freqBgEdu" className="absolute inset-0 bg-[var(--purple)] rounded-[var(--radius-full)] z-[-1]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
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
                    <motion.button key={a.value} onClick={() => { setSelectedAmount(a.value); setCustomAmount(""); }}
                      className={`flex flex-col justify-center min-h-[72px] lg:min-h-[64px] p-4 rounded-[var(--radius-lg)] border-[1.5px] text-left transition-colors duration-200 ${isSelected ? "bg-[var(--purple)] border-[var(--purple)] text-white shadow-[var(--shadow-md)]" : "bg-white text-[var(--dark)] border-[var(--border-color)] hover:bg-[var(--purple-light)] hover:border-[var(--purple)]"}`}
                      animate={{ scale: isSelected ? 1.02 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                      <span className="font-['Inter'] font-[700] text-[20px] leading-tight">{a.label}</span>
                      <p className={`font-['Inter'] font-[400] text-[11px] leading-tight mt-1 transition-opacity ${isSelected ? "opacity-[0.85] text-white" : "opacity-[0.80] text-[var(--mid)]"}`}>{a.impact}</p>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mb-8">
                <label className="text-[14px] text-[var(--mid)] mb-2 block font-medium">Or enter custom amount</label>
                <div className="relative">
                  <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] font-[600] font-['Inter'] text-[var(--purple)]">₹</span>
                  <input type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    className="w-full h-[52px] pl-[28px] pr-[16px] border-[1.5px] border-[var(--border-color)] rounded-[var(--radius-md)] text-[18px] font-[500] font-['Inter'] text-[var(--dark)] focus:border-[var(--purple)] focus:shadow-[0_0_0_3px_rgba(31,154,168,0.12)] outline-none transition-all no-float"
                    placeholder="Enter amount" />
                </div>
              </div>
            </FadeInUp>

            <AnimatePresence>
              {currentAmount >= 1500 && <ImpactVisualiser amount={currentAmount} gateway="education" />}
            </AnimatePresence>

            <AnimatePresence>
              {currentAmount > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
                      {([["name", "Full Name", "text"], ["email", "Email Address", "email"]] as const).map(([name, label, type]) => (
                        <div key={name}>
                          <label className="text-sm font-medium text-[var(--dark)] mb-1 block">{label}</label>
                          <input placeholder=" " {...register(name)} type={type} className={`w-full h-12 px-4 border rounded-lg bg-white outline-none transition-all focus:border-[var(--purple)] focus:ring-2 focus:ring-[var(--purple)]/15 ${errors[name] ? "border-[#DC2626]" : "border-[var(--border-color)]"}`} />
                          {errors[name] && <p className="text-xs text-[#DC2626] mt-1">{String(errors[name]?.message)}</p>}
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[var(--dark)] mb-1 block">Phone Number</label>
                      <input placeholder=" " {...register("phone")} type="tel" className={`w-full h-12 px-4 border rounded-lg bg-white outline-none transition-all focus:border-[var(--purple)] focus:ring-2 focus:ring-[var(--purple)]/15 ${errors.phone ? "border-[#DC2626]" : "border-[var(--border-color)]"}`} />
                      {errors.phone && <p className="text-xs text-[#DC2626] mt-1">{String(errors.phone?.message)}</p>}
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer py-3 mt-2">
                      <input placeholder=" " {...register("showOnWall")} type="checkbox" className="w-[18px] h-[18px] rounded border-[1.5px] border-[var(--border-color)] text-[var(--purple)] focus:ring-[var(--purple)]" />
                      <span className="text-[14px] text-[var(--mid)]">Add my first name and city to the AGSWS Donor Wall</span>
                    </label>

                    <div className="flex items-center gap-3 py-2">
                      <button type="button" onClick={() => setValue("isGift", !isGift)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${isGift ? "bg-[var(--purple-light)] text-[var(--purple)] border-[var(--purple)]" : "bg-transparent text-[var(--mid)] border-[var(--border-color)] hover:border-[var(--purple)] hover:text-[var(--purple)]"}`}>
                        <Gift size={16} /> Make this a gift donation
                      </button>
                    </div>

                    <AnimatePresence>
                      {isGift && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 border border-[var(--border-color)] bg-white rounded-xl p-6 overflow-hidden">
                          <p className="text-[13px] font-bold text-[var(--purple)] uppercase tracking-wider mb-2">Gift recipient details</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
                            <input {...register("giftRecipientName")} placeholder="Recipient's Name" className="w-full h-12 px-4 border border-[var(--border-color)] rounded-lg bg-white outline-none focus:border-[var(--purple)] focus:ring-2 focus:ring-[var(--purple)]/15" />
                            <input {...register("giftRecipientEmail")} placeholder="Recipient's Email" type="email" className="w-full h-12 px-4 border border-[var(--border-color)] rounded-lg bg-white outline-none focus:border-[var(--purple)] focus:ring-2 focus:ring-[var(--purple)]/15" />
                          </div>
                          <textarea {...register("giftMessage")} placeholder="Personal message (optional)" maxLength={200} rows={3} className="w-full p-4 border border-[var(--border-color)] rounded-lg bg-white outline-none focus:border-[var(--purple)] focus:ring-2 focus:ring-[var(--purple)]/15 resize-none" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button type="submit" disabled={isSubmitting}
                      className="w-full h-[52px] bg-[var(--yellow)] font-['Inter'] font-[700] text-[15px] text-[var(--dark)] rounded-[var(--radius-full)] hover:shadow-[var(--shadow-yellow)] transition-all flex items-center justify-center mt-6 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                      {isSubmitting ? (<><Loader2 className="animate-spin mr-2 h-5 w-5" />Redirecting to secure checkout…</>) : (`Donate ₹${currentAmount.toLocaleString()} via Stripe →`)}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:sticky lg:top-[80px] space-y-6 self-start">
            <CampaignThermometer goalAmount={300000} raisedAmount={195000} deadlineDate="2025-06-30" campaignName="Education Q2 Drive" compact />

            <div className="bg-[var(--white)] border border-[var(--border-color)] rounded-[var(--radius-2xl)] p-[28px] shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3 mb-5">
                <Shield size={24} className="text-[var(--purple)]" />
                <span className="font-semibold text-[var(--dark)] text-[16px]">Your Donation is Safe</span>
              </div>
              {["Encrypted Stripe checkout", "Email confirmation in seconds", "Funds used only for education"].map((text) => (
                <div key={text} className="flex items-start gap-3 mb-3.5">
                  <CheckCircle size={18} className="text-[#16A34A] mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] leading-snug text-[var(--mid)]">{text}</span>
                </div>
              ))}
            </div>

            <div className="bg-[var(--white)] border border-[var(--border-color)] rounded-[var(--radius-2xl)] p-[28px] shadow-[var(--shadow-card)]">
              <h4 className="font-semibold text-[var(--dark)] mb-5 text-[15px]">Recent Support</h4>
              <div className="space-y-4">
                {recentDonations.filter(d => d.gateway === "Education").slice(0, 4).map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--purple-light)] flex items-center justify-center text-[var(--purple)] font-bold text-sm">{d.city[0]}</div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-[var(--dark)]">A donor from {d.city}</p>
                      <p className="text-[11px] text-[var(--light)]">{d.amount} · {d.time}</p>
                    </div>
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

export default DonateEducation;
