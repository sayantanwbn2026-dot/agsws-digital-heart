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
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { createStripeCheckoutRedirect } from "@/lib/stripeCheckout";
import { PremiumInput, PremiumTextarea } from "@/components/ui/PremiumFormElements";
import { sanitizeINRInput, formatINR, validateINRAmount, INR_MAX } from "@/lib/inrAmount";

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
  { value: 500, label: "₹500", impact: "Medicines for 1 child for 1 month" },
  { value: 1000, label: "₹1,000", impact: "Emergency transport + specialist consultation" },
  { value: 5000, label: "₹5,000", impact: "Surgery support + hospital operational costs for 1 day" },
  { value: 10000, label: "₹10,000", impact: "Full treatment cycle — admission, surgery, medicines, post-discharge care" },
];

const DonateMedical = () => {
  useSEO("Donate Medical Aid", "Donate to AGSWS Medical Aid — fund emergency care and treatment in Kolkata.");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DonorFormData>({
    resolver: zodResolver(donorSchema),
    defaultValues: { showOnWall: true, isGift: false },
  });

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

  const isGift = watch("isGift");
  const currentAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);

  const onSubmit = async (data: DonorFormData) => {
    const check = validateINRAmount(currentAmount);
    if (!check.ok) {
      toast.error(check.message || "Please select or enter a valid amount.");
      return;
    }
    const checkoutRedirect = createStripeCheckoutRedirect();
    setIsSubmitting(true);
    try {
      localStorage.setItem("agsws_donor", JSON.stringify({
        name: data.name, email: data.email, phone: data.phone,
        lastAmount: currentAmount, lastGateway: "Medical Aid",
        lastDate: new Date().toLocaleDateString("en-IN"),
      }));

      const { data: result, error } = await supabase.functions.invoke('create-stripe-donation', {
        body: {
          cause: 'medical',
          amount: currentAmount,
          donor_name: data.name,
          donor_email: data.email,
          donor_phone: data.phone,
          is_gift: data.isGift,
          gift_recipient_name: data.giftRecipientName,
          gift_recipient_email: data.giftRecipientEmail,
          gift_message: data.giftMessage,
          show_on_wall: data.showOnWall,
          success_url: `${window.location.origin}/donation-complete?gateway=medical&amount=${currentAmount}&name=${encodeURIComponent(data.name)}`,
          cancel_url: `${window.location.origin}/donation-cancelled?gateway=medical&amount=${currentAmount}&name=${encodeURIComponent(data.name)}`,
        },
      });

      if (error) throw error;
      if (!result?.url) throw new Error('Checkout URL missing');
      checkoutRedirect.redirect(result.url);
    } catch (err: any) {
      checkoutRedirect.cancel();
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.");
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

      <section className="bg-[var(--bg)] section">
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
                          <motion.div layoutId="freqBgMed" className="absolute inset-0 bg-[var(--teal)] rounded-[var(--radius-full)] z-[-1]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
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
                      className={`flex flex-col justify-center min-h-[72px] lg:min-h-[64px] p-4 rounded-[var(--radius-lg)] border-[1.5px] text-left transition-colors duration-200 ${isSelected ? "bg-[var(--teal)] border-[var(--teal)] text-white shadow-[var(--shadow-md)]" : "bg-white text-[var(--dark)] border-[var(--border-color)] hover:bg-[var(--teal-light)] hover:border-[var(--teal)]"}`}
                      animate={{ scale: isSelected ? 1.02 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                      <span className="font-['Inter'] font-[700] text-[20px] leading-tight">{a.label}</span>
                      <p className={`font-['Inter'] font-[400] text-[11px] leading-tight mt-1 transition-opacity ${isSelected ? "opacity-[0.85] text-white" : "opacity-[0.80] text-[var(--mid)]"}`}>{a.impact}</p>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mb-8">
                <label className="text-[11px] font-[600] uppercase tracking-[0.12em] text-[var(--mid)] mb-2 block">
                  Or enter custom amount
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-[600] font-['Inter'] text-[var(--teal)] pointer-events-none select-none">
                    ₹
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    maxLength={7}
                    value={customAmount ? formatINR(customAmount) : ""}
                    onChange={(e) => { setCustomAmount(sanitizeINRInput(e.target.value)); setSelectedAmount(null); }}
                    style={{ paddingLeft: 40, paddingRight: 16 }}
                    className="no-float w-full h-[52px] bg-white border-[1.5px] border-[var(--border-color)] rounded-[14px] text-[18px] font-[600] font-['Inter'] text-[var(--dark)] shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] hover:border-[var(--mid)]/40 focus:border-[var(--teal)] focus:shadow-[0_0_0_4px_rgba(31,154,168,0.10),inset_0_1px_0_rgba(0,0,0,0.02)] outline-none transition-all duration-300 placeholder:text-[var(--light)]/60 placeholder:font-[400] placeholder:text-[14px]"
                    placeholder="Enter amount"
                    aria-label="Custom donation amount in rupees"
                  />
                </div>
                {customAmount && parseInt(customAmount) >= INR_MAX && (
                  <p className="text-[11px] text-[var(--mid)] mt-1.5">Maximum donation is ₹{formatINR(INR_MAX)}.</p>
                )}
              </div>
            </FadeInUp>

            <AnimatePresence>
              {currentAmount >= 500 && <ImpactVisualiser amount={currentAmount} gateway="medical" />}
            </AnimatePresence>

            <AnimatePresence>
              {currentAmount > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <PremiumInput label="Full Name" required placeholder="Your full name" {...register("name")} error={errors.name?.message as string} />
                      <PremiumInput label="Email Address" required type="email" placeholder="you@example.com" {...register("email")} error={errors.email?.message as string} />
                    </div>
                    <PremiumInput label="Phone Number" required type="tel" placeholder="+91 98XXXXXXXX" {...register("phone")} error={errors.phone?.message as string} />

                    <label className="flex items-center gap-3 cursor-pointer py-3 mt-2">
                      <input placeholder=" " {...register("showOnWall")} type="checkbox" className="w-[18px] h-[18px] rounded border-[1.5px] border-[var(--border-color)] text-[var(--teal)] focus:ring-[var(--teal)]" />
                      <span className="text-[14px] text-[var(--mid)]">Add my first name and city to the AGSWS Donor Wall</span>
                    </label>

                    <div className="flex items-center gap-3 py-2">
                      <button type="button" onClick={() => setValue("isGift", !isGift)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${isGift ? "bg-[var(--teal-light)] text-[var(--teal)] border-[var(--teal)]" : "bg-transparent text-[var(--mid)] border-[var(--border-color)] hover:border-[var(--teal)] hover:text-[var(--teal)]"}`}>
                        <Gift size={16} /> Make this a gift donation
                      </button>
                    </div>

                    <AnimatePresence>
                      {isGift && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-5 border border-[var(--border-color)] bg-white rounded-2xl p-6 overflow-hidden">
                          <p className="text-[11px] font-[700] text-[var(--teal)] uppercase tracking-[0.12em]">Gift recipient details</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <PremiumInput label="Recipient's Name" placeholder="Their full name" {...register("giftRecipientName")} />
                            <PremiumInput label="Recipient's Email" type="email" placeholder="their@email.com" {...register("giftRecipientEmail")} />
                          </div>
                          <PremiumTextarea label="Personal Message (Optional)" placeholder="Add a note for the recipient…" maxLength={200} rows={3} {...register("giftMessage")} />
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
            <CampaignThermometer goalAmount={300000} raisedAmount={195000} deadlineDate="2025-06-30" campaignName="Medical Q2 Drive" compact />

            <div className="bg-[var(--white)] border border-[var(--border-color)] rounded-[var(--radius-2xl)] p-[28px] shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3 mb-5">
                <Shield size={24} className="text-[var(--teal)]" />
                <span className="font-semibold text-[var(--dark)] text-[16px]">Your Donation is Safe</span>
              </div>
              {["Encrypted Stripe checkout", "Email confirmation in seconds", "Funds used only for medical aid"].map((text) => (
                <div key={text} className="flex items-start gap-3 mb-3.5">
                  <CheckCircle size={18} className="text-[#16A34A] mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] leading-snug text-[var(--mid)]">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DonateMedical;
