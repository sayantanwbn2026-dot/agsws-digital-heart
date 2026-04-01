import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { Link } from "react-router-dom";
import { Heart, Users, Stethoscope, Pill, ArrowRight, CheckCircle, Phone } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "@/components/layout/PageHero";

const MedicalAid = () => {
  useSEO("Medical Aid", "AGSWS Medical Aid — emergency care, hospital support, and treatment funding in Kolkata.");
  const [showApply, setShowApply] = useState(false);

  return (
    <main id="main-content">
      <PageHero
        title="Medical Aid & Hospital Support"
        label="Initiative"
        bgVariant="teal-dark"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Initiatives", href: "/initiatives" }, { label: "Medical Aid" }]}
      />

      <section className="bg-card py-24">
        <div className="max-w-[900px] mx-auto px-6">
          <FadeInUp>
            <p className="body-lg text-text-mid mb-12">
              Our Medical Aid program provides life-saving healthcare access to families across Kolkata who cannot afford treatment. From emergency hospital admissions to long-term medicine support, every donation directly funds patient care.
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {[
              { icon: Stethoscope, title: "Emergency Care", desc: "Rapid hospital admission coordination with our 6 partner hospitals." },
              { icon: Pill, title: "Medicine Support", desc: "Monthly medicine funding for chronic conditions and post-surgery recovery." },
              { icon: Users, title: "Health Camps", desc: "Free quarterly health camps serving 200+ patients each session." },
              { icon: Heart, title: "Surgery Support", desc: "Partial to full surgery funding for critical cases." },
            ].map((item, i) => (
              <FadeInUp key={item.title} delay={i * 0.1}>
                <div className="global-card">
                  <item.icon size={28} className="text-teal mb-3" />
                  <h4 className="heading-4 text-text-dark mb-2">{item.title}</h4>
                  <p className="body-small text-text-mid">{item.desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp className="text-center">
            <Link to="/donate/medical" className="inline-flex items-center gap-2 bg-yellow text-text-dark font-semibold px-10 py-4 rounded-full shadow-yellow hover:scale-[1.02] transition-transform">
              Donate Medical Aid <ArrowRight size={18} />
            </Link>
          </FadeInUp>
        </div>
      </section>

      {/* Need Support Section */}
      <section className="bg-teal-light border-t-4 border-teal py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          <div>
            <span className="label-text text-teal mb-2 block">For Families in Need</span>
            <h3 className="heading-3 text-text-dark mb-4">Is Your Family Facing a Medical Emergency?</h3>
            <p className="text-sm text-text-mid leading-relaxed mb-6">
              If you or a family member in Kolkata needs emergency medical support and cannot afford treatment, AGSWS is here. Reach out to us directly — our team will assess and respond within 24 hours.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowApply(true)} className="bg-teal text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity">
                Apply for Medical Support →
              </button>
              <a href="tel:+919876543210" className="border border-teal text-teal font-semibold px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-teal hover:text-primary-foreground transition-colors">
                <Phone size={16} /> Call Our Helpline
              </a>
            </div>
          </div>
          <div className="global-card">
            <h4 className="font-semibold text-text-dark mb-4">What we cover:</h4>
            {["Emergency hospitalisation", "Critical medicines", "Specialist consultations", "Surgery support (partial/full)", "Post-discharge care"].map((item) => (
              <div key={item} className="flex items-center gap-2 mb-2.5">
                <CheckCircle size={16} className="text-teal flex-shrink-0" />
                <span className="text-sm text-text-mid">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApply && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={() => setShowApply(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
              <div className="global-card w-full max-w-[520px] my-8">
                <h3 className="font-semibold text-text-dark mb-6 text-lg">Apply for Medical Support</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowApply(false); }}>
                  <input placeholder="Patient Full Name *" required className="global-card w-full h-12 outline-none focus: text-sm" />
                  <input placeholder="Patient Age *" required type="number" className="global-card w-full h-12 outline-none focus: text-sm" />
                  <textarea placeholder="Medical Condition / Diagnosis *" required rows={3} className="global-card w-full outline-none focus: text-sm" />
                  <input placeholder="Hospital Name (if admitted)" className="global-card w-full h-12 outline-none focus: text-sm" />
                  <input placeholder="Your Phone *" required type="tel" className="global-card w-full h-12 outline-none focus: text-sm" />
                  <input placeholder="Your Email *" required type="email" className="global-card w-full h-12 outline-none focus: text-sm" />
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowApply(false)} className="border border-border text-text-mid px-5 py-2.5 rounded-full text-sm font-medium">Cancel</button>
                    <button type="submit" className="bg-teal text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold flex-1">Submit Application</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
};

export default MedicalAid;
