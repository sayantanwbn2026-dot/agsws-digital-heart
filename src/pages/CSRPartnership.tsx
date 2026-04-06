import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import PageHero from "@/components/layout/PageHero";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, BookOpen, Users, ShieldCheck, FileText, CheckCircle, Building, ArrowRight } from "lucide-react";

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

const csrAreas = [
  { icon: Heart, title: "Healthcare CSR", desc: "Schedule VII (i) — Health, sanitation, and preventive care", color: "var(--teal)" },
  { icon: BookOpen, title: "Education CSR", desc: "Schedule VII (ii) — Promoting education and livelihood", color: "var(--purple)" },
  { icon: Users, title: "Elderly Care", desc: "Schedule VII (iii) — Measures for senior citizen welfare", color: "var(--beige)" },
];

const FormInput = ({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="text-[11px] font-[600] text-[var(--dark)] mb-1.5 block uppercase tracking-[0.08em]">{label}</label>
    <input {...props} className={`w-full h-[48px] px-4 text-[14px] text-[var(--dark)] bg-[var(--bg)] border ${error ? 'border-[#DC2626]' : 'border-[var(--border-color)]'} rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10 transition-all placeholder:text-[var(--light)]`} />
    {error && <p className="text-[11px] text-[#DC2626] mt-1">{error}</p>}
  </div>
);

const FormSelect = ({ label, error, children, ...props }: { label: string; error?: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div>
    <label className="text-[11px] font-[600] text-[var(--dark)] mb-1.5 block uppercase tracking-[0.08em]">{label}</label>
    <select {...props} className={`w-full h-[48px] px-4 text-[14px] text-[var(--dark)] bg-[var(--bg)] border ${error ? 'border-[#DC2626]' : 'border-[var(--border-color)]'} rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10 transition-all appearance-none`}>
      {children}
    </select>
    {error && <p className="text-[11px] text-[#DC2626] mt-1">{error}</p>}
  </div>
);

const CSRPartnership = () => {
  useSEO("CSR Partnership", "Partner with AGSWS for meaningful CSR impact.");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<z.infer<typeof csrSchema>>({
    resolver: zodResolver(csrSchema),
    defaultValues: { focusMedical: false, focusEducation: false, focusElderly: false, focusVolunteering: false, consent: false },
  });
  const data = watch();
  const onSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} className="text-center max-w-md mx-auto px-6 py-16">
          <div className="w-20 h-20 bg-[var(--teal)] rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} className="text-white" /></div>
          <h2 className="text-[28px] font-[700] text-[var(--teal)] mb-3">Proposal Sent!</h2>
          <p className="text-[var(--mid)] text-[14px] mb-6 leading-[1.7]">Our CSR team will follow up within 48 hours at {data.contactEmail}.</p>
          <a href="/" className="text-[var(--teal)] font-[600] text-[14px] hover:underline">← Back to Home</a>
        </motion.div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <PageHero title="Partner With AGSWS" label="CSR Partnership" subtitle="Meaningful impact. Full compliance. Instant documentation." bgVariant="teal-dark" size="md" breadcrumb={[{ label: "Home", href: "/" }, { label: "CSR Partnership" }]}>
        <div className="flex gap-3 mt-4 flex-wrap">
          {["Schedule VII Compliant", "80G + 12A Certified"].map(b => (
            <span key={b} className="bg-white/[0.08] text-white/90 text-[11px] font-[600] px-4 py-1.5 rounded-full flex items-center gap-1.5 border border-white/[0.1]">
              <ShieldCheck size={12} /> {b}
            </span>
          ))}
        </div>
      </PageHero>

      {/* CSR Areas */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-[var(--container)] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {csrAreas.map((c, i) => (
              <FadeInUp key={c.title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }} className="bg-white rounded-[16px] border border-[var(--border-color)] p-6 shadow-[var(--shadow-card)] transition-shadow">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `color-mix(in srgb, ${c.color} 10%, white)` }}>
                    <c.icon size={22} style={{ color: c.color }} />
                  </div>
                  <h4 className="font-[600] text-[var(--dark)] mb-2 text-[16px]">{c.title}</h4>
                  <p className="text-[13px] text-[var(--mid)] leading-[1.7]">{c.desc}</p>
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-[var(--bg)] py-16 lg:py-24">
        <div className="max-w-[var(--container)] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
            <div>
              {/* Stepper */}
              <div className="flex items-center gap-3 mb-8">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-3">
                    <motion.div animate={{ scale: step === s ? 1.1 : 1 }} className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-[700] transition-colors ${step >= s ? "bg-[var(--teal)] text-white" : "bg-[var(--border-color)] text-[var(--light)]"}`}>
                      {step > s ? <CheckCircle size={14} /> : s}
                    </motion.div>
                    {s < 3 && <div className={`w-10 h-[2px] rounded-full transition-colors ${step > s ? "bg-[var(--teal)]" : "bg-[var(--border-color)]"}`} />}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8">
                      <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-6">Your Organisation</h3>
                      <div className="space-y-4">
                        <FormInput label="Company Name" {...register("companyName")} placeholder="Company Name" error={errors.companyName?.message} />
                        <FormInput label="Contact Person" {...register("contactName")} placeholder="Contact Person" error={errors.contactName?.message} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormInput label="Email" {...register("contactEmail")} type="email" placeholder="Email" error={errors.contactEmail?.message} />
                          <FormInput label="Phone" {...register("contactPhone")} type="tel" placeholder="Phone" error={errors.contactPhone?.message} />
                        </div>
                        <FormInput label="Website (optional)" {...register("website")} type="url" placeholder="https://..." />
                        <FormSelect label="Industry" {...register("industry")} error={errors.industry?.message}>
                          <option value="">Select</option>
                          {["Technology", "Finance", "Manufacturing", "Healthcare", "FMCG", "Real Estate", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
                        </FormSelect>
                        <motion.button type="button" onClick={() => setStep(2)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[var(--teal)] text-white font-[600] px-8 py-3 rounded-full text-[14px] mt-2">Next →</motion.button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8">
                      <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-6">CSR Budget & Focus</h3>
                      <div className="space-y-4">
                        <FormSelect label="Annual CSR Budget" {...register("budgetRange")}>
                          <option value="">Select range</option>
                          {["Below ₹5 Lakh", "₹5L–₹25L", "₹25L–₹1 Cr", "Above ₹1 Cr"].map(o => <option key={o} value={o}>{o}</option>)}
                        </FormSelect>
                        <div>
                          <p className="text-[11px] font-[600] text-[var(--dark)] mb-3 uppercase tracking-[0.08em]">Focus Areas</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              { name: "focusMedical" as const, label: "Medical Aid & Hospital Support", icon: Heart },
                              { name: "focusEducation" as const, label: "Education for Children", icon: BookOpen },
                              { name: "focusElderly" as const, label: "Elderly Care Support", icon: Users },
                              { name: "focusVolunteering" as const, label: "Employee Volunteering", icon: Building },
                            ].map(c => (
                              <label key={c.name} className="flex items-center gap-3 p-3 rounded-[10px] border border-[var(--border-color)] cursor-pointer hover:bg-[var(--bg)] transition-colors">
                                <input {...register(c.name)} type="checkbox" className="w-4 h-4 accent-[var(--teal)]" />
                                <span className="text-[13px] text-[var(--mid)] font-[500]">{c.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <FormSelect label="Timeline" {...register("timeline")}>
                          <option value="">Select</option>
                          {["This Quarter", "This Financial Year", "Next Year", "Flexible"].map(o => <option key={o} value={o}>{o}</option>)}
                        </FormSelect>
                        <div className="flex gap-3 mt-2">
                          <button type="button" onClick={() => setStep(1)} className="border border-[var(--border-color)] text-[var(--mid)] font-[600] px-6 py-3 rounded-full text-[14px] hover:bg-[var(--bg)] transition-colors">← Back</button>
                          <motion.button type="button" onClick={() => setStep(3)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[var(--teal)] text-white font-[600] px-8 py-3 rounded-full text-[14px]">Next →</motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8">
                      <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-6">Review & Submit</h3>
                      <div className="bg-[var(--bg)] rounded-[14px] p-6 mb-6">
                        {[["Company", data.companyName], ["Contact", data.contactName], ["Email", data.contactEmail], ["Budget", data.budgetRange], ["Timeline", data.timeline]].map(([l, v]) => (
                          <div key={l} className="flex justify-between py-2.5 border-b border-[var(--border-color)] last:border-0">
                            <span className="text-[13px] text-[var(--light)]">{l}</span>
                            <span className="text-[13px] font-[600] text-[var(--dark)]">{v || "—"}</span>
                          </div>
                        ))}
                      </div>
                      <label className="flex items-start gap-3 py-2 cursor-pointer mb-4">
                        <input {...register("consent")} type="checkbox" className="w-4 h-4 accent-[var(--teal)] mt-0.5" />
                        <span className="text-[13px] text-[var(--mid)]">I agree to be contacted by AGSWS regarding this enquiry</span>
                      </label>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(2)} className="border border-[var(--border-color)] text-[var(--mid)] font-[600] px-6 py-3 rounded-full text-[14px] hover:bg-[var(--bg)] transition-colors">← Back</button>
                        <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[var(--yellow)] text-[var(--dark)] font-[700] px-8 py-3 rounded-full shadow-[var(--shadow-yellow)] flex items-center gap-2 text-[14px]">
                          <FileText size={16} /> Submit Proposal
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Live preview sidebar */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] sticky top-24 overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--teal-dark)] to-[var(--teal)] p-6">
                  <p className="text-[10px] font-[600] text-white/50 uppercase tracking-[0.1em]">AGSWS CSR Proposal</p>
                  <p className="text-white font-[700] text-[18px] mt-1">{data.companyName || "Your Company"}</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {data.focusMedical && <span className="text-[10px] bg-[var(--teal-light)] text-[var(--teal)] px-3 py-1 rounded-full font-[600]">Medical</span>}
                    {data.focusEducation && <span className="text-[10px] bg-[var(--purple-light)] text-[var(--purple)] px-3 py-1 rounded-full font-[600]">Education</span>}
                    {data.focusElderly && <span className="text-[10px] bg-[var(--yellow-light)] text-[var(--dark)] px-3 py-1 rounded-full font-[600]">Elderly</span>}
                    {data.focusVolunteering && <span className="text-[10px] bg-[var(--bg)] text-[var(--mid)] px-3 py-1 rounded-full font-[600]">Volunteering</span>}
                  </div>
                  {data.budgetRange && (
                    <div>
                      <p className="text-[10px] text-[var(--light)] uppercase tracking-[0.06em] mb-2">Budget Range</p>
                      <div className="h-2 bg-[var(--border-color)] rounded-full">
                        <motion.div className="h-full bg-[var(--teal)] rounded-full" animate={{ width: data.budgetRange.includes("1 Cr") ? "100%" : data.budgetRange.includes("25L") ? "70%" : data.budgetRange.includes("5L") ? "40%" : "15%" }} transition={{ duration: 0.5 }} />
                      </div>
                      <p className="text-[12px] font-[600] text-[var(--dark)] mt-1">{data.budgetRange}</p>
                    </div>
                  )}
                  <p className="text-[11px] text-[var(--light)]">Proposal will be emailed to {data.contactEmail || "..."}</p>
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
