import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { Link } from "react-router-dom";
import { Heart, Users, Stethoscope, Pill, ArrowRight, CheckCircle, Phone } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "@/components/layout/PageHero";

const FormInput = ({ label, required, ...props }: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="text-[11px] font-[600] text-[var(--dark)] mb-1.5 block uppercase tracking-[0.08em]">{label} {required && <span className="text-[#DC2626]">*</span>}</label>
    <input {...props} className="w-full h-[48px] px-4 text-[14px] text-[var(--dark)] bg-[var(--bg)] border border-[var(--border-color)] rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10 transition-all placeholder:text-[var(--light)]" />
  </div>
);

const MedicalAid = () => {
  useSEO("Medical Aid", "AGSWS Medical Aid — emergency care, hospital support, and treatment funding in Kolkata.");
  const [showApply, setShowApply] = useState(false);

  return (
    <main id="main-content">
      <PageHero title="Medical Aid & Hospital Support" label="Initiative" bgVariant="teal-dark" breadcrumb={[{ label: "Home", href: "/" }, { label: "Initiatives", href: "/initiatives" }, { label: "Medical Aid" }]} />

      <section className="bg-card py-20 lg:py-28">
        <div className="max-w-[900px] mx-auto px-6">
          <FadeInUp>
            <p className="text-[15px] lg:text-[17px] text-[var(--mid)] mb-12 leading-[1.8] max-w-[700px]">
              Our Medical Aid program provides life-saving healthcare access to families across Kolkata who cannot afford treatment. From emergency hospital admissions to long-term medicine support, every donation directly funds patient care.
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {[
              { icon: Stethoscope, title: "Emergency Care", desc: "Rapid hospital admission coordination with our 6 partner hospitals." },
              { icon: Pill, title: "Medicine Support", desc: "Monthly medicine funding for chronic conditions and post-surgery recovery." },
              { icon: Users, title: "Health Camps", desc: "Free quarterly health camps serving 200+ patients each session." },
              { icon: Heart, title: "Surgery Support", desc: "Partial to full surgery funding for critical cases." },
            ].map((item, i) => (
              <FadeInUp key={item.title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }} className="bg-white rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6 transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[var(--teal-light)] flex items-center justify-center mb-4">
                    <item.icon size={22} className="text-[var(--teal)]" />
                  </div>
                  <h4 className="text-[16px] font-[700] text-[var(--dark)] mb-2">{item.title}</h4>
                  <p className="text-[13px] text-[var(--mid)] leading-[1.7]">{item.desc}</p>
                </motion.div>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp className="text-center">
            <Link to="/donate/medical" className="inline-flex items-center gap-2 bg-[var(--yellow)] text-[var(--dark)] font-[700] px-10 py-4 rounded-full shadow-[var(--shadow-yellow)] hover:scale-[1.02] transition-transform text-[14px]">
              Donate Medical Aid <ArrowRight size={16} />
            </Link>
          </FadeInUp>
        </div>
      </section>

      <section className="bg-[var(--teal-light)] border-t-4 border-[var(--teal)] py-16">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          <div>
            <span className="text-[11px] font-[600] text-[var(--teal)] uppercase tracking-[0.1em] mb-2 block">For Families in Need</span>
            <h3 className="text-[22px] font-[800] text-[var(--dark)] mb-4 tracking-[-0.01em]">Is Your Family Facing a Medical Emergency?</h3>
            <p className="text-[14px] text-[var(--mid)] leading-relaxed mb-6">
              If you or a family member in Kolkata needs emergency medical support and cannot afford treatment, AGSWS is here. Reach out to us directly — our team will assess and respond within 24 hours.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowApply(true)} className="bg-[var(--teal)] text-white font-[600] px-6 py-3 rounded-full text-[13px] hover:bg-[var(--teal-dark)] transition-colors">Apply for Medical Support →</button>
              <a href="tel:+919876543210" className="border border-[var(--teal)] text-[var(--teal)] font-[600] px-6 py-3 rounded-full text-[13px] flex items-center gap-2 hover:bg-[var(--teal)] hover:text-white transition-colors">
                <Phone size={14} /> Call Our Helpline
              </a>
            </div>
          </div>
          <div className="bg-white rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6">
            <h4 className="font-[600] text-[var(--dark)] mb-4 text-[14px]">What we cover:</h4>
            {["Emergency hospitalisation", "Critical medicines", "Specialist consultations", "Surgery support (partial/full)", "Post-discharge care"].map((item) => (
              <div key={item} className="flex items-center gap-2 mb-2.5">
                <CheckCircle size={16} className="text-[var(--teal)] flex-shrink-0" />
                <span className="text-[13px] text-[var(--mid)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApply && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4" onClick={() => setShowApply(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-[520px] rounded-[20px] p-8 shadow-[var(--shadow-lg)] max-h-[90vh] overflow-y-auto">
              <h3 className="text-[18px] font-[700] text-[var(--dark)] mb-6">Apply for Medical Support</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowApply(false); }}>
                <FormInput label="Patient Full Name" required placeholder="Full name" />
                <FormInput label="Patient Age" required type="number" placeholder="Age" />
                <div>
                  <label className="text-[11px] font-[600] text-[var(--dark)] mb-1.5 block uppercase tracking-[0.08em]">Medical Condition <span className="text-[#DC2626]">*</span></label>
                  <textarea required rows={3} placeholder="Describe the condition or diagnosis" className="w-full px-4 py-3 text-[14px] text-[var(--dark)] bg-[var(--bg)] border border-[var(--border-color)] rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10 transition-all resize-none placeholder:text-[var(--light)]" />
                </div>
                <FormInput label="Hospital Name" placeholder="If admitted" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Phone" required type="tel" placeholder="Phone number" />
                  <FormInput label="Email" required type="email" placeholder="Email address" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowApply(false)} className="flex-1 border border-[var(--border-color)] text-[var(--mid)] py-3 rounded-full text-[13px] font-[600] hover:bg-[var(--bg)] transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-[var(--teal)] text-white py-3 rounded-full text-[13px] font-[600] hover:bg-[var(--teal-dark)] transition-colors">Submit Application</button>
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
