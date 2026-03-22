import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, GraduationCap, CheckCircle } from "lucide-react";

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

const InputField = ({ label, error, ...props }: any) => (
  <div>
    <label className="text-sm font-medium text-text-dark mb-1 block">{label}</label>
    <input {...props} className={`w-full h-12 px-4 border rounded-lg bg-card outline-none transition-all focus:border-teal focus:ring-2 focus:ring-teal/15 ${error ? "border-destructive" : "border-border"}`} />
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

const ApplyForSupport = () => {
  useSEO("Apply for Support", "Apply for AGSWS medical or education support. Free and confidential.");
  const [activeForm, setActiveForm] = useState<"medical" | "education" | null>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const med = useForm({ resolver: zodResolver(medicalSchema) });
  const edu = useForm<z.infer<typeof educationSchema>>({ resolver: zodResolver(educationSchema), defaultValues: { needFees: false, needBooks: false, needMeals: false, needUniform: false, needExamFees: false } });

  const onMedicalSubmit = () => setSubmitted(`APP-MED-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  const onEducationSubmit = () => setSubmitted(`APP-EDU-${String(Math.floor(Math.random() * 9000) + 1000)}`);

  if (submitted) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-background">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md mx-auto px-6 py-16">
          <div className="w-20 h-20 bg-teal rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-teal mb-2">Application Received</h2>
          <p className="text-text-mid text-sm mb-4">We will review your application and contact you within 3 working days. Our team is here to help.</p>
          <div className="bg-teal-light rounded-xl p-4 mb-6">
            <p className="text-xs text-text-light">Application Reference</p>
            <p className="text-xl font-bold text-teal">{submitted}</p>
          </div>
          <p className="text-xs text-text-light">Save this reference number for follow-up.</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <section className="h-[300px] bg-gradient-to-br from-beige via-teal to-teal flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/20" />
        <div className="relative z-10 text-center">
          <h1 className="heading-1 text-primary-foreground">We're Here to Help</h1>
          <p className="text-sm text-primary-foreground/70 mt-3">Applying for support is simple, private, and free. We respond within 3 working days.</p>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="max-w-[900px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medical */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-brand-sm">
            <div className="bg-gradient-to-r from-teal-dark to-teal h-[140px] flex items-center justify-center">
              <Heart size={40} className="text-primary-foreground" />
            </div>
            <div className="p-6">
              <h3 className="heading-3 text-text-dark mb-2">Apply for Medical Aid</h3>
              <p className="text-sm text-text-mid mb-4">For patients and families in Kolkata who cannot afford treatment, medicines, surgery, or hospital costs.</p>
              <button onClick={() => setActiveForm(activeForm === "medical" ? null : "medical")} className="w-full bg-teal text-primary-foreground font-semibold py-3 rounded-lg text-sm">
                {activeForm === "medical" ? "Close Form" : "Apply Now →"}
              </button>
            </div>
            <AnimatePresence>
              {activeForm === "medical" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <form onSubmit={med.handleSubmit(onMedicalSubmit)} className="p-6 pt-0 space-y-3">
                    <InputField label="Patient Full Name" {...med.register("patientName")} error={med.formState.errors.patientName?.message} />
                    <InputField label="Patient Age" type="number" {...med.register("patientAge")} error={med.formState.errors.patientAge?.message} />
                    <div>
                      <label className="text-sm font-medium text-text-dark mb-1 block">Medical Condition</label>
                      <textarea {...med.register("condition")} rows={3} className="w-full px-4 py-3 border border-border rounded-lg bg-card outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 text-sm" />
                    </div>
                    <InputField label="Hospital Name (if admitted)" {...med.register("hospitalName")} />
                    <div>
                      <label className="text-sm font-medium text-text-dark mb-1 block">Approximate Monthly Family Income</label>
                      <select {...med.register("income")} className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal">
                        <option value="">Select</option>
                        {incomeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-dark mb-1 block">Kolkata Contact Address</label>
                      <textarea {...med.register("address")} rows={2} className="w-full px-4 py-3 border border-border rounded-lg bg-card outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 text-sm" />
                    </div>
                    <InputField label="Your Name (if different)" {...med.register("contactName")} />
                    <InputField label="Your Phone" type="tel" {...med.register("phone")} error={med.formState.errors.phone?.message} />
                    <InputField label="Your Email" type="email" {...med.register("email")} error={med.formState.errors.email?.message} />
                    <button type="submit" className="w-full bg-teal text-primary-foreground font-bold py-3 rounded-lg mt-2">Submit Application</button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Education */}
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-brand-sm">
            <div className="bg-gradient-to-r from-purple to-purple/80 h-[140px] flex items-center justify-center">
              <GraduationCap size={40} className="text-primary-foreground" />
            </div>
            <div className="p-6">
              <h3 className="heading-3 text-text-dark mb-2">Apply for Education Support</h3>
              <p className="text-sm text-text-mid mb-4">For students in Kolkata who need school fees, books, meals, or educational materials.</p>
              <button onClick={() => setActiveForm(activeForm === "education" ? null : "education")} className="w-full bg-purple text-primary-foreground font-semibold py-3 rounded-lg text-sm">
                {activeForm === "education" ? "Close Form" : "Apply Now →"}
              </button>
            </div>
            <AnimatePresence>
              {activeForm === "education" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <form onSubmit={edu.handleSubmit(onEducationSubmit)} className="p-6 pt-0 space-y-3">
                    <InputField label="Child's Full Name" {...edu.register("childName")} error={edu.formState.errors.childName?.message} />
                    <InputField label="Child's Age" type="number" {...edu.register("childAge")} error={edu.formState.errors.childAge?.message} />
                    <InputField label="Class / Grade" {...edu.register("grade")} error={edu.formState.errors.grade?.message} />
                    <InputField label="School Name & Address" {...edu.register("schoolName")} error={edu.formState.errors.schoolName?.message} />
                    <div>
                      <p className="text-sm font-medium text-text-dark mb-2">Specific Needs</p>
                      {[
                        { name: "needFees" as const, label: "School fees" },
                        { name: "needBooks" as const, label: "Books & stationery" },
                        { name: "needMeals" as const, label: "School meals" },
                        { name: "needUniform" as const, label: "Uniform" },
                        { name: "needExamFees" as const, label: "Exam fees" },
                      ].map(c => (
                        <label key={c.name} className="flex items-center gap-2 py-1 cursor-pointer">
                          <input {...edu.register(c.name)} type="checkbox" className="w-4 h-4 accent-purple" />
                          <span className="text-sm text-text-mid">{c.label}</span>
                        </label>
                      ))}
                    </div>
                    <InputField label="Parent/Guardian Name" {...edu.register("parentName")} error={edu.formState.errors.parentName?.message} />
                    <InputField label="Parent Phone" type="tel" {...edu.register("parentPhone")} error={edu.formState.errors.parentPhone?.message} />
                    <InputField label="Parent Email" type="email" {...edu.register("parentEmail")} error={edu.formState.errors.parentEmail?.message} />
                    <div>
                      <label className="text-sm font-medium text-text-dark mb-1 block">Monthly Family Income</label>
                      <select {...edu.register("income")} className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-purple">
                        <option value="">Select</option>
                        {incomeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-dark mb-1 block">Brief reason (optional)</label>
                      <textarea {...edu.register("reason")} rows={2} maxLength={300} className="w-full px-4 py-3 border border-border rounded-lg bg-card outline-none focus:border-purple focus:ring-2 focus:ring-purple/15 text-sm" />
                    </div>
                    <button type="submit" className="w-full bg-purple text-primary-foreground font-bold py-3 rounded-lg mt-2">Submit Application</button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ApplyForSupport;
