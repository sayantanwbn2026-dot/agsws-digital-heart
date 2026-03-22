import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, BookOpen, Users, ShieldCheck, FileText, CheckCircle } from "lucide-react";

const csrSchema = z.object({
  companyName: z.string().min(2, "Required"),
  industry: z.string().min(1, "Required"),
  contactName: z.string().min(2, "Required"),
  contactEmail: z.string().email("Valid email required"),
  contactPhone: z.string().min(10, "Valid phone required"),
  website: z.string().optional(),
  budgetRange: z.string().min(1, "Required"),
  focusMedical: z.boolean().default(false),
  focusEducation: z.boolean().default(false),
  focusElderly: z.boolean().default(false),
  focusVolunteering: z.boolean().default(false),
  timeline: z.string().min(1, "Required"),
  consent: z.boolean().refine(v => v, "Required"),
});

const CSRPartnership = () => {
  useSEO("CSR Partnership", "Partner with AGSWS for meaningful CSR impact.");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<z.infer<typeof csrSchema>>({ resolver: zodResolver(csrSchema), defaultValues: { focusMedical: false, focusEducation: false, focusElderly: false, focusVolunteering: false, consent: false } });
  const data = watch();

  const onSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md mx-auto px-6 py-16">
          <div className="w-20 h-20 bg-teal rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-teal mb-2">Proposal Sent!</h2>
          <p className="text-text-mid text-sm mb-6">Our CSR team will follow up within 48 hours at {data.contactEmail}.</p>
          <a href="/" className="text-teal font-semibold hover:underline">Back to Home</a>
        </motion.div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <section className="h-[360px] bg-gradient-to-br from-teal-dark via-teal to-teal flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/30" />
        <div className="relative z-10 text-center">
          <h1 className="heading-1 text-primary-foreground">Partner With AGSWS for CSR</h1>
          <p className="text-sm text-primary-foreground/60 mt-3">Meaningful impact. Full compliance. Instant documentation.</p>
          <div className="flex gap-3 justify-center mt-6">
            {["Schedule VII Compliant", "80G + 12A Certified"].map(b => (
              <span key={b} className="bg-primary-foreground/10 text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck size={14} /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeInUp>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: Heart, title: "Healthcare CSR", desc: "Schedule VII item (i) — health, sanitation, safe drinking water" },
                { icon: BookOpen, title: "Education CSR", desc: "Schedule VII item (ii) — promoting education and livelihood" },
                { icon: Users, title: "Elderly Care CSR", desc: "Schedule VII item (iii) — measures for elderly welfare" },
              ].map(c => (
                <div key={c.title} className="bg-card border border-border rounded-xl p-6 shadow-brand-sm">
                  <c.icon size={28} className="text-teal mb-3" />
                  <h4 className="font-semibold text-text-dark mb-2">{c.title}</h4>
                  <p className="text-sm text-text-mid">{c.desc}</p>
                </div>
              ))}
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
            <div>
              {/* Stepper */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? "bg-teal text-primary-foreground" : "bg-border text-text-light"}`}>{s}</div>
                    {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-teal" : "bg-border"}`} />}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <h3 className="heading-3 mb-4">Your Organisation</h3>
                      {[
                        { name: "companyName" as const, label: "Company Name", type: "text" },
                        { name: "contactName" as const, label: "Contact Person", type: "text" },
                        { name: "contactEmail" as const, label: "Email", type: "email" },
                        { name: "contactPhone" as const, label: "Phone", type: "tel" },
                        { name: "website" as const, label: "Website (optional)", type: "url" },
                      ].map(f => (
                        <div key={f.name}>
                          <label className="text-sm font-medium text-text-dark mb-1 block">{f.label}</label>
                          <input {...register(f.name)} type={f.type} className={`w-full h-12 px-4 border rounded-lg bg-card outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/15 ${errors[f.name] ? "border-destructive" : "border-border"}`} />
                        </div>
                      ))}
                      <div>
                        <label className="text-sm font-medium text-text-dark mb-1 block">Industry</label>
                        <select {...register("industry")} className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal">
                          <option value="">Select</option>
                          {["Technology", "Finance", "Manufacturing", "Healthcare", "FMCG", "Real Estate", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <button type="button" onClick={() => setStep(2)} className="bg-teal text-primary-foreground font-semibold px-8 py-3 rounded-full mt-4">Next →</button>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <h3 className="heading-3 mb-4">CSR Budget & Focus</h3>
                      <div>
                        <label className="text-sm font-medium text-text-dark mb-1 block">Annual CSR Budget</label>
                        <select {...register("budgetRange")} className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal">
                          <option value="">Select range</option>
                          {["Below ₹5 Lakh", "₹5L–₹25L", "₹25L–₹1 Cr", "Above ₹1 Cr"].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-dark mb-2">Focus Areas</p>
                        {[
                          { name: "focusMedical" as const, label: "Medical Aid & Hospital Support" },
                          { name: "focusEducation" as const, label: "Education for Underprivileged Children" },
                          { name: "focusElderly" as const, label: "Elderly Care Support" },
                          { name: "focusVolunteering" as const, label: "Employee Volunteering" },
                        ].map(c => (
                          <label key={c.name} className="flex items-center gap-3 py-2 cursor-pointer">
                            <input {...register(c.name)} type="checkbox" className="w-4 h-4 accent-teal" />
                            <span className="text-sm text-text-mid">{c.label}</span>
                          </label>
                        ))}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-text-dark mb-1 block">Timeline</label>
                        <select {...register("timeline")} className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal">
                          <option value="">Select</option>
                          {["This Quarter", "This Financial Year", "Next Year", "Flexible"].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button type="button" onClick={() => setStep(1)} className="border border-border text-text-mid font-semibold px-8 py-3 rounded-full">← Back</button>
                        <button type="button" onClick={() => setStep(3)} className="bg-teal text-primary-foreground font-semibold px-8 py-3 rounded-full">Next →</button>
                      </div>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <h3 className="heading-3 mb-4">Confirm & Submit</h3>
                      <div className="bg-card border border-border rounded-xl p-6 space-y-3 text-sm">
                        {[
                          ["Company", data.companyName],
                          ["Contact", data.contactName],
                          ["Email", data.contactEmail],
                          ["Budget", data.budgetRange],
                          ["Timeline", data.timeline],
                        ].map(([l, v]) => (
                          <div key={l} className="flex justify-between">
                            <span className="text-text-light">{l}</span>
                            <span className="font-medium text-text-dark">{v || "—"}</span>
                          </div>
                        ))}
                      </div>
                      <label className="flex items-start gap-3 py-2 cursor-pointer">
                        <input {...register("consent")} type="checkbox" className="w-4 h-4 accent-teal mt-0.5" />
                        <span className="text-sm text-text-mid">I agree to be contacted by AGSWS regarding this enquiry</span>
                      </label>
                      <div className="flex gap-3 mt-4">
                        <button type="button" onClick={() => setStep(2)} className="border border-border text-text-mid font-semibold px-8 py-3 rounded-full">← Back</button>
                        <button type="submit" className="bg-yellow text-text-dark font-bold px-8 py-3 rounded-full shadow-yellow flex items-center gap-2">
                          <FileText size={16} /> Generate My Proposal →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Live proposal preview */}
            <div className="hidden lg:block">
              <div className="sticky top-24 bg-card border border-border rounded-xl shadow-brand-lg overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <div className="bg-teal p-5">
                  <p className="text-xs font-bold text-primary-foreground/60 uppercase tracking-widest">AGSWS CSR Proposal</p>
                  <p className="text-primary-foreground font-bold mt-1">{data.companyName || "Your Company"}</p>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {data.focusMedical && <span className="text-[10px] bg-teal-light text-teal px-2 py-0.5 rounded-full font-semibold">Medical</span>}
                    {data.focusEducation && <span className="text-[10px] bg-purple-light text-purple px-2 py-0.5 rounded-full font-semibold">Education</span>}
                    {data.focusElderly && <span className="text-[10px] bg-yellow-light text-text-dark px-2 py-0.5 rounded-full font-semibold">Elderly</span>}
                    {data.focusVolunteering && <span className="text-[10px] bg-background text-text-mid px-2 py-0.5 rounded-full font-semibold">Volunteering</span>}
                  </div>
                  {data.budgetRange && (
                    <div>
                      <p className="text-[10px] text-text-light uppercase">Budget</p>
                      <div className="h-2 bg-border rounded-full mt-1">
                        <div className="h-full bg-teal rounded-full" style={{ width: data.budgetRange.includes("1 Cr") ? "100%" : data.budgetRange.includes("25L") ? "70%" : data.budgetRange.includes("5L") ? "40%" : "15%" }} />
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-text-light mt-auto">Your copy will be emailed to {data.contactEmail || "..."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CSRPartnership;
