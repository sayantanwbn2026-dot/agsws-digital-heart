import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { Link } from "react-router-dom";
import { Heart, Users, Stethoscope, Pill, ArrowRight, CheckCircle, Phone } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "@/components/layout/PageHero";
import { PremiumInput, PremiumTextarea, PremiumCard, PremiumButton } from "@/components/ui/PremiumFormElements";
import { useCMSSection } from "@/hooks/useCMSSection";
import { supabase } from "@/integrations/supabase/client";
import toast from "react-hot-toast";

const iconMap: Record<string, any> = { Stethoscope, Pill, Users, Heart };

const defaultMedical = {
  intro: "Our Medical Aid program provides life-saving healthcare access to families across Kolkata who cannot afford treatment. From emergency hospital admissions to long-term medicine support, every donation directly funds patient care.",
  cta_label: "Donate Medical Aid",
  benefits: [
    { icon: "Stethoscope", title: "Emergency Care", desc: "Rapid hospital admission coordination with our 6 partner hospitals." },
    { icon: "Pill", title: "Medicine Support", desc: "Monthly medicine funding for chronic conditions and post-surgery recovery." },
    { icon: "Users", title: "Health Camps", desc: "Free quarterly health camps serving 200+ patients each session." },
    { icon: "Heart", title: "Surgery Support", desc: "Partial to full surgery funding for critical cases." },
  ],
  apply_label: "For Families in Need",
  apply_heading: "Is Your Family Facing a Medical Emergency?",
  apply_body: "If you or a family member in Kolkata needs emergency medical support and cannot afford treatment, AGSWS is here. Reach out to us directly — our team will assess and respond within 24 hours.",
  helpline_phone: "+919876543210",
  covers_heading: "What we cover:",
  covers: ["Emergency hospitalisation", "Critical medicines", "Specialist consultations", "Surgery support (partial/full)", "Post-discharge care"],
};

const MedicalAid = () => {
  useSEO("Medical Aid", "AGSWS Medical Aid — emergency care, hospital support, and treatment funding in Kolkata.");
  const [showApply, setShowApply] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patient_name: "", patient_age: "", condition: "", hospital: "", phone: "", email: "",
  });
  const { data: cms } = useCMSSection<typeof defaultMedical>('medical_page', defaultMedical);
  const benefits = cms.benefits ?? defaultMedical.benefits;
  const covers = cms.covers ?? defaultMedical.covers;

  async function submitMedicalApply(e: React.FormEvent) {
    e.preventDefault();
    if (!form.patient_name || !form.condition || !form.phone || !form.email) {
      toast.error("Please fill patient name, condition, phone and email.");
      return;
    }
    setSubmitting(true);
    const { error } = await (supabase.from("support_applications" as any) as any).insert({
      type: "medical",
      applicant_name: form.patient_name,
      email: form.email,
      phone: form.phone,
      form_data: {
        patient_age: form.patient_age,
        medical_condition: form.condition,
        hospital: form.hospital,
        source: "medical_aid_page",
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error("Submission failed. Please try again.");
      return;
    }
    toast.success("Application submitted. Our team will reach out within 24 hours.");
    setForm({ patient_name: "", patient_age: "", condition: "", hospital: "", phone: "", email: "" });
    setShowApply(false);
  }

  return (
    <main id="main-content">
      <PageHero title="Medical Aid & Hospital Support" label="Initiative" bgVariant="teal-dark" breadcrumb={[{ label: "Home", href: "/" }, { label: "Initiatives", href: "/initiatives" }, { label: "Medical Aid" }]} />

      <section className="bg-card py-20 lg:py-28">
        <div className="max-w-[900px] mx-auto px-6">
          <FadeInUp>
            <p className="text-[15px] lg:text-[17px] text-[var(--mid)] mb-12 leading-[1.8] max-w-[700px]">
              {cms.intro}
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {benefits.map((item: any, i: number) => {
              const Icon = iconMap[item.icon] || Stethoscope;
              return (
                <FadeInUp key={item.title} delay={i * 0.08}>
                  <motion.div whileHover={{ y: -4, boxShadow: "var(--shadow-lg)" }} className="bg-[var(--white)] rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--teal-light)] flex items-center justify-center mb-4">
                      <Icon size={22} className="text-[var(--teal)]" />
                    </div>
                    <h4 className="text-[16px] font-[700] text-[var(--dark)] mb-2">{item.title}</h4>
                    <p className="text-[13px] text-[var(--mid)] leading-[1.7]">{item.desc}</p>
                  </motion.div>
                </FadeInUp>
              );
            })}
          </div>

          <FadeInUp className="text-center">
            <Link to="/donate/medical" className="inline-flex items-center gap-2 bg-[var(--yellow)] text-[var(--dark)] font-[700] px-10 py-4 rounded-full shadow-[var(--shadow-yellow)] hover:scale-[1.02] transition-transform text-[14px]">
              {cms.cta_label} <ArrowRight size={16} />
            </Link>
          </FadeInUp>
        </div>
      </section>

      <section className="bg-[var(--teal-light)] border-t-4 border-[var(--teal)] py-16">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          <div>
            <span className="text-[11px] font-[600] text-[var(--teal)] uppercase tracking-[0.1em] mb-2 block">{cms.apply_label}</span>
            <h3 className="text-[22px] font-[800] text-[var(--dark)] mb-4 tracking-[-0.01em]">{cms.apply_heading}</h3>
            <p className="text-[14px] text-[var(--mid)] leading-relaxed mb-6">
              {cms.apply_body}
            </p>
            <div className="flex flex-wrap gap-3">
              <PremiumButton onClick={() => setShowApply(true)}>Apply for Medical Support →</PremiumButton>
              <a href={`tel:${cms.helpline_phone}`} className="h-[52px] px-8 border-[1.5px] border-[var(--teal)] text-[var(--teal)] font-[600] rounded-full text-[14px] flex items-center gap-2 hover:bg-[var(--teal)] hover:text-white transition-all">
                <Phone size={14} /> Call Our Helpline
              </a>
            </div>
          </div>
          <PremiumCard className="!p-6">
            <h4 className="font-[600] text-[var(--dark)] mb-4 text-[14px]">{cms.covers_heading}</h4>
            {covers.map((item: string) => (
              <div key={item} className="flex items-center gap-2.5 mb-3">
                <CheckCircle size={16} className="text-[var(--teal)] flex-shrink-0" />
                <span className="text-[13px] text-[var(--mid)]">{item}</span>
              </div>
            ))}
          </PremiumCard>
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApply && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-md p-4" onClick={() => setShowApply(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="bg-[var(--white)] w-full max-w-[520px] rounded-[24px] p-8 shadow-[var(--shadow-lg)] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] flex items-center justify-center">
                  <Stethoscope size={18} className="text-white" />
                </div>
                <h3 className="text-[20px] font-[700] text-[var(--dark)]">Apply for Medical Support</h3>
              </div>
              <form className="space-y-5" onSubmit={submitMedicalApply}>
                <PremiumInput label="Patient Full Name" required placeholder="Full name" value={form.patient_name} onChange={(e: any) => setForm({ ...form, patient_name: e.target.value })} />
                <PremiumInput label="Patient Age" required type="number" placeholder="Age" value={form.patient_age} onChange={(e: any) => setForm({ ...form, patient_age: e.target.value })} />
                <PremiumTextarea label="Medical Condition" required rows={3} placeholder="Describe the condition or diagnosis" value={form.condition} onChange={(e: any) => setForm({ ...form, condition: e.target.value })} />
                <PremiumInput label="Hospital Name" placeholder="If admitted" value={form.hospital} onChange={(e: any) => setForm({ ...form, hospital: e.target.value })} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <PremiumInput label="Phone" required type="tel" placeholder="Phone number" value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} />
                  <PremiumInput label="Email" required type="email" placeholder="Email address" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <PremiumButton variant="secondary" type="button" onClick={() => setShowApply(false)} className="flex-1">Cancel</PremiumButton>
                  <PremiumButton type="submit" loading={submitting} disabled={submitting} className="flex-1">{submitting ? "Submitting..." : "Submit Application"}</PremiumButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default MedicalAid;
