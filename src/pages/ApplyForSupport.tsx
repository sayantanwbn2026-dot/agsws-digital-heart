import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, GraduationCap, CheckCircle, Phone, ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import FadeInUp from "@/components/ui/FadeInUp";

const medicalSchema = z.object({
  patientName: z.string().min(2, "Required"),
  patientAge: z.string().min(1, "Required"),
  condition: z.string().min(5, "Please describe the condition"),
  hospitalName: z.string().optional(),
  income: z.string().min(1, "Required"),
  address: z.string().min(5, "Required"),
  contactName: z.string().optional(),
  phone: z.string().min(10, "Valid phone required"),
  email: z.string().email("Valid email required"),
});

const educationSchema = z.object({
  childName: z.string().min(2, "Required"),
  childAge: z.string().min(1, "Required"),
  grade: z.string().min(1, "Required"),
  schoolName: z.string().min(2, "Required"),
  needFees: z.boolean().default(false),
  needBooks: z.boolean().default(false),
  needMeals: z.boolean().default(false),
  needUniform: z.boolean().default(false),
  needExamFees: z.boolean().default(false),
  parentName: z.string().min(2, "Required"),
  parentPhone: z.string().min(10, "Valid phone required"),
  parentEmail: z.string().email("Valid email required"),
  income: z.string().min(1, "Required"),
  reason: z.string().max(300).optional(),
});

const incomeOptions = ["Below ₹5,000", "₹5,000–₹15,000", "₹15,000–₹30,000", "Above ₹30,000"];

const FormField = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div>
    <label className="text-[12px] font-[600] text-[var(--dark)] mb-2 block uppercase tracking-[0.06em]">{label}</label>
    {children}
    {error && <p className="text-[12px] text-[#DC2626] mt-1">{error}</p>}
  </div>
);

const ApplyForSupport = () => {
  useSEO("Apply for Support", "Apply for AGSWS medical or education support. Free and confidential.");
  const [activeForm, setActiveForm] = useState<"medical" | "education" | null>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const med = useForm({ resolver: zodResolver(medicalSchema) });
  const edu = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: { needFees: false, needBooks: false, needMeals: false, needUniform: false, needExamFees: false },
  });

  const onMedicalSubmit = () => setSubmitted(`APP-MED-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  const onEducationSubmit = () => setSubmitted(`APP-EDU-${String(Math.floor(Math.random() * 9000) + 1000)}`);

  if (submitted) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} className="text-center max-w-md mx-auto px-6 py-16">
          <div className="w-20 h-20 bg-[var(--teal)] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-[28px] font-[700] text-[var(--teal)] mb-3">Application Received</h2>
          <p className="text-[var(--mid)] text-[14px] mb-6 leading-[1.7]">We will review and contact you within 3 working days.</p>
          <div className="bg-[var(--teal)]/5 rounded-[var(--radius-xl)] p-5 mb-6 border border-[var(--teal)]/15">
            <p className="text-[11px] text-[var(--light)] uppercase tracking-[0.08em]">Application Reference</p>
            <p className="text-[22px] font-[800] text-[var(--teal)] mt-1">{submitted}</p>
          </div>
          <a href="/" className="text-[var(--teal)] font-[600] text-[14px] hover:underline">← Back to Home</a>
        </motion.div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <PageHero title="We're Here to Help" label="Apply for Support" subtitle="Applying for support is simple, private, and free. We respond within 3 working days." bgVariant="warm" size="md" breadcrumb={[{ label: "Home", href: "/" }, { label: "Apply for Support" }]} />

      <section className="bg-[var(--bg)] py-[64px] lg:py-[96px]">
        <div className="max-w-[900px] mx-auto px-[var(--container-px)]">
          {/* Choose type */}
          {!activeForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { type: "medical" as const, icon: Heart, title: "Medical Aid", desc: "For patients and families who cannot afford treatment, medicines, surgery, or hospital costs.", color: "var(--teal)", colorLight: "var(--teal-light)" },
                { type: "education" as const, icon: GraduationCap, title: "Education Support", desc: "For students who need school fees, books, meals, or educational materials.", color: "var(--purple)", colorLight: "var(--purple-light)" },
              ].map((card, i) => (
                <FadeInUp key={card.type} delay={i * 0.1}>
                  <motion.button
                    onClick={() => setActiveForm(card.type)}
                    whileHover={{ y: -6, boxShadow: "var(--shadow-lg)" }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full text-left bg-white rounded-[var(--radius-2xl)] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8 transition-shadow"
                  >
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: `color-mix(in srgb, ${card.color} 10%, white)` }}>
                      <card.icon size={26} style={{ color: card.color }} />
                    </div>
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-2">{card.title}</h3>
                    <p className="text-[14px] text-[var(--mid)] leading-[1.7] mb-5">{card.desc}</p>
                    <span className="inline-flex items-center gap-2 text-[14px] font-[600]" style={{ color: card.color }}>
                      Apply Now <ArrowRight size={16} />
                    </span>
                  </motion.button>
                </FadeInUp>
              ))}
            </div>
          )}

          {/* Medical Form */}
          <AnimatePresence mode="wait">
            {activeForm === "medical" && (
              <motion.div key="med" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <button onClick={() => setActiveForm(null)} className="text-[var(--teal)] font-[600] text-[14px] mb-6 hover:underline">← Choose a different category</button>
                <div className="bg-white rounded-[var(--radius-2xl)] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[var(--teal)]/10 flex items-center justify-center">
                      <Heart size={18} className="text-[var(--teal)]" />
                    </div>
                    <h3 className="text-[20px] font-[700] text-[var(--dark)]">Medical Aid Application</h3>
                  </div>
                  <form onSubmit={med.handleSubmit(onMedicalSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Patient Name" error={med.formState.errors.patientName?.message as string}>
                        <input {...med.register("patientName")} placeholder="Full name" className="no-float" />
                      </FormField>
                      <FormField label="Patient Age" error={med.formState.errors.patientAge?.message as string}>
                        <input {...med.register("patientAge")} type="number" placeholder="Age" className="no-float" />
                      </FormField>
                    </div>
                    <FormField label="Medical Condition" error={med.formState.errors.condition?.message as string}>
                      <textarea {...med.register("condition")} placeholder="Describe the condition" rows={3} className="no-float" />
                    </FormField>
                    <FormField label="Hospital Name (if admitted)">
                      <input {...med.register("hospitalName")} placeholder="Hospital name" className="no-float" />
                    </FormField>
                    <FormField label="Monthly Family Income" error={med.formState.errors.income?.message as string}>
                      <select {...med.register("income")} className="no-float">
                        <option value="">Select</option>
                        {incomeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Kolkata Address" error={med.formState.errors.address?.message as string}>
                      <textarea {...med.register("address")} placeholder="Full address" rows={2} className="no-float" />
                    </FormField>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Your Phone" error={med.formState.errors.phone?.message as string}>
                        <input {...med.register("phone")} type="tel" placeholder="Phone number" className="no-float" />
                      </FormField>
                      <FormField label="Your Email" error={med.formState.errors.email?.message as string}>
                        <input {...med.register("email")} type="email" placeholder="Email" className="no-float" />
                      </FormField>
                    </div>
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-[48px] bg-[var(--teal)] text-white font-[600] rounded-full text-[14px] hover:bg-[var(--teal-dark)] transition-colors mt-2">
                      Submit Application
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}

            {activeForm === "education" && (
              <motion.div key="edu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <button onClick={() => setActiveForm(null)} className="text-[var(--purple)] font-[600] text-[14px] mb-6 hover:underline">← Choose a different category</button>
                <div className="bg-white rounded-[var(--radius-2xl)] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[var(--purple)]/10 flex items-center justify-center">
                      <GraduationCap size={18} className="text-[var(--purple)]" />
                    </div>
                    <h3 className="text-[20px] font-[700] text-[var(--dark)]">Education Support Application</h3>
                  </div>
                  <form onSubmit={edu.handleSubmit(onEducationSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Child's Name" error={edu.formState.errors.childName?.message as string}>
                        <input {...edu.register("childName")} placeholder="Full name" className="no-float" />
                      </FormField>
                      <FormField label="Child's Age" error={edu.formState.errors.childAge?.message as string}>
                        <input {...edu.register("childAge")} type="number" placeholder="Age" className="no-float" />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Class / Grade" error={edu.formState.errors.grade?.message as string}>
                        <input {...edu.register("grade")} placeholder="e.g. Class 5" className="no-float" />
                      </FormField>
                      <FormField label="School Name" error={edu.formState.errors.schoolName?.message as string}>
                        <input {...edu.register("schoolName")} placeholder="School name" className="no-float" />
                      </FormField>
                    </div>
                    <div>
                      <p className="text-[12px] font-[600] text-[var(--dark)] mb-3 uppercase tracking-[0.06em]">Specific Needs</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { name: "needFees" as const, label: "School fees" },
                          { name: "needBooks" as const, label: "Books" },
                          { name: "needMeals" as const, label: "Meals" },
                          { name: "needUniform" as const, label: "Uniform" },
                          { name: "needExamFees" as const, label: "Exam fees" },
                        ].map(c => (
                          <label key={c.name} className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] border border-[var(--border-color)] cursor-pointer hover:bg-[var(--bg)] transition-colors">
                            <input {...edu.register(c.name)} type="checkbox" className="w-4 h-4 accent-[var(--purple)]" />
                            <span className="text-[13px] text-[var(--mid)]">{c.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label="Parent/Guardian Name" error={edu.formState.errors.parentName?.message as string}>
                        <input {...edu.register("parentName")} placeholder="Name" className="no-float" />
                      </FormField>
                      <FormField label="Parent Phone" error={edu.formState.errors.parentPhone?.message as string}>
                        <input {...edu.register("parentPhone")} type="tel" placeholder="Phone" className="no-float" />
                      </FormField>
                    </div>
                    <FormField label="Parent Email" error={edu.formState.errors.parentEmail?.message as string}>
                      <input {...edu.register("parentEmail")} type="email" placeholder="Email" className="no-float" />
                    </FormField>
                    <FormField label="Monthly Family Income" error={edu.formState.errors.income?.message as string}>
                      <select {...edu.register("income")} className="no-float">
                        <option value="">Select</option>
                        {incomeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Brief reason (optional)">
                      <textarea {...edu.register("reason")} placeholder="Why is support needed?" rows={2} maxLength={300} className="no-float" />
                    </FormField>
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-[48px] bg-[var(--purple)] text-white font-[600] rounded-full text-[14px] hover:opacity-90 transition-opacity mt-2">
                      Submit Application
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help note */}
          <FadeInUp className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-white rounded-full border border-[var(--border-color)] px-6 py-3 shadow-[var(--shadow-card)]">
              <Phone size={16} className="text-[var(--teal)]" />
              <span className="text-[14px] text-[var(--mid)]">Need urgent help? Call <strong className="text-[var(--teal)]">+91 98765 43210</strong></span>
            </div>
          </FadeInUp>
        </div>
      </section>
    </main>
  );
};

export default ApplyForSupport;
