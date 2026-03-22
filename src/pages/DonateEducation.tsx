import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Shield, Gift } from "lucide-react";
import { recentDonations } from "@/data/recentDonations";
import ImpactVisualiser from "@/components/donation/ImpactVisualiser";
import CampaignThermometer from "@/components/campaign/CampaignThermometer";

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
  { value: 1500, label: "₹1,500", impact: "School books & stationery for 1 child, full year" },
  { value: 2500, label: "₹2,500", impact: "Mid-day school meals for 1 child, one term (90 days)" },
  { value: 5000, label: "₹5,000", impact: "Full academic year school fees at partner schools" },
  { value: 12000, label: "₹12,000", impact: "Complete sponsorship — fees, books, meals & uniform" },
];

const slabs = [5, 20, 30];

const DonateEducation = () => {
  useSEO("Donate Education", "Donate to AGSWS Education — sponsor scholarships and learning programs.");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [taxSlab, setTaxSlab] = useState(() => {
    const saved = localStorage.getItem("agsws_tax_slab");
    return saved ? parseInt(saved) : 30;
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DonorFormData>({
    resolver: zodResolver(donorSchema),
    defaultValues: { showOnWall: true, isGift: false },
  });

  const isGift = watch("isGift");
  const currentAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  const taxSaving = currentAmount > 0 ? Math.round(currentAmount * 0.5 * (taxSlab / 100)) : 0;
  const netCost = currentAmount - taxSaving;

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

  useEffect(() => { localStorage.setItem("agsws_tax_slab", String(taxSlab)); }, [taxSlab]);

  const onSubmit = (data: any) => {
    localStorage.setItem("agsws_donor", JSON.stringify({
      name: data.name, email: data.email, phone: data.phone, pan: data.pan,
      lastAmount: currentAmount, lastGateway: "Education", lastDate: new Date().toLocaleDateString(),
    }));
    window.location.href = `/thank-you?amount=${currentAmount}&name=${encodeURIComponent(data.name)}&gateway=education`;
  };

  return (
    <main id="main-content">
      <section className="h-[300px] bg-gradient-to-br from-purple via-purple to-purple/80 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/30" />
        <div className="relative z-10 text-center">
          <h1 className="heading-1 text-primary-foreground">Donate to Education</h1>
          <p className="text-sm text-primary-foreground/60 mt-3">Give a child the gift of learning</p>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div>
            <FadeInUp>
              <div className="flex gap-2 mb-8">
                {(["once", "monthly"] as const).map((f) => (
                  <button key={f} onClick={() => setFrequency(f)} className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 ${frequency === f ? "bg-purple text-primary-foreground border-purple" : "bg-card text-text-mid border-border"}`}>
                    {f === "once" ? "One-Time" : "Monthly"}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {amounts.map((a) => (
                  <button key={a.value} onClick={() => { setSelectedAmount(a.value); setCustomAmount(""); }} className={`p-4 rounded-xl border text-left transition-all duration-300 ${selectedAmount === a.value ? "bg-purple text-primary-foreground border-purple shadow-brand-md scale-[1.02]" : "bg-card text-text-dark border-border hover:bg-purple-light hover:border-purple"}`}>
                    <span className="font-bold text-xl">{a.label}</span>
                    <p className={`text-xs mt-1 ${selectedAmount === a.value ? "text-primary-foreground/80" : "text-text-mid"}`}>{a.impact}</p>
                  </button>
                ))}
              </div>
              <div className="mb-6">
                <label className="text-sm text-text-mid mb-2 block">Or enter custom amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-text-mid">₹</span>
                  <input type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }} className="w-full h-12 pl-10 pr-4 border border-border rounded-lg text-lg font-medium bg-card focus:border-purple focus:ring-2 focus:ring-purple/15 outline-none transition-all" placeholder="Enter amount" />
                </div>
              </div>
            </FadeInUp>

            {currentAmount > 0 && (
              <FadeInUp>
                <div className="bg-card border border-border rounded-xl p-5 shadow-brand-sm mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-text-dark">80G Tax Saving Calculator</p>
                    <div className="flex gap-1">
                      {slabs.map(s => (
                        <button key={s} onClick={() => setTaxSlab(s)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${taxSlab === s ? "bg-purple text-primary-foreground" : "bg-background text-text-mid border border-border"}`}>{s}%</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-purple-light rounded-lg p-3 text-center">
                      <p className="text-xs text-text-light">You donate</p>
                      <p className="text-lg font-bold text-purple">₹{currentAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-light rounded-lg p-3 text-center">
                      <p className="text-xs text-text-light">Tax saving</p>
                      <p className="text-lg font-bold text-green-600">₹{taxSaving.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-light rounded-lg p-3 text-center">
                      <p className="text-xs text-text-light">Net cost</p>
                      <p className="text-lg font-bold text-text-dark">₹{netCost.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-light text-center mt-2 italic">Under Section 80G of the Income Tax Act. Consult your CA for exact figures.</p>
                </div>
              </FadeInUp>
            )}

            <AnimatePresence>
              {currentAmount >= 1500 && <ImpactVisualiser amount={currentAmount} gateway="education" />}
            </AnimatePresence>

            <AnimatePresence>
              {currentAmount > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {([["name", "Full Name", "text"], ["email", "Email Address", "email"], ["phone", "Phone Number", "tel"]] as const).map(([name, label, type]) => (
                      <div key={name}>
                        <label className="text-sm font-medium text-text-dark mb-1 block">{label}</label>
                        <input {...register(name)} type={type} className={`w-full h-12 px-4 border rounded-lg bg-card outline-none transition-all focus:border-purple focus:ring-2 focus:ring-purple/15 ${errors[name] ? "border-destructive" : "border-border"}`} />
                        {errors[name] && <p className="text-xs text-destructive mt-1">{String(errors[name]?.message)}</p>}
                      </div>
                    ))}
                    <div>
                      <label className="text-sm font-medium text-text-dark mb-1 block">PAN Number <span className="text-text-light">(optional)</span></label>
                      <input {...register("pan")} className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-purple focus:ring-2 focus:ring-purple/15 transition-all" />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input {...register("showOnWall")} type="checkbox" className="w-4 h-4 accent-purple" />
                      <span className="text-sm text-text-mid">Add my first name and city to the AGSWS Donor Wall</span>
                    </label>

                    <div className="flex items-center gap-3 py-2">
                      <button type="button" onClick={() => setValue("isGift", !isGift)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${isGift ? "bg-purple text-primary-foreground border-purple" : "bg-card text-text-mid border-border"}`}>
                        <Gift size={16} /> Make this a gift donation
                      </button>
                    </div>
                    <AnimatePresence>
                      {isGift && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 border border-border rounded-xl p-4">
                          <p className="label-text text-purple">Gift recipient details</p>
                          <input {...register("giftRecipientName")} placeholder="Recipient's Name" className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-purple" />
                          <input {...register("giftRecipientEmail")} placeholder="Recipient's Email" type="email" className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-purple" />
                          <textarea {...register("giftMessage")} placeholder="Personal message (optional)" maxLength={200} rows={3} className="w-full px-4 py-3 border border-border rounded-lg bg-card outline-none focus:border-purple text-sm" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button type="submit" className="w-full h-[52px] bg-yellow text-text-dark font-bold text-base rounded-full shadow-yellow hover:scale-[1.01] transition-transform mt-6">
                      Complete Donation →
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:sticky lg:top-24 space-y-6 self-start">
            <CampaignThermometer goalAmount={300000} raisedAmount={195000} deadlineDate="2025-06-30" campaignName="Education Q2 Drive" compact />

            <div className="bg-card border border-border rounded-xl p-6 shadow-brand-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className="text-purple" />
                <span className="font-semibold text-text-dark">Your Donation is Safe</span>
              </div>
              {["Razorpay encrypted payment", "80G receipt within 60 seconds", "Funds used only for education"].map((text) => (
                <div key={text} className="flex items-start gap-2 mb-3">
                  <CheckCircle size={16} className="text-purple mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-text-mid">{text}</span>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-brand-sm">
              <h4 className="font-semibold text-text-dark mb-4 text-sm">Recent Donations</h4>
              <div className="space-y-3">
                {recentDonations.filter(d => d.gateway === "Education").map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-purple flex-shrink-0" />
                    <p className="text-xs text-text-mid">A donor from {d.city} donated {d.amount} — {d.time}</p>
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
